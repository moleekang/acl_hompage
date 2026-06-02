// /projects — AICONLAB 프로젝트 (결과물 카탈로그)
// 컨셉: levels.io 영감 — "1인이 만든 모든 것" 한 페이지에
// 자동화 vs 프로젝트 차이: 자동화=HOW(방법), 프로젝트=WHAT(결과물)

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONGEN_DOWNLOAD } from "@/lib/links";

// AICONLAB 프로젝트 — 진행 중 + 출시 + 계획
const projects = [
  {
    icon: "✦",
    title: "ConGen",
    subtitle: "Content Generation Launcher",
    desc: "AI 컨텍스트로 콘텐츠를 자동 생성하는 로컬 데스크톱 런처. Mac + Windows 지원. AICONLAB의 Flagship 제품.",
    status: "베타",
    type: "SaaS",
    tech: ["Electron", "Claude API", "FFmpeg"],
    metric: "베타 테스터 30명",
    flagship: true,
  },
  {
    icon: "🏠",
    title: "AICONLAB 홈페이지",
    subtitle: "Build in Public — 지금 보고 있는 사이트",
    desc: "AICONLAB의 모든 활동이 모이는 디지털 본진. 이 사이트 자체가 진행 중인 프로젝트.",
    status: "진행",
    type: "웹사이트",
    tech: ["Next.js 16", "Tailwind", "shadcn/ui"],
    metric: "v0 단계",
    flagship: false,
  },
  {
    icon: "📚",
    title: "AICONLAB 위키",
    subtitle: "브랜드 빌딩 지식 베이스",
    desc: "정체성 · 통찰 · 비즈니스 · 콘텐츠 전략을 통째로 담는 Obsidian 기반 위키. 모든 인사이트의 원천.",
    status: "운영",
    type: "지식 베이스",
    tech: ["Obsidian", "Markdown", "Git"],
    metric: "22+ 페이지",
    flagship: false,
  },
  {
    icon: "🎬",
    title: "Remotion 영상 자동화",
    subtitle: "코드로 영상 생성하는 자체 시스템",
    desc: "스크립트 + 메타데이터로 유튜브 영상을 자동 렌더링. 영상 1편 8시간 → 30분으로 단축.",
    status: "운영",
    type: "도구",
    tech: ["Remotion", "Node.js", "FFmpeg"],
    metric: "월 영상 4~6편 자동",
    flagship: false,
  },
  {
    icon: "🧠",
    title: "LLM Wiki",
    subtitle: "1인 기업을 위한 LLM 학습 가이드",
    desc: "카르파티 강의 + AICONLAB 실전 적용. 무료는 워크플로우 + 가치, 유료는 만드는 방법 풀 가이드.",
    status: "진행",
    type: "지식 베이스",
    tech: ["Claude", "GPT", "Notion"],
    metric: "무료 6 + 유료 10 챕터",
    flagship: false,
    href: "/llm-wiki",
  },
  {
    icon: "🤖",
    title: "시청자 인터랙션 봇",
    subtitle: "카카오톡 + 유튜브 자동 응답",
    desc: "단톡방 신규 가입 환영, 자주 묻는 질문 자동 답변, 후기 자동 수집까지 한 번에.",
    status: "계획",
    type: "도구",
    tech: ["KakaoTalk Bot", "YouTube API", "Claude"],
    metric: "예정",
    flagship: false,
  },
  {
    icon: "📦",
    title: "자료 · 템플릿 라이브러리",
    subtitle: "무료 + 유료 자료 모음",
    desc: "1인 기업 자동화 체크리스트, 매출 깔때기 시트, 프롬프트 모음 등을 무료/유료로 배포.",
    status: "진행",
    type: "콘텐츠",
    tech: ["Notion", "Stripe"],
    metric: "6개 자료 준비 중",
    flagship: false,
  },
];

// 상태별 컬러
const statusColors: Record<string, string> = {
  운영: "bg-[#5db872]/15 text-[#3a8048]",
  베타: "bg-[#e8a55a]/15 text-[#a06f30]",
  진행: "bg-primary/15 text-primary",
  계획: "bg-muted text-muted-foreground",
};

export default function ProjectsPage() {
  // 통계 계산
  const inOperation = projects.filter(
    (p) => p.status === "운영" || p.status === "베타",
  ).length;
  const inProgress = projects.filter((p) => p.status === "진행").length;
  const planned = projects.filter((p) => p.status === "계획").length;

  return (
    <div className="bg-background">
      {/* ===== Hero ===== */}
      <section className="container mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          🚀 AICONLAB 프로젝트
        </p>
        <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
          한 사람이
          <br />
          만들고 있는 모든 것
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#3d3d3a]">
          앱 · 사이트 · 도구 · 콘텐츠 라이브러리. AICONLAB이 1인 기업으로
          돌리고 있는 모든 결과물을 한 곳에서.
        </p>

        {/* 통계 */}
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div>
            <span className="font-serif text-2xl text-[#3a8048]">
              {inOperation}
            </span>
            <span className="ml-2 text-muted-foreground">운영 중</span>
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
              {projects.length}
            </span>
            <span className="ml-2 text-muted-foreground">총 프로젝트</span>
          </div>
        </div>
      </section>

      {/* ===== Flagship 프로젝트 (ConGen) — Dark 강조 ===== */}
      {projects
        .filter((p) => p.flagship)
        .map((flagship) => (
          <section
            key={flagship.title}
            className="container mx-auto max-w-6xl px-6 pb-16"
          >
            <div className="overflow-hidden rounded-2xl bg-[#181715] text-[#faf9f5]">
              <div className="grid gap-0 md:grid-cols-2">
                {/* 좌측: 정보 */}
                <div className="p-12 md:p-16">
                  <Badge className="mb-6 rounded-full bg-primary text-xs uppercase tracking-wider text-primary-foreground">
                    ⚡ FLAGSHIP · {flagship.type}
                  </Badge>
                  <h2 className="font-serif text-5xl leading-tight">
                    {flagship.title}
                  </h2>
                  <p className="mt-2 text-sm uppercase tracking-wider text-[#a09d96]">
                    {flagship.subtitle}
                  </p>
                  <p className="mt-6 text-base leading-relaxed text-[#a09d96]">
                    {flagship.desc}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {flagship.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-[#252320] px-2 py-1 text-xs text-[#a09d96]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={CONGEN_DOWNLOAD.home}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#a9583e]"
                  >
                    ConGen 다운로드 →
                  </a>
                </div>

                {/* 우측: 통계 미리보기 */}
                <div className="bg-[#1f1e1b] p-12 md:p-16">
                  <p className="mb-6 text-xs uppercase tracking-[0.15em] text-[#a09d96]">
                    현재 상태
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[#a09d96]">상태</p>
                      <p className="mt-1 font-serif text-2xl text-primary">
                        {flagship.status} 중
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#a09d96]">트랙션</p>
                      <p className="mt-1 font-serif text-2xl">
                        {flagship.metric}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#a09d96]">플랫폼</p>
                      <p className="mt-1 text-sm">macOS 12+ · Windows 10/11</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

      {/* ===== 나머지 프로젝트 그리드 ===== */}
      <section className="bg-secondary py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-12">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              나머지 프로젝트
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">
              운영 중 · 진행 중 · 계획
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects
              .filter((p) => !p.flagship)
              .map((project) => (
                <Card
                  key={project.title}
                  className="rounded-xl border-0 bg-card shadow-none transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <CardHeader className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <span className="text-3xl">{project.icon}</span>
                      <Badge
                        variant="outline"
                        className="rounded-full border-border bg-background text-xs"
                      >
                        {project.type}
                      </Badge>
                    </div>

                    <CardTitle className="font-serif text-xl font-normal leading-tight">
                      {project.title}
                    </CardTitle>
                    <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                      {project.subtitle}
                    </p>
                    <CardDescription className="mt-3 text-sm leading-relaxed">
                      {project.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    {/* 사용 기술 */}
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* 하단: 상태 + 메트릭 */}
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusColors[project.status]
                        }`}
                      >
                        {project.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {project.metric}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* ===== Build in Public 메시지 ===== */}
      <section className="container mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          ✦ BUILD IN PUBLIC
        </p>
        <h2 className="font-serif text-3xl leading-tight md:text-4xl">
          만드는 과정도,
          <br />
          결과물도, 통째로 나눕니다
        </h2>
        <p className="mt-6 text-base leading-relaxed text-[#3d3d3a]">
          새 프로젝트가 시작되거나 상태가 바뀌면 작업 일지에 자동으로 기록됩니다.
          모두가 함께 보고, 함께 배웁니다.
        </p>
      </section>
    </div>
  );
}
