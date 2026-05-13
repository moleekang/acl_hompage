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

// 자동화 사례 데이터 — 실제 위키 automation-map과 연동 예정
const automations = [
  // 콘텐츠 제작
  {
    icon: "🎬",
    category: "콘텐츠",
    title: "Remotion 영상 자동화",
    desc: "코드로 영상을 자동 생성. 한 번 셋업하면 계속 영상 찍어냄",
    tools: ["Remotion", "Node.js"],
    status: "완료",
    impact: "영상 1편: 8시간 → 30분",
  },
  {
    icon: "✦",
    category: "콘텐츠",
    title: "ConGen 콘텐츠 런처",
    desc: "AI 컨텍스트로 콘텐츠 자동 생성하는 로컬 런처",
    tools: ["Electron", "Claude API"],
    status: "베타",
    impact: "직접 작업 시간 1/10",
  },
  {
    icon: "🖼️",
    category: "콘텐츠",
    title: "썸네일 자동 생성",
    desc: "영상 메타데이터로 썸네일 자동 생성",
    tools: ["DALL-E", "Figma API"],
    status: "계획",
    impact: "예정",
  },

  // 운영
  {
    icon: "📚",
    category: "운영",
    title: "콘텐츠 자동 발행",
    desc: "노트 작성 → 홈페이지 인사이트에 자동 노출",
    tools: ["Next.js", "MDX"],
    status: "진행",
    impact: "수동 발행 0",
  },
  {
    icon: "💬",
    category: "운영",
    title: "단톡방 운영 자동화",
    desc: "자주 묻는 질문 자동 답변, 신규 가입 환영",
    tools: ["KakaoTalk Bot", "Claude"],
    status: "계획",
    impact: "예정",
  },

  // 마케팅
  {
    icon: "📨",
    category: "마케팅",
    title: "뉴스레터 자동 발송",
    desc: "새 인사이트 추가 시 멤버에게 자동 발송",
    tools: ["Stibee API"],
    status: "계획",
    impact: "예정",
  },
  {
    icon: "🤝",
    category: "마케팅",
    title: "시청자 후기 자동 수집",
    desc: "유튜브 댓글 + 단톡방에서 좋은 후기 자동 정리",
    tools: ["YouTube API", "Claude"],
    status: "계획",
    impact: "예정",
  },

  // 비즈니스
  {
    icon: "💰",
    category: "비즈니스",
    title: "매출 깔때기 자동화",
    desc: "Awareness → Revenue 5단계 자동 트래킹",
    tools: ["GA4", "Stripe"],
    status: "계획",
    impact: "예정",
  },
  {
    icon: "💳",
    category: "비즈니스",
    title: "결제 + 멤버 자동 가입",
    desc: "결제 → 자동 멤버 등급 부여 → 혜택 발급",
    tools: ["토스페이먼츠", "Clerk"],
    status: "계획",
    impact: "예정",
  },

  // 개인 생산성
  {
    icon: "🧠",
    category: "생산성",
    title: "AI 어시스트 코딩",
    desc: "Claude Code로 1인 개발 가속",
    tools: ["Claude Code", "Cursor"],
    status: "완료",
    impact: "코딩 속도 3~5배",
  },
  {
    icon: "📊",
    category: "생산성",
    title: "데이터 자동 분석",
    desc: "유튜브 / 단톡방 데이터 주간 자동 리포트",
    tools: ["Python", "Claude"],
    status: "계획",
    impact: "예정",
  },
];

const categories = [
  "전체",
  "콘텐츠",
  "운영",
  "마케팅",
  "비즈니스",
  "생산성",
];

// 상태별 컬러
const statusColors: Record<string, string> = {
  완료: "bg-[#5db872]/15 text-[#3a8048]",
  베타: "bg-[#e8a55a]/15 text-[#a06f30]",
  진행: "bg-primary/15 text-primary",
  계획: "bg-muted text-muted-foreground",
};

export default function AutomationPage() {
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
