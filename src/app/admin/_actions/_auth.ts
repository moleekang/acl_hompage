"use server";

// Server Action은 HTTP 엔드포인트로 노출된다.
// admin layout의 미들웨어/서버 컴포넌트 게이트는 Server Action 직접 호출을 막지 못한다.
// 따라서 모든 admin Server Action은 이 함수를 첫 줄에서 호출해야 한다.
// 인증(세션 존재)과 권한(role=admin, status=active)을 모두 검사한다.

import { createClient } from "@/lib/supabase/server";

export async function requireAdmin(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" || profile?.status !== "active") {
    throw new Error("Forbidden");
  }

  return user.id;
}
