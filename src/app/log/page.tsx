// /log — 팀 블로그 (셀피시클럽 팀 블로그 패턴 차용 · 목업)
// 셀피시의 카드 그리드 (이미지 + 카테고리 + 제목 + 부제 + 메타) 형식을
// AICONLAB 페이퍼 톤에 맞춰 옮긴 정적 목업.
//
// Note: 정적 더미 9개로 진열. 카드 클릭 시 /log/[slug] 목업 상세로 이동.
// 추후 위키 log.md 자동 발행 또는 MDX 기반 글 시스템으로 교체 예정.

import Link from "next/link";
import { FadeUp } from "@/components/aiconlab/fade-up";
import { Icon } from "@/components/aiconlab/icon";
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

        {/* 카테고리 필터 (목업 — 클릭 동작 없음) */}
        <FadeUp delay={220}>
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <CategoryChip label="전체" active />
            {Object.entries(categories).map(([k, v]) => (
              <CategoryChip key={k} label={v.label} color={v.color} />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// 카테고리 필터 칩 (목업 — 동작 X, 시각 요소만)
function CategoryChip({
  label,
  color,
  active,
}: {
  label: string;
  color?: string;
  active?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 999,
        background: active ? "var(--ink-900)" : "rgba(255,255,255,0.04)",
        color: active ? "#fff" : "var(--fg-2)",
        border: `1px solid ${active ? "var(--ink-900)" : "var(--border-1)"}`,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {color && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: color,
          }}
        />
      )}
      {label}
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// 2. POST CARD — 단일 글 카드 (셀피시 팀 블로그 카드 패턴)
// ──────────────────────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
  const meta = categories[post.cat];

  return (
    <Link
      href={`/log/${post.slug}`}
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
        height: "100%",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform .15s ease",
      }}
    >
      {/* ─── 썸네일 영역 (16:9) ─── */}
      <div
        style={{
          aspectRatio: "16/9",
          background: "var(--ink-900)",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--border-1)",
        }}
      >
        {post.thumbnailUrl ? (
          // 썸네일 이미지가 있으면 커버 표시
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          // 없으면 기존 그라데이션 + 카테고리 큰 텍스트 fallback
          <>
            {/* 다층 글로우 (카테고리 색) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse at 30% 30%, ${meta.glow}, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(255,255,255,0.04), transparent 60%)`,
              }}
            />
            {/* 가운데 — 카테고리 큰 텍스트 (시각 액센트) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 36,
                fontWeight: 800,
                color: meta.color,
                opacity: 0.18,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                pointerEvents: "none",
              }}
            >
              {meta.label}
            </div>
          </>
        )}
        {/* 좌상단 — 카테고리 배지 (항상 오버레이) */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            padding: "4px 10px",
            background: meta.glow,
            color: meta.color,
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            zIndex: 2,
          }}
        >
          ● {meta.label}
        </div>
        {/* 우하단 — 읽기 시간 (항상 오버레이) */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            padding: "3px 8px",
            background: "rgba(0,0,0,0.55)",
            borderRadius: 4,
            fontSize: 11,
            color: "#fff",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.06em",
            zIndex: 2,
          }}
        >
          {post.readTime}
        </div>
      </div>

      {/* ─── 본문 영역 ─── */}
      <div
        style={{
          padding: 22,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: 10,
        }}
      >
        {/* 날짜 + 카테고리 메타 */}
        <div
          className="mono"
          style={{
            fontSize: 12,
            color: "var(--fg-3)",
            letterSpacing: "0.06em",
          }}
        >
          {post.date} · {meta.label}
        </div>

        {/* 제목 */}
        <h3
          className="aicon-h2"
          style={{
            fontSize: 19,
            fontWeight: 700,
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {post.title}
        </h3>

        {/* 부제 (한 줄 요약) */}
        <p
          style={{
            fontSize: 14.5,
            color: "var(--fg-2)",
            lineHeight: 1.6,
            margin: 0,
            flex: 1,
          }}
        >
          {post.sub}
        </p>

        {/* 하단 — 읽기 화살표 */}
        <div
          style={{
            marginTop: 8,
            paddingTop: 12,
            borderTop: "1px dashed var(--border-1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            className="mono"
            style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.06em" }}
          >
            AICONLAB
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text-mint)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            읽기 <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </article>
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
        <div className="grid-3">
          {posts.map((p, i) => (
            <FadeUp key={p.slug} delay={80 + i * 50}>
              <PostCard post={p} />
            </FadeUp>
          ))}
        </div>
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
        {/* 더보기 (목업) */}
        <FadeUp>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 56,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              style={{ minWidth: 200 }}
            >
              더 많은 글 보기
            </button>
          </div>
        </FadeUp>

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
