// 위키 영역 — 멤버 게이트.
// 비로그인 → /login. role이 member/admin이 아니면 안내 화면(메인사이트 톤).
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "AICONLAB · 위키",
};

export default async function WikiLayout({ children }: { children: ReactNode }) {
  const preview = process.env.ADMIN_PREVIEW_MODE === "1";

  if (preview) return <>{children}</>;

  const supabase = await createClient();
  const { data: userResult } = await supabase.auth.getUser();
  const user = userResult.user;
  if (!user) redirect("/login?next=/llm-wiki");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status, nickname")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.status === "suspended") {
    redirect("/?error=suspended");
  }

  const isMember = profile.role === "member" || profile.role === "admin";
  if (!isMember) {
    // guest — 안내 화면
    return (
      <main style={{ minHeight: "calc(100vh - 64px)", padding: "80px 24px", background: "var(--bg-canvas)" }}>
        <div
          style={{
            maxWidth: 560, margin: "0 auto",
            background: "var(--surface-1)",
            border: "1px solid var(--border-1)",
            borderRadius: 14,
            padding: 36,
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--paper-ink)", marginBottom: 12 }}>
            위키는 멤버십 전용이에요
          </div>
          <p style={{ color: "var(--fg-2)", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
            가입은 환영! 위키에서 인사이트를 함께 쌓으려면 운영자의 한 번 승급이 필요해요.
            <br />
            아래 메일로 한 줄만 보내주세요 — 어떤 일 하고 계신지.
          </p>
          <a
            href="mailto:contact@aiconlab.xyz?subject=위키 멤버십 신청"
            style={{
              display: "inline-block",
              background: "var(--ink-900)", color: "#fff",
              padding: "12px 22px", borderRadius: 8,
              fontWeight: 700, textDecoration: "none",
            }}
          >
            위키 멤버십 신청하기 →
          </a>
          <div style={{ marginTop: 18, fontSize: 13, color: "var(--fg-3)" }}>
            또는 <Link href="/" style={{ color: "var(--text-mint)", fontWeight: 700 }}>메인으로</Link>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
