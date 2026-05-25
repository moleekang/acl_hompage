"use client";

// 0009 컨텐츠 테이블 4종(testimonials, journal_entries, site_tools, site_resources)을
// 공통 UI로 관리. 각 페이지는 schema(필드 정의)와 rows만 넘기면 된다.

import { useState, useTransition } from "react";
import {
  createContentRow,
  updateContentRow,
  togglePublishContent,
  deleteContentRow,
  type ContentTable,
} from "@/app/admin/_actions/content";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  hideInList?: boolean; // 리스트에선 안 보임 (긴 본문 같은 거)
};

type ContentRow = {
  id: string;
  published: boolean;
  [k: string]: unknown;
};

type Props = {
  table: ContentTable;
  fields: FieldDef[];
  rows: ContentRow[];
  // 리스트 컬럼으로 쓸 key 목록 (hideInList=true는 제외하고 골라줌).
  primaryColumns?: string[];
};

export function ContentManager({ table, fields, rows, primaryColumns }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const columns =
    primaryColumns ?? fields.filter((f) => !f.hideInList).map((f) => f.key);

  async function handleSubmit(
    formData: FormData,
    mode: "create" | "update",
    id?: string,
  ) {
    setError(null);
    const row: Record<string, unknown> = {};
    for (const f of fields) {
      const v = formData.get(f.key);
      if (v === null || v === "") {
        if (f.required && mode === "create") {
          setError(`${f.label}은(는) 필수입니다.`);
          return;
        }
        row[f.key] = null;
        continue;
      }
      row[f.key] = f.type === "number" ? Number(v) : String(v);
    }
    // order_idx, published 처리 (폼에 있으면 위에서 잡힘)
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createContentRow(table, row);
          setAdding(false);
        } else if (id) {
          await updateContentRow(table, id, row);
          setEditingId(null);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "저장 실패");
      }
    });
  }

  function handleTogglePublish(id: string, current: boolean) {
    setError(null);
    startTransition(async () => {
      try {
        await togglePublishContent(table, id, !current);
      } catch (e) {
        setError(e instanceof Error ? e.message : "발행 토글 실패");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("정말 삭제할까요? 되돌릴 수 없습니다.")) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteContentRow(table, id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "삭제 실패");
      }
    });
  }

  return (
    <div>
      {error && (
        <div
          style={{
            padding: "10px 14px",
            marginBottom: 12,
            background: "rgba(255,107,71,0.10)",
            border: "1px dashed var(--text-hot)",
            borderRadius: 6,
            color: "var(--text-hot)",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        {!adding ? (
          <button
            type="button"
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
            className="btn"
          >
            + 새 항목 추가
          </button>
        ) : (
          <RowForm
            fields={fields}
            row={null}
            disabled={pending}
            onSubmit={(fd) => handleSubmit(fd, "create")}
            onCancel={() => setAdding(false)}
          />
        )}
      </div>

      <table className="adm-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{fields.find((f) => f.key === c)?.label ?? c}</th>
            ))}
            <th style={{ width: 90 }}>발행</th>
            <th style={{ width: 140 }}>작업</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2} style={{ textAlign: "center", padding: 24, color: "var(--fg-3)" }}>
                항목이 없습니다.
              </td>
            </tr>
          ) : (
            rows.map((r) => {
              const isEditing = editingId === r.id;
              return (
                <RowFragment key={r.id}>
                  <tr>
                    {columns.map((c) => {
                      const raw = r[c];
                      const text = raw == null ? "" : String(raw);
                      return (
                        <td key={c} style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {text.length > 80 ? text.slice(0, 80) + "…" : text}
                        </td>
                      );
                    })}
                    <td>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => handleTogglePublish(r.id, r.published)}
                        className={r.published ? "pill pill-on" : "pill pill-off"}
                      >
                        {r.published ? "발행됨" : "비공개"}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => setEditingId(isEditing ? null : r.id)}
                        className="link-btn"
                      >
                        {isEditing ? "닫기" : "수정"}
                      </button>
                      <span style={{ color: "var(--border-2)", margin: "0 6px" }}>·</span>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => handleDelete(r.id)}
                        className="link-btn link-danger"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                  {isEditing && (
                    <tr>
                      <td colSpan={columns.length + 2} style={{ background: "var(--paper-dim)", padding: 16 }}>
                        <RowForm
                          fields={fields}
                          row={r}
                          disabled={pending}
                          onSubmit={(fd) => handleSubmit(fd, "update", r.id)}
                          onCancel={() => setEditingId(null)}
                        />
                      </td>
                    </tr>
                  )}
                </RowFragment>
              );
            })
          )}
        </tbody>
      </table>

      <style>{`
        .adm-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .adm-table th, .adm-table td {
          padding: 10px 12px;
          border-bottom: 1px solid var(--border-1);
          text-align: left;
        }
        .adm-table th { font-weight: 600; color: var(--fg-2); background: var(--paper-dim); }
        .btn {
          padding: 8px 14px;
          background: var(--ink-900);
          color: #fff;
          border: 0;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn:disabled { opacity: 0.6; cursor: wait; }
        .pill {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid transparent;
          cursor: pointer;
        }
        .pill-on  { background: var(--mint-soft, #E7FBF1); color: #2a7a4a; }
        .pill-off { background: var(--paper-dim); color: var(--fg-3); }
        .link-btn { background: transparent; border: 0; cursor: pointer; color: var(--fg-2); font-size: 13px; padding: 0; }
        .link-btn:hover { color: var(--paper-ink); text-decoration: underline; }
        .link-danger { color: var(--text-hot); }
      `}</style>
    </div>
  );
}

function RowFragment({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function RowForm({
  fields,
  row,
  disabled,
  onSubmit,
  onCancel,
}: {
  fields: FieldDef[];
  row: ContentRow | null;
  disabled: boolean;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
      style={{ display: "grid", gap: 10 }}
    >
      {fields.map((f) => {
        const value = row ? (row[f.key] ?? "") : "";
        const common = {
          name: f.key,
          defaultValue: String(value),
          placeholder: f.placeholder,
          disabled,
          style: {
            width: "100%",
            padding: "8px 10px",
            border: "1px solid var(--border-1)",
            borderRadius: 6,
            fontSize: 13,
            fontFamily: "inherit",
          },
        };
        return (
          <label key={f.key} style={{ display: "block", fontSize: 12, color: "var(--fg-2)" }}>
            <span style={{ display: "block", marginBottom: 4 }}>
              {f.label}
              {f.required && <span style={{ color: "var(--text-hot)" }}> *</span>}
            </span>
            {f.type === "textarea" ? (
              <textarea {...common} rows={3} />
            ) : f.type === "select" ? (
              <select {...common}>
                <option value="">— 선택 —</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input {...common} type={f.type} />
            )}
          </label>
        );
      })}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={disabled} className="btn">{row ? "저장" : "추가"}</button>
        <button type="button" onClick={onCancel} disabled={disabled} className="link-btn">취소</button>
      </div>
    </form>
  );
}
