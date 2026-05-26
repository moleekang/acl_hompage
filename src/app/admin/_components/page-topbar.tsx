// 모든 admin 페이지가 상단에 한 줄로 렌더하는 topbar.
// 디자인의 .topbar 마크업 그대로.
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";

type Props = {
  title: string;
  crumb: string;
  sub?: string;
  right?: ReactNode;
};

async function fetchOperatorName(): Promise<string> {
  const supabase = await createClient();
  const { data: userResult } = await supabase.auth.getUser();
  const user = userResult.user;
  if (!user) return "—";

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .maybeSingle();

  // nickname > email의 @ 앞부분 > "운영자"
  return profile?.nickname?.trim() || user.email?.split("@")[0] || "운영자";
}

export async function PageTopbar({ title, crumb, sub, right }: Props) {
  const operator = right ? null : await fetchOperatorName();
  const today = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, ".");

  return (
    <header className="topbar">
      <div>
        <div className="crumb">{crumb}</div>
        <h1>{title}</h1>
      </div>
      {sub && (
        <span
          className="hand"
          style={{
            color: "var(--fg-3)",
            fontSize: 18,
            transform: "rotate(-2deg)",
            marginLeft: 8,
          }}
        >
          — {sub}
        </span>
      )}
      <div className="spacer" />
      {right ?? (
        <div className="meta">
          오늘 <b className="mono">{today}</b> · 운영자 <b>{operator}</b>
        </div>
      )}
    </header>
  );
}
