// 공개 페이지 진입 시 잠깐 노출되는 범용 로딩 스켈레톤 (loading.tsx fallback).
// 사이트가 aicon(다크 카드) · shadcn(페이퍼) 두 디자인 시스템을 혼용하므로,
// 펄스 블록 색을 중립 반투명 회색으로 둬서 어느 배경에서도 자연스럽게 보이게 한다.
// list: 헤더 + 카드 그리드 / article: 좁은 본문 칼럼.

type Variant = "list" | "article";

// 펄스 블록 공통 — animate-pulse는 Tailwind 기본 유틸
const TONE = { backgroundColor: "rgba(125,125,125,0.13)" };

function Bar({
  w,
  h,
  mt,
}: {
  w: number | string;
  h: number;
  mt?: number;
}) {
  return (
    <div
      className="animate-pulse rounded-lg"
      style={{ ...TONE, width: w, height: h, marginTop: mt }}
    />
  );
}

export function PageSkeleton({ variant = "list" }: { variant?: Variant }) {
  if (variant === "article") {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "96px 24px 64px" }}>
        <Bar w={120} h={14} />
        <Bar w="80%" h={40} mt={20} />
        <Bar w="50%" h={40} mt={10} />
        <Bar w={200} h={16} mt={28} />
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 14 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Bar key={i} w={i % 3 === 2 ? "70%" : "100%"} h={16} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 24px 64px" }}>
      <Bar w={160} h={14} />
      <Bar w="60%" h={48} mt={20} />
      <Bar w="40%" h={20} mt={16} />
      <div
        style={{
          marginTop: 48,
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl" style={{ ...TONE, height: 280 }} />
        ))}
      </div>
    </div>
  );
}
