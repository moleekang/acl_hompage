// /membership — 멤버십 가격표
// UI 컨셉: 3단 가격표 (Free / Plus / Pro) + 추천단은 dark navy (Claude pricing-tier-card-featured)
// + FAQ 섹션

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 가격 단계 정의
const tiers = [
  {
    name: "Free",
    price: "₩0",
    priceDesc: "영원히 무료",
    desc: "AICONLAB의 출발선. 누구나 환영.",
    features: [
      "✓ 모든 무료 인사이트 열람",
      "✓ 카카오톡 단톡방 참여",
      "✓ 무료 자료/템플릿 다운로드",
      "✓ ConGen 베타 사용",
      "✓ 뉴스레터 구독",
    ],
    cta: "무료 가입",
    featured: false,
  },
  {
    name: "Plus",
    price: "₩9,900",
    priceDesc: "/월 (예정)",
    desc: "더 가까이, 더 깊이 함께.",
    features: [
      "✓ Free 모든 혜택",
      "✓ 멤버 전용 인사이트 (🔒 표시)",
      "✓ 멤버 전용 자료 다운로드",
      "✓ 추천 도구 제휴 할인 코드",
      "✓ 단톡방 우선 답변",
      "✓ 월간 멤버 전용 라이브",
    ],
    cta: "Plus 가입",
    featured: true,
  },
  {
    name: "Pro",
    price: "추후 공개",
    priceDesc: "코어 멤버 진화 시",
    desc: "공동 프로젝트 동료가 되는 길.",
    features: [
      "✓ Plus 모든 혜택",
      "✓ AICONLAB 코어 멤버",
      "✓ 공동 프로젝트 참여",
      "✓ 1:1 컨설팅 (분기)",
      "✓ 위키 기여자 명시",
      "✓ 추후 정의될 혜택",
    ],
    cta: "관심 등록",
    featured: false,
  },
];

// FAQ
const faqs = [
  {
    q: "지금 가입하면 즉시 혜택을 받나요?",
    a: "현재는 v0 단계로 가입 시스템이 v1에서 도입될 예정입니다. 미리 관심 등록하시면 출시 시 가장 먼저 안내드려요.",
  },
  {
    q: "Plus 가격은 확정인가요?",
    a: "v1 출시 시점에 최종 결정됩니다. 9,900원은 잠정 가격이며, 초기 가입자에게는 평생 할인 혜택을 검토 중입니다.",
  },
  {
    q: "환불 정책은 어떻게 되나요?",
    a: "결제 후 7일 이내 100% 환불 가능합니다. 멤버 전용 콘텐츠 다운로드 후라도 환불 가능 (신뢰 기반).",
  },
  {
    q: "Pro 가입은 언제 열리나요?",
    a: "Pro는 단순 결제가 아닌 '코어 멤버 진화'의 결과입니다. 단톡방·기여 누적이 일정 수준 이상인 분들 중에서 자연스럽게 형성될 예정입니다.",
  },
];

export default function MembershipPage() {
  return (
    <div className="bg-background">
      {/* ===== Hero ===== */}
      <section className="container mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            ✉️ 멤버십
          </p>
          <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
            세 가지 길, 하나의 실험실
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#3d3d3a]">
            기여 우선 (Give First) 가치에 따라 무료가 가장 풍성합니다.
            <br />
            더 가까이 함께하고 싶으면 Plus, 함께 만들고 싶으면 Pro.
          </p>
        </div>
      </section>

      {/* ===== 3단 가격표 (Claude pricing-tier 패턴) ===== */}
      <section className="container mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative rounded-xl border shadow-none transition-shadow hover:shadow-md ${
                tier.featured
                  ? "border-0 bg-[#181715] text-[#faf9f5]"
                  : "border-border bg-background"
              }`}
            >
              {tier.featured && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-xs uppercase tracking-wider text-primary-foreground">
                  ✦ 추천
                </Badge>
              )}

              <CardHeader className="p-8">
                {/* 단계 이름 */}
                <p
                  className={`font-serif text-2xl ${
                    tier.featured ? "text-[#faf9f5]" : "text-foreground"
                  }`}
                >
                  {tier.name}
                </p>

                {/* 가격 (serif!) */}
                <p
                  className={`mt-4 font-serif text-5xl ${
                    tier.featured ? "text-primary" : "text-foreground"
                  }`}
                >
                  {tier.price}
                </p>
                <p
                  className={`text-sm ${
                    tier.featured ? "text-[#a09d96]" : "text-muted-foreground"
                  }`}
                >
                  {tier.priceDesc}
                </p>

                {/* 단계 설명 */}
                <p
                  className={`mt-4 text-sm leading-relaxed ${
                    tier.featured ? "text-[#a09d96]" : "text-[#3d3d3a]"
                  }`}
                >
                  {tier.desc}
                </p>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                {/* 혜택 리스트 */}
                <ul
                  className={`space-y-3 text-sm ${
                    tier.featured ? "text-[#a09d96]" : "text-[#3d3d3a]"
                  }`}
                >
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  asChild
                  className={`mt-8 w-full rounded-md ${
                    tier.featured
                      ? "bg-primary text-primary-foreground hover:bg-[#a9583e]"
                      : "bg-foreground text-background hover:bg-[#252523]"
                  }`}
                  size="lg"
                >
                  <a href="#">{tier.cta}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          ✦ 가입 시스템은 v1에서 도입됩니다. 지금은 미리보기 (UI 목업)
        </p>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              자주 묻는 질문
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">FAQ</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card
                key={faq.q}
                className="rounded-xl border-0 bg-card shadow-none"
              >
                <CardContent className="p-6">
                  <p className="font-serif text-lg">Q. {faq.q}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#3d3d3a]">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
