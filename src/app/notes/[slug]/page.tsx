// /notes/[slug] — 인사이트 글 상세 페이지
// 작성자 아바타 + 이름 노출. /log/[slug] 패턴 차용.
//
// Next.js 16: params는 Promise — async 컴포넌트에서 await 필요

import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeUp } from "@/components/aiconlab/fade-up";
import { Icon } from "@/components/aiconlab/icon";
import { HtmlBody } from "@/components/notes/html-body";
import {
  fetchNote,
  fetchRelatedNotes,
  categories,
  type Note,
} from "../notes";
import { createAdminClient } from "@/lib/supabase/server";

// 빌드 타임에 모든 글 slug 미리 생성 (SSG)
export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("notes")
    .select("slug")
    .not("published_at", "is", null);
  return (data ?? []).map((n) => ({ slug: n.slug }));
}

// ──────────────────────────────────────────────────────────
// 메인 페이지 컴포넌트
// ──────────────────────────────────────────────────────────
export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await fetchNote(slug);

  // 글이 없으면 404
  if (!note) notFound();

  const cat = categories[note.cat];
  const related = await fetchRelatedNotes(slug, 3);

  return (
    <>
      <NoteHero note={note} cat={cat} />
      <NoteBody note={note} />
      <RelatedSection related={related} />
      <BackToListCTA />
    </>
  );
}

// ──────────────────────────────────────────────────────────
// 1. HERO — 카테고리 배지 + 제목 + 부제 + 작성자 메타
// ──────────────────────────────────────────────────────────
function NoteHero({
  note,
  cat,
}: {
  note: Note;
  cat: (typeof categories)[Note["cat"]];
}) {
  const authorName = note.author?.nickname ?? "작성자";
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 80, paddingBottom: 40, position: "relative", overflow: "hidden" }}
    >
      {/* 카테고리 색 글로우 배경 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 20% 0%, ${cat.glow}, transparent 50%)`,
          pointerEvents: "none",
        }}
      />
      <div className="aicon-container" style={{ position: "relative", maxWidth: 880 }}>
        {/* 상단 — 목록으로 돌아가기 */}
        <FadeUp>
          <Link
            href="/notes"
            style={{
              fontSize: 13,
              color: "var(--fg-3)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 32,
              fontWeight: 600,
            }}
          >
            <span aria-hidden>←</span> 인사이트로 돌아가기
          </Link>
        </FadeUp>

        {/* 카테고리 배지 */}
        <FadeUp delay={60}>
          <div
            style={{
              display: "inline-block",
              padding: "5px 12px",
              background: cat.glow,
              color: cat.color,
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            ● {cat.label}
          </div>
        </FadeUp>

        {/* 제목 */}
        <FadeUp delay={120}>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              marginBottom: 18,
              maxWidth: 820,
            }}
          >
            {note.title}
          </h1>
        </FadeUp>

        {/* 부제 */}
        <FadeUp delay={180}>
          <p
            style={{
              fontSize: 19,
              color: "var(--fg-2)",
              lineHeight: 1.6,
              marginBottom: 32,
              maxWidth: 720,
            }}
          >
            {note.sub}
          </p>
        </FadeUp>

        {/* 메타 — 날짜 / 읽기 시간 / 작성자 */}
        <FadeUp delay={240}>
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              flexWrap: "wrap",
              color: "var(--fg-3)",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.04em",
              paddingTop: 20,
              borderTop: "1px dashed var(--border-1)",
            }}
          >
            <span>{note.date}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{note.readTime} 읽기</span>
            <span style={{ opacity: 0.4 }}>·</span>
            {/* 작성자 아바타 + 이름 */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {note.author?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={note.author.avatar_url}
                  alt={authorName}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    objectFit: "cover",
                    border: "1px solid var(--border-1)",
                  }}
                />
              ) : (
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    background: "var(--text-electric)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 800,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {authorInitial}
                </span>
              )}
              <span>{authorName}</span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 2. BODY — 본문 (HTML 그대로 sandbox iframe에 렌더)
// ──────────────────────────────────────────────────────────
function NoteBody({ note }: { note: Note }) {
  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 24, paddingBottom: 64 }}
    >
      <div className="aicon-container" style={{ maxWidth: 1080 }}>
        {note.body_mdx ? (
          <HtmlBody html={note.body_mdx} />
        ) : (
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 10,
              background: "rgba(90,124,255,0.06)",
              border: "1px dashed rgba(90,124,255,0.35)",
              marginBottom: 48,
              fontSize: 14,
              color: "var(--fg-2)",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              lineHeight: 1.55,
            }}
          >
            <span style={{ fontSize: 18 }} aria-hidden>
              ✏️
            </span>
            <span>
              <b style={{ color: "var(--fg-1)" }}>아직 본문이 없습니다.</b>{" "}
              admin에서 HTML 본문을 작성해 주세요.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 3. RELATED — 관련 글 3개 (간소 카드)
// ──────────────────────────────────────────────────────────
function RelatedSection({ related }: { related: Note[] }) {
  return (
    <section
      className="aicon-section"
      style={{
        background: "var(--surface-2)",
        paddingTop: 64,
        paddingBottom: 64,
      }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            RELATED · 함께 읽으면 좋은 글
          </div>
        </FadeUp>
        <FadeUp delay={60}>
          <h2
            className="aicon-h1"
            style={{ fontSize: 26, fontWeight: 700, marginBottom: 32 }}
          >
            이런 글도 있어요.
          </h2>
        </FadeUp>

        <div className="grid-3">
          {related.map((n, i) => {
            const meta = categories[n.cat];
            const relAuthorName = n.author?.nickname ?? "작성자";
            return (
              <FadeUp key={n.slug} delay={120 + i * 60}>
                <Link
                  href={`/notes/${n.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    height: "100%",
                  }}
                >
                  <article
                    className="card-dark"
                    style={{
                      padding: 22,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {/* 카테고리 배지 */}
                    <div
                      style={{
                        display: "inline-block",
                        padding: "3px 9px",
                        background: meta.glow,
                        color: meta.color,
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        alignSelf: "flex-start",
                      }}
                    >
                      ● {meta.label}
                    </div>

                    {/* 제목 */}
                    <h3
                      style={{
                        fontSize: 17,
                        fontWeight: 700,
                        lineHeight: 1.45,
                        margin: 0,
                      }}
                    >
                      {n.title}
                    </h3>

                    {/* 부제 */}
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--fg-2)",
                        lineHeight: 1.6,
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      {n.sub}
                    </p>

                    {/* 메타 */}
                    <div
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: "var(--fg-3)",
                        letterSpacing: "0.06em",
                        marginTop: 6,
                        paddingTop: 10,
                        borderTop: "1px dashed var(--border-1)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span>{n.date} · {n.readTime}</span>
                      <span style={{ opacity: 0.4 }}>·</span>
                      <span>{relAuthorName}</span>
                    </div>
                  </article>
                </Link>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 4. BACK CTA — 목록으로 돌아가기
// ──────────────────────────────────────────────────────────
function BackToListCTA() {
  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 56, paddingBottom: 80, textAlign: "center" }}
    >
      <div className="aicon-container">
        <FadeUp>
          <Link href="/notes" className="btn btn-secondary btn-lg">
            <Icon name="arrow" size={16} /> 인사이트 전체 보기
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
