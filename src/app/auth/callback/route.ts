// Google OAuth 콜백.
// Supabase가 /auth/v1/callback에서 우리 도메인의 이 라우트로 리다이렉트시킨다.
// 쿼리 ?code=...를 받아 세션 쿠키로 교환한다.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivityEvent } from "@/aicon/log/activity/server";

/** Open-redirect 방지: 같은 오리진의 경로만 허용한다. */
function safeNext(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return "/";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${url.origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchange failed:", error.message);
    return NextResponse.redirect(
      `${url.origin}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  // Aicon Log L1 — created_at ≈ last_sign_in_at 이면 신규 가입으로 판별 (fire-and-forget).
  const sessionUser = data.session?.user;
  if (sessionUser?.email) {
    const createdAt = new Date(sessionUser.created_at ?? 0).getTime();
    const lastSignIn = new Date(sessionUser.last_sign_in_at ?? 0).getTime();
    const isSignup = Math.abs(lastSignIn - createdAt) < 60_000;
    logActivityEvent(isSignup ? "user_signup" : "user_signin", {
      userId: sessionUser.email,
      pagePath: "/auth/callback",
    });
  }

  return NextResponse.redirect(`${url.origin}${next}`);
}
