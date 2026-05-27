// /notes — 인사이트 (한 사람의 사색과 기록)
// 작성자 아바타 + 이름 노출. /log 팀 블로그 패턴 차용.

import Link from "next/link";
import { FadeUp } from "@/components/aiconlab/fade-up";
import { Icon } from "@/components/aiconlab/icon";
import { fetchNotes, categories, type Note } from "./notes";

// ──────────────────────────────────────────────────────────
// 1. INTRO — 페이지 헤더
// ──────────────────────────────────────────────────────────
function NotesIntro() {
  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 96, paddingBottom: 48 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            INSIGHTS · 한 사람의 사색
          </div>
        </FadeUp>

        <FadeUp delay={80}>
          <h1
            className="hero-headline"
            style={{ maxWidth: 880, marginBottom: 20 }}
          >
            생각하는 사람의
            <br />
            <span className="marker">인사이트.</span>
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
            사색 · 도구 · 운영 · 기록 — 1인 기업을 운영하며 얻은 개인의 통찰.
            <br />
            정제된 결론만이 아니라{" "}
            <span className="hand" style={{ color: "var(--text-sun)", fontSize: 22 }}>
              과정과 질문까지.
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
// 2. NOTE CARD — 단일 글 카드 (작성자 아바타 + 이름 포함)
// ──────────────────────────────────────────────────────────
function NoteCard({ note }: { note: Note }) {
  const meta = categories[note.cat];

  // 작성자 표시: nickname 우선, 없으면 email local part 불가(공개 측엔 없음) → "작성자"
  const authorName = note.author?.nickname ?? "작성자";
  const authorInitial = authorName.charAt(0).toUpperCase();

  // newtab 모드: raw 경로로 새 탭 열기, embed 모드: 상세 페이지로 이동
  const isNewTab = note.renderMode === "newtab";

  return (
    <Link
      href={isNewTab ? `/notes/${note.slug}/raw` : `/notes/${note.slug}`}
      target={isNewTab ? "_blank" : undefined}
      rel={isNewTab ? "noopener noreferrer" : undefined}
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
          {note.thumbnailUrl ? (
            // 썸네일 이미지가 있으면 커버 표시
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={note.thumbnailUrl}
              alt={note.title}
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
            {note.readTime}
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
            {note.date} · {meta.label}
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
            {note.title}
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
            {note.sub}
          </p>

          {/* 하단 — 작성자 + 읽기 화살표 */}
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
            {/* 작성자 아바타 + 이름 */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {note.author?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={note.author.avatar_url}
                  alt={authorName}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    objectFit: "cover",
                    border: "1px solid var(--border-1)",
                  }}
                />
              ) : (
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background: "var(--text-electric)",
                    color: "#fff",
                    fontSize: 11,
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
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.06em" }}
              >
                {authorName}
              </span>
            </div>
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
              {isNewTab && <span aria-label="새 탭에서 열림" style={{ fontSize: 12, opacity: 0.7 }}>🪟</span>}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ──────────────────────────────────────────────────────────
// 3. NOTE GRID — 카드 그리드 3열
// ──────────────────────────────────────────────────────────
function NoteGrid({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
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
          {notes.map((n, i) => (
            <FadeUp key={n.slug} delay={80 + i * 50}>
              <NoteCard note={n} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 4. CTA — 더보기
// ──────────────────────────────────────────────────────────
function NotesCTA() {
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
                  "radial-gradient(ellipse at 50% 100%, rgba(90,124,255,0.14), transparent 60%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative" }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>
                INSIGHTS · 생각의 단면
              </div>
              <h2
                className="aicon-h1"
                style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}
              >
                깊이 읽고,{" "}
                <span className="marker">함께 생각하기.</span>
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
                AICONLAB의 인사이트 아카이브. 한 사람의 사색이 쌓여갑니다.
              </p>
              <Link href="/log" className="btn btn-secondary">
                <Icon name="arrow" size={16} /> 팀 블로그도 보기
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE
// ──────────────────────────────────────────────────────────
export default async function NotesPage() {
  const notes = await fetchNotes();
  return (
    <>
      <NotesIntro />
      <NoteGrid notes={notes} />
      <NotesCTA />
    </>
  );
}
