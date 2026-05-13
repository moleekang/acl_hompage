// 위키 페이지 에디터 — 좌 MDX, 우 미리보기.
// slug가 "new"면 신규 생성.
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MdRender } from "@/components/wiki/md-render";

type Params = Promise<{ slug: string }>;

export default function WikiEditorPage({ params }: { params: Params }) {
  const { slug: routeSlug } = use(params);
  const isNew = routeSlug === "new";
  const router = useRouter();

  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState(isNew ? "" : routeSlug);
  const [body, setBody] = useState("");

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data, error: fetchErr } = await supabase
        .from("wiki_pages")
        .select("title, slug, body_mdx")
        .eq("slug", routeSlug)
        .is("deleted_at", null)
        .maybeSingle();
      if (cancelled) return;
      if (fetchErr) setError(fetchErr.message);
      else if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setBody(data.body_mdx ?? "");
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [isNew, routeSlug]);

  async function save() {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { data: userResult } = await supabase.auth.getUser();
    const userId = userResult.user?.id;
    if (!userId) {
      setError("로그인이 필요합니다");
      setBusy(false);
      return;
    }

    if (isNew) {
      const { error: insertErr } = await supabase
        .from("wiki_pages")
        .insert({ slug, title, body_mdx: body, created_by: userId, updated_by: userId });
      if (insertErr) {
        setError(insertErr.message);
        setBusy(false);
        return;
      }
    } else {
      const { error: updateErr } = await supabase
        .from("wiki_pages")
        .update({ title, body_mdx: body, updated_by: userId })
        .eq("slug", routeSlug);
      if (updateErr) {
        setError(updateErr.message);
        setBusy(false);
        return;
      }
    }
    router.push(`/llm-wiki/${slug}`);
  }

  if (loading) {
    return (
      <main style={{ padding: 80, textAlign: "center", color: "var(--fg-3)" }}>불러오는 중…</main>
    );
  }

  return (
    <main className="aicon-section" style={{ paddingTop: 56, paddingBottom: 96, background: "var(--bg-canvas)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href={isNew ? "/llm-wiki" : `/llm-wiki/${routeSlug}`} style={{ color: "var(--fg-2)", fontSize: 13 }}>
              ← 취소
            </Link>
            <code className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>
              {isNew ? "새 페이지" : `/llm-wiki/${routeSlug}/edit`}
            </code>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={busy || !title || !slug}
            style={{
              background: "var(--mint-400)", color: "var(--ink-900)",
              border: "1.5px solid var(--ink-900)",
              boxShadow: "2px 2px 0 var(--ink-900)",
              padding: "10px 18px", borderRadius: 8,
              fontWeight: 700, cursor: busy ? "wait" : "pointer",
              opacity: busy || !title || !slug ? 0.5 : 1,
            }}
          >
            {busy ? "저장 중..." : "저장"}
          </button>
        </div>

        {error && (
          <div style={{ padding: 12, background: "rgba(255,107,71,0.1)", border: "1px dashed var(--text-hot)", borderRadius: 8, color: "var(--text-hot)", marginBottom: 14, fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              제목
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="페이지 제목"
              style={{
                width: "100%", padding: "10px 12px",
                border: "1px solid var(--border-2)", borderRadius: 8,
                background: "var(--surface-1)", fontSize: 15, fontWeight: 700,
                fontFamily: "var(--font-body)",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              슬러그 (URL)
            </label>
            <input
              value={slug}
              onChange={(e) => isNew && setSlug(e.target.value.replace(/[^a-z0-9-]/gi, "-").toLowerCase())}
              disabled={!isNew}
              placeholder="my-page"
              className="mono"
              style={{
                width: "100%", padding: "10px 12px",
                border: "1px solid var(--border-2)", borderRadius: 8,
                background: isNew ? "var(--surface-1)" : "var(--surface-2)",
                fontFamily: "var(--font-mono)", fontSize: 13,
                color: isNew ? "var(--fg-1)" : "var(--fg-3)",
              }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>MDX 에디터</div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="# 제목\n\n본문..."
              style={{
                width: "100%", minHeight: 460,
                padding: 16,
                border: "1px solid var(--border-2)", borderRadius: 14,
                background: "var(--surface-1)",
                fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7,
                resize: "vertical",
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>실시간 미리보기</div>
            <div
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border-1)",
                borderRadius: 14,
                padding: "28px 32px",
                minHeight: 460,
                fontSize: 14, lineHeight: 1.75,
              }}
            >
              {title && (
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 12 }}>{title}</h1>
              )}
              <MdRender body={body} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
