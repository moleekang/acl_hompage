// /resources — 자료·앱 페이지 (제품 쇼케이스 톤)
// UI 컨셉: 큰 메인 제품(ConGen, 하드코딩) + 작은 자료 그리드(DB)

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/server";

type Resource = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  tier: "free" | "members";
};

async function fetchResources(): Promise<Resource[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("site_resources")
    .select("id, name, description, icon_emoji, tier")
    .eq("published", true)
    .order("order_idx", { ascending: true });
  if (error) {
    console.error("[resources] fetchResources:", error.message);
    return [];
  }
  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.name,
    desc: row.description,
    icon: row.icon_emoji ?? "📦",
    tier: (row.tier as "free" | "members") ?? "free",
  }));
}

export default async function ResourcesPage() {
  const resources = await fetchResources();
  return (
    <div className="bg-background">
      {/* ===== Hero ===== */}
      <section className="container mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          📦 자료 · 앱
        </p>
        <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
          직접 만들어, 통째로 공유합니다
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#3d3d3a]">
          현장에서 검증된 도구와 자료들. 무료는 모두에게, 깊은 자료는 멤버에게.
        </p>
      </section>

      {/* ===== 메인 제품: ConGen 큰 쇼케이스 카드 ===== */}
      <section className="container mx-auto max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-2xl bg-[#181715] text-[#faf9f5]">
          <div className="grid gap-0 md:grid-cols-2">
            {/* 좌측: 정보 + CTA */}
            <div className="p-12 md:p-16">
              <Badge className="mb-6 rounded-full bg-primary text-xs uppercase tracking-wider text-primary-foreground">
                ⚡ FLAGSHIP · BETA
              </Badge>
              <h2 className="font-serif text-4xl leading-tight md:text-5xl">
                ConGen
              </h2>
              <p className="mt-2 text-sm uppercase tracking-wider text-[#a09d96]">
                Content Generation Launcher
              </p>
              <p className="mt-6 text-base leading-relaxed text-[#a09d96]">
                AI 컨텍스트로 콘텐츠를 자동 생성하는 로컬 런처. Mac + Windows
                지원. 영상 1편을 시간이 아닌 분 단위로 만듭니다.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-md bg-primary px-6 text-primary-foreground hover:bg-[#a9583e]"
                >
                  <a href="#">⬇ Mac 다운로드</a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-md border-[#a09d96] bg-transparent px-6 text-[#faf9f5] hover:bg-[#252320] hover:text-[#faf9f5]"
                >
                  <a href="#">⬇ Windows 다운로드</a>
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#a09d96]">
                <span>✓ macOS 12.0+</span>
                <span>✓ Windows 10/11</span>
                <span>✓ 무료 (Freemium)</span>
              </div>
            </div>

            {/* 우측: 미리보기 mockup */}
            <div className="bg-[#1f1e1b] p-12 md:p-16">
              <div className="mx-auto max-w-sm">
                <div className="rounded-lg bg-[#252320] p-6 font-mono text-xs">
                  <div className="mb-3 flex gap-1">
                    <div className="h-3 w-3 rounded-full bg-[#c64545]" />
                    <div className="h-3 w-3 rounded-full bg-[#d4a017]" />
                    <div className="h-3 w-3 rounded-full bg-[#5db872]" />
                  </div>
                  <p className="text-[#5db8a6]">$ congen launch</p>
                  <p className="mt-1 text-[#a09d96]">
                    ✓ 컨텍스트 로드 (3.2 MB)
                  </p>
                  <p className="text-[#a09d96]">✓ Remotion 엔진 시작</p>
                  <p className="text-[#a09d96]">✓ 127.0.0.1:3030 활성</p>
                  <p className="mt-2 text-primary">
                    → 영상 생성 준비 완료 (12s)
                  </p>
                </div>
                <p className="mt-4 text-center text-xs text-[#a09d96]">
                  실제 ConGen 부팅 화면 미리보기
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 작은 자료 그리드 ===== */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-12">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              📚 작은 자료들
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">
              검증된 템플릿과 가이드
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((res) => (
              <Card
                key={res.id}
                className="rounded-xl border-0 bg-card shadow-none transition-shadow hover:shadow-md"
              >
                <CardHeader className="p-6">
                  <div className="mb-3 text-3xl">{res.icon}</div>
                  <CardTitle className="font-serif text-lg font-normal">
                    {res.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm">
                    {res.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {res.tier === "members" ? (
                    <Badge className="rounded-full bg-primary text-xs text-primary-foreground">
                      🔒 멤버 전용
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-background text-xs"
                    >
                      무료
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
