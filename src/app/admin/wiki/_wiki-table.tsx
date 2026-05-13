"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/admin/avatar";
import { Icon } from "@/components/admin/icons";
import { RowMenu } from "@/components/admin/row-menu";
import { softDeleteWikiPage, restoreWikiPage, purgeWikiPage } from "../_actions/wiki";

export type WikiTableRow = {
  id: string;
  slug: string;
  title: string;
  updated_at: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  revs: number;
  editorName: string;
};

export function WikiTable({ rows }: { rows: WikiTableRow[] }) {
  const [tab, setTab] = useState<"active" | "trash">("active");
  const [pending, start] = useTransition();
  const router = useRouter();

  const filtered = rows.filter((w) => (tab === "active" ? !w.deleted_at : !!w.deleted_at));
  const activeCount = rows.filter((w) => !w.deleted_at).length;
  const trashCount = rows.filter((w) => !!w.deleted_at).length;

  function run(action: () => Promise<void>) {
    start(async () => {
      try {
        await action();
      } catch (e) {
        alert("실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  return (
    <div className="stack" style={{ gap: 18, opacity: pending ? 0.7 : 1 }}>
      <div className="row wrap" style={{ gap: 12 }}>
        <div className="row" style={{ gap: 6, padding: 4, background: "var(--surface-1)", border: "1px solid var(--border-1)", borderRadius: "var(--r-pill)" }}>
          <button type="button" className={"chip " + (tab === "active" ? "active" : "")} style={{ border: 0 }} onClick={() => setTab("active")}>
            활성 페이지<span className="n">{activeCount}</span>
          </button>
          <button type="button" className={"chip " + (tab === "trash" ? "active" : "")} style={{ border: 0 }} onClick={() => setTab("trash")}>
            휴지통<span className="n">{trashCount}</span>
          </button>
        </div>
        <div className="grow" />
        <Link href="/llm-wiki/new/edit" className="btn btn-primary">
          <Icon name="plus" size={14} /> 새 페이지
        </Link>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "32%" }}>제목</th>
              <th>슬러그</th>
              <th style={{ width: 200 }}>최종 수정자</th>
              <th style={{ width: 150 }}>수정일</th>
              <th style={{ width: 100 }}>revisions</th>
              <th style={{ width: 60 }} className="actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty">
                    <div className="h">{tab === "trash" ? "휴지통이 비어 있어요" : "활성 페이지가 없어요"}</div>
                    <div>
                      {tab === "trash" ? "삭제한 페이지는 여기서 복원할 수 있어요." : "위에서 새 페이지를 만들어 보세요."}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((w) => (
                <tr key={w.id} onClick={() => router.push(`/admin/wiki/${w.id}/revisions`)}>
                  <td><div style={{ fontWeight: 700 }}>{w.title}</div></td>
                  <td>
                    <code className="mono" style={{ fontSize: 11.5, background: "var(--surface-2)", padding: "2px 6px", borderRadius: 4 }}>
                      /{w.slug}
                    </code>
                  </td>
                  <td>
                    <div className="user-cell">
                      <Avatar name={w.editorName} size="sm" />
                      <span style={{ fontSize: 13 }}>{w.editorName}</span>
                    </div>
                  </td>
                  <td className="num">{w.updated_at ? new Date(w.updated_at).toLocaleString("ko-KR") : "—"}</td>
                  <td className="num">{w.revs}회</td>
                  <td className="actions" onClick={(e) => e.stopPropagation()}>
                    <RowMenu
                      items={
                        tab === "active"
                          ? [
                              { id: "rev", label: "수정 이력 보기", primary: true },
                              { id: "open", label: "새 탭에서 열기" },
                              { divider: true },
                              { id: "delete", label: "휴지통으로", danger: true },
                            ]
                          : [
                              { id: "restore", label: "복원", primary: true },
                              { divider: true },
                              { id: "purge", label: "완전 삭제", danger: true },
                            ]
                      }
                      onSelect={(id) => {
                        if (id === "rev") router.push(`/admin/wiki/${w.id}/revisions`);
                        else if (id === "open") window.open(`/llm-wiki/${w.slug}`, "_blank");
                        else if (id === "delete") {
                          if (confirm(`"${w.title}"을(를) 휴지통으로 보낼까요?`)) run(() => softDeleteWikiPage(w.id));
                        } else if (id === "restore") run(() => restoreWikiPage(w.id));
                        else if (id === "purge") {
                          if (confirm(`"${w.title}"을(를) 완전 삭제할까요? 되돌릴 수 없습니다.`)) run(() => purgeWikiPage(w.id));
                        }
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
