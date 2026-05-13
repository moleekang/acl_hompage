// /admin/* 공통 레이아웃 — 좌측 사이드바 + main 컨테이너.
// role=admin이 아니면 진입 차단. 단 개발 환경에서 NEXT_PUBLIC_ADMIN_PREVIEW_MODE=0 이 아니면
// 디자인 미리보기를 위해 통과시킨다 (production에선 자동 OFF).
import "./admin.css";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "./_components/sidebar";

export const metadata = {
  title: "AICONLAB · Admin",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const isProd = process.env.NODE_ENV === "production";
  const preview =
    !isProd && process.env.NEXT_PUBLIC_ADMIN_PREVIEW_MODE !== "0";

  if (!preview) {
    const supabase = await createClient();
    const { data: userResult } = await supabase.auth.getUser();
    const user = userResult.user;
    if (!user) redirect("/login?next=/admin");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin" || profile.status !== "active") {
      redirect("/?error=admin_required");
    }
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="main">{children}</div>
    </div>
  );
}
