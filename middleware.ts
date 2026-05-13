import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// 모든 요청에서 Supabase 세션 쿠키를 갱신한다.
// 정적 자원·이미지는 제외해서 성능 절약.
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 다음을 제외한 모든 경로:
     * - _next/static (정적 빌드 산출물)
     * - _next/image (이미지 최적화)
     * - favicon, robots, sitemap
     * - 일반 이미지 확장자
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
