// 모든 admin 페이지가 상단에 한 줄로 렌더하는 topbar.
// 디자인의 .topbar 마크업 그대로.
import type { ReactNode } from "react";

type Props = {
  title: string;
  crumb: string;
  sub?: string;
  right?: ReactNode;
};

export function PageTopbar({ title, crumb, sub, right }: Props) {
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
          오늘 <b className="mono">{new Date().toISOString().slice(0, 10).replace(/-/g, ".")}</b> · 운영자 <b>caden</b>
        </div>
      )}
    </header>
  );
}
