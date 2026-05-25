// AICONLAB About 페이지 — 정체성·가치·이야기 깊은 콘텐츠 모음
// 메인 페이지 (가벼운 7섹션)에서 분리. 호기심이 깊어진 방문자가 진입.
//
// 9섹션 흐름:
//   1. AboutHero (인트로 + 메인 돌아가기)
//   2. Definition (핵심 정의문)
//   3. Essence (표면 vs 본질)
//   4. Values (5대 핵심 가치)
//   5. Framework (정체성→결과물→자동화)
//   6. BuildInPublic (Build in Public 철학)
//   7. Positioning (시장 가짜 vs 우리 진짜)
//   8. NorthStar (1년 후 Before/After)
//   9. AboutCTA (유튜브 + 메인으로 돌아가기)
//
// 비전 정렬: "도구를 만들고, 같이 배우고, 함께 즐기는 — AI 실험실 커뮤니티."

import Link from "next/link";
import { Fragment } from "react";
import { FadeUp } from "@/components/aiconlab/fade-up";
import { Icon } from "@/components/aiconlab/icon";
import { SITE_STATS } from "@/lib/site-stats";
import {
  StickerCallout,
  StickerCircle,
  StickerStamp,
} from "@/components/aiconlab/sticker";

// ──────────────────────────────────────────────────────────
// 1. ABOUT HERO — 페이지 인트로
// ──────────────────────────────────────────────────────────
function AboutHero() {
  return (
    <section
      className="aicon-section"
      style={{
        paddingTop: 80,
        paddingBottom: 48,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="hero-radial" />
      <div className="aicon-container" style={{ position: "relative" }}>
        {/* 메인 돌아가기 */}
        <FadeUp>
          <Link
            href="/"
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
            <span aria-hidden>←</span> 메인으로 돌아가기
          </Link>
        </FadeUp>

        <FadeUp delay={60}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            ABOUT AICONLAB · 깊은 이야기
          </div>
        </FadeUp>

        <FadeUp delay={120}>
          <h1
            className="hero-headline"
            style={{ maxWidth: 880, marginBottom: 20 }}
          >
            우리가{" "}
            <span className="marker">왜</span>
            <br />
            이걸 만드는가.
          </h1>
        </FadeUp>

        <FadeUp delay={180}>
          <p className="hero-sub" style={{ maxWidth: 720 }}>
            정체성 · 핵심 가치 · 만드는 방식 · 1년 후 비전까지 —{" "}
            <span
              className="hand"
              style={{ color: "var(--text-sun)", fontSize: 22 }}
            >
              깊이 알고 싶은 분만
            </span>
            을 위해 정리했어요.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 2. DEFINITION — 핵심 정의문 (paper 카드)
// ──────────────────────────────────────────────────────────
function Definition() {
  return (
    <section className="aicon-section" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <div className="aicon-container">
        <FadeUp>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              className="card-paper quote-block"
              style={{ maxWidth: 880, width: "100%" }}
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
                AICONLAB · 핵심 정의문
              </div>
              <p
                style={{
                  fontSize: "clamp(22px, 3vw, 34px)",
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: "var(--paper-ink)",
                  letterSpacing: "-0.02em",
                  marginBottom: 18,
                }}
              >
                프롬프트 너머의 컨텍스트로,
                <br />
                1인 기업을 통째로 자동화해 가는
                <br />
                한 사람의 과정을 통째로 나누며
                <br />
                시청자와 함께 쌓아가는{" "}
                <span style={{ background: "var(--sun-400)", padding: "0 6px" }}>
                  AI 실험실.
                </span>
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 20,
                  color: "#6b5e3c",
                }}
              >
                <div style={{ width: 32, height: 1, background: "#6b5e3c" }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>AICONLAB</span>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 3. ESSENCE — 표면 vs 본질
// ──────────────────────────────────────────────────────────
function Essence() {
  const surface = [
    "AI 자동화 콘텐츠 채널",
    "AI 도구 · 기법 소개",
    "자동화 프로그램 무료 배포",
    "콘텐츠 제작 노하우 공유",
  ];
  const essence = [
    "AI 시대의 라이프스타일 문화",
    "진짜 만드는 사람의 컨텍스트",
    "끝까지 만들고 통째로 나눔",
    "1인 기업 라이브 다큐멘터리",
  ];

  return (
    <section
      className="aicon-section"
      id="essence"
      style={{ paddingTop: 64, paddingBottom: 80 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <div className="eyebrow">CHAPTER 01 · 우리는 누구인가</div>
            <div
              style={{
                fontSize: 13,
                color: "var(--fg-3)",
                fontFamily: "var(--font-mono)",
              }}
            >
              OUR ESSENCE
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={80}>
          <h2 className="display-2" style={{ maxWidth: 880, marginBottom: 20 }}>
            도구 너머,
            <br />
            <span className="marker">문화</span>를 함께 만듭니다.
          </h2>
        </FadeUp>

        <FadeUp delay={140}>
          <p
            style={{
              fontSize: 18,
              color: "var(--fg-2)",
              maxWidth: 720,
              marginBottom: 56,
            }}
          >
            애플이 컴퓨터가 아닌 라이프스타일을 팔듯, AICONLAB은 도구를 넘어 1인
            기업 실험실 문화를 함께 만듭니다.
          </p>
        </FadeUp>

        <div className="grid-2" style={{ gap: 20 }}>
          <FadeUp delay={200}>
            <div className="card-dark" style={{ position: "relative", padding: 32 }}>
              <div
                style={{
                  color: "var(--fg-3)",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                  fontWeight: 600,
                }}
              >
                ENTRY · 입구
              </div>
              <h3
                className="aicon-h2"
                style={{ marginBottom: 20, color: "var(--fg-2)" }}
              >
                처음 만나는 것
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {surface.map((s) => (
                  <li
                    key={s}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      color: "var(--fg-2)",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--ink-400)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        marginTop: 4,
                      }}
                    >
                      →
                    </span>
                    <span style={{ fontSize: 16 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>

          <FadeUp delay={280}>
            <div
              className="card-dark"
              style={{
                position: "relative",
                padding: 32,
                borderColor: "rgba(77,224,166,0.45)",
                background:
                  "linear-gradient(180deg, rgba(124,245,196,0.18), var(--surface-1))",
              }}
            >
              <div
                style={{
                  color: "var(--text-mint)",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                  fontWeight: 700,
                }}
              >
                ESSENCE · 본질
              </div>
              <h3 className="aicon-h2" style={{ marginBottom: 20 }}>
                오래 남는 것
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {essence.map((s) => (
                  <li
                    key={s}
                    style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                  >
                    <span style={{ color: "var(--text-mint)", marginTop: 2 }}>
                      <Icon name="check" size={18} color="var(--text-mint)" />
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 500 }}>{s}</span>
                  </li>
                ))}
              </ul>
              <StickerStamp
                text="★ CORE"
                style={{ position: "absolute", top: -14, right: 24 }}
              />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 4. VALUES — 5대 핵심 가치
// ──────────────────────────────────────────────────────────
function Values() {
  const values = [
    {
      n: "01",
      t: "기여 우선",
      q: '"1을 주고, N을 받는다"',
      d: "무료 자료 · 도구 · 노하우를 먼저 제공합니다.",
      icon: "heart" as const,
      color: "var(--text-mint)",
    },
    {
      n: "02",
      t: "솔직한 공유",
      q: '"노하우를 숨기지 않는다"',
      d: "실패담과 시행착오까지 공개합니다.",
      icon: "eye" as const,
      color: "var(--text-electric)",
    },
    {
      n: "03",
      t: "상호 존중",
      q: '"개인이 존중받을 때 진짜 공유"',
      d: "권위적 · 무시 톤은 절대 금지.",
      icon: "handshake" as const,
      color: "var(--text-sun)",
    },
    {
      n: "04",
      t: "실행력",
      q: '"말이 아닌 결과로 증명"',
      d: "결과물과 증거 중심으로 말합니다.",
      icon: "bolt" as const,
      color: "var(--text-hot)",
    },
    {
      n: "05",
      t: "시간 자유",
      q: '"시간을 돌려준다"',
      d: "모든 의사결정의 북극성.",
      icon: "target" as const,
      color: "var(--text-mint)",
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
            CORE VALUES · 5대 핵심 가치
          </div>
        </FadeUp>
        <FadeUp delay={80}>
          <h2 className="display-2" style={{ maxWidth: 780, marginBottom: 14 }}>
            우리는 어떻게
            <br />
            행동하는가,{" "}
            <span
              className="hand"
              style={{ color: "var(--text-sun)", fontSize: "0.7em" }}
            >
              5가지로요.
            </span>
          </h2>
        </FadeUp>
        <FadeUp delay={140}>
          <p
            style={{
              fontSize: 17,
              color: "var(--fg-2)",
              marginBottom: 48,
              maxWidth: 640,
            }}
          >
            모든 콘텐츠 · 자동화 · 의사결정의 기준입니다. 정체성에 어긋나는
            자동화는 하지 않습니다.
          </p>
        </FadeUp>

        <div className="grid-5">
          {values.map((v, i) => (
            <FadeUp key={v.n} delay={160 + i * 80}>
              <div
                className="card-dark card-elev"
                style={{
                  height: "100%",
                  padding: 24,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    opacity: 0.08,
                    fontFamily: "var(--font-mono)",
                    fontSize: 96,
                    fontWeight: 800,
                    color: v.color,
                    lineHeight: 1,
                  }}
                >
                  {v.n}
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `color-mix(in srgb, ${v.color} 22%, transparent)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon name={v.icon} size={20} color={v.color} />
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 12,
                    color: v.color,
                    fontWeight: 700,
                    marginBottom: 6,
                    letterSpacing: "0.08em",
                  }}
                >
                  VALUE {v.n}
                </div>
                <h3
                  className="aicon-h2"
                  style={{ fontSize: 22, marginBottom: 8, fontWeight: 700 }}
                >
                  {v.t}
                </h3>
                <p
                  className="hand"
                  style={{
                    color: "var(--text-sun)",
                    fontSize: 17,
                    marginBottom: 10,
                  }}
                >
                  {v.q}
                </p>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--fg-2)",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {v.d}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 5. FRAMEWORK — 정체성→결과물→자동화
// ──────────────────────────────────────────────────────────
function Framework() {
  const steps = [
    {
      n: "1",
      t: "정체성",
      en: "Identity",
      d: '"진짜를 끝까지 만드는 사람."',
      sub: "5대 가치 · 핵심 정의문이 모든 결정의 기준.",
      color: "var(--text-mint)",
      icon: "flask" as const,
    },
    {
      n: "2",
      t: "결과물",
      en: "Output",
      d: "정체성의 살아있는 증거.",
      sub: "콘텐츠 · 도구 · 위키 · 자동화 시스템.",
      color: "var(--text-electric)",
      icon: "layers" as const,
    },
    {
      n: "3",
      t: "자동화",
      en: "Automation",
      d: "결과물을 지속 · 확장 가능하게.",
      sub: "운영자 → 코어 → 시청자 3계층 시스템.",
      color: "var(--text-sun)",
      icon: "bolt" as const,
    },
  ];

  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 80, paddingBottom: 80 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            CHAPTER 02 · 어떻게 만드는가
          </div>
        </FadeUp>
        <FadeUp delay={80}>
          <h2 className="display-2" style={{ maxWidth: 920, marginBottom: 14 }}>
            <span style={{ position: "relative", display: "inline-block" }}>
              정체성 → 결과물 → 자동화.
              <StickerCircle
                size={140}
                style={{
                  position: "absolute",
                  top: "-30%",
                  left: "-4%",
                  width: "108%",
                  height: "160%",
                  pointerEvents: "none",
                }}
              />
            </span>
            <br />
            순서는 <span className="marker">절대</span> 바꾸지 않습니다.
          </h2>
        </FadeUp>
        <FadeUp delay={140}>
          <p
            style={{
              fontSize: 17,
              color: "var(--fg-2)",
              marginBottom: 48,
              maxWidth: 680,
            }}
          >
            정체성에 어긋나는 자동화는 하지 않습니다. — AICONLAB Way
          </p>
        </FadeUp>

        <div className="framework-grid">
          {steps.map((s, i) => (
            <Fragment key={s.n}>
              <FadeUp delay={160 + i * 100}>
                <div
                  className="card-dark card-elev"
                  style={{ height: "100%", padding: 32, position: "relative" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `color-mix(in srgb, ${s.color} 22%, transparent)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name={s.icon} size={22} color={s.color} />
                    </div>
                    <div
                      className="mono"
                      style={{ fontSize: 14, fontWeight: 700, color: s.color }}
                    >
                      STEP 0{s.n}
                    </div>
                  </div>
                  <h3 className="aicon-h1" style={{ fontSize: 30, marginBottom: 4 }}>
                    {s.t}
                  </h3>
                  <div
                    className="mono"
                    style={{
                      fontSize: 13,
                      color: "var(--fg-3)",
                      letterSpacing: "0.16em",
                      marginBottom: 18,
                    }}
                  >
                    {s.en.toUpperCase()}
                  </div>
                  <p
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: "var(--fg-1)",
                      marginBottom: 8,
                    }}
                  >
                    {s.d}
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      color: "var(--fg-2)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {s.sub}
                  </p>
                </div>
              </FadeUp>
              {i < steps.length - 1 && (
                <div
                  className="arrow-cell"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="arrow" size={28} color="var(--text-mint)" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 6. BUILD IN PUBLIC — 철학
// ──────────────────────────────────────────────────────────
function BuildInPublic() {
  const items = [
    {
      t: "주간 logs/",
      d: "What · Why · How · Next 4섹션 표준으로 매주 공개합니다.",
      icon: "book" as const,
    },
    {
      t: "공개 위키",
      d: "회사 정체성 · 페르소나 · 시스템까지 모두 위키에 둡니다.",
      icon: "wiki" as const,
    },
    {
      t: "댓글 응대",
      d: "시행착오 공유 · 운영자 육성을 가장 우선합니다.",
      icon: "chat" as const,
    },
  ];

  return (
    <section
      className="aicon-section"
      style={{
        background: "var(--surface-2)",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            PHILOSOPHY · BUILD IN PUBLIC
          </div>
        </FadeUp>
        <FadeUp delay={80}>
          <div className="bip-grid">
            <div>
              <h2 className="display-2" style={{ marginBottom: 20 }}>
                편집된 성공만
                <br />
                보여주지 <span className="marker">않습니다.</span>
              </h2>
              <p
                style={{
                  fontSize: 18,
                  color: "var(--fg-2)",
                  lineHeight: 1.65,
                  marginBottom: 24,
                }}
              >
                실패와 시행착오까지 라이브로 공유합니다. 그래야 시청자가{" "}
                <span
                  className="hand"
                  style={{ color: "var(--text-sun)", fontSize: 22 }}
                >
                  &quot;함께 가는 사람&quot;
                </span>
                이 됩니다.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="sticker" style={{ transform: "rotate(-3deg)" }}>
                  끝까지 만든다
                </span>
                <span
                  className="sticker"
                  style={{ background: "var(--mint-400)", transform: "rotate(2deg)" }}
                >
                  통째로 나눈다
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {items.map((it, i) => (
                <FadeUp key={it.t} delay={140 + i * 80}>
                  <div
                    className="card-dark card-elev"
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      padding: 24,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: "rgba(77,224,166,0.22)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={it.icon} size={20} color="var(--text-mint)" />
                    </div>
                    <div>
                      <h3
                        className="aicon-h3"
                        style={{ marginBottom: 6, fontSize: 18 }}
                      >
                        {it.t}
                      </h3>
                      <p
                        style={{
                          fontSize: 15,
                          color: "var(--fg-2)",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {it.d}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 7. POSITIONING — 가짜 vs 진짜
// ──────────────────────────────────────────────────────────
function Positioning() {
  const rows = [
    { fake: "끝까지 안 가본 사람의 말", real: "끝까지 가본 사람의 노하우" },
    { fake: "도구 카탈로그", real: "실제 작동하는 결과물 + 컨텍스트" },
    { fake: "표면 정보 (프롬프트 팁)", real: "프롬프트 너머의 컨텍스트" },
    { fake: '"돈을 번다"', real: '"시간을 판다"' },
    { fake: "권위적 / 친목 위주", real: "캐주얼 + 상호 존중" },
  ];

  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 80, paddingBottom: 80 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            MARKET POSITIONING
          </div>
        </FadeUp>
        <FadeUp delay={80}>
          <h2 className="display-2" style={{ maxWidth: 920, marginBottom: 14 }}>
            시장의 <span style={{ color: "var(--text-hot)" }}>가짜</span> vs
            <br />
            AICONLAB의 <span style={{ color: "var(--text-mint)" }}>진짜</span>.
          </h2>
        </FadeUp>
        <FadeUp delay={140}>
          <p
            style={{
              fontSize: 17,
              color: "var(--fg-2)",
              marginBottom: 48,
              maxWidth: 680,
            }}
          >
            &quot;내가 진짜야&quot;라고 말하지 않습니다.{" "}
            <span style={{ fontWeight: 600, color: "var(--fg-1)" }}>
              결과물과 과정으로 증명
            </span>
            합니다.
          </p>
        </FadeUp>

        <FadeUp delay={200}>
          <div className="compare">
            <div className="compare-col compare-fake">
              <div
                style={{
                  color: "var(--text-hot)",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: 18,
                }}
              >
                ✕ 시장의 가짜
              </div>
              {rows.map((r, i) => (
                <div className="compare-row" key={i}>
                  <span
                    style={{
                      color: "var(--text-hot)",
                      fontFamily: "var(--font-mono)",
                      marginTop: 2,
                    }}
                  >
                    ✕
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      color: "var(--fg-2)",
                      textDecoration: "line-through",
                      textDecorationColor: "rgba(255,107,71,0.5)",
                    }}
                  >
                    {r.fake}
                  </span>
                </div>
              ))}
            </div>
            <div className="compare-col compare-real">
              <div
                style={{
                  color: "var(--text-mint)",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: 18,
                }}
              >
                ✓ AICONLAB의 진짜
              </div>
              {rows.map((r, i) => (
                <div className="compare-row" key={i}>
                  <Icon name="check" size={16} color="var(--text-mint)" />
                  <span
                    style={{ fontSize: 15, color: "var(--fg-1)", fontWeight: 500 }}
                  >
                    {r.real}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 8. NORTH STAR — Before / After
// ──────────────────────────────────────────────────────────
function NorthStar() {
  const before = [
    `유튜브 채널 (구독자 ${SITE_STATS.youtubeSubscribers}명)`,
    "자동화 프로그램 무료 배포",
    "위키에 정체성 박힘",
    "운영자 1인 + 시청자",
  ];
  const after = [
    "시청자가 따라할 수 있는 자동화 시스템",
    "위키 = 컨텍스트 학습 자산화",
    "시청자 일부 → 코어 그룹 진화",
    "운영자 + 코어 + 시청자 3계층 문화",
  ];

  return (
    <section
      className="aicon-section"
      style={{
        background: "var(--surface-2)",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            NORTH STAR · 1년 후, 우리는 어디에
          </div>
        </FadeUp>
        <FadeUp delay={80}>
          <h2 className="display-2" style={{ maxWidth: 980, marginBottom: 14 }}>
            AICONLAB을 본다
            <br />= AI 시대 1인 기업의{" "}
            <span className="marker">컨텍스트를 학습한다</span>.
          </h2>
        </FadeUp>
        <FadeUp delay={140}>
          <p
            style={{
              fontSize: 17,
              color: "var(--fg-2)",
              marginBottom: 48,
              maxWidth: 680,
            }}
          >
            북극성. 모든 의사결정이 이 한 줄을 향합니다.
          </p>
        </FadeUp>

        <div className="grid-2" style={{ gap: 20, alignItems: "stretch" }}>
          <FadeUp delay={200}>
            <div
              className="card-dark"
              style={{ padding: 32, height: "100%", position: "relative" }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 13,
                  color: "var(--fg-3)",
                  letterSpacing: "0.16em",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                BEFORE · 2026.05
              </div>
              <h3
                className="aicon-h1"
                style={{ fontSize: 32, marginBottom: 24, color: "var(--fg-1)" }}
              >
                지금
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {before.map((b, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 15,
                      color: "var(--fg-2)",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--ink-400)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      —
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
          <FadeUp delay={280}>
            <div
              className="card-dark"
              style={{
                padding: 32,
                height: "100%",
                position: "relative",
                background:
                  "linear-gradient(180deg, rgba(124,245,196,0.20), var(--surface-1))",
                borderColor: "rgba(77,224,166,0.45)",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  color: "var(--text-mint)",
                  letterSpacing: "0.16em",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                AFTER · 2027.05
              </div>
              <h3
                className="aicon-h1"
                style={{ fontSize: 32, marginBottom: 24, color: "var(--fg-1)" }}
              >
                1년 후
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {after.map((b, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 15,
                      color: "var(--fg-1)",
                      fontWeight: 500,
                    }}
                  >
                    <Icon name="check" size={16} color="var(--text-mint)" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <StickerStamp
                text="★ NORTH"
                style={{ position: "absolute", top: -14, right: 24 }}
              />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 9. ABOUT CTA — 마지막 액션 (유튜브 + 메인 돌아가기)
// ──────────────────────────────────────────────────────────
function AboutCTA() {
  return (
    <section
      className="aicon-section"
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
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
      <div className="aicon-container" style={{ position: "relative" }}>
        <FadeUp>
          <div
            className="eyebrow"
            style={{ marginBottom: 18, justifyContent: "center" }}
          >
            여기까지 읽어주셔서 고맙습니다.
          </div>
        </FadeUp>
        <FadeUp delay={80}>
          <h2
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 18,
            }}
          >
            함께 <span className="marker">실험해요.</span>
          </h2>
        </FadeUp>
        <FadeUp delay={140}>
          <p
            style={{
              fontSize: 18,
              color: "var(--fg-2)",
              maxWidth: 620,
              margin: "0 auto 36px",
            }}
          >
            <span
              className="hand"
              style={{ color: "var(--text-sun)", fontSize: 22 }}
            >
              &quot;도구를 만들고, 같이 배우고, 함께 즐기는 — AI 실험실 커뮤니티.&quot;
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
              <Icon name="youtube" size={18} color="var(--ink-900)" /> 유튜브
              구독하기
            </a>
            <Link className="btn btn-secondary btn-lg" href="/">
              <Icon name="arrow" size={18} /> 메인으로 돌아가기
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE — About 페이지 9섹션 마스터 조합
// ──────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Definition />
      <Essence />
      <Values />
      <Framework />
      <BuildInPublic />
      <Positioning />
      <NorthStar />
      <AboutCTA />
    </>
  );
}
