// /community — 단톡방 + 시청자 기여 페이지
// UI 컨셉: 큰 단톡방 CTA Hero + 통계 + 시청자 후기

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 시청자 후기 placeholder
const testimonials = [
  {
    name: "김OO",
    role: "1인 콘텐츠 크리에이터",
    text: "ConGen 베타 써봤는데 진짜 영상 만드는 시간이 1/10로 줄었어요. 단톡방에서 빠른 피드백도 좋고요.",
    contribution: "베타 테스터 + 사용 후기",
  },
  {
    name: "이OO",
    role: "AI 자동화 학습자",
    text: "위키 인사이트 따라하면서 1인 기업 자동화 시작했어요. 매번 새 글 올라올 때마다 뭐 배울지 기대됨.",
    contribution: "독자 + 적용 후기",
  },
  {
    name: "박OO",
    role: "유튜브 크리에이터",
    text: "단톡방에서 자동화 흐름 같이 고민해주시는 게 진짜 도움돼요. 혼자 할 때랑 완전 다름.",
    contribution: "단톡방 활약",
  },
];

export default function CommunityPage() {
  return (
    <div className="bg-background">
      {/* ===== Hero — 큰 단톡방 CTA ===== */}
      <section className="container mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            💬 함께하는 공간
          </p>
          <h1 className="mx-auto max-w-3xl font-serif text-5xl leading-[1.05] md:text-6xl">
            마을 회관에 들어오세요
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#3d3d3a]">
            유튜브 시청자가 단톡방으로 들어와 머물고, 그중 능동적인 사람들이
            자료·콘텐츠를 함께 만드는 공간.
          </p>

          {/* 큰 CTA */}
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="rounded-md bg-primary px-8 py-7 text-lg text-primary-foreground hover:bg-[#a9583e]"
            >
              <a href="#" target="_blank" rel="noopener noreferrer">
                💬 카카오톡 단톡방 입장하기 →
              </a>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              * 링크는 곧 연결 예정
            </p>
          </div>
        </div>
      </section>

      {/* ===== 통계 (dark 톤 강조) ===== */}
      <section className="container mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl bg-[#181715] p-12 text-center text-[#faf9f5] md:p-16">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <p className="font-serif text-4xl text-primary md:text-5xl">
                1,000+
              </p>
              <p className="mt-2 text-sm text-[#a09d96]">단톡방 멤버</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-primary md:text-5xl">
                9,490
              </p>
              <p className="mt-2 text-sm text-[#a09d96]">유튜브 구독자</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-primary md:text-5xl">
                30+
              </p>
              <p className="mt-2 text-sm text-[#a09d96]">베타 테스터</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-primary md:text-5xl">
                Daily
              </p>
              <p className="mt-2 text-sm text-[#a09d96]">활성 대화</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 함께하는 방법 ===== */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              4단계 흐름
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">
              시청자 → 코어로 자연스럽게
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              { step: "1", icon: "📺", title: "유튜브 시청", desc: "9,490명 구독자" },
              { step: "2", icon: "💬", title: "단톡방 합류", desc: "마을 회관에 머물기" },
              { step: "3", icon: "🤝", title: "능동적 활동", desc: "질문 · 공유 · 기여" },
              { step: "4", icon: "✦", title: "코어 자연 형성", desc: "공동 프로젝트 동료" },
            ].map((stage) => (
              <Card
                key={stage.step}
                className="rounded-xl border-0 bg-card shadow-none"
              >
                <CardContent className="p-6 text-center">
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    Step {stage.step}
                  </p>
                  <div className="mb-3 text-3xl">{stage.icon}</div>
                  <p className="font-serif text-lg">{stage.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {stage.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 시청자 후기 ===== */}
      <section className="container mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            🤝 시청자 기여
          </p>
          <h2 className="font-serif text-3xl md:text-4xl">
            함께 쌓아가는 사람들
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="rounded-xl border-0 bg-card shadow-none"
            >
              <CardHeader className="p-6">
                <p className="text-sm leading-relaxed text-[#3d3d3a]">
                  &ldquo;{t.text}&rdquo;
                </p>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="border-t border-border pt-4">
                  <p className="font-serif text-base">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                  <Badge
                    variant="secondary"
                    className="mt-2 rounded-full bg-background text-xs"
                  >
                    {t.contribution}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          ✦ 위 후기는 v0 placeholder입니다 — 실제 후기는 단톡방 활동 누적 후 공개
        </p>
      </section>
    </div>
  );
}
