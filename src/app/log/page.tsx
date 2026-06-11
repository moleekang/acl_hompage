// /log — 팀 블로그 (셀피시클럽 팀 블로그 패턴 차용 · 목업)
// 셀피시의 카드 그리드 (이미지 + 카테고리 + 제목 + 부제 + 메타) 형식을
// AICONLAB 페이퍼 톤에 맞춰 옮긴 정적 목업.
//
// Note: 정적 더미 9개로 진열. 카드 클릭 시 /log/[slug] 목업 상세로 이동.
// 추후 위키 log.md 자동 발행 또는 MDX 기반 글 시스템으로 교체 예정.

import Link from "next/link";
import { FadeUp } from "@/components/aiconlab/fade-up";
import { Icon } from "@/components/aiconlab/icon";
import { CategoryFilterGrid } from "@/components/aiconlab/category-filter-grid";
import { fetchPosts, categories, type Post } from "./posts";

// ──────────────────────────────────────────────────────────
// 1. INTRO — 페이지 헤더 (셀피시 팀 블로그 섹션 헤더 패턴)
// ──────────────────────────────────────────────────────────
function BlogIntro() {
  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 96, paddingBottom: 48 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            TEAM BLOG · 만드는 사람의 기록
          </div>
        </FadeUp>

        <FadeUp delay={80}>
          <h1
            className="hero-headline"
            style={{ maxWidth: 880, marginBottom: 20 }}
          >
            만드는 사람의
            <br />
            <span className="marker">일지.</span>
          </h1>
        </FadeUp>

        <FadeUp delay={160}>
          <p
            style={{
              fontSize: 18,
              color: "var(--fg-2)",
              maxWidth: 720,
              lineHeight: 1.65,
            }}
          >
            Congen 개발 · 위키 운영 · AI 도구 사용기 — 1인 기업의 매주 라이브
            다큐멘터리.
            <br />
            편집된 성공만이 아니라{" "}
            <span className="hand" style={{ color: "var(--text-sun)", fontSize: 22 }}>
              실패와 시행착오까지.
            </span>
          </p>
        </FadeUp>

      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 2. POST CARD — 단일 글 카드 (셀피시 팀 블로그 카드 패턴)
// ──────────────────────────────────────────────────────────
function PostCard({ post, index }: { post: Post; index: number }) {
  const meta = categories[post.cat];
  // 도판 인덱스 — NO. 001 형식
  const no = String(index).padStart(3, "0");

  return (
    <Link
      href={`/log/${post.slug}`}
      className="gallery-card"
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      {/* ─── 썸네일 (미술관 도판의 '작품') — 테두리 없는 크림 박스 ─── */}
      <div
        className="gallery-card__plate"
        style={{
          aspectRatio: "4 / 3",
          background: "var(--surface-2)",
          borderRadius: 16,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 6px 22px rgba(0,0,0,0.05)",
        }}
      >
        {post.thumbnailUrl ? (
          // contain + 약간의 여백: 비율이 안 맞아도 이미지가 잘리지 않고 전체가 보인다.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            style={{ position: "absolute", inset: 10, width: "calc(100% - 20px)", height: "calc(100% - 20px)", objectFit: "contain" }}
          />
        ) : (
          // 이미지 없으면 손글씨 제목 + 부제 + 카테고리 마크
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "24px 28px",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 30,
                fontWeight: 700,
                color: "var(--fg-1)",
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              {post.title}
            </h3>
            {post.sub && (
              <p style={{ fontSize: 13, color: "var(--fg-3)", lineHeight: 1.5, margin: 0 }}>
                {post.sub}
              </p>
            )}
            <span
              aria-hidden
              style={{ marginTop: 4, width: 34, height: 30, borderRadius: 8, background: meta.color, display: "inline-block" }}
            />
          </div>
        )}
        {/* 좌상단 — 멤버 전용 잠금 배지 */}
        {post.locked && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              padding: "3px 10px",
              background: "rgba(14,17,22,0.82)",
              borderRadius: 999,
              fontSize: 11,
              color: "#fff",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.04em",
            }}
          >
            🔒 멤버 전용
          </div>
        )}
        {/* 우하단 — 읽기 시간 배지 */}
        {post.readTime && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              padding: "3px 10px",
              background: "rgba(14,17,22,0.82)",
              borderRadius: 999,
              fontSize: 11,
              color: "#fff",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.04em",
            }}
          >
            {post.readTime}
          </div>
        )}
      </div>

      {/* ─── 도판 캡션 (카드 밖) ─── */}
      <div style={{ padding: "16px 4px 0" }}>
        <div
          className="mono"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontSize: 12,
            color: "var(--fg-3)",
            letterSpacing: "0.06em",
            marginBottom: 8,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 999, background: meta.color, flexShrink: 0 }} />
          NO. {no} — {meta.label}
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: "var(--fg-1)",
            lineHeight: 1.4,
            margin: "0 0 12px",
          }}
        >
          {post.title}
        </h3>
        <span
          className="mono"
          style={{ fontSize: 12, color: "var(--fg-3)", letterSpacing: "0.04em" }}
        >
          {post.date}
          {post.readTime && ` · ${post.readTime}`}
        </span>
      </div>
    </Link>
  );
}

// ──────────────────────────────────────────────────────────
// 3. POST GRID — 카드 그리드 3열 × 3행 = 9개
// ──────────────────────────────────────────────────────────
function PostGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <section className="aicon-section" style={{ paddingTop: 16, paddingBottom: 48 }}>
        <div className="aicon-container">
          <p style={{ color: "var(--fg-3)", fontSize: 15 }}>
            아직 발행된 글이 없습니다.
          </p>
        </div>
      </section>
    );
  }
  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 16, paddingBottom: 48 }}
    >
      <div className="aicon-container">
        <CategoryFilterGrid
          chip="aicon"
          categories={Object.entries(categories).map(([key, v]) => ({
            key,
            label: v.label,
            color: v.color,
          }))}
          items={posts.map((p, i) => ({
            key: p.slug,
            cat: p.cat,
            node: (
              <FadeUp key={p.slug} delay={80 + i * 50}>
                <PostCard post={p} index={i + 1} />
              </FadeUp>
            ),
          }))}
        />
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 4. PAGINATION & SUBSCRIBE CTA — 셀피시 "더보기" + 뉴스레터 패턴
// ──────────────────────────────────────────────────────────
function PaginationCTA() {
  return (
    <section
      className="aicon-section"
      style={{
        background: "var(--surface-2)",
        paddingTop: 64,
        paddingBottom: 96,
      }}
    >
      <div className="aicon-container">
        {/* 구독 CTA (셀피시 뉴스레터 마퀴 패턴 축약 버전) */}
        <FadeUp delay={120}>
          <div
            className="card-dark"
            style={{
              padding: "40px 36px",
              textAlign: "center",
              maxWidth: 720,
              margin: "0 auto",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 50% 100%, rgba(255,210,63,0.18), transparent 60%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative" }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>
                SUBSCRIBE · 매주 새 글 알림
              </div>
              <h2
                className="aicon-h1"
                style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}
              >
                만드는 과정,{" "}
                <span className="marker">놓치지 않고</span> 받기.
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--fg-2)",
                  marginBottom: 24,
                  maxWidth: 480,
                  margin: "0 auto 24px",
                  lineHeight: 1.6,
                }}
              >
                AICONLAB의 라이브 다큐멘터리를 메일로 받아보세요. 매주 1회.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  justifyContent: "center",
                  maxWidth: 480,
                  margin: "0 auto",
                }}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  disabled
                  style={{
                    flex: 1,
                    minWidth: 200,
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "1px solid var(--border-1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "var(--fg-1)",
                    fontSize: 14,
                    fontFamily: "inherit",
                    cursor: "not-allowed",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: "12px 24px", whiteSpace: "nowrap" }}
                >
                  구독하기 <Icon name="arrow" size={16} />
                </button>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--fg-3)",
                  marginTop: 12,
                  fontStyle: "italic",
                }}
              >
                ⚠️ 목업입니다 — 실제 구독 기능은 아직 미구현
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE — 팀 블로그 페이지 마스터 조합
// ──────────────────────────────────────────────────────────
export default async function TeamBlogPage() {
  const posts = await fetchPosts();
  return (
    <>
      <BlogIntro />
      <PostGrid posts={posts} />
      <PaginationCTA />
    </>
  );
}
