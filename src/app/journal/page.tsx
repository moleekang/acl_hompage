// /journal — 일기 (외형) + 인사이트·결과물 (내용)
// UI 컨셉: 시간순 일기장 흐름 + 다양한 카테고리(사색/회고/의문/결과물/관찰)
// 셀피쉬 /blog의 미니멀 패턴을 1인 일기 톤으로 변형
// 카테고리 필터 + 날짜 그룹 렌더는 클라이언트 컴포넌트(JournalFeed)가 담당.

import { createAdminClient } from "@/lib/supabase/server";
import { JournalFeed, type JournalEntry } from "./_journal-feed";

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

export default async function JournalPage() {
  const journalEntries = await fetchJournalEntries();
  const uniqueDates = new Set(journalEntries.map((e) => e.date)).size;

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
          <span>📅 {uniqueDates}일치 일기</span>
          <span>
            ✦ {journalEntries.filter((e) => e.output).length}개에 결과물 연결
          </span>
        </div>
      </section>

      {/* ===== 일기 흐름 (카테고리 필터 + 날짜별 그룹) ===== */}
      <section className="container mx-auto max-w-4xl px-6 py-16">
        <JournalFeed entries={journalEntries} />

        {/* 안내 */}
        <p className="mt-16 text-center text-sm text-muted-foreground">
          모든 노트는 결국 인사이트의 원료가 됩니다 — Build in Public.
        </p>
      </section>
    </div>
  );
}
