// /journal — 일기 (외형) + 인사이트·결과물 (내용)
// UI 컨셉: 시간순 일기장 흐름 + 다양한 카테고리(사색/회고/의문/결과물/관찰)
// 셀피쉬 /blog의 미니멀 패턴을 1인 일기 톤으로 변형

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";

// DB에서 가져오는 행을 화면 쓰던 모양으로 변환.
type JournalEntry = {
  id: string;
  date: string;
  category: string;
  title: string;
  preview: string;
  output: { label: string; href: string } | null;
};

async function fetchJournalEntries(): Promise<JournalEntry[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("journal_entries")
    .select("id, entry_date, category, title, preview, output_label, output_href")
    .eq("published", true)
    .order("entry_date", { ascending: false })
    .order("order_idx", { ascending: true });
  if (error) {
    console.error("[journal] fetchJournalEntries:", error.message);
    return [];
  }
  return (data ?? []).map((row) => ({
    id: row.id,
    date: row.entry_date,
    category: row.category,
    title: row.title,
    preview: row.preview,
    output:
      row.output_label && row.output_href
        ? { label: row.output_label, href: row.output_href }
        : null,
  }));
}


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
function groupByDate(entries: JournalEntry[]) {
  const grouped: Record<string, JournalEntry[]> = {};
  entries.forEach((entry) => {
    if (!grouped[entry.date]) grouped[entry.date] = [];
    grouped[entry.date].push(entry);
  });
  return grouped;
}

export default async function JournalPage() {
  const journalEntries = await fetchJournalEntries();
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
                {grouped[date].map((entry) => (
                  <Card
                    key={entry.id}
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
