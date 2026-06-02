// /notes — 인사이트 (한 사람의 사색과 기록)
// 작성자 아바타 + 이름 노출. /log 팀 블로그 패턴 차용.

import Link from "next/link";
import { FadeUp } from "@/components/aiconlab/fade-up";
import { Icon } from "@/components/aiconlab/icon";
import { CategoryFilterGrid } from "@/components/aiconlab/category-filter-grid";
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
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 2. NOTE CARD — 단일 글 카드 (작성자 아바타 + 이름 포함)
// ──────────────────────────────────────────────────────────
function NoteCard({ note, index }: { note: Note; index: number }) {
  const meta = categories[note.cat];

  // newtab 모드: raw 경로로 새 탭 열기, embed 모드: 상세 페이지로 이동
  const isNewTab = note.renderMode === "newtab";
  // 도판 인덱스 — NO. 001 형식
  const no = String(index).padStart(3, "0");

  return (
    <Link
      href={isNewTab ? `/notes/${note.slug}/raw` : `/notes/${note.slug}`}
      target={isNewTab ? "_blank" : undefined}
      rel={isNewTab ? "noopener noreferrer" : undefined}
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
        {note.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={note.thumbnailUrl}
            alt={note.title}
            // contain + 약간의 여백: 비율이 안 맞아도 이미지가 잘리지 않고 전체가 보인다. 빈 공간은 크림 배경.
            style={{ position: "absolute", inset: 10, width: "calc(100% - 20px)", height: "calc(100% - 20px)", objectFit: "contain" }}
          />
        ) : (
          // 이미지 없으면 손글씨 제목 + 부제 + 카테고리 마크 (프로토타입 C)
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
              {note.title}
            </h3>
            {note.sub && (
              <p style={{ fontSize: 13, color: "var(--fg-3)", lineHeight: 1.5, margin: 0 }}>
                {note.sub}
              </p>
            )}
            <span
              aria-hidden
              style={{
                marginTop: 4,
                width: 34,
                height: 30,
                borderRadius: 8,
                background: meta.color,
                display: "inline-block",
              }}
            />
          </div>
        )}
        {/* 우하단 — 읽기 시간 배지 */}
        {note.readTime && (
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
            {note.readTime}
          </div>
        )}
      </div>

      {/* ─── 도판 캡션 (카드 밖) — 인덱스·카테고리 / 제목 / 메타 ─── */}
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
          <span
            style={{ width: 7, height: 7, borderRadius: 999, background: meta.color, flexShrink: 0 }}
          />
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
          {note.title}
        </h3>
        <span
          className="mono"
          style={{ fontSize: 12, color: "var(--fg-3)", letterSpacing: "0.04em" }}
        >
          {note.date}
          {note.readTime && ` · ${note.readTime}`}
          {isNewTab && (
            <span aria-label="새 탭에서 열림" style={{ marginLeft: 6, opacity: 0.7 }}>
              🪟
            </span>
          )}
        </span>
      </div>
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
        <CategoryFilterGrid
          chip="aicon"
          categories={Object.entries(categories).map(([key, v]) => ({
            key,
            label: v.label,
            color: v.color,
          }))}
          items={notes.map((n, i) => ({
            key: n.slug,
            cat: n.cat,
            node: (
              <FadeUp key={n.slug} delay={80 + i * 50}>
                <NoteCard note={n} index={i + 1} />
              </FadeUp>
            ),
          }))}
        />
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
