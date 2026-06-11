// Edge-safe middleware hook — anonymous visitor cookie + API call logging.
// Responsibility split (double-count prevention):
//   - middleware  → POST /call/logs only (hard document requests)
//   - <AiconLogTracker /> (client) → single source for /menu/logs + page_view events
// Wired from the root middleware.ts after updateSession().

import type { NextRequest, NextResponse } from "next/server";
import { fireAiconLog, isActive } from "../_core";

export const ANON_COOKIE = "aicon_anon_id";
const ANON_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const SKIP_PREFIXES = ["/api", "/_next", "/favicon", "/robots.txt", "/sitemap.xml"];

function shouldLogRequest(request: NextRequest, path: string): boolean {
  if (request.method !== "GET") return false;
  if (SKIP_PREFIXES.some((p) => path === p || path.startsWith(p))) return false;
  if (/\.[a-zA-Z0-9]+$/.test(path)) return false; // static assets
  // Skip RSC payload / prefetch requests — only count real document navigations.
  if (request.headers.get("rsc") || request.headers.get("next-router-prefetch")) return false;
  const dest = request.headers.get("sec-fetch-dest");
  if (dest && dest !== "document") return false;
  if (!dest && !(request.headers.get("accept") ?? "").includes("text/html")) return false;
  return true;
}

/** Best-effort email extraction from the Supabase auth cookie (no network call). */
function emailFromSupabaseCookies(request: NextRequest): string | null {
  try {
    const chunks = request.cookies
      .getAll()
      .filter((c) => /^sb-.+-auth-token(\.\d+)?$/.test(c.name))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (chunks.length === 0) return null;
    let raw = chunks.map((c) => c.value).join("");
    if (raw.startsWith("base64-")) {
      raw = atob(raw.slice(7).replace(/-/g, "+").replace(/_/g, "/"));
    }
    const session = JSON.parse(raw) as { access_token?: string };
    const jwtPayload = session.access_token?.split(".")[1];
    if (!jwtPayload) return null;
    const payload = JSON.parse(
      atob(jwtPayload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { email?: string };
    return payload.email ?? null;
  } catch {
    return null;
  }
}

export function aiconLogMiddleware(request: NextRequest, response: NextResponse): void {
  try {
    // 1. Anonymous visitor id (plan §4 option A) — issued for everyone, kept on revisit.
    let anonId = request.cookies.get(ANON_COOKIE)?.value;
    if (!anonId) {
      anonId = crypto.randomUUID();
      response.cookies.set(ANON_COOKIE, anonId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: ANON_COOKIE_MAX_AGE,
      });
    }

    // 2. API call log (fire-and-forget, document requests only).
    if (!isActive()) return;
    const path = request.nextUrl.pathname;
    if (!shouldLogRequest(request, path)) return;

    const email = emailFromSupabaseCookies(request);
    fireAiconLog("/call/logs", {
      user_id: email ?? `anon:${anonId}`,
      http_method: request.method,
      end_point: path,
      status_code: 200,
      success_yn: "Y",
    });
  } catch {
    // logging must never break the request
  }
}
