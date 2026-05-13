"use client";

import { Avatar } from "@/components/admin/avatar";
import { Icon } from "@/components/admin/icons";
import { RoleBadge } from "@/components/admin/badges";
import type { MemberRow } from "@/lib/admin/fetchers";

type Props = {
  member: MemberRow | null;
  onClose: () => void;
  onAction: (id: string) => void;
};

export function MemberDrawer({ member, onClose, onAction }: Props) {
  if (!member) return null;

  return (
    <>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer">
        <div className="drawer-head">
          <Avatar name={member.name} size="lg" />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="row" style={{ gap: 8 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26 }}>{member.name}</h2>
              <RoleBadge role={member.role} />
            </div>
            <div className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>{member.email || "—"}</div>
          </div>
          <button type="button" className="close-x" onClick={onClose} aria-label="닫기">
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="drawer-body stack" style={{ gap: 22 }}>
          <div className="grid-2" style={{ gap: 14 }}>
            <div className="card flat" style={{ background: "var(--surface-2)", padding: 14 }}>
              <div className="micro" style={{ marginBottom: 6 }}>가입일</div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{member.joinedAt}</div>
            </div>
            <div className="card flat" style={{ background: "var(--surface-2)", padding: 14 }}>
              <div className="micro" style={{ marginBottom: 6 }}>마지막 로그인</div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{member.lastLogin || "—"}</div>
            </div>
          </div>

          <div>
            <div className="micro" style={{ marginBottom: 12 }}>현재 상태</div>
            <div style={{ fontSize: 13, color: "var(--fg-2)" }}>
              role: <b style={{ color: "var(--fg-1)" }}>{member.role}</b> · status: <b style={{ color: "var(--fg-1)" }}>{member.status}</b>
            </div>
          </div>
        </div>

        <div className="drawer-foot">
          {member.role === "guest" && (
            <button type="button" className="btn btn-primary" onClick={() => onAction("promote")}>
              ★ 위키 멤버로 승급
            </button>
          )}
          {member.role === "member" && (
            <button type="button" className="btn btn-secondary" onClick={() => onAction("demote")}>
              위키 멤버 회수
            </button>
          )}
          {member.role !== "suspended" && (
            <button type="button" className="btn btn-danger" onClick={() => onAction("suspend")}>
              정지
            </button>
          )}
          {member.role === "suspended" && (
            <button type="button" className="btn btn-primary" onClick={() => onAction("unsuspend")}>
              정지 해제
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={onClose}>닫기</button>
        </div>
      </aside>
    </>
  );
}
