// /log/[slug] — 팀 블로그 글 상세 페이지 (목업)
// posts.ts의 slug를 받아서 글 메타데이터를 표시하고 더미 본문 렌더.
// 실제 글 내용은 추후 위키 log.md 자동 발행 또는 MDX 시스템과 연동 예정.
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

  return (
    <>
      <PostHero post={post} cat={cat} />
      <PostBody post={post} />
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
// 2. BODY — 목업 안내 + 더미 본문
// ──────────────────────────────────────────────────────────
function PostBody({ post }: { post: Post }) {
  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 24, paddingBottom: 64 }}
    >
      <div className="aicon-container" style={{ maxWidth: 720 }}>
        {/* 목업 안내 배너 */}
        <FadeUp>
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 10,
              background: "rgba(255,210,63,0.08)",
              border: "1px dashed rgba(255,210,63,0.45)",
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
              🚧
            </span>
            <span>
              <b style={{ color: "var(--fg-1)" }}>이 글은 목업입니다.</b> 실제 글
              내용은 추후 위키 log.md 자동 발행 또는 MDX 시스템과 연동되어 이
              자리에 들어갑니다.
            </span>
          </div>
        </FadeUp>

        {/* 더미 본문 — 3섹션 */}
        <FadeUp delay={80}>
          <p style={bodyParagraphStyle}>
            AICONLAB은 1인 기업을 통째로 자동화하며 그 과정을 라이브로 공유하는
            실험실입니다. 이 글은 그 여정의 한 조각을 기록합니다.
          </p>
        </FadeUp>

        <FadeUp delay={120}>
          <h2 style={bodyH2Style}>왜 이 주제를 다루는가</h2>
          <p style={bodyParagraphStyle}>
            <i>{post.title}</i> — 이 제목 아래 들어갈 본문은 사장님이 매주 발행할
            글의 자리입니다. 위키의 log.md에 작성된 내용이 이 자리에 마크다운으로
            렌더링되거나, MDX 파일을 직접 두는 방식으로 운영할 수 있습니다.
          </p>
          <p style={bodyParagraphStyle}>
            셀피시클럽의 팀 블로그가 그러하듯, 발행되는 글은{" "}
            <b>실패와 시행착오</b>까지 솔직히 포함합니다. AICONLAB의 5대 가치 중{" "}
            <b>"솔직한 공유"</b>가 이 페이지의 톤을 정합니다.
          </p>
        </FadeUp>

        <FadeUp delay={180}>
          <h2 style={bodyH2Style}>어떻게 만들어지는가</h2>
          <p style={bodyParagraphStyle}>
            이 페이지는 디자인 검증을 위한 시각 목업입니다. 셀피시클럽의 팀 블로그
            패턴(카드 그리드 → 상세 페이지)을 빠르게 확인할 수 있도록 만들었습니다.
          </p>
          <ul style={bodyListStyle}>
            <li>썸네일 영역 (16:9 그라데이션 + 카테고리 색)</li>
            <li>카테고리 배지 + 제목 + 부제의 위계</li>
            <li>날짜·읽기 시간 메타 정보</li>
            <li>관련 글 3개 추천 (카테고리 우선)</li>
          </ul>
        </FadeUp>

        <FadeUp delay={240}>
          <h2 style={bodyH2Style}>다음 단계</h2>
          <p style={bodyParagraphStyle}>
            실제 글이 쌓이기 시작하면 이 자리에 마크다운으로 작성된 본문이
            들어옵니다. 코드 블록, 이미지, 인용, 표 — 풀스타일로 렌더링되도록
            추후 글 발행 시스템을 연결할 예정입니다.
          </p>
          <blockquote
            style={{
              borderLeft: "3px solid var(--text-mint)",
              paddingLeft: 18,
              margin: "24px 0",
              fontSize: 17,
              color: "var(--fg-1)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            "프롬프트 너머의 컨텍스트로, 1인 기업을 통째로 자동화해 가는 한 사람의
            과정을 통째로 나누며 시청자와 함께 쌓아가는 AI 실험실."
          </blockquote>
        </FadeUp>
      </div>
    </section>
  );
}

// 본문 스타일 토큰 — 인라인 스타일 재사용용
const bodyParagraphStyle: React.CSSProperties = {
  fontSize: 17,
  color: "var(--fg-1)",
  lineHeight: 1.85,
  marginBottom: 20,
};
const bodyH2Style: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: "-0.01em",
  marginTop: 40,
  marginBottom: 16,
  color: "var(--fg-1)",
};
const bodyListStyle: React.CSSProperties = {
  fontSize: 16,
  color: "var(--fg-2)",
  lineHeight: 1.9,
  paddingLeft: 24,
  marginBottom: 20,
};

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
