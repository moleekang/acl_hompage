"use client";

import { useState, useTransition } from "react";
import { Avatar } from "@/components/admin/avatar";
import { Icon } from "@/components/admin/icons";
import { RowMenu, type RowMenuItem } from "@/components/admin/row-menu";
import { RoleBadge } from "@/components/admin/badges";
import type { Role } from "@/lib/admin/types";
import type { MemberRow } from "@/lib/admin/fetchers";
import { MemberDrawer } from "./_components/member-drawer";
import { updateMemberRole, updateMemberStatus } from "../_actions/members";

type Filter = "all" | Role;

const FILTERS: Array<{ k: Filter; label: string }> = [
  { k: "all", label: "전체" },
  { k: "guest", label: "guest" },
  { k: "member", label: "member" },
  { k: "admin", label: "admin" },
  { k: "suspended", label: "suspended" },
];

function rowActions(role: Role): RowMenuItem[] {
  const items: RowMenuItem[] = [];
  if (role === "guest") items.push({ id: "promote", label: "★ 위키 멤버로 승급", primary: true });
  if (role === "member") items.push({ id: "demote", label: "위키 멤버 회수" });
  if (role !== "suspended") items.push({ id: "suspend", label: "정지" });
  if (role === "suspended") items.push({ id: "unsuspend", label: "정지 해제", primary: true });
  return items;
}

export function MembersTable({ members }: { members: MemberRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openUid, setOpenUid] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const rows = members
    .filter((m) => filter === "all" || m.role === filter)
    .filter((m) => !query || m.name.includes(query) || m.email.toLowerCase().includes(query.toLowerCase()));

  function handleAction(uid: string, role: Role, actionId: string) {
    start(async () => {
      try {
        if (actionId === "promote") await updateMemberRole(uid, "member");
        else if (actionId === "demote") await updateMemberRole(uid, "guest");
        else if (actionId === "suspend") await updateMemberStatus(uid, "suspended");
        else if (actionId === "unsuspend") await updateMemberStatus(uid, "active");
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        alert("실패: " + message);
      }
    });
    void role; // 표시만, 직접 사용 X
  }

  return (
    <div className="stack" style={{ gap: 18, opacity: pending ? 0.7 : 1 }}>
      <div className="row wrap" style={{ gap: 12 }}>
        <div className="search" style={{ flex: "1 1 320px", maxWidth: 420 }}>
          <Icon name="search" size={16} />
          <input
            className="input"
            placeholder="닉네임 또는 이메일로 검색하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="row wrap" style={{ gap: 6 }}>
          {FILTERS.map((f) => {
            const n = f.k === "all" ? members.length : members.filter((m) => m.role === f.k).length;
            return (
              <button
                key={f.k}
                type="button"
                className={"chip " + (filter === f.k ? "active" : "")}
                onClick={() => setFilter(f.k)}
              >
                {f.label}<span className="n">{n}</span>
              </button>
            );
          })}
        </div>
        <div className="grow" />
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "26%" }}>닉네임</th>
              <th>이메일</th>
              <th style={{ width: 120 }}>역할</th>
              <th style={{ width: 110 }}>가입일</th>
              <th style={{ width: 160 }}>마지막 로그인</th>
              <th style={{ width: 60 }} className="actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty">
                    <div className="h">조건에 맞는 멤버가 없어요</div>
                    <div>검색어나 필터를 바꿔 보세요.</div>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((m) => (
                <tr
                  key={m.id}
                  className={openUid === m.id ? "selected" : ""}
                  onClick={() => setOpenUid(m.id)}
                >
                  <td>
                    <div className="user-cell">
                      <Avatar name={m.name} />
                      <div style={{ minWidth: 0 }}>
                        <div className="nm">{m.name}</div>
                        <div className="handle">@{m.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="mono" style={{ fontSize: 12, color: "var(--fg-2)" }}>{m.email}</span></td>
                  <td><RoleBadge role={m.role} /></td>
                  <td className="num">{m.joinedAt}</td>
                  <td className="num">{m.lastLogin || "—"}</td>
                  <td className="actions" onClick={(e) => e.stopPropagation()}>
                    <RowMenu items={rowActions(m.role)} onSelect={(id) => handleAction(m.id, m.role, id)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {openUid && (
        <MemberDrawer
          member={members.find((m) => m.id === openUid) ?? null}
          onClose={() => setOpenUid(null)}
          onAction={(actionId) => {
            const target = members.find((m) => m.id === openUid);
            if (!target) return;
            handleAction(target.id, target.role, actionId);
            setOpenUid(null);
          }}
        />
      )}
    </div>
  );
}
