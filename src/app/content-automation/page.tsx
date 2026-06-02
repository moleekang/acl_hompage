// /content-automation — 컨텐츠 자동화 (영상 제작 워크플로우)
// 컨셉: AICONLAB의 핵심 자랑거리 — 영상 1편 8시간 → 30분
// 워크플로우 단계별 시각화 + 도구 카탈로그 + ConGen 강조

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONGEN_DOWNLOAD } from "@/lib/links";

// 영상 제작 7단계 워크플로우
const workflow = [
  {
    step: "01",
    icon: "💡",
    title: "아이디어",
    desc: "주제 발굴 + 시청자 니즈 분석",
    tools: ["YouTube Trends", "Claude"],
    automation: "주간 트렌드 자동 수집 → 후보 5개 추천",
  },
  {
    step: "02",
    icon: "📝",
    title: "시나리오",
    desc: "스크립트 작성 + 흐름 설계",
    tools: ["Claude API"],
    automation: "키워드 → 7~15분 분량 스크립트 자동 생성",
  },
  {
    step: "03",
    icon: "🎬",
    title: "영상 제작",
    desc: "편집 + 모션 + 자막 합성",
    tools: ["Remotion", "ConGen"],
    automation: "코드로 영상 자동 렌더링 — 핵심 자동화",
    highlight: true,
  },
  {
    step: "04",
    icon: "🖼️",
    title: "썸네일",
    desc: "클릭률 높은 표지 이미지",
    tools: ["DALL-E", "Figma API"],
    automation: "제목 → 썸네일 후보 3장 자동 생성",
  },
  {
    step: "05",
    icon: "🎙️",
    title: "자막",
    desc: "한/영 자막 생성 + 동기화",
    tools: ["Whisper", "DeepL"],
    automation: "음성 → 자막 100% 자동",
  },
  {
    step: "06",
    icon: "📤",
    title: "업로드",
    desc: "메타데이터 + 챕터 + SEO",
    tools: ["YouTube API"],
    automation: "스케줄 + 태그 + 설명 자동 채움",
  },
  {
    step: "07",
    icon: "📊",
    title: "분석",
    desc: "조회수 / 댓글 / 시청 시간",
    tools: ["YouTube API", "Claude"],
    automation: "주간 자동 리포트 + 다음 영상 인사이트",
  },
];

// 자동화 효과 통계
const beforeAfter = [
  { label: "영상 1편 제작 시간", before: "8시간", after: "30분", saving: "94%" },
  { label: "썸네일 1장 제작 시간", before: "1시간", after: "5분", saving: "92%" },
  { label: "자막 추가 시간", before: "2시간", after: "10분", saving: "92%" },
  { label: "분석 리포트 작성", before: "주 3시간", after: "자동", saving: "100%" },
];

export default function ContentAutomationPage() {
  return (
    <div className="bg-background">
      {/* ===== Hero — 시간 절약 강조 ===== */}
      <section className="container mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          🎬 컨텐츠 자동화 · CONTENT FACTORY
        </p>
        <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
          영상 1편 만드는 데
          <br />
          <span className="text-primary">8시간 → 30분</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#3d3d3a]">
          시나리오부터 업로드까지 7단계 워크플로우. 각 단계마다 AI를 끼워
          넣어서 직접 손대는 시간을 1/16로 줄였습니다.
        </p>
      </section>

      {/* ===== Before / After 통계 (Dark 톤) ===== */}
      <section className="container mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-xl bg-[#181715] p-8 text-[#faf9f5] md:p-12">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.15em] text-[#a09d96]">
            ⏱️ 자동화 효과 측정
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {beforeAfter.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-[#252320] pb-4 last:border-0"
              >
                <div>
                  <p className="text-sm text-[#a09d96]">{item.label}</p>
                  <p className="mt-1 font-serif">
                    <span className="text-base text-[#a09d96] line-through">
                      {item.before}
                    </span>
                    <span className="mx-3 text-[#a09d96]">→</span>
                    <span className="text-2xl text-primary">{item.after}</span>
                  </p>
                </div>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                  -{item.saving}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7단계 워크플로우 ===== */}
      <section className="bg-secondary py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-16 max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              7단계 워크플로우
            </p>
            <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
              아이디어부터 분석까지,
              <br />
              모든 단계에 AI
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflow.map((stage) => (
              <Card
                key={stage.step}
                className={`rounded-xl border-0 shadow-none transition-all hover:-translate-y-1 hover:shadow-md ${
                  stage.highlight
                    ? "bg-[#181715] text-[#faf9f5]"
                    : "bg-card"
                }`}
              >
                <CardHeader className="p-6">
                  {/* 단계 번호 + 아이콘 */}
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`font-serif text-xl ${
                        stage.highlight ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {stage.step}
                    </span>
                    <span className="text-3xl">{stage.icon}</span>
                  </div>

                  <CardTitle
                    className={`font-serif text-xl font-normal ${
                      stage.highlight ? "text-[#faf9f5]" : ""
                    }`}
                  >
                    {stage.title}
                  </CardTitle>
                  <CardDescription
                    className={`mt-2 text-sm ${
                      stage.highlight ? "text-[#a09d96]" : ""
                    }`}
                  >
                    {stage.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {/* 사용 도구 */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {stage.tools.map((tool) => (
                      <span
                        key={tool}
                        className={`rounded-md px-2 py-0.5 text-xs ${
                          stage.highlight
                            ? "bg-[#252320] text-[#a09d96]"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  {/* 자동화 설명 */}
                  <p
                    className={`mt-3 border-t pt-3 text-xs leading-relaxed ${
                      stage.highlight
                        ? "border-[#252320] text-[#a09d96]"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        stage.highlight ? "text-primary" : "text-foreground"
                      }`}
                    >
                      ⚡ 자동화:
                    </span>{" "}
                    {stage.automation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ConGen 강조 (Coral CTA Band) ===== */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-xl bg-primary p-12 text-primary-foreground md:p-16">
            <Badge className="mb-6 rounded-full bg-background/20 px-3 py-1 text-xs uppercase tracking-wider text-primary-foreground">
              ⚡ FLAGSHIP
            </Badge>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              ConGen
            </h2>
            <p className="mt-2 text-sm uppercase tracking-wider opacity-90">
              Content Generation Launcher
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-95">
              위 7단계 중 3번 (영상 제작)을 직접 풀어내는 자체 런처. AI
              컨텍스트로 콘텐츠를 자동 생성하는 로컬 도구. Mac + Windows 지원.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CONGEN_DOWNLOAD.mac}
                className="inline-flex items-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card"
              >
                ⬇ Mac 다운로드
              </a>
              <a
                href={CONGEN_DOWNLOAD.win}
                className="inline-flex items-center gap-2 rounded-md border border-background/30 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-background/10"
              >
                ⬇ Windows 다운로드
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer 안내 ===== */}
      <section className="container mx-auto max-w-4xl px-6 pb-24 text-center">
        <p className="text-sm text-muted-foreground">
          ✦ 새 자동화 단계가 추가되거나 도구가 바뀔 때마다 자동 업데이트됩니다.
        </p>
      </section>
    </div>
  );
}
