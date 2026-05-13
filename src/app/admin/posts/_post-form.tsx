"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { createPost, updatePost } from "../_actions/posts";

type Mode = "new" | "edit";

type Initial = {
  slug: string;
  title: string;
  sub: string | null;
  cat: string;
  read_time: string | null;
  body_mdx: string | null;
};

export function PostForm({ mode, initial }: { mode: Mode; initial: Initial }) {
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
          await createPost({ slug, title, sub, cat, read_time: read, body_mdx: body });
        } else {
          await updatePost(initial.slug, { title, sub, cat, read_time: read, body_mdx: body });
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
              {["사고방식", "자동화", "회사", "실패담", "logs"].map((c) => (<option key={c}>{c}</option>))}
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
        <div className="micro" style={{ marginBottom: 8 }}>본문 (MDX)</div>
        <textarea className="input textarea mdx" value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
    </div>
  );
}
