// /community — 단톡방 + 시청자 기여 페이지
// UI 컨셉: 큰 단톡방 CTA Hero + 통계 + 시청자 후기

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSiteStats } from "@/lib/site-stats";
import { KAKAO_OPENCHAT } from "@/lib/links";
import { createAdminClient } from "@/lib/supabase/server";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  body: string;
  contribution: string | null;
};

async function fetchTestimonials(): Promise<Testimonial[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("testimonials")
    .select("id, name, role, body, contribution")
    .eq("published", true)
    .order("order_idx", { ascending: true });
  if (error) {
    console.error("[community] fetchTestimonials:", error.message);
    return [];
  }
  return data ?? [];
}

export default async function CommunityPage() {
  const [testimonials, stats] = await Promise.all([
    fetchTestimonials(),
    getSiteStats(),
  ]);
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
              <a href={KAKAO_OPENCHAT} target="_blank" rel="noopener noreferrer">
                💬 카카오톡 단톡방 입장하기 →
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== 통계 (dark 톤 강조) ===== */}
      <section className="container mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl bg-[#181715] p-12 text-center text-[#faf9f5] md:p-16">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <p className="font-serif text-4xl text-[var(--text-mint)] md:text-5xl">
                {stats.communityMembers}
              </p>
              <p className="mt-2 text-sm text-[#a09d96]">단톡방 멤버</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-[var(--text-mint)] md:text-5xl">
                {stats.youtubeSubscribers}
              </p>
              <p className="mt-2 text-sm text-[#a09d96]">유튜브 구독자</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-[var(--text-mint)] md:text-5xl">
                {stats.betaTesters}
              </p>
              <p className="mt-2 text-sm text-[#a09d96]">베타 테스터</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-[var(--text-mint)] md:text-5xl">
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
              { step: "1", icon: "📺", title: "유튜브 시청", desc: `${stats.youtubeSubscribers}명 구독자` },
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
              key={t.id}
              className="rounded-xl border-0 bg-card shadow-none"
            >
              <CardHeader className="p-6">
                <p className="text-sm leading-relaxed text-[#3d3d3a]">
                  &ldquo;{t.body}&rdquo;
                </p>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="border-t border-border pt-4">
                  <p className="font-serif text-base">{t.name}</p>
                  {t.role && (
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  )}
                  {t.contribution && (
                    <Badge
                      variant="secondary"
                      className="mt-2 rounded-full bg-background text-xs"
                    >
                      {t.contribution}
                    </Badge>
                  )}
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
