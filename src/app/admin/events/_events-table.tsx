"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RowMenu } from "@/components/admin/row-menu";
import { Status, type StatusKind } from "@/components/admin/badges";
import { deleteEvent } from "../_actions/events";

const STATUS_LABEL: Record<string, string> = {
  draft: "초안", open: "모집 중", closed: "마감", done: "완료",
};

export type EventTableRow = {
  id: string;
  slug: string;
  title: string;
  starts_at: string;
  location: string | null;
  capacity: number | null;
  status: string;
  invited: number;
  going: number;
  declined: number;
  pending: number;
};

export function EventsTable({ rows }: { rows: EventTableRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function handleDelete(e: EventTableRow) {
    if (!confirm(`"${e.title}"을(를) 삭제할까요? 초대도 모두 삭제됩니다.`)) return;
    start(async () => {
      try {
        await deleteEvent(e.id);
      } catch (err) {
        alert("실패: " + (err instanceof Error ? err.message : String(err)));
      }
    });
  }

  return (
    <div className="stack" style={{ gap: 18, opacity: pending ? 0.7 : 1 }}>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>제목</th>
              <th style={{ width: 160 }}>일시</th>
              <th>위치</th>
              <th style={{ width: 110 }}>초대됨</th>
              <th style={{ width: 220 }}>RSVP</th>
              <th style={{ width: 100 }}>상태</th>
              <th style={{ width: 60 }} className="actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7}><div className="empty"><div className="h">아직 이벤트가 없어요</div><div>위에서 새 공유회를 만들어 보세요.</div></div></td></tr>
            ) : (
              rows.map((e) => {
                const total = e.going + e.declined + e.pending || 1;
                return (
                  <tr key={e.id} onClick={() => router.push(`/admin/events/${e.id}`)}>
                    <td><div style={{ fontWeight: 700 }}>{e.title}</div></td>
                    <td className="num">{new Date(e.starts_at).toLocaleString("ko-KR")}</td>
                    <td><span style={{ fontSize: 13, color: "var(--fg-2)" }}>{e.location ?? "—"}</span></td>
                    <td>
                      <span className="mono" style={{ fontSize: 13 }}>{e.invited}</span>
                      {e.capacity && <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}> / {e.capacity}</span>}
                    </td>
                    <td>
                      <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", background: "var(--paper-dim)" }}>
                        <div style={{ width: (e.going / total * 100) + "%", background: "var(--mint-400)" }} />
                        <div style={{ width: (e.pending / total * 100) + "%", background: "var(--ink-300)" }} />
                        <div style={{ width: (e.declined / total * 100) + "%", background: "var(--hot-400)" }} />
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>
                        <span style={{ color: "var(--text-mint)" }}>참석 {e.going}</span>
                        <span> · 대기 {e.pending}</span>
                        <span style={{ color: "var(--text-hot)" }}> · 거절 {e.declined}</span>
                      </div>
                    </td>
                    <td><Status kind={e.status as StatusKind} label={STATUS_LABEL[e.status] ?? e.status} /></td>
                    <td className="actions" onClick={(ev) => ev.stopPropagation()}>
                      <RowMenu
                        items={[
                          { id: "view", label: "상세 보기", primary: true },
                          { divider: true },
                          { id: "delete", label: "삭제", danger: true },
                        ]}
                        onSelect={(id) => {
                          if (id === "view") router.push(`/admin/events/${e.id}`);
                          else if (id === "delete") handleDelete(e);
                        }}
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
  );
}
