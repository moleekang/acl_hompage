// /log/[slug] — 팀 블로그 글 상세 페이지
// posts.ts의 slug로 글 메타 + body_mdx(마크다운) 본문을 렌더. 본문 없으면 안내.
//
// Next.js 16: params는 Promise — async 컴포넌트에서 await 필요
// generateStaticParams로 9개 slug 모두 빌드 타임 정적 생성

import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeUp } from "@/components/aiconlab/fade-up";
import { Icon } from "@/components/aiconlab/icon";
import {
  fetchPost,
  fetchRelatedPosts,
  categories,
  type Post,
} from "../posts";
import { createAdminClient } from "@/lib/supabase/server";
import { getViewerMembership } from "@/lib/membership";
import { renderNoteBody } from "@/lib/notes/render";
import { HtmlBody } from "@/components/notes/html-body";
import { MemberGate } from "@/components/aiconlab/member-gate";

// 빌드 타임에 모든 글 slug 미리 생성 (SSG) — generateStaticParams는 쿠키 기반 클라이언트를 쓸 수 없어
// 서비스 롤 클라이언트로 직접 조회한다.
export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .not("published_at", "is", null);
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

// ──────────────────────────────────────────────────────────
// 메인 페이지 컴포넌트
// ──────────────────────────────────────────────────────────
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  // 글이 없으면 404
  if (!post) notFound();

  const cat = categories[post.cat];
  const related = await fetchRelatedPosts(slug, 3);

  // 멤버 전용 글 + 비멤버 뷰어 — 본문 대신 게이트.
  let gate = null;
  if (post.locked) {
    const { loggedIn } = await getViewerMembership();
    gate = <MemberGate loggedIn={loggedIn} nextPath={`/log/${slug}`} />;
  }

  return (
    <>
      <PostHero post={post} cat={cat} />
      {gate ?? <PostBody post={post} />}
      <RelatedSection related={related} />
      <BackToListCTA />
    </>
  );
}

// ──────────────────────────────────────────────────────────
// 1. HERO — 카테고리 배지 + 제목 + 부제 + 메타
// ──────────────────────────────────────────────────────────
function PostHero({
  post,
  cat,
}: {
  post: Post;
  cat: (typeof categories)[Post["cat"]];
}) {
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
            href="/log"
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
            <span aria-hidden>←</span> 팀 블로그로 돌아가기
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
            {post.title}
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
            {post.sub}
          </p>
        </FadeUp>

        {/* 메타 — 날짜 / 읽기 시간 / 저자 */}
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
            <span>{post.date}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{post.readTime} 읽기</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>AICONLAB</span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 2. BODY — body_mdx(마크다운) → HTML 렌더. 본문 없으면 안내.
// ──────────────────────────────────────────────────────────
function PostBody({ post }: { post: Post }) {
  const renderedHtml = post.body_mdx
    ? renderNoteBody(post.body_mdx, "markdown")
    : null;

  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 24, paddingBottom: 64 }}
    >
      <div className="aicon-container" style={{ maxWidth: 720 }}>
        {renderedHtml ? (
          <FadeUp>
            <HtmlBody html={renderedHtml} />
          </FadeUp>
        ) : (
          <FadeUp>
            <div
              style={{
                padding: "14px 18px",
                borderRadius: 10,
                background: "rgba(90,124,255,0.06)",
                border: "1px dashed rgba(90,124,255,0.35)",
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
                admin에서 본문을 작성해 주세요.
              </span>
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 3. RELATED — 관련 글 3개 (간소 카드)
// ──────────────────────────────────────────────────────────
function RelatedSection({ related }: { related: Post[] }) {
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
          {related.map((p, i) => {
            const meta = categories[p.cat];
            return (
              <FadeUp key={p.slug} delay={120 + i * 60}>
                <Link
                  href={`/log/${p.slug}`}
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
                      {p.title}
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
                      {p.sub}
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
                      }}
                    >
                      {p.date} · {p.readTime}
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
          <Link href="/log" className="btn btn-secondary btn-lg">
            <Icon name="arrow" size={16} /> 팀 블로그 전체 보기
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
