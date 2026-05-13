// 매 요청마다 Supabase 세션 쿠키를 리프레시한다.
// 루트 middleware.ts에서 호출.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getUser()는 매 호출마다 Supabase Auth 서버에 토큰 검증을 보낸다 (보안용).
  // 결과 자체는 쓰지 않아도, 호출이 만료 토큰 자동 갱신을 트리거한다.
  await supabase.auth.getUser();

  return response;
}
