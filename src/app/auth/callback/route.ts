// Google OAuth 콜백.
// Supabase가 /auth/v1/callback에서 우리 도메인의 이 라우트로 리다이렉트시킨다.
// 쿼리 ?code=...를 받아 세션 쿠키로 교환한다.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchange failed:", error.message);
    return NextResponse.redirect(
      `${url.origin}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${url.origin}${next}`);
}
