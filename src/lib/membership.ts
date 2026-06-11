// 공개 페이지에서 현재 뷰어의 멤버십을 판별하는 헬퍼.
// llm-wiki layout의 게이트 로직과 같은 기준: role member/admin + status active.

import { createClient } from "@/lib/supabase/server";

export type ViewerMembership = {
  loggedIn: boolean;
  isMember: boolean;
};

export async function getViewerMembership(): Promise<ViewerMembership> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { loggedIn: false, isMember: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  const isMember =
    !!profile &&
    profile.status === "active" &&
    (profile.role === "member" || profile.role === "admin");

  return { loggedIn: true, isMember };
}
