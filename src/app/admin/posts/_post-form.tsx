"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { createPost, updatePost } from "../_actions/posts";
import { uploadAdminImage } from "../_actions/uploads";

// cat value는 DB 영문값, 화면 표시는 한글 label (server 모듈에서 import 불가 → 여기 정의)
const POST_CATEGORIES: Array<{ key: string; label: string }> = [
  { key: "brand",   label: "브랜드" },
  { key: "dev",     label: "개발" },
  { key: "insight", label: "인사이트" },
  { key: "ops",     label: "운영" },
  { key: "retro",   label: "회고" },
  { key: "tool",    label: "AI 도구" },
];

type Mode = "new" | "edit";

type Initial = {
  slug: string;
  title: string;
  sub: string | null;
  cat: string;
  read_time: string | null;
  body_mdx: string | null;
  thumbnail_url?: string | null;
  visibility?: "public" | "member";
};

export function PostForm({ mode, initial }: { mode: Mode; initial: Initial }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [uploading, startUpload] = useTransition();
  const [title, setTitle] = useState(initial.title);
  const [sub, setSub] = useState(initial.sub ?? "");
  const [cat, setCat] = useState(initial.cat);
  const [read, setRead] = useState(initial.read_time ?? "");
  const [body, setBody] = useState(initial.body_mdx ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initial.thumbnail_url ?? null);
  const [visibility, setVisibility] = useState<"public" | "member">(initial.visibility ?? "public");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    startUpload(async () => {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const { url } = await uploadAdminImage(fd, "posts");
        setThumbnailUrl(url);
      } catch (err) {
        alert("이미지 업로드 실패: " + (err instanceof Error ? err.message : String(err)));
      }
    });
  }

  function save() {
    start(async () => {
      try {
        if (mode === "new") {
          await createPost({ title, sub, cat, read_time: read, body_mdx: body, thumbnail_url: thumbnailUrl, visibility });
        } else {
          await updatePost(initial.slug, { title, sub, cat, read_time: read, body_mdx: body, thumbnail_url: thumbnailUrl, visibility });
        }
        router.push("/admin/posts");
      } catch (e) {
        alert("실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  return (
    <div className="stack" style={{ gap: 18, opacity: busy ? 0.7 : 1 }}>
      <div className="row" style={{ gap: 10 }}>
        <Link href="/admin/posts" className="btn btn-secondary btn-sm"><Icon name="chevron-left" size={14} /> 글 목록</Link>
        <div className="grow" />
        <button type="button" className="btn btn-primary" onClick={save} disabled={busy || uploading || !title}>
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
              {POST_CATEGORIES.map(({ key, label }) => (
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
            {mode === "edit" ? (
              <input
                className="input mono"
                value={initial.slug}
                disabled
                style={{ background: "var(--surface-2)", color: "var(--fg-3)" }}
              />
            ) : (
              <div
                className="input mono"
                style={{ display: "flex", alignItems: "center", background: "var(--surface-2)", color: "var(--fg-3)" }}
              >
                저장 시 카테고리 기준으로 자동 생성됩니다
              </div>
            )}
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label className="field-label">부제</label>
            <input className="input" value={sub} onChange={(e) => setSub(e.target.value)} />
          </div>
          <div>
            <label className="field-label">공개 범위</label>
            <select
              className="select"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as "public" | "member")}
            >
              <option value="public">전체 공개</option>
              <option value="member">🔒 멤버 전용</option>
            </select>
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

      <div>
        <div className="micro" style={{ marginBottom: 8 }}>본문 (MDX)</div>
        <textarea className="input textarea mdx" value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
    </div>
  );
}
