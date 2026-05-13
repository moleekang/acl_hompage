// /journal — 일기 (외형) + 인사이트·결과물 (내용)
// UI 컨셉: 시간순 일기장 흐름 + 다양한 카테고리(사색/회고/의문/결과물/관찰)
// 셀피쉬 /blog의 미니멀 패턴을 1인 일기 톤으로 변형

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// 일기 데이터 — placeholder
// 각 항목: 날짜 + 카테고리 + 제목 + 미리보기 + (옵션) 결과물 링크
const journalEntries = [
  {
    date: "2026-05-04",
    category: "결과물",
    title: "AICONLAB 홈페이지 v0 풀 적용 완료",
    preview:
      "Claude Design System으로 모든 페이지 톤 통일. Footer 컴포넌트 분리해서 모든 페이지 자동 노출하게 만들었다. v0의 첫 형태가 드디어 보인다.",
    output: { label: "결과물 → 홈페이지 v0", href: "/" },
  },
  {
    date: "2026-05-04",
    category: "사색",
    title: "왜 셀피쉬 톤보다 Claude 톤이 AICONLAB에 맞을까",
    preview:
      "처음엔 흰 배경 + 검정 텍스트가 깔끔하다 느꼈다. 그런데 '한 사람의 라이브 실험실'이라는 정의문에 대입해보니, 차가운 미니멀보다 따뜻한 editorial이 정체성에 더 맞았다.",
    output: { label: "참고 → claude-design-system.md", href: "#" },
  },
  {
    date: "2026-05-04",
    category: "회고",
    title: "브랜드 정체성 한 줄로 압축까지 3일",
    preview:
      "2026-05-02에 시작한 AICONLAB이 사실 'AI Context Lab' 이었다는 걸 깨달은 게 5월 4일. 'Content'가 아니라 'Context'. 한 글자 차이가 모든 메시지를 바꿔놨다.",
    output: { label: "결과물 → brand-vision.md", href: "#" },
  },
  {
    date: "2026-05-04",
    category: "의문",
    title: "ConGen 출시를 미루기로 한 결정의 진짜 이유",
    preview:
      "'매출이 안 나올 것 같다'는 직감. 도대체 무엇을 가리켰을까. 제품 자체? 시청자? 내 어색함? 명확히 짚지 못한 채 일단 다음 단계로 넘어왔다. 다시 와서 봐야 할 질문.",
    output: null,
  },
  {
    date: "2026-05-04",
    category: "관찰",
    title: "Pieter Levels의 Just Ship It 정신을 직접 적용해본 후",
    preview:
      "v0를 못생겨도 24시간 안에 출시한다. 도메인은 안 사고 Vercel 임시 URL로 시작. 사용자가 제안한 '도메인은 나중에' 가 정확히 levels.io 정신이었다.",
    output: { label: "참고 → pieter-levels-levels-io.md", href: "#" },
  },
  {
    date: "2026-05-04",
    category: "결과물",
    title: "헤더 + 6개 페이지 신규 + Footer 분리",
    preview:
      "각 페이지마다 다른 UI 패턴 — 디지털 가든(/insights), 제품 쇼케이스(/resources), 셀피쉬 AI 툴(/tools), Build in Public 타임라인(/log), 단톡방 허브(/community), 3단 가격표(/membership).",
    output: { label: "결과물 → 7개 페이지 v0", href: "/" },
  },
  {
    date: "2026-05-03",
    category: "사색",
    title: "셀피쉬클럽이 사용자 직접 모티브였던 이유",
    preview:
      "사용자가 처음에 '내 모티브가 된 거는 이거야'라며 selfishclub.xyz를 보여줬을 때, 그제서야 모든 결정이 한 곳으로 모였다. 1인 정체성 + 한국형 커뮤니티 구조의 정확한 합.",
    output: { label: "참고 → selfishclub-xyz.md", href: "#" },
  },
  {
    date: "2026-05-02",
    category: "회고",
    title: "ABN 모델 그대로 안 가져오고 새로 짠 이유",
    preview:
      "ABN의 5명 코어 모델은 너무 강력했다. 그런데 AICONLAB은 1인 + N명 시청자 → 코어 자연 형성이라는 다른 결. 자매 프로젝트지만 진짜 다른 길이라는 걸 받아들이는 데 시간이 걸렸다.",
    output: { label: "결과물 → community-model.md", href: "#" },
  },
];

const categories = ["전체", "사색", "회고", "의문", "결과물", "관찰"];

// 카테고리별 강조 컬러 (디자인 시스템 보조 컬러 활용)
const categoryColors: Record<string, string> = {
  사색: "bg-[#5db8a6]/15 text-[#3d8c7d]",      // teal
  회고: "bg-[#e8a55a]/15 text-[#a06f30]",      // amber
  의문: "bg-primary/15 text-primary",          // coral (강조)
  결과물: "bg-[#5db872]/15 text-[#3a8048]",    // success green
  관찰: "bg-muted text-muted-foreground",      // neutral
};

// 일기를 날짜별로 그룹화 (시간순 흐름 강조)
function groupByDate(entries: typeof journalEntries) {
  const grouped: Record<string, typeof journalEntries> = {};
  entries.forEach((entry) => {
    if (!grouped[entry.date]) grouped[entry.date] = [];
    grouped[entry.date].push(entry);
  });
  return grouped;
}

export default function JournalPage() {
  const grouped = groupByDate(journalEntries);
  const dates = Object.keys(grouped).sort().reverse(); // 최신 먼저

  return (
    <div className="bg-background">
      {/* ===== Hero ===== */}
      <section className="container mx-auto max-w-4xl px-6 py-16 md:py-24">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          🗒️ 일기 · 사유의 흐름
        </p>
        <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
          한 사람의 작업실 노트
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#3d3d3a]">
          정리되지 않은 사색 · 회고 · 의문 · 결과물의 흐름. 깔끔하지 않아도
          그대로 통째로 나눕니다 — 결국 이게 모여 정리된 인사이트가 됩니다.
        </p>

        {/* 통계 */}
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>📝 총 {journalEntries.length}개 노트</span>
          <span>📅 {dates.length}일치 일기</span>
          <span>
            ✦ {journalEntries.filter((e) => e.output).length}개에 결과물 연결
          </span>
        </div>
      </section>

      {/* ===== 카테고리 필터 ===== */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container mx-auto max-w-4xl px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-card text-foreground"
                    : "text-muted-foreground hover:bg-card/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 일기 흐름 (시간순, 날짜별 그룹) ===== */}
      <section className="container mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {dates.map((date) => (
            <div key={date}>
              {/* 날짜 헤더 (큰 serif) */}
              <div className="mb-6 flex items-baseline gap-3 border-b border-border pb-2">
                <h2 className="font-serif text-3xl">{date}</h2>
                <span className="text-sm text-muted-foreground">
                  · {grouped[date].length}개 노트
                </span>
              </div>

              {/* 그날의 일기들 */}
              <div className="space-y-6">
                {grouped[date].map((entry, idx) => (
                  <Card
                    key={idx}
                    className="rounded-xl border-0 bg-card shadow-none transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <CardContent className="p-8">
                      {/* 카테고리 배지 */}
                      <div className="mb-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            categoryColors[entry.category] ||
                            categoryColors.관찰
                          }`}
                        >
                          {entry.category}
                        </span>
                      </div>

                      {/* 제목 (큰 serif) */}
                      <h3 className="font-serif text-2xl leading-tight">
                        {entry.title}
                      </h3>

                      {/* 본문 미리보기 */}
                      <p className="mt-3 text-base leading-relaxed text-[#3d3d3a]">
                        {entry.preview}
                      </p>

                      {/* 결과물 연결 (있는 경우) */}
                      {entry.output && (
                        <div className="mt-5 border-t border-border pt-4">
                          <Link
                            href={entry.output.href}
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <span className="font-medium">
                              {entry.output.label}
                            </span>
                            <span aria-hidden>→</span>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 안내 */}
        <p className="mt-16 text-center text-sm text-muted-foreground">
          모든 노트는 결국 인사이트의 원료가 됩니다 — Build in Public.
        </p>
      </section>
    </div>
  );
}
