// /insights — 공유회 신청 페이지 (셀피시 sharing 패턴 차용 · 목업)
// 헤더 메뉴 "공유회"와 연결 (라벨은 공유회, URL은 /insights 유지)
//
// 셀피시 sharing 구조 차용:
//   1. 헤딩 + 부제 + 해시태그
//   2. 필터 탭 (전체 / 신청중 / 신청 마감)
//   3. 1열 가로형 카드 리스트 (좌측 썸네일 + 우측 텍스트)
//   4. 카드: 썸네일 + 상태 배지 + 제목 + 부제 + 날짜·장소·정원·비용 + CTA
//   5. 빈 상태 메시지
//
// Note: 더미 데이터 3개 (open / upcoming / closed 다양한 상태).
// 실제 공유회 정보는 추후 교체 또는 CMS(Notion DB 등)와 연동 가능.

"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeUp } from "@/components/aiconlab/fade-up";

// ──────────────────────────────────────────────────────────
// 더미 데이터 (3종 · 다양한 상태)
// ──────────────────────────────────────────────────────────
type Status = "upcoming" | "open" | "closed";

type Sharing = {
  slug: string;
  status: Status;
  title: string;
  sub: string;
  date: string;
  location: string;
  capacity: string;
  fee: string;
  thumbColor: string; // 썸네일 배경 색 (이미지 없을 때 그라데이션 베이스)
};

const sharings: Sharing[] = [
  {
    slug: "first-meetup",
    status: "open",
    title: "AICONLAB 첫 공유회 — AI 영상 자동화 시작하기",
    sub: "Congen 베타로 영상 한 편을 같이 만들어봐요. 입문자 환영.",
    date: "2026.06.15(토) 14:00-16:00",
    location: "온라인 (Zoom)",
    capacity: "정원 15명",
    fee: "무료 · AICONLAB 시청자 우선",
    thumbColor: "rgba(77, 224, 166, 0.18)",
  },
  {
    slug: "claude-workflow",
    status: "upcoming",
    title: "Claude로 1인 기업 자동화 — 실전 워크플로우 공개",
    sub: "AICONLAB이 매주 쓰는 Claude 워크플로우를 통째로 공개합니다.",
    date: "2026.07.05(토) 14:00-17:00",
    location: "오프라인 (서울, 장소 추후 공개)",
    capacity: "정원 8명 (소규모)",
    fee: "무료 · 코어 그룹 우선",
    thumbColor: "rgba(90, 124, 255, 0.18)",
  },
  {
    slug: "build-in-public",
    status: "closed",
    title: "Build in Public — 1인 기업 라이브 다큐 첫 회고",
    sub: "1년치 라이브 다큐멘터리 운영의 시행착오를 같이 돌아봅니다.",
    date: "2026.04.20(토) 14:00-16:00",
    location: "온라인 (Zoom)",
    capacity: "정원 20명",
    fee: "무료",
    thumbColor: "rgba(255, 107, 71, 0.18)",
  },
];

// 상태별 메타 (라벨·색)
const statusMeta = {
  open: {
    label: "신청중",
    color: "var(--text-mint)",
    bg: "rgba(77, 224, 166, 0.16)",
  },
  upcoming: {
    label: "예정",
    color: "var(--text-electric)",
    bg: "rgba(90, 124, 255, 0.16)",
  },
  closed: {
    label: "신청 마감",
    color: "var(--fg-3)",
    bg: "rgba(0, 0, 0, 0.06)",
  },
} as const;

// 필터 옵션
type FilterKey = "all" | "open" | "closed";
const filterOptions: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "open", label: "신청중" },
  { key: "closed", label: "신청 마감" },
];

// ──────────────────────────────────────────────────────────
// 메인 페이지 컴포넌트
// ──────────────────────────────────────────────────────────
export default function SharingPage() {
  const [filter, setFilter] = useState<FilterKey>("all");

  // 필터링 — "open"이면 신청중 + 예정 둘 다 (셀피시 패턴), "closed"는 마감만
  const filtered = sharings.filter((s) => {
    if (filter === "all") return true;
    if (filter === "open") return s.status === "open" || s.status === "upcoming";
    if (filter === "closed") return s.status === "closed";
    return true;
  });

  return (
    <>
      <SharingHero />
      <FilterTabs current={filter} onChange={setFilter} />
      <SharingList items={filtered} />
    </>
  );
}

// ──────────────────────────────────────────────────────────
// 1. HERO — 페이지 헤딩
// ──────────────────────────────────────────────────────────
function SharingHero() {
  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 80, paddingBottom: 40 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            SHARING · 공유회 · 워크샵
          </div>
        </FadeUp>

        <FadeUp delay={60}>
          <h1
            className="hero-headline"
            style={{ maxWidth: 880, marginBottom: 20 }}
          >
            같이 배우고,
            <br />
            <span className="marker">함께 만드는</span> 자리.
          </h1>
        </FadeUp>

        <FadeUp delay={140}>
          <p
            style={{
              fontSize: 18,
              color: "var(--fg-2)",
              maxWidth: 720,
              lineHeight: 1.65,
              marginBottom: 18,
            }}
          >
            AICONLAB 시청자라면 우선 신청 가능. AI 잘 쓰고 싶은 누구나
            환영합니다. 오프라인·온라인 모두 진행해요.
          </p>
        </FadeUp>

        <FadeUp delay={200}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Tag>#함께만드는</Tag>
            <Tag>#AI공유</Tag>
            <Tag>#소규모운영</Tag>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// 해시태그 칩
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="mono"
      style={{
        fontSize: 12,
        padding: "5px 11px",
        background: "var(--surface-2)",
        color: "var(--fg-2)",
        borderRadius: 999,
        border: "1px solid var(--border-1)",
        fontWeight: 600,
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// 2. FILTER TABS — 전체 / 신청중 / 마감
// ──────────────────────────────────────────────────────────
function FilterTabs({
  current,
  onChange,
}: {
  current: FilterKey;
  onChange: (k: FilterKey) => void;
}) {
  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 0, paddingBottom: 32 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              paddingBottom: 20,
              borderBottom: "1px solid var(--border-1)",
            }}
          >
            {filterOptions.map((opt) => {
              const active = current === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onChange(opt.key)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    background: active ? "var(--ink-900)" : "transparent",
                    color: active ? "#fff" : "var(--fg-2)",
                    border: `1px solid ${
                      active ? "var(--ink-900)" : "var(--border-2)"
                    }`,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .15s ease",
                    fontFamily: "inherit",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 3. SHARING LIST — 카드 1열 그리드
// ──────────────────────────────────────────────────────────
function SharingList({ items }: { items: Sharing[] }) {
  // 빈 상태 (필터 결과 0건)
  if (items.length === 0) {
    return (
      <section
        className="aicon-section"
        style={{ paddingTop: 32, paddingBottom: 96 }}
      >
        <div className="aicon-container">
          <FadeUp>
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                background: "var(--surface-2)",
                borderRadius: 14,
                border: "1px dashed var(--border-2)",
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  marginBottom: 16,
                }}
                aria-hidden
              >
                🌱
              </div>
              <h3
                className="aicon-h2"
                style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}
              >
                신청 가능한 공유회가 없어요
              </h3>
              <p style={{ fontSize: 15, color: "var(--fg-2)", margin: 0 }}>
                새 공유회 알림을 받으려면 단톡방 또는 유튜브 채널을 구독해주세요.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>
    );
  }

  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 32, paddingBottom: 96 }}
    >
      <div className="aicon-container">
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {items.map((item, i) => (
            <FadeUp key={item.slug} delay={i * 80}>
              <SharingCard item={item} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 4. SHARING CARD — 가로형 1열 카드 (좌이미지 + 우텍스트)
// ──────────────────────────────────────────────────────────
function SharingCard({ item }: { item: Sharing }) {
  const meta = statusMeta[item.status];
  const isClosed = item.status === "closed";

  return (
    <Link
      href={`/insights/${item.slug}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <article
        className="card-dark sharing-card"
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 0,
          padding: 0,
          overflow: "hidden",
          opacity: isClosed ? 0.72 : 1,
          transition: "transform .15s ease",
        }}
      >
        {/* 좌측 — 썸네일 (컬러 그라데이션 플레이스홀더) */}
        <div
          className="sharing-thumb"
          style={{
            aspectRatio: "16/10",
            background: `linear-gradient(135deg, ${item.thumbColor}, var(--ink-900))`,
            position: "relative",
            borderRight: "1px solid var(--border-1)",
            minHeight: 180,
          }}
        >
          {/* 상태 배지 */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              padding: "4px 11px",
              background: meta.bg,
              color: meta.color,
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              zIndex: 2,
              border: "1px solid currentColor",
            }}
          >
            ● {meta.label}
          </div>

          {/* 가운데 큰 SHARING 라벨 (시각 액센트) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.2)",
              pointerEvents: "none",
            }}
          >
            SHARING
          </div>
        </div>

        {/* 우측 — 텍스트 정보 */}
        <div
          style={{
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {/* 제목 */}
          <h3
            className="aicon-h2"
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
            }}
          >
            {item.title}
          </h3>

          {/* 부제 */}
          <p
            style={{
              fontSize: 15,
              color: "var(--fg-2)",
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {item.sub}
          </p>

          {/* 메타 정보 — 날짜·장소·정원·비용 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 18px",
              marginTop: 10,
              paddingTop: 14,
              borderTop: "1px dashed var(--border-1)",
              fontSize: 13,
              color: "var(--fg-2)",
            }}
          >
            <MetaItem icon="📅" text={item.date} />
            <MetaItem icon="📍" text={item.location} />
            <MetaItem icon="👥" text={item.capacity} />
            <MetaItem icon="💵" text={item.fee} />
          </div>

          {/* CTA — 신청중일 때만 활성 톤 */}
          <div
            style={{
              marginTop: 6,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: isClosed ? "var(--fg-3)" : "var(--text-mint)",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {isClosed ? "마감됨" : "자세히 보기"} <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </article>

      {/* 모바일 반응형 — 작은 화면에서 1열로 변환 */}
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.sharing-card) {
            grid-template-columns: 1fr !important;
          }
          :global(.sharing-thumb) {
            aspect-ratio: 16/9 !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border-1) !important;
          }
        }
      `}</style>
    </Link>
  );
}

// 메타 정보 아이콘 + 텍스트
function MetaItem({ icon, text }: { icon: string; text: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span aria-hidden>{icon}</span>
      <span>{text}</span>
    </span>
  );
}
