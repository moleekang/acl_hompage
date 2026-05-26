// /admin/* 공통 레이아웃 — 좌측 사이드바 + main 컨테이너.
// role=admin이 아니면 진입 차단. ADMIN_PREVIEW_MODE=1을 명시적으로 켰을 때만 인증 우회 (디자인 미리보기용, 서버 전용 env).
import "./admin.css";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "./_components/sidebar";

export const metadata = {
  title: "AICONLAB · Admin",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const preview = process.env.ADMIN_PREVIEW_MODE === "1";

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
