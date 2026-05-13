// /tools — 추천 도구 페이지 (셀피쉬 AI 툴 패턴)
// UI 컨셉: 카테고리 탭 + 카드 그리드 4-up + 멤버 혜택 호버
// v0: placeholder 도구 12개

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 사용자가 실제 쓰는 (또는 추천하는) AI 도구들 — placeholder
const tools = [
  { name: "Claude", category: "AI 모델", icon: "✦", desc: "긴 컨텍스트, 글쓰기 최강", deal: "20% 할인" },
  { name: "Cursor", category: "코딩", icon: "⌘", desc: "AI 코딩 에디터 표준", deal: "1개월 Pro" },
  { name: "Remotion", category: "영상", icon: "🎬", desc: "코드로 영상 자동 생성", deal: "-" },
  { name: "Gamma", category: "디자인", icon: "✨", desc: "AI 슬라이드 자동 생성", deal: "Pro 50% 할인" },
  { name: "Notion AI", category: "문서", icon: "🗂️", desc: "노트 + AI 작성 통합", deal: "-" },
  { name: "ElevenLabs", category: "음성", icon: "🎙️", desc: "사람 같은 음성 생성", deal: "1개월 Starter" },
  { name: "Vercel", category: "배포", icon: "▲", desc: "Next.js 호스팅 표준", deal: "$50 크레딧" },
  { name: "Figma", category: "디자인", icon: "🎨", desc: "UI 디자인의 표준", deal: "-" },
  { name: "Obsidian", category: "위키", icon: "🔮", desc: "로컬 마크다운 위키", deal: "-" },
  { name: "Stibee", category: "이메일", icon: "📨", desc: "한국형 뉴스레터", deal: "1개월 무료" },
  { name: "Toss Payments", category: "결제", icon: "💳", desc: "한국 1위 결제 PG", deal: "-" },
  { name: "GitHub", category: "협업", icon: "🐙", desc: "코드 저장 + 버전 관리", deal: "-" },
];

const categories = ["전체", "AI 모델", "코딩", "영상", "디자인", "문서", "음성", "배포", "위키"];

export default function ToolsPage() {
  return (
    <div className="bg-background">
      {/* ===== Hero ===== */}
      <section className="container mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          🤝 추천 도구
        </p>
        <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
          실제로 쓰는 것만 추천합니다
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#3d3d3a]">
          AICONLAB이 매일 사용하는 AI · 자동화 · 운영 도구들. 멤버 가입 시 일부
          도구의 제휴 할인 혜택을 받을 수 있어요.
        </p>
      </section>

      {/* ===== 카테고리 필터 (셀피쉬 패턴) ===== */}
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

      {/* ===== 도구 카드 그리드 (4-up, 작은 카드) ===== */}
      <section className="container mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Card
              key={tool.name}
              className="group relative overflow-hidden rounded-xl border-0 bg-card shadow-none transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {tool.category}
                  </span>
                </div>
                <CardTitle className="font-serif text-lg font-normal">
                  {tool.name}
                </CardTitle>
                <CardDescription className="mt-1 text-xs leading-relaxed">
                  {tool.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                {tool.deal !== "-" ? (
                  <Badge className="rounded-full bg-primary text-xs text-primary-foreground">
                    🎁 {tool.deal}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="rounded-full border-border text-xs"
                  >
                    추천만
                  </Badge>
                )}
              </CardContent>

              {/* 호버 시 노출되는 멤버 안내 (셀피쉬 패턴) */}
              {tool.deal !== "-" && (
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-primary p-4 text-center text-xs text-primary-foreground transition-transform group-hover:translate-y-0">
                  멤버 가입 시 코드 자동 발급
                </div>
              )}
            </Card>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          ✦ 호버 시 멤버 혜택이 나타납니다 (UI 미리보기)
        </p>
      </section>
    </div>
  );
}
