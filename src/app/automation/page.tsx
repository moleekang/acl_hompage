// /automation — 자동화 실험 페이지
// 컨셉: "AI로 1인 기업을 자동화" 정체성의 시각적 증명
// 카테고리별 자동화 사례 + 상태 (완료/진행/계획) + 사용 도구

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

// DB row 구조 — supabase automations 테이블타입한다.
type AutomationRow = {
  slug: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  tools: string[] | null;
  impact: string | null;
  icon_emoji: string | null;
};

// UI가 소비하는 모양으로 정규화.
type Automation = {
  slug: string;
  icon: string;
  category: string;
  title: string;
  desc: string;
  tools: string[];
  status: string;
  impact: string;
};

async function fetchAutomations(): Promise<Automation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("automations")
    .select("slug,title,description,category,status,tools,impact,icon_emoji")
    .not("published_at", "is", null)
    .order("order_idx", { ascending: true });
  if (error || !data) return [];
  return (data as AutomationRow[]).map((r) => ({
    slug: r.slug,
    icon: r.icon_emoji ?? "✨",
    category: r.category,
    title: r.title,
    desc: r.description ?? "",
    tools: Array.isArray(r.tools) ? r.tools : [],
    status: r.status,
    impact: r.impact ?? "",
  }));
}

const CATEGORY_FILTERS = [
  "전체",
  "콘텐츠",
  "운영",
  "마케팅",
  "비즈니스",
  "생산성",
];

// 상태별 컴러
const statusColors: Record<string, string> = {
  완료: "bg-[#5db872]/15 text-[#3a8048]",
  베타: "bg-[#e8a55a]/15 text-[#a06f30]",
  진행: "bg-primary/15 text-primary",
  계획: "bg-muted text-muted-foreground",
};

export default async function AutomationPage() {
  const automations = await fetchAutomations();

  // 통계 계산
  const completed = automations.filter((a) => a.status === "완료").length;
  const inProgress = automations.filter(
    (a) => a.status === "진행" || a.status === "베타",
  ).length;
  const planned = automations.filter((a) => a.status === "계획").length;

  return (
    <div className="bg-background">
      {/* ===== Hero ===== */}
      <section className="container mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          ⚙️ 자동화 · AUTOMATION LAB
        </p>
        <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
          1인 기업을
          <br />
          통째로 자동화합니다
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#3d3d3a]">
          AI 시대의 1인 기업은 어디까지 자동화 가능할까요. AICONLAB이 직접 짜고
          돌리고 있는 모든 자동화 실험을 통째로 공개합니다.
        </p>

        {/* 자동화 통계 */}
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div>
            <span className="font-serif text-2xl text-[#3a8048]">
              {completed}
            </span>
            <span className="ml-2 text-muted-foreground">완료</span>
          </div>
          <div>
            <span className="font-serif text-2xl text-primary">
              {inProgress}
            </span>
            <span className="ml-2 text-muted-foreground">진행 중</span>
          </div>
          <div>
            <span className="font-serif text-2xl text-muted-foreground">
              {planned}
            </span>
            <span className="ml-2 text-muted-foreground">계획</span>
          </div>
          <div>
            <span className="font-serif text-2xl text-foreground">
              {automations.length}
            </span>
            <span className="ml-2 text-muted-foreground">총 실험</span>
          </div>
        </div>
      </section>

      {/* ===== 카테고리 필터 ===== */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container mx-auto max-w-6xl px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((cat, i) => (
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

      {/* ===== 자동화 카드 그리드 ===== */}
      <section className="container mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {automations.map((auto) => (
            <Card
              key={auto.title}
              className="rounded-xl border-0 bg-card shadow-none transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader className="p-6">
                {/* 상단: 아이콘 + 카테고리 */}
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-3xl">{auto.icon}</span>
                  <Badge
                    variant="outline"
                    className="rounded-full border-border bg-background text-xs"
                  >
                    {auto.category}
                  </Badge>
                </div>

                <CardTitle className="font-serif text-xl font-normal leading-tight">
                  {auto.title}
                </CardTitle>
                <CardDescription className="mt-3 text-sm leading-relaxed">
                  {auto.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {/* 사용 도구 태그 */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {auto.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {/* 하단: 상태 + 효과 */}
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusColors[auto.status]
                    }`}
                  >
                    {auto.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {auto.impact}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          ✦ 새 자동화 실험이 매주 추가됩니다.
        </p>
      </section>

      {/* ===== Dark 강조 섹션 — 의뢰 CTA ===== */}
      <section className="container mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-xl bg-[#181715] p-12 text-[#faf9f5] md:p-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[#a09d96]">
            💡 자동화 실험 제안
          </p>
          <h2 className="font-serif text-3xl leading-tight md:text-4xl">
            우리 회사에 이런 자동화도
            <br />
            가능할까요?
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#a09d96]">
            단톡방에서 자동화 아이디어를 공유하면, AICONLAB이 직접 실험해보고
            결과를 통째로 나눕니다. 당신의 1인 기업도 함께 자동화될 수 있어요.
          </p>
          <a
            href="/community"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#a9583e]"
          >
            단톡방에서 제안하기 →
          </a>
        </div>
      </section>
    </div>
  );
}
