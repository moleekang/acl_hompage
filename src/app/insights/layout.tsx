// 공유회 영역 — 로그인 필수 + member/admin만 진입 가능 (이벤트 RLS는 invitation 단위로 한 번 더 필터).
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "AICONLAB · 공유회",
};

export default async function InsightsLayout({ children }: { children: ReactNode }) {
  const preview = process.env.ADMIN_PREVIEW_MODE === "1";
  if (preview) return <>{children}</>;

  const supabase = await createClient();
  const { data: userResult } = await supabase.auth.getUser();
  const user = userResult.user;
  if (!user) redirect("/login?next=/insights");

  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || profile.status === "suspended") redirect("/?error=suspended");

  return <>{children}</>;
}
