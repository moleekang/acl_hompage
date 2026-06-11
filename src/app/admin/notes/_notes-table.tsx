"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "@/components/admin/avatar";
import { Icon } from "@/components/admin/icons";
import { publishNote, deleteNote } from "../_actions/notes";

// categories는 notes.ts에서 가져올 수 없음 (server-only 모듈) — 여기서 직접 정의.
// notes.ts의 categories와 키/라벨을 일치시킬 것.
const NOTE_CATEGORIES: Record<string, { label: string }> = {
  youtube: { label: "유튜브" },
  ai:      { label: "AI" },
  domain:  { label: "도메인" },
};

export type NoteRow = {
  slug: string;
  title: string;
  sub: string | null;
  cat: string;
  read_time: string | null;
  published_at: string | null;
  author_id: string | null;
  author: { id: string; nickname: string | null; avatar_url: string | null } | null;
  visibility: string | null;
};

const CAT_LABELS = ["전체", ...Object.values(NOTE_CATEGORIES).map((v) => v.label)];

export function NotesTable({ notes }: { notes: NoteRow[] }) {
  const [cat, setCat] = useState("전체");
  const [pending, start] = useTransition();

  const filtered = notes.filter((n) => {
    if (cat === "전체") return true;
    const meta = NOTE_CATEGORIES[n.cat];
    return meta?.label === cat;
  });

  function handle(action: "publish" | "unpublish" | "delete", slug: string, title: string) {
    if (action === "delete" && !confirm(`"${title}"을(를) 삭제할까요?`)) return;
    start(async () => {
      try {
        if (action === "publish") await publishNote(slug, true);
        else if (action === "unpublish") await publishNote(slug, false);
        else if (action === "delete") await deleteNote(slug);
      } catch (e) {
        alert("실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  return (
    <div className="stack" style={{ gap: 18, opacity: pending ? 0.7 : 1 }}>
      <div className="row wrap" style={{ gap: 12 }}>
        <div className="search" style={{ flex: "1 1 320px", maxWidth: 420 }}>
          <Icon name="search" size={16} />
          <input className="input" placeholder="제목으로 검색" />
        </div>
        <div className="row" style={{ gap: 6 }}>
          {CAT_LABELS.map((c) => (
            <button key={c} type="button" className={"chip " + (cat === c ? "active" : "")} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="grow" />
        <Link href="/admin/notes/new" className="btn btn-primary">
          <Icon name="plus" size={14} /> 새 글
        </Link>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "44%" }}>제목</th>
              <th style={{ width: 110 }}>카테고리</th>
              <th style={{ width: 120 }}>발행일</th>
              <th style={{ width: 80 }}>읽기</th>
              <th style={{ width: 150 }}>작성자</th>
              <th style={{ width: 110 }}>상태</th>
              <th style={{ width: 80 }} className="actions">삭제</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="empty"><div className="h">글이 없어요</div><div>위에서 새 글을 작성해 보세요.</div></div></td></tr>
            ) : filtered.map((n) => {
              const authorName = n.author?.nickname ?? (n.author_id ? "작성자" : "—");
              const published = !!n.published_at;
              const catMeta = NOTE_CATEGORIES[n.cat];
              return (
                <tr key={n.slug}>
                  <td>
                    <Link href={`/admin/notes/${n.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div style={{ fontWeight: 700 }}>
                        {n.title}
                        {n.visibility === "member" && (
                          <span className="chip" style={{ marginLeft: 8, padding: "2px 8px", fontSize: 11 }}>🔒 멤버십 전용</span>
                        )}
                      </div>
                      {n.sub && <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{n.sub}</div>}
                    </Link>
                  </td>
                  <td><span className="chip" style={{ padding: "3px 9px", fontSize: 11 }}>{catMeta?.label ?? n.cat}</span></td>
                  <td className="num">{n.published_at ? new Date(n.published_at).toLocaleDateString("ko-KR") : "—"}</td>
                  <td className="num">{n.read_time ?? "—"}</td>
                  <td>
                    <div className="user-cell">
                      <Avatar name={authorName} size="sm" />
                      <span style={{ fontSize: 13 }}>{authorName}</span>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => handle(published ? "unpublish" : "publish", n.slug, n.title)}
                      title={published ? "클릭해서 대기로 전환" : "클릭해서 발행"}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: pending ? "wait" : "pointer",
                        border: published ? "1px solid #b6e4cd" : "1px solid var(--border-1)",
                        background: published ? "#e7fbf1" : "var(--surface-2)",
                        color: published ? "#2a7a4a" : "var(--fg-3)",
                        letterSpacing: 0.2,
                      }}
                    >
                      {published ? "● 발행" : "○ 대기"}
                    </button>
                  </td>
                  <td className="actions">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => handle("delete", n.slug, n.title)}
                      style={{
                        background: "transparent",
                        border: 0,
                        cursor: pending ? "wait" : "pointer",
                        color: "var(--text-hot, #ff6b47)",
                        fontSize: 13,
                        fontWeight: 600,
                        padding: 0,
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
