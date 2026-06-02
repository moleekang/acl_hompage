// /journal 카테고리 필터 + 날짜별 그룹 렌더 (클라이언트).
// 필터를 먼저 적용한 뒤 날짜별로 그룹화 → 빈 날짜 그룹은 자연히 사라진다.
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export type JournalEntry = {
  id: string;
  date: string;
  category: string;
  title: string;
  preview: string;
  output: { label: string; href: string } | null;
};

const CATEGORIES = ["사색", "회고", "의문", "결과물", "관찰"];

// 카테고리별 강조 컬러 (디자인 시스템 보조 컬러 활용)
const categoryColors: Record<string, string> = {
  사색: "bg-[#5db8a6]/15 text-[#3d8c7d]",
  회고: "bg-[#e8a55a]/15 text-[#a06f30]",
  의문: "bg-primary/15 text-primary",
  결과물: "bg-[#5db872]/15 text-[#3a8048]",
  관찰: "bg-muted text-muted-foreground",
};

function groupByDate(entries: JournalEntry[]) {
  const grouped: Record<string, JournalEntry[]> = {};
  entries.forEach((entry) => {
    if (!grouped[entry.date]) grouped[entry.date] = [];
    grouped[entry.date].push(entry);
  });
  return grouped;
}

export function JournalFeed({ entries }: { entries: JournalEntry[] }) {
  const [active, setActive] = useState("전체");
  const filtered =
    active === "전체" ? entries : entries.filter((e) => e.category === active);
  const grouped = groupByDate(filtered);
  const dates = Object.keys(grouped).sort().reverse(); // 최신 먼저

  return (
    <>
      {/* 카테고리 필터 */}
      <div className="mb-12 flex flex-wrap gap-2">
        {["전체", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              cat === active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-card/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {dates.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          이 카테고리의 노트는 아직 없어요.
        </p>
      ) : (
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
                            categoryColors[entry.category] || categoryColors.관찰
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
      )}
    </>
  );
}
