"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { createNote, updateNote } from "../_actions/notes";

// categories는 notes.ts에서 가져올 수 없음 (server-only 모듈) — 여기서 직접 정의
const NOTE_CATEGORIES: Array<{ key: string; label: string }> = [
  { key: "thought", label: "사색" },
  { key: "tool",    label: "도구" },
  { key: "ops",     label: "운영" },
  { key: "record",  label: "기록" },
];

type Mode = "new" | "edit";

type Initial = {
  slug: string;
  title: string;
  sub: string | null;
  cat: string;
  read_time: string | null;
  body_mdx: string | null;
};

export function NoteForm({ mode, initial }: { mode: Mode; initial: Initial }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [slug, setSlug] = useState(initial.slug);
  const [title, setTitle] = useState(initial.title);
  const [sub, setSub] = useState(initial.sub ?? "");
  const [cat, setCat] = useState(initial.cat);
  const [read, setRead] = useState(initial.read_time ?? "");
  const [body, setBody] = useState(initial.body_mdx ?? "");

  function save() {
    start(async () => {
      try {
        if (mode === "new") {
          await createNote({ slug, title, sub, cat, read_time: read, body_mdx: body });
        } else {
          await updateNote(initial.slug, { title, sub, cat, read_time: read, body_mdx: body });
        }
        router.push("/admin/notes");
      } catch (e) {
        alert("실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  return (
    <div className="stack" style={{ gap: 18, opacity: busy ? 0.7 : 1 }}>
      <div className="row" style={{ gap: 10 }}>
        <Link href="/admin/notes" className="btn btn-secondary btn-sm"><Icon name="chevron-left" size={14} /> 글 목록</Link>
        <div className="grow" />
        <button type="button" className="btn btn-primary" onClick={save} disabled={busy || !title || !slug}>
          {busy ? "저장 중..." : mode === "new" ? "★ 발행 준비 (초안 저장)" : "저장"}
        </button>
      </div>

      <div className="card elevated">
        <div className="grid-4" style={{ gap: 14 }}>
          <div style={{ gridColumn: "span 2" }}>
            <label className="field-label">제목</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} style={{ fontSize: 16, fontWeight: 700 }} />
          </div>
          <div>
            <label className="field-label">카테고리</label>
            <select className="select" value={cat} onChange={(e) => setCat(e.target.value)}>
              {NOTE_CATEGORIES.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">읽기 시간</label>
            <input className="input mono" value={read} onChange={(e) => setRead(e.target.value)} placeholder="6분" />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label className="field-label">슬러그 (URL)</label>
            <input
              className="input mono"
              value={slug}
              onChange={(e) => mode === "new" && setSlug(e.target.value.replace(/[^a-z0-9-]/gi, "-").toLowerCase())}
              disabled={mode === "edit"}
              style={mode === "edit" ? { background: "var(--surface-2)", color: "var(--fg-3)" } : undefined}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label className="field-label">부제</label>
            <input className="input" value={sub} onChange={(e) => setSub(e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <div className="row" style={{ alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <div className="micro" style={{ flex: 1, minWidth: 240 }}>
            본문 (HTML) — AI가 만든 페이지를 통째로 붙여넣거나 .html 파일을 업로드하세요. sandbox iframe에서 격리 실행되며 script도 동작합니다 (iframe 밖 페이지엔 영향 없음)
          </div>
          <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
            📎 .html 파일 업로드
            <input
              type="file"
              accept=".html,.htm,text/html"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                setBody(text);
                // 같은 파일을 다시 골랐을 때도 onChange 발화시키기 위해 reset
                e.target.value = "";
              }}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <textarea
          className="input textarea mdx"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={'<!DOCTYPE html>\n<html>\n  <head><style>...</style></head>\n  <body>...</body>\n</html>'}
        />
      </div>
    </div>
  );
}
