"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "@/components/admin/avatar";
import { Icon } from "@/components/admin/icons";
import { RowMenu } from "@/components/admin/row-menu";
import { RoleBadge, Status, SectionHead, type StatusKind } from "@/components/admin/badges";
import type { MemberRow } from "@/lib/admin/fetchers";
import { inviteMembers, removeInvite, updateEventStatus } from "../../_actions/events";

const STATUS_LABEL: Record<string, string> = {
  draft: "초안", open: "모집 중", closed: "마감", done: "완료",
};

type InvitationRow = { user_id: string; rsvp: "going" | "declined" | "pending" };

type Props = {
  event: {
    id: string; slug: string; title: string; body_mdx: string | null;
    starts_at: string; location: string | null; capacity: number | null; status: string;
  };
  invitations: InvitationRow[];
  members: MemberRow[];
};

export function EventDetailView({ event: ev, invitations, members }: Props) {
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState("");
  const [pending, start] = useTransition();

  const invitedUids = new Set(invitations.map((r) => r.user_id));
  const candidates = members.filter(
    (m) =>
      m.role !== "suspended" &&
      m.role !== "admin" &&
      !invitedUids.has(m.id) &&
      (!q || m.name.includes(q) || m.email.toLowerCase().includes(q.toLowerCase())),
  );

  const pickedCount = Object.values(picked).filter(Boolean).length;
  const toggle = (uid: string) => setPicked((p) => ({ ...p, [uid]: !p[uid] }));

  function doInvite() {
    const ids = Object.entries(picked).filter(([, v]) => v).map(([k]) => k);
    if (ids.length === 0) return;
    start(async () => {
      try {
        await inviteMembers(ev.id, ids);
        setPicked({});
      } catch (e) {
        alert("실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  function doRemove(uid: string, name: string) {
    if (!confirm(`${name}님 초대를 취소할까요?`)) return;
    start(async () => {
      try {
        await removeInvite(ev.id, uid);
      } catch (e) {
        alert("실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  function changeStatus(next: string) {
    start(async () => {
      try {
        await updateEventStatus(ev.id, next as "draft" | "open" | "closed" | "done");
      } catch (e) {
        alert("실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  return (
    <div className="stack" style={{ gap: 22, opacity: pending ? 0.7 : 1 }}>
      <div className="row" style={{ gap: 10 }}>
        <Link href="/admin/events" className="btn btn-secondary btn-sm">
          <Icon name="chevron-left" size={14} /> 공유회 목록
        </Link>
        <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>/admin/events/{ev.id}</span>
      </div>

      <div className="card elevated">
        <div className="between" style={{ alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <Status kind={ev.status as StatusKind} label={STATUS_LABEL[ev.status] ?? ev.status} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 34, marginTop: 8 }}>{ev.title}</h2>
            <div className="row wrap" style={{ gap: 18, marginTop: 12 }}>
              <span className="row" style={{ gap: 6 }}>
                <Icon name="clock" size={14} style={{ color: "var(--fg-3)" }} />
                <span className="mono" style={{ fontSize: 13 }}>{new Date(ev.starts_at).toLocaleString("ko-KR")}</span>
              </span>
              <span className="row" style={{ gap: 6 }}>
                <Icon name="calendar" size={14} style={{ color: "var(--fg-3)" }} />
                <span style={{ fontSize: 13 }}>{ev.location ?? "—"}</span>
              </span>
              {ev.capacity && (
                <span className="row" style={{ gap: 6 }}>
                  <Icon name="users" size={14} style={{ color: "var(--fg-3)" }} />
                  <span className="mono" style={{ fontSize: 13 }}>정원 {ev.capacity}명</span>
                </span>
              )}
            </div>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <select
              className="select"
              value={ev.status}
              onChange={(e) => changeStatus(e.target.value)}
              style={{ width: 110 }}
            >
              <option value="draft">초안</option>
              <option value="open">모집 중</option>
              <option value="closed">마감</option>
              <option value="done">완료</option>
            </select>
          </div>
        </div>

        <div className="divider" style={{ margin: "20px 0" }} />
        <div className="micro" style={{ marginBottom: 8 }}>본문 미리보기</div>
        <p style={{ color: "var(--fg-2)", maxWidth: 700 }}>{ev.body_mdx ?? "—"}</p>
      </div>

      <div>
        <SectionHead title="초대된 멤버" sub={`이미 ${invitations.length}명을 초대했어요`} />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: "32%" }}>닉네임</th>
                <th>이메일</th>
                <th style={{ width: 130 }}>RSVP</th>
                <th style={{ width: 60 }} className="actions">액션</th>
              </tr>
            </thead>
            <tbody>
              {invitations.length === 0 ? (
                <tr><td colSpan={4}><div className="empty"><div className="h">초대된 멤버가 없어요</div><div>아래에서 멤버를 골라 초대하세요.</div></div></td></tr>
              ) : (
                invitations.map((r) => {
                  const m = members.find((x) => x.id === r.user_id);
                  const kind: StatusKind = r.rsvp === "going" ? "live" : r.rsvp === "declined" ? "retired" : "draft";
                  const label = r.rsvp === "going" ? "✓ 참석" : r.rsvp === "declined" ? "거절" : "대기";
                  return (
                    <tr key={r.user_id}>
                      <td>
                        <div className="user-cell">
                          <Avatar name={m?.name ?? "?"} size="sm" />
                          <div className="nm">{m?.name ?? "—"}</div>
                        </div>
                      </td>
                      <td><span className="mono" style={{ fontSize: 12, color: "var(--fg-2)" }}>{m?.email ?? ""}</span></td>
                      <td><Status kind={kind} label={label} /></td>
                      <td className="actions">
                        <RowMenu
                          items={[{ id: "remove", label: "초대 취소", danger: true }]}
                          onSelect={(id) => { if (id === "remove") doRemove(r.user_id, m?.name ?? r.user_id); }}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card elevated">
        <SectionHead title="초대 관리" sub="아래에서 멤버를 골라 한 번에 초대할 수 있어요" />
        <div className="search" style={{ marginBottom: 14 }}>
          <Icon name="search" size={16} />
          <input className="input" placeholder="이름으로 멤버 검색" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {candidates.length === 0 ? (
          <div className="empty">
            <div className="h">초대할 수 있는 멤버가 없어요</div>
            <div>이미 모두 초대했거나 검색 결과가 없습니다.</div>
          </div>
        ) : (
          <div className="grid-4">
            {candidates.map((m) => {
              const on = !!picked[m.id];
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggle(m.id)}
                  style={{
                    textAlign: "left", padding: 14,
                    background: on ? "var(--mint-soft)" : "var(--surface-1)",
                    border: "1px solid " + (on ? "var(--text-mint)" : "var(--border-1)"),
                    borderRadius: "var(--r-card)", cursor: "pointer", position: "relative",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {on && (
                    <span style={{ position: "absolute", top: 10, right: 10, width: 22, height: 22, borderRadius: 999, background: "var(--mint-400)", border: "1.5px solid var(--ink-900)", display: "grid", placeItems: "center", color: "var(--ink-900)" }}>
                      <Icon name="check" size={12} stroke={2.4} />
                    </span>
                  )}
                  <Avatar name={m.name} size="lg" style={{ marginBottom: 10 }} />
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2, marginBottom: 8 }}>{m.email}</div>
                  <RoleBadge role={m.role} />
                </button>
              );
            })}
          </div>
        )}

        <div className="divider" style={{ margin: "18px 0 14px" }} />
        <div className="between">
          <div className="mono" style={{ fontSize: 13, color: "var(--fg-2)" }}>
            선택된 멤버 <b style={{ color: "var(--fg-1)", fontSize: 18 }}>{pickedCount}</b>명
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button type="button" className="btn btn-ghost" onClick={() => setPicked({})}>선택 해제</button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={pickedCount === 0 || pending}
              onClick={doInvite}
              style={pickedCount === 0 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              선택된 {pickedCount}명 초대
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
