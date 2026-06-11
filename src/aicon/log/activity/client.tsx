"use client";

// Client-side Aicon Log helpers — everything goes through the /api/aicon-log proxy
// (the API key never reaches the browser; the proxy attaches it server-side).
//
// - <AiconLogTracker />   : mount once in RootLayout — single source for page_view/menu logs
// - trackClientEvent()    : fire an L1/L3 event from client interaction handlers
// - <AiconLogEvent />     : declarative one-shot event on mount (e.g. blog_post_read on SSG pages)

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const PROXY_ENDPOINT = "/api/aicon-log";

// Intentionally untracked paths (keep in sync with menu-map.ts EXCLUDED_PATHS).
const EXCLUDED_PATHS = ["/login", "/auth", "/api"];

function clientEnabled(): boolean {
  // NEXT_PUBLIC_AICON_LOG_ENABLED=false turns off all client-side calls.
  // The proxy additionally gates with the server-side AICON_LOG_ENABLED.
  return process.env.NEXT_PUBLIC_AICON_LOG_ENABLED !== "false";
}

function postToProxy(payload: Record<string, unknown>): void {
  if (!clientEnabled()) return;
  try {
    void fetch(PROXY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true, // survive page unload
    }).catch(() => {});
  } catch {
    // logging must never break the UI
  }
}

export function trackClientEvent(
  eventName: string,
  opts: {
    label?: string;
    value?: number;
    pagePath?: string;
    properties?: Record<string, unknown>;
  } = {},
): void {
  postToProxy({
    kind: "event",
    event_name: eventName,
    ...(opts.label ? { event_label: opts.label } : {}),
    ...(opts.value != null ? { event_value: opts.value } : {}),
    ...(opts.pagePath ? { page_path: opts.pagePath } : {}),
    ...(opts.properties ? { properties: opts.properties } : {}),
  });
}

/** Mounted once in RootLayout. Tracks hard loads + App Router soft navigations. */
export function AiconLogTracker() {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || prevPathRef.current === pathname) return;
    const referrer = prevPathRef.current;
    prevPathRef.current = pathname;
    if (EXCLUDED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return;

    // 200ms debounce — absorbs rapid back/forward navigation.
    const timer = setTimeout(() => {
      postToProxy({ kind: "page_view", page_path: pathname, referrer_path: referrer });
    }, 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

/** Fires a single event when mounted — for instrumenting static (SSG) pages. */
export function AiconLogEvent({
  name,
  label,
  properties,
}: {
  name: string;
  label?: string;
  properties?: Record<string, unknown>;
}) {
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackClientEvent(name, { label, pagePath: window.location.pathname, properties });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
