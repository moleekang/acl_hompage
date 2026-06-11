// Aicon Log client-event proxy.
// Browser events land here without credentials; this route resolves the real
// user (Supabase session cookie) + anonymous id server-side, attaches
// AICON_LOG_API_KEY and relays to the central Aicon Log server (fire-and-forget).

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fireAiconLog, isActive } from "@/aicon/log/_core";
import { isExcludedPath, resolveMenu } from "@/aicon/log/activity/menu-map";
import { ANON_COOKIE } from "@/aicon/log/activity/middleware";
import { createClient } from "@/lib/supabase/server";

// Events the browser is allowed to emit (everything else is server-instrumented).
const CLIENT_EVENT_ALLOWLIST = new Set([
  "user_signup",
  "user_signin",
  "blog_post_read",
  "wiki_page_edit",
  "wiki_page_create",
  "event_signup",
]);

type ProxyPayload = {
  kind?: string;
  page_path?: string;
  referrer_path?: string;
  event_name?: string;
  event_label?: string;
  event_value?: number;
  properties?: Record<string, unknown>;
};

export async function POST(request: Request) {
  try {
    if (!isActive()) {
      return NextResponse.json({ success: true, skipped: true }, { status: 202 });
    }

    const payload = (await request.json().catch(() => null)) as ProxyPayload | null;
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }

    // Identity is resolved server-side — never trust a client-provided user_id.
    const cookieStore = await cookies();
    const anonId = cookieStore.get(ANON_COOKIE)?.value ?? null;
    let email: string | null = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      email = data.user?.email ?? null;
    } catch {
      // no session — fall back to anonymous id
    }
    const userId = email ?? (anonId ? `anon:${anonId}` : null);

    if (payload.kind === "page_view" && typeof payload.page_path === "string") {
      const pagePath = payload.page_path;
      if (isExcludedPath(pagePath)) {
        return NextResponse.json({ success: true, skipped: true }, { status: 202 });
      }
      const menu = resolveMenu(pagePath);
      fireAiconLog("/menu/logs", {
        menu_code: menu.code,
        menu_name: menu.name,
        page_path: pagePath,
        referrer_path: typeof payload.referrer_path === "string" ? payload.referrer_path : null,
        ...(userId ? { user_id: userId } : {}),
        ...(anonId ? { anonymous_id: anonId } : {}),
      });
      fireAiconLog("/event/logs", {
        event_name: "page_view",
        page_path: pagePath,
        ...(userId ? { user_id: userId } : {}),
        ...(anonId ? { anonymous_id: anonId } : {}),
      });
      return NextResponse.json({ success: true }, { status: 202 });
    }

    if (
      payload.kind === "event" &&
      typeof payload.event_name === "string" &&
      CLIENT_EVENT_ALLOWLIST.has(payload.event_name)
    ) {
      fireAiconLog("/event/logs", {
        event_name: payload.event_name,
        ...(typeof payload.event_label === "string" ? { event_label: payload.event_label } : {}),
        ...(typeof payload.event_value === "number" ? { event_value: payload.event_value } : {}),
        ...(typeof payload.page_path === "string" ? { page_path: payload.page_path } : {}),
        ...(payload.properties && typeof payload.properties === "object"
          ? { properties: payload.properties }
          : {}),
        ...(userId ? { user_id: userId } : {}),
        ...(anonId ? { anonymous_id: anonId } : {}),
      });
      return NextResponse.json({ success: true }, { status: 202 });
    }

    return NextResponse.json({ error: "unsupported payload" }, { status: 400 });
  } catch {
    // Logging must never surface errors to the client.
    return NextResponse.json({ success: false }, { status: 202 });
  }
}
