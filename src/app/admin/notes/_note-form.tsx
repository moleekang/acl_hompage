"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { createNote, updateNote, publishNote, deleteNote } from "../_actions/notes";
import { uploadAdminImage } from "../_actions/uploads";

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
  published_at?: string | null;
  render_mode?: "embed" | "newtab";
  content_type?: "html" | "markdown";
  thumbnail_url?: string | null;
};

export function NoteForm({ mode, initial }: { mode: Mode; initial: Initial }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [uploading, startUpload] = useTransition();
  const [slug, setSlug] = useState(initial.slug);
  const [title, setTitle] = useState(initial.title);
  const [sub, setSub] = useState(initial.sub ?? "");
  const [cat, setCat] = useState(initial.cat);
  const [read, setRead] = useState(initial.read_time ?? "");
  const [body, setBody] = useState(initial.body_mdx ?? "");
  const [renderMode, setRenderMode] = useState<"embed" | "newtab">(initial.render_mode ?? "embed");
  const [contentType, setContentType] = useState<"html" | "markdown">(initial.content_type ?? "html");
  const [publishedAt, setPublishedAt] = useState<string | null>(initial.published_at ?? null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initial.thumbnail_url ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isPublished = !!publishedAt;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    startUpload(async () => {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const { url } = await uploadAdminImage(fd, "notes");
        setThumbnailUrl(url);
      } catch (err) {
        alert("이미지 업로드 실패: " + (err instanceof Error ? err.message : String(err)));
      }
    });
  }

  function togglePublish() {
    start(async () => {
      try {
        await publishNote(initial.slug, !isPublished);
        setPublishedAt(isPublished ? null : new Date().toISOString());
      } catch (e) {
        alert("발행 토글 실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  function remove() {
    if (!confirm(`"${initial.title}"을(를) 삭제할까요?`)) return;
    start(async () => {
      try {
        await deleteNote(initial.slug);
        router.push("/admin/notes");
      } catch (e) {
        alert("삭제 실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  function save() {
    start(async () => {
      try {
        if (mode === "new") {
          await createNote({ slug, title, sub, cat, read_time: read, body_mdx: body, render_mode: renderMode, content_type: contentType, thumbnail_url: thumbnailUrl });
        } else {
          await updateNote(initial.slug, { title, sub, cat, read_time: read, body_mdx: body, render_mode: renderMode, content_type: contentType, thumbnail_url: thumbnailUrl });
        }
        router.push("/admin/notes");
      } catch (e) {
        alert("실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  return (
    <div className="stack" style={{ gap: 18, opacity: busy ? 0.7 : 1 }}>
      <div className="row" style={{ gap: 10, alignItems: "center" }}>
        <Link href="/admin/notes" className="btn btn-secondary btn-sm"><Icon name="chevron-left" size={14} /> 글 목록</Link>
        <div className="grow" />
        {mode === "edit" && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={togglePublish}
              title={isPublished ? "클릭해서 대기로 전환" : "클릭해서 발행"}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                cursor: busy ? "wait" : "pointer",
                border: isPublished ? "1px solid #b6e4cd" : "1px solid var(--border-1)",
                background: isPublished ? "#e7fbf1" : "var(--surface-2)",
                color: isPublished ? "#2a7a4a" : "var(--fg-3)",
              }}
            >
              {isPublished ? "● 발행됨" : "○ 대기 (초안)"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={remove}
              style={{
                background: "transparent",
                border: "1px solid var(--border-1)",
                cursor: busy ? "wait" : "pointer",
                color: "var(--text-hot, #ff6b47)",
                fontSize: 13,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 6,
              }}
            >
              삭제
            </button>
          </>
        )}
        <button type="button" className="btn btn-primary" onClick={save} disabled={busy || uploading || !title || !slug}>
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

          {/* 카드 썸네일 이미지 */}
          <div style={{ gridColumn: "span 4" }}>
            <label className="field-label">카드 썸네일 이미지 (없으면 그라데이션 자동 적용)</label>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              {/* 미리보기 */}
              {thumbnailUrl ? (
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailUrl}
                    alt="썸네일 미리보기"
                    style={{
                      width: 120,
                      height: 68,
                      objectFit: "cover",
                      borderRadius: "var(--r-input)",
                      border: "1px solid var(--border-2)",
                      display: "block",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: 120,
                    height: 68,
                    borderRadius: "var(--r-input)",
                    border: "1px dashed var(--border-2)",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--fg-3)",
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >
                  없음
                </div>
              )}

              {/* 업로드 버튼 영역 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || busy}
                >
                  {uploading ? "업로드 중..." : thumbnailUrl ? "교체" : "이미지 업로드"}
                </button>
                {thumbnailUrl && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ color: "var(--text-hot)", fontSize: 11 }}
                    onClick={() => {
                      setThumbnailUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    disabled={uploading || busy}
                  >
                    제거
                  </button>
                )}
                <span style={{ fontSize: 11, color: "var(--fg-3)" }}>
                  JPG · PNG · WEBP · GIF, 최대 5MB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 렌더 위치 + 본문 포맷 라디오 그룹 */}
      <div className="card elevated" style={{ padding: "14px 18px" }}>
        <div className="row" style={{ gap: 32, flexWrap: "wrap" }}>
          <div>
            <div className="field-label" style={{ marginBottom: 8 }}>렌더 위치</div>
            <div className="row" style={{ gap: 16 }}>
              {(["embed", "newtab"] as const).map((v) => (
                <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                  <input
                    type="radio"
                    name="render_mode"
                    value={v}
                    checked={renderMode === v}
                    onChange={() => setRenderMode(v)}
                  />
                  {v === "embed" ? "상세 페이지에 임베드" : "새 탭에서 열기"}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="field-label" style={{ marginBottom: 8 }}>본문 포맷</div>
            <div className="row" style={{ gap: 16 }}>
              {(["html", "markdown"] as const).map((v) => (
                <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                  <input
                    type="radio"
                    name="content_type"
                    value={v}
                    checked={contentType === v}
                    onChange={() => setContentType(v)}
                  />
                  {v === "html" ? "HTML" : "Markdown"}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="row" style={{ alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <div className="micro" style={{ flex: 1, minWidth: 240 }}>
            본문 — AI가 만든 페이지를 통째로 붙여넣거나 파일을 업로드하세요.{" "}
            {contentType === "html"
              ? "sandbox iframe에서 격리 실행되며 script도 동작합니다 (iframe 밖 페이지엔 영향 없음)"
              : "Markdown으로 작성 시 서버에서 HTML로 변환됩니다."}
          </div>
          <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
            📎 파일 업로드
            <input
              type="file"
              accept=".html,.htm,.md,.markdown,text/html,text/markdown"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                setBody(text);
                // 확장자로 content_type 자동 설정
                const name = file.name.toLowerCase();
                if (name.endsWith(".md") || name.endsWith(".markdown")) {
                  setContentType("markdown");
                } else {
                  setContentType("html");
                }
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
          placeholder={contentType === "html"
            ? '<!DOCTYPE html>\n<html>\n  <head><style>...</style></head>\n  <body>...</body>\n</html>'
            : '# 제목\n\n본문을 Markdown으로 작성하세요.\n\n## 소제목\n\n내용...'}
        />
      </div>
    </div>
  );
}
