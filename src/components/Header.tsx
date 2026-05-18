// AICONLAB 헤더 — 셀피쉬 스타일 (사용자 결정 🅰️)
// 메뉴: 자동화앱 · 공유회 · 팀 블로그 · 단톡방 + 멤버십 CTA
// Sticky 상단 고정 + 모바일 햄버거 메뉴
// 서버 컴포넌트 래퍼가 현재 유저를 읽어 HeaderClient로 전달.

import { createClient } from "@/lib/supabase/server";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인된 경우 profiles 테이블에서 닉네임 조회 시도.
  let displayName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", user.id)
      .single();
    displayName = profile?.nickname ?? user.email ?? null;
  }

  return <HeaderClient userDisplay={displayName} />;
}
