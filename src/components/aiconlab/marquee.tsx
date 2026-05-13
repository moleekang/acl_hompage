// 흘러가는 챕터 라벨 마퀴 — 페이지의 챕터 인덱스 역할
// CSS @keyframes aicon-marq로 무한 좌측 스크롤 (40s linear)
// 양 끝 mask로 자연스러운 페이드 처리
export function ChapterMarquee() {
  // 4개 챕터 + 키워드 6개 — 두 번 반복해 seamless loop
  const tags = [
    "01 우리는 누구인가",
    "02 누구를 위해 만드는가",
    "03 어떻게 만드는가",
    "04 어디로 가는가",
    "정체성",
    "5대 가치",
    "끝까지 만든다",
    "통째로 나눈다",
    "Build in Public",
    "북극성",
  ];
  // animation translateX(-50%)와 맞추기 위해 정확히 두 번 복제
  const dup = [...tags, ...tags];

  return (
    <section
      style={{
        padding: "40px 0",
        borderTop: "1px solid var(--border-1)",
        borderBottom: "1px solid var(--border-1)",
        background: "var(--surface-2)",
      }}
    >
      <div className="marquee">
        <div className="marquee-track">
          {dup.map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                fontSize: 15,
                color: "var(--fg-2)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "var(--text-hot)" }}>★</span>
              <span style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
