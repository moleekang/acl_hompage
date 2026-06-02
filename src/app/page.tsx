// AICONLAB 메인 페이지 (Option A — 가벼운 메인 + 별도 About)
// 비전: "도구를 만들고, 같이 배우고, 함께 즐기는 — AI 실험실 커뮤니티."
//
// 7섹션 흐름 (5초 결정 친화 + 커뮤니티 무게중심):
//   1. Hero (새 카피 + paper 비디오 카드)
//   2. ProductsPreview (자동화앱 진열 — Congen + Coming Soon)
//   3. AudienceSegments (같이 배우는 사람들 — 3 페르소나)
//   4. LatestBlog (팀 블로그 최신 3개 — posts.ts에서)
//   5. JoinChannels (★ 합류 채널 3블록 — 다크 CTA 패턴)
//   6. AboutPreview (정체성 한 줄 + About 진입)
//   7. ClosingCTA (마지막 액션 유도)
//
// Note: 깊이 있는 정체성 콘텐츠(5대 가치·Definition·Framework·NorthStar·Positioning 등)는
// 별도 /about 페이지로 분리. 호기심 깊어진 방문자가 그쪽으로 진입.

import Link from "next/link";
import { FadeUp } from "@/components/aiconlab/fade-up";
import { Icon } from "@/components/aiconlab/icon";
import {
  StickerArrow,
  StickerCallout,
  StickerCircle,
  StickerStamp,
} from "@/components/aiconlab/sticker";
import { fetchPosts, categories, type Post } from "./log/posts";
import { getSiteStats } from "@/lib/site-stats";

// ──────────────────────────────────────────────────────────
// 1. HERO — 새 비전 카피 (④번 확정안)
// ──────────────────────────────────────────────────────────
async function Hero() {
  const stats = await getSiteStats();
  return (
    <section
      className="aicon-section"
      id="top"
      style={{
        paddingTop: 96,
        paddingBottom: 120,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 배경 radial wash */}
      <div className="hero-radial" />

      <div className="aicon-container" style={{ position: "relative" }}>
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            AICONLAB · AI 실험실 커뮤니티
          </div>
        </FadeUp>

        <div className="hero-grid">
          {/* ─── 좌측: 카피 ─── */}
          <div>
            <FadeUp delay={80}>
              <h1 className="hero-headline">
                {/* "함께" 단어에 크레용 손그림 동그라미 표시 (가장 강조하고 싶은 단어) */}
                <span
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  함께
                  <StickerCircle
                    size={90}
                    style={{
                      position: "absolute",
                      top: "-25%",
                      left: "-15%",
                      width: "130%",
                      height: "155%",
                      pointerEvents: "none",
                    }}
                  />
                </span>{" "}
                만드는
                <br />
                <span className="marker">AI 실험실.</span>
              </h1>
            </FadeUp>

            <FadeUp delay={160}>
              <p className="hero-sub">
                AI를 실험하고, 같이 배우고, 함께 즐기는 —
                <br />
                AICONLAB은{" "}
                <span
                  className="hand"
                  style={{ color: "var(--text-sun)", fontSize: 22 }}
                >
                  AI 문화 커뮤니티
                </span>
                예요.
              </p>
            </FadeUp>

            <FadeUp delay={240}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <a
                  className="btn btn-primary btn-lg"
                  href="https://www.youtube.com/@A-ConLab-b1m"
                  target="_blank"
                  rel="noreferrer"
                >
                  유튜브 구독하기 <Icon name="arrow" size={18} />
                </a>
                <Link className="btn btn-secondary btn-lg" href="/products">
                  자동화앱 둘러보기
                </Link>
              </div>
            </FadeUp>

            {/* Stat row */}
            <FadeUp delay={320}>
              <div
                style={{
                  marginTop: 48,
                  display: "flex",
                  gap: 24,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Stat n={stats.youtubeSubscribers} label="함께하는 시청자" />
                <Divider />
                <Stat n={stats.topVideoViews} label="인기 영상 뷰" />
                <Divider />
                <Stat n={stats.wikiPages} label="공유 위키" />
              </div>
            </FadeUp>
          </div>

          {/* ─── 우측: paper-rotated 비디오 카드 + 스티커 ─── */}
          <div style={{ position: "relative" }}>
            <FadeUp delay={200}>
              <div
                className="card-paper"
                style={{ transform: "rotate(-1.6deg)", padding: 22 }}
              >
                <div
                  style={{
                    aspectRatio: "16/9",
                    background: "var(--ink-900)",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(ellipse at 30% 20%, rgba(124,245,196,0.18), transparent 60%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, transparent, rgba(90,124,255,0.10))",
                    }}
                  />
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 999,
                      background: "var(--mint-400)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "var(--shadow-mint)",
                    }}
                  >
                    <Icon name="play" size={26} color="var(--ink-900)" />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      padding: "4px 8px",
                      background: "rgba(255,107,71,0.95)",
                      borderRadius: 4,
                      fontSize: 12,
                      color: "#fff",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                    }}
                  >
                    LIVE DOC
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 12,
                      left: 12,
                      padding: "4px 8px",
                      background: "rgba(0,0,0,.75)",
                      borderRadius: 4,
                      fontSize: 12,
                      color: "#fff",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    14:32
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      padding: "4px 8px",
                      background: "rgba(0,0,0,.55)",
                      borderRadius: 4,
                      fontSize: 12,
                      color: "#fff",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {stats.topVideoViews}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 14,
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--paper-ink)",
                  }}
                >
                  Congen으로 영상 자동화하기
                </div>
                <div style={{ fontSize: 12, color: "#9a8a6a", marginTop: 4 }}>
                  AICONLAB · 인기 영상 1위
                </div>
              </div>
            </FadeUp>

            <StickerCallout
              text="같이 만들어요!"
              style={{
                position: "absolute",
                top: -28,
                right: -12,
                filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.4))",
              }}
            />
            <StickerArrow
              style={{
                position: "absolute",
                bottom: -6,
                left: -26,
                transform: "rotate(15deg)",
              }}
            />
          </div>
        </div>

        {/* 푸터 라인 — 운영자 카드 (Build in Public 톤: 아바타 + 활동 4개) */}
        <FadeUp delay={400}>
          <div
            style={{
              marginTop: 80,
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              padding: "22px 26px",
              background: "var(--surface-1)",
              border: "1px solid var(--border-1)",
              borderRadius: 14,
              flexWrap: "wrap",
              boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
            }}
          >
            {/* 아바타 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar-aiconlab.png"
              alt="AICONLAB 운영자 아바타"
              width={80}
              height={80}
              style={{
                width: 80,
                height: 80,
                borderRadius: 999,
                objectFit: "cover",
                border: "3px solid var(--border-2)",
                background: "var(--surface-2)",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            />

            {/* 운영자 정보 + 활동 그리드 */}
            <div style={{ flex: 1, minWidth: 240 }}>
              {/* 이름 + 한 줄 소개 */}
              <div style={{ marginBottom: 14, lineHeight: 1.45 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--fg-1)",
                    marginBottom: 2,
                  }}
                >
                  AICONLAB 운영자
                </div>
                <div style={{ fontSize: 13, color: "var(--fg-2)" }}>
                  AI로 1인 기업을 만들고, 같이 나눠요
                </div>
              </div>

              {/* 활동 4개 — 2x2 자동 그리드 (Build in Public 톤) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px 24px",
                  paddingTop: 12,
                  borderTop: "1px dashed var(--border-1)",
                }}
              >
                <ActivityRow
                  emoji="🛠️"
                  label="Building"
                  content="Congen · Remotion 영상 자동화"
                  color="var(--text-mint)"
                />
                <ActivityRow
                  emoji="✏️"
                  label="Writing"
                  content={`위키 ${stats.wikiPages} 페이지`}
                  color="var(--text-electric)"
                />
                <ActivityRow
                  emoji="📺"
                  label="Streaming"
                  content={`유튜브 AiConLab · ${stats.youtubeSubscribers}명`}
                  color="var(--text-hot)"
                />
                <ActivityRow
                  emoji="💬"
                  label="Sharing"
                  content="단톡방 · 매주 logs/"
                  color="var(--text-sun)"
                />
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// Hero 헬퍼 — Stat / Divider
function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div
        className="mono"
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--text-mint)",
          lineHeight: 1,
        }}
      >
        {n}
      </div>
      <div style={{ fontSize: 14, color: "var(--fg-2)", marginTop: 6 }}>
        {label}
      </div>
    </div>
  );
}
function Divider() {
  return <div style={{ width: 1, height: 36, background: "var(--border-2)" }} />;
}

// 운영자 카드의 활동 한 줄 — Build in Public 톤
// 이모지 + 라벨(BUILDING/WRITING/STREAMING/SHARING) + 활동 내용
function ActivityRow({
  emoji,
  label,
  content,
  color,
}: {
  emoji: string;
  label: string;
  content: string;
  color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1.3 }} aria-hidden>
        {emoji}
      </span>
      {/* 라벨(위) + 내용(아래) 세로 스택 — content가 길어도 자연스럽게 줄바꿈 */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            color,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 3,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.45 }}>
          {content}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 2. PRODUCTS PREVIEW — 자동화앱 진열 (Congen + Coming Soon 2개)
// ──────────────────────────────────────────────────────────
function ProductsPreview() {
  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 24, paddingBottom: 80 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 12,
            }}
          >
            <div className="eyebrow">PRODUCTS · 편의성 제공</div>
            <Link
              href="/products"
              style={{
                fontSize: 13,
                color: "var(--text-mint)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              전체 자동화앱 보기 →
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={60}>
          <h2 className="display-2" style={{ maxWidth: 820, marginBottom: 32 }}>
            만든 것들로
            <br />
            <span className="marker">증명합니다.</span>
          </h2>
        </FadeUp>

        <div className="grid-3">
          {/* Congen (BETA) */}
          <FadeUp delay={140}>
            <Link
              href="/products"
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
                }}
              >
                <div
                  style={{
                    aspectRatio: "16/9",
                    background: "var(--ink-900)",
                    position: "relative",
                    borderBottom: "1px solid var(--border-1)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(ellipse at 30% 30%, rgba(124,245,196,0.22), transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(90,124,255,0.18), transparent 60%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      padding: "4px 10px",
                      background: "rgba(90,124,255,0.16)",
                      color: "var(--text-electric)",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                    }}
                  >
                    ● BETA
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 999,
                        background: "var(--mint-400)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name="play" size={22} color="var(--ink-900)" />
                    </div>
                  </div>
                </div>
                <div style={{ padding: 22, flex: 1 }}>
                  <h3
                    className="aicon-h2"
                    style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}
                  >
                    Congen
                  </h3>
                  <p
                    className="hand"
                    style={{
                      color: "var(--text-sun)",
                      fontSize: 16,
                      marginBottom: 10,
                    }}
                  >
                    &quot;프롬프트로 유튜브 영상을 끝까지&quot;
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--fg-2)",
                      lineHeight: 1.6,
                    }}
                  >
                    Fal.ai + Gemini + FFmpeg 6단계 파이프라인. Electron 데스크톱
                    런처.
                  </p>
                </div>
              </article>
            </Link>
          </FadeUp>

          {/* Coming Soon 2개 */}
          <FadeUp delay={200}>
            <ComingSoonCard
              name="(가칭) Congen Cloud"
              pitch="브라우저에서 돌아가는 SaaS 버전"
              soon="2026 Q3"
              colorVar="var(--text-electric)"
              glowVar="rgba(90,124,255,0.16)"
            />
          </FadeUp>
          <FadeUp delay={260}>
            <ComingSoonCard
              name="ACL Claude Skills"
              pitch="Claude Code에 꽂는 스킬 팩"
              soon="코어 우선 공개"
              colorVar="var(--text-hot)"
              glowVar="rgba(255,107,71,0.14)"
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// Coming Soon 카드 헬퍼
function ComingSoonCard({
  name,
  pitch,
  soon,
  colorVar,
  glowVar,
}: {
  name: string;
  pitch: string;
  soon: string;
  colorVar: string;
  glowVar: string;
}) {
  return (
    <article
      className="card-dark"
      style={{
        height: "100%",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        opacity: 0.72,
      }}
    >
      <div
        style={{
          aspectRatio: "16/9",
          background: "var(--ink-900)",
          position: "relative",
          borderBottom: "1px solid var(--border-1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 30% 30%, ${glowVar}, transparent 60%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            padding: "4px 10px",
            background: "rgba(0,0,0,0.4)",
            color: "var(--fg-3)",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.1em",
          }}
        >
          ● COMING SOON
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 32,
            fontWeight: 800,
            color: colorVar,
            opacity: 0.2,
          }}
        >
          SOON
        </div>
      </div>
      <div style={{ padding: 22, flex: 1 }}>
        <h3
          className="aicon-h2"
          style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}
        >
          {name}
        </h3>
        <p
          className="hand"
          style={{
            color: "var(--text-sun)",
            fontSize: 16,
            marginBottom: 10,
          }}
        >
          &quot;{pitch}&quot;
        </p>
        <p
          className="mono"
          style={{ fontSize: 12, color: "var(--fg-3)", letterSpacing: "0.06em" }}
        >
          {soon}
        </p>
      </div>
    </article>
  );
}

// ──────────────────────────────────────────────────────────
// 3. AUDIENCE SEGMENTS — 같이 배우는 사람들 (3 페르소나)
// ──────────────────────────────────────────────────────────
function AudienceSegments() {
  // 페르소나는 AI 활용 단계로 정의 (2026-05-12 진화)
  // 각 단계마다 "여기서 얻는 메리트" 사실 기반 정리 (2026-05-12 사실 검증 반영)
  // - 입문자: Congen 무료 버전 존재 (유료 버전도 있음)
  // - 활용가: 유튜브 콘텐츠 제작 인사이트 정리 (형식 미확정)
  // - 메이커: 투명한 인사이트 공유 + 공동 프로젝트 함께 시작 (메일 문의)
  // 2026-05-12: pct(%) 필드 제거 — 비율 표시보다 가치 메시지 우선
  type Benefit = { text: string; href?: string; linkLabel?: string };
  const segs: Array<{
    t: string;
    quote: string;
    benefitsLabel: string;
    benefits: Benefit[];
    color: string;
  }> = [
    {
      t: "AI 입문자",
      quote: '"AI 좋다는데 어디서 시작?"',
      benefitsLabel: "처음 시작할 때 받는 것",
      benefits: [
        { text: "Congen 무료 버전으로 부담없이 시작" },
        { text: "따라할 수 있는 영상·튜토리얼" },
        { text: "같이 시작하는 동료 (단톡방)" },
      ],
      color: "var(--text-mint)",
    },
    {
      t: "AI 활용가",
      quote: '"써보는데 좀 더 깊이 가고 싶어요"',
      benefitsLabel: "더 깊이 갈 때 받는 것",
      benefits: [
        { text: "유튜브 콘텐츠 제작 인사이트 모음" },
        { text: "AI 워크플로우 실전 케이스 (Build in Public)" },
        { text: "다른 활용가들과 적용 사례 공유" },
      ],
      color: "var(--text-electric)",
    },
    {
      t: "AI 메이커",
      quote: '"AI로 만드는데 같이할 동료가 필요해요"',
      benefitsLabel: "함께 만들 수 있는 것",
      benefits: [
        { text: "Congen · Claude Skills 우선 공개" },
        { text: "투명하게 서로의 인사이트 공유" },
        {
          text: "공동 프로젝트 함께 시작",
          href: "mailto:contact@aiconlab.xyz",
          linkLabel: "메일 문의 →",
        },
      ],
      color: "var(--text-sun)",
    },
  ];

  return (
    <section
      className="aicon-section"
      style={{ background: "var(--surface-2)", paddingTop: 80, paddingBottom: 80 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            COMMUNITY · 같이 배우는 사람들
          </div>
        </FadeUp>
        <FadeUp delay={60}>
          <h2 className="display-2" style={{ maxWidth: 820, marginBottom: 14 }}>
            AI 잘 쓰고 싶은
            <br />
            <span className="marker">누구나</span> 환영해요.
          </h2>
        </FadeUp>
        <FadeUp delay={120}>
          <p
            style={{
              fontSize: 17,
              color: "var(--fg-2)",
              marginBottom: 48,
              maxWidth: 720,
              lineHeight: 1.65,
            }}
          >
            직장인 · 학생 · 프리랜서 · 사업가 · 창작자 —{" "}
            <b style={{ color: "var(--fg-1)" }}>직업·연령·경력 무관</b>.<br />
            입문자부터 메이커까지, 같은 자리에서 배우고 즐기는 커뮤니티예요.
          </p>
        </FadeUp>
        <div className="grid-3">
          {segs.map((s, i) => (
            <FadeUp key={s.t} delay={160 + i * 80}>
              <div
                className="card-dark"
                style={{
                  height: "100%",
                  padding: 28,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* 단계 번호 (mono) */}
                <div
                  className="mono"
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: s.color,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  STAGE 0{i + 1}
                </div>

                {/* 단계 이름 (강조 — 색 + 큰 폰트) */}
                <h3
                  className="aicon-h2"
                  style={{
                    fontSize: 30,
                    marginBottom: 12,
                    fontWeight: 800,
                    color: "var(--fg-1)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.t}
                </h3>

                {/* 시청자 목소리 (손글씨 강조) */}
                <p
                  className="hand"
                  style={{
                    color: "var(--text-sun)",
                    fontSize: 17,
                    marginBottom: 22,
                    lineHeight: 1.45,
                  }}
                >
                  {s.quote}
                </p>

                {/* 메리트 영역 — 단계별 라벨 */}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: s.color,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                    paddingTop: 16,
                    borderTop: "1px dashed var(--border-1)",
                  }}
                >
                  ✦ {s.benefitsLabel}
                </div>

                {/* 메리트 3개 (mailto 링크 옵셔널 지원) */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    flex: 1,
                  }}
                >
                  {s.benefits.map((b, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontSize: 14,
                        color: "var(--fg-1)",
                        lineHeight: 1.55,
                      }}
                    >
                      <span style={{ marginTop: 3, flexShrink: 0 }}>
                        <Icon name="check" size={14} color={s.color} />
                      </span>
                      <span>
                        {b.text}
                        {b.href && (
                          <>
                            {" "}
                            <a
                              href={b.href}
                              style={{
                                color: s.color,
                                fontWeight: 700,
                                textDecoration: "underline",
                                textUnderlineOffset: "3px",
                              }}
                            >
                              {b.linkLabel}
                            </a>
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 4. LATEST BLOG — 팀 블로그 최신 3개 (posts.ts에서)
// ──────────────────────────────────────────────────────────
function LatestBlog({ latest }: { latest: Post[] }) {
  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 80, paddingBottom: 80 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 12,
            }}
          >
            <div className="eyebrow">BLOG · 같이 배우는 글</div>
            <Link
              href="/log"
              style={{
                fontSize: 13,
                color: "var(--text-mint)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              전체 글 보기 →
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={60}>
          <h2 className="display-2" style={{ maxWidth: 820, marginBottom: 32 }}>
            최근의{" "}
            <span className="marker">기록들.</span>
          </h2>
        </FadeUp>

        <div className="grid-3">
          {latest.map((p, i) => {
            const meta = categories[p.cat];
            return (
              <FadeUp key={p.slug} delay={140 + i * 60}>
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
                      height: "100%",
                      padding: 22,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
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
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        lineHeight: 1.45,
                        margin: 0,
                      }}
                    >
                      {p.title}
                    </h3>
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
// 5. JOIN CHANNELS — ★ 합류 채널 3블록 (셀피시 다크 CTA 패턴)
// ──────────────────────────────────────────────────────────
function JoinChannels() {
  const channels = [
    {
      icon: "youtube" as const,
      title: "유튜브 구독",
      sub: "1인 기업 자동화 라이브 다큐",
      cta: "구독하기 →",
      href: "https://www.youtube.com/@A-ConLab-b1m",
      external: true,
      color: "var(--text-hot)",
    },
    {
      icon: "wiki" as const,
      title: "AICONLAB Wiki",
      sub: "공유 위키에서 깊이 학습",
      cta: "위키 둘러보기 →",
      href: "/insights",
      external: false,
      color: "var(--text-mint)",
    },
    {
      icon: "chat" as const,
      title: "단톡방 들어가기",
      sub: "함께 작당모의하는 카카오톡",
      cta: "단톡방 →",
      href: "/community",
      external: false,
      color: "var(--text-sun)",
    },
  ];

  return (
    <section
      className="aicon-section"
      style={{
        background: "var(--ink-900)",
        paddingTop: 96,
        paddingBottom: 96,
        position: "relative",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      {/* 배경 글로우 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(124,245,196,0.18), transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(90,124,255,0.12), transparent 50%)",
          pointerEvents: "none",
        }}
      />
      <div className="aicon-container" style={{ position: "relative" }}>
        <FadeUp>
          <div
            className="eyebrow"
            style={{
              marginBottom: 14,
              color: "var(--text-mint)",
              background: "rgba(124,245,196,0.12)",
            }}
          >
            JOIN · 함께하는 방법
          </div>
        </FadeUp>

        <FadeUp delay={60}>
          <h2
            className="display-2"
            style={{ maxWidth: 820, marginBottom: 14, color: "#fff" }}
          >
            여정의 어디서나
            <br />
            <span
              className="hand"
              style={{ color: "var(--text-sun)", fontSize: "0.7em" }}
            >
              들어오시면 돼요.
            </span>
          </h2>
        </FadeUp>

        <FadeUp delay={120}>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 48,
              maxWidth: 640,
            }}
          >
            세 가지 방법 — 본인 속도에 맞춰 한 칸씩 깊어집니다.
          </p>
        </FadeUp>

        <div className="grid-3">
          {channels.map((c, i) => (
            <FadeUp key={c.title} delay={160 + i * 80}>
              {c.external ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                >
                  <ChannelCard channel={c} />
                </a>
              ) : (
                <Link
                  href={c.href}
                  style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                >
                  <ChannelCard channel={c} />
                </Link>
              )}
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// JoinChannels 카드 헬퍼
function ChannelCard({
  channel,
}: {
  channel: {
    icon: "youtube" | "wiki" | "chat";
    title: string;
    sub: string;
    cta: string;
    color: string;
  };
}) {
  return (
    <div
      style={{
        height: "100%",
        padding: 32,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transition: "transform .15s ease, background .15s ease",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `color-mix(in srgb, ${channel.color} 22%, transparent)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={channel.icon} size={22} color={channel.color} />
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#fff" }}>
        {channel.title}
      </h3>
      <p
        style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.7)",
          margin: 0,
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {channel.sub}
      </p>
      <div
        style={{
          paddingTop: 14,
          borderTop: "1px dashed rgba(255,255,255,0.15)",
          color: channel.color,
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        {channel.cta}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 6. ABOUT PREVIEW — 정체성 한 줄 + About 진입
// ──────────────────────────────────────────────────────────
function AboutPreview() {
  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 80, paddingBottom: 80 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div
            className="card-paper quote-block"
            style={{
              maxWidth: 880,
              margin: "0 auto",
              padding: "40px 36px",
              position: "relative",
            }}
          >
            <div
              style={{
                color: "var(--hot-600)",
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              ABOUT AICONLAB · 우리가 누구인가
            </div>
            <p
              style={{
                fontSize: "clamp(20px, 2.6vw, 28px)",
                fontWeight: 700,
                lineHeight: 1.5,
                color: "var(--paper-ink)",
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              AI를 잘 쓰고 싶은 사람들이,
              <br />
              <span style={{ background: "var(--sun-400)", padding: "0 6px" }}>
                함께 만드는 AI 실험실.
              </span>
            </p>
            <Link
              href="/about"
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              더 깊은 이야기 보기 <Icon name="arrow" size={16} />
            </Link>
            <StickerStamp
              text="★ CORE"
              style={{ position: "absolute", top: -14, right: 24 }}
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 7. CLOSING CTA — 마지막 액션 유도
// ──────────────────────────────────────────────────────────
function ClosingCTA() {
  return (
    <section
      className="aicon-section"
      style={{
        background: "var(--surface-2)",
        paddingTop: 96,
        paddingBottom: 96,
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 1200,
          height: 600,
          background:
            "radial-gradient(ellipse, rgba(124,245,196,0.22), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="aicon-container"
        style={{ position: "relative" }}
      >
        <FadeUp>
          <div
            className="eyebrow"
            style={{ marginBottom: 18, justifyContent: "center" }}
          >
            함께 즐겨봐요.
          </div>
        </FadeUp>
        <FadeUp delay={80}>
          <h2
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: 18,
            }}
          >
            <span className="marker">AI 문화</span>, 함께 만들어가요.
          </h2>
        </FadeUp>
        <FadeUp delay={140}>
          <p
            style={{
              fontSize: 19,
              color: "var(--fg-2)",
              maxWidth: 620,
              margin: "0 auto 36px",
            }}
          >
            <span
              className="hand"
              style={{ color: "var(--text-sun)", fontSize: 22 }}
            >
              &quot;AI를 실험하고, 같이 배우고, 함께 즐기는&nbsp;— AI 문화 커뮤니티.&quot;
            </span>
          </p>
        </FadeUp>
        <FadeUp delay={200}>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              className="btn btn-primary btn-lg"
              href="https://www.youtube.com/@A-ConLab-b1m"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="youtube" size={18} color="var(--ink-900)" /> 유튜브 AiConLab
            </a>
            <Link className="btn btn-secondary btn-lg" href="/products">
              <Icon name="play" size={18} /> 자동화앱 둘러보기
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE — 7섹션 마스터 조합 (옵션 A · 가벼운 메인)
// ──────────────────────────────────────────────────────────
export default async function Home() {
  const latest = await fetchPosts(3);
  return (
    <>
      <Hero />
      <ProductsPreview />
      <AudienceSegments />
      <LatestBlog latest={latest} />
      <JoinChannels />
      <AboutPreview />
      <ClosingCTA />
    </>
  );
}
