"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { restoreWikiRevision } from "../../../_actions/wiki";

export type RevisionItem = {
  id: string;
  title: string;
  edited_at: string;
  edited_by: string | null;
  note: string | null;
  editorName: string;
};

type Props = {
  pageId: string;
  pageTitle: string;
  pageSlug: string;
  revisions: RevisionItem[];
};

export function RevisionsView({ pageId, pageTitle, pageSlug, revisions }: Props) {
  const [cur, setCur] = useState<string | null>(revisions[0]?.id ?? null);
  const [pending, start] = useTransition();
  const isLatest = cur === revisions[0]?.id;
  const currentRev = revisions.find((r) => r.id === cur);

  function restore() {
    if (!currentRev || isLatest) return;
    if (!confirm(`"${currentRev.note ?? currentRev.id}" 버전으로 복원할까요?`)) return;
    start(async () => {
      try {
        await restoreWikiRevision(pageId, currentRev.id);
        alert("복원 완료");
      } catch (e) {
        alert("실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  return (
    <div className="stack" style={{ gap: 18, opacity: pending ? 0.7 : 1 }}>
      <div className="row" style={{ gap: 10 }}>
        <Link href="/admin/wiki" className="btn btn-secondary btn-sm">
          <Icon name="chevron-left" size={14} /> 위키로
        </Link>
        <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>/admin/wiki/{pageId}/revisions</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 18 }}>
        <div className="card flat" style={{ padding: 16 }}>
          <div className="micro" style={{ marginBottom: 12 }}>revision 타임라인</div>
          <div className="stack" style={{ gap: 4 }}>
            {revisions.length === 0 && (
              <div style={{ fontSize: 13, color: "var(--fg-3)" }}>아직 이력이 없어요.</div>
            )}
            {revisions.map((r, i) => {
              const active = cur === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setCur(r.id)}
                  style={{
                    textAlign: "left", padding: "10px 12px",
                    background: active ? "var(--ink-900)" : "transparent",
                    color: active ? "var(--paper)" : "var(--fg-1)",
                    border: 0, borderRadius: 8, cursor: "pointer",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <div className="row" style={{ gap: 6, justifyContent: "space-between" }}>
                    <span className="mono" style={{ fontSize: 11, color: active ? "var(--mint-300)" : "var(--fg-3)" }}>
                      r{revisions.length - i} {i === 0 && "· 현재"}
                    </span>
                    <span className="mono" style={{ fontSize: 11, color: active ? "var(--mint-300)" : "var(--fg-3)" }}>
                      {r.edited_at.slice(5, 10)}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>{r.note ?? r.title}</div>
                  <div className="mono" style={{ fontSize: 10, color: active ? "var(--mint-300)" : "var(--fg-3)", marginTop: 4 }}>
                    by {r.editorName}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="stack" style={{ gap: 14 }}>
          <div className="between">
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 30 }}>{pageTitle}</h2>
              <div className="mono" style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 4 }}>
                선택: <b style={{ color: "var(--fg-1)" }}>{currentRev?.id.slice(0, 8) ?? "—"}</b>
                {isLatest && <span style={{ color: "var(--text-mint)", marginLeft: 6 }}>· 현재 버전</span>}
              </div>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <Link href={`/llm-wiki/${pageSlug}`} target="_blank" className="btn btn-secondary">
                새 탭에서 열기 <Icon name="external" size={12} />
              </Link>
              <button
                type="button"
                className="btn btn-primary"
                onClick={restore}
                disabled={isLatest || pending}
                style={isLatest || pending ? { opacity: 0.5, cursor: "not-allowed" } : {}}
              >
                이 버전으로 복원
              </button>
            </div>
          </div>

          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border-1)",
              borderRadius: 14,
              padding: 28,
              minHeight: 320,
              fontFamily: "var(--font-mono)",
              fontSize: 12.5,
              whiteSpace: "pre-wrap",
              color: "var(--fg-2)",
              lineHeight: 1.7,
            }}
          >
            {currentRev ? (
              <RevisionBody pageId={pageId} revisionId={currentRev.id} />
            ) : (
              <div style={{ color: "var(--fg-3)" }}>revision을 선택해주세요.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 본문은 별도 서버 fetch면 좋지만, 현재 props에 없어서 placeholder.
// 디자인 시안의 diff까지는 비교 복잡도가 크므로, 본문 미리보기는 후속 작업으로.
function RevisionBody(_: { pageId: string; revisionId: string }) {
  return (
    <div style={{ color: "var(--fg-3)" }}>
      본문 비교 뷰는 다음 단계에서 추가됩니다. 지금은 "이 버전으로 복원" 액션으로 빠르게 되돌릴 수 있습니다.
    </div>
  );
}
