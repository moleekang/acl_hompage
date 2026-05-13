// /llm-wiki — LLM Wiki 프로젝트 상세 (무료/유료 비교 페이지)
// 컨셉: 사용자 첫 비전("wiki 데이터 무료/유료 분리")의 첫 실제 구현
// 카르파티 강의 + AICONLAB 1인 기업 실전 적용

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 무료 콘텐츠 — 워크플로우 + 가치 (전체 그림)
const freeContents = [
  { ch: "01", title: "LLM이 뭐고, 왜 1인 기업의 도구가 됐나" },
  { ch: "02", title: "Claude · GPT · Gemini · Llama — 큰 그림" },
  { ch: "03", title: "프롬프트 vs 컨텍스트 — 진짜 차이" },
  { ch: "04", title: "AICONLAB의 LLM 자동화 워크플로우 (전체 지도)" },
  { ch: "05", title: "어떤 가치를 만들었나 — 시간 · 결과물 · 효율" },
  { ch: "06", title: "1인 기업이 LLM으로 풀 수 있는 10가지 문제" },
];

// 유료 콘텐츠 — 만드는 방법 + 사용법 (디테일 풀 가이드)
const paidContents = [
  { ch: "07", title: "Claude API 풀 가이드 — 토큰 · 비용 · 캐싱" },
  { ch: "08", title: "프롬프트 엔지니어링 — 30개 검증 패턴" },
  { ch: "09", title: "긴 컨텍스트 다루기 (200K 토큰)" },
  { ch: "10", title: "에이전트 구축 — Tool Use · MCP" },
  { ch: "11", title: "ConGen 코드 풀 공개 (Electron + Claude API)" },
  { ch: "12", title: "비용 최적화 — Prompt Caching 실전" },
  { ch: "13", title: "카르파티 강의 정리 + 1인 기업 적용" },
  { ch: "14", title: "실전 케이스 7개 (콘텐츠 / 운영 / 마케팅 / 세무 등)" },
  { ch: "15", title: "에러 핸들링 + 프로덕션 체크리스트" },
  { ch: "16", title: "다음 단계 — Custom GPT · Fine-tuning · RAG" },
];

export default function LLMWikiPage() {
  return (
    <div className="bg-background">
      {/* ===== Hero ===== */}
      <section className="container mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          🧠 LLM WIKI · 학습 가이드
        </p>
        <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
          LLM 워크플로우,
          <br />
          한 번 만들고 평생 굴리세요
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#3d3d3a]">
          카르파티 강의를 기반으로, 1인 기업이 직접 굴리는 LLM 자동화 사례를
          풀어냈습니다. 큰 그림은 누구에게나 무료, 풀 가이드는 멤버에게.
        </p>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>📚 총 {freeContents.length + paidContents.length}개 챕터</span>
          <span>✅ 무료 {freeContents.length}개</span>
          <span>🔒 유료 {paidContents.length}개</span>
          <span>📅 매주 1챕터씩 추가</span>
        </div>
      </section>

      {/* ===== 두 버전 비교 가격표 ===== */}
      <section className="container mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* ===== 무료 카드 ===== */}
          <Card className="rounded-2xl border-border bg-card shadow-none">
            <CardHeader className="p-10">
              <Badge
                variant="secondary"
                className="mb-4 w-fit rounded-full bg-background px-3"
              >
                ✦ 무료 버전
              </Badge>
              <p className="font-serif text-3xl">
                워크플로우 + 가치
              </p>
              <p className="mt-3 text-base leading-relaxed text-[#3d3d3a]">
                "LLM이 뭐고, 1인 기업에 어떤 가치를 만드나"의 큰 그림. 시작점에
                필요한 모든 것.
              </p>
              <p className="mt-6 font-serif text-5xl">₩0</p>
              <p className="text-sm text-muted-foreground">영원히 무료</p>
            </CardHeader>
            <CardContent className="px-10 pb-10">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                포함된 챕터 {freeContents.length}개
              </p>
              <ul className="space-y-3">
                {freeContents.map((item) => (
                  <li
                    key={item.ch}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="font-mono text-xs text-muted-foreground">
                      {item.ch}
                    </span>
                    <span className="leading-relaxed text-foreground">
                      {item.title}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="mt-8 w-full rounded-md bg-foreground text-background hover:bg-[#252523]"
              >
                <a href="#">무료로 시작하기</a>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                이메일만 입력하면 즉시 열람
              </p>
            </CardContent>
          </Card>

          {/* ===== 유료 카드 (Featured Dark) ===== */}
          <Card className="relative rounded-2xl border-0 bg-[#181715] shadow-none">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-xs uppercase tracking-wider text-primary-foreground">
              ⚡ 추천
            </Badge>

            <CardHeader className="p-10 text-[#faf9f5]">
              <Badge className="mb-4 w-fit rounded-full bg-primary/20 px-3 text-primary">
                🔒 유료 버전
              </Badge>
              <p className="font-serif text-3xl">
                만드는 방법 + 사용법
              </p>
              <p className="mt-3 text-base leading-relaxed text-[#a09d96]">
                무료 + 모든 디테일 풀 공개. 코드, 프롬프트, 실전 케이스, ConGen
                내부 구조까지.
              </p>
              <p className="mt-6 font-serif text-5xl text-primary">₩29,000</p>
              <p className="text-sm text-[#a09d96]">평생 접근 (잠정 가격)</p>
            </CardHeader>
            <CardContent className="px-10 pb-10">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-[#a09d96]">
                무료 + 추가 챕터 {paidContents.length}개
              </p>
              <ul className="space-y-3">
                {paidContents.map((item) => (
                  <li
                    key={item.ch}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="font-mono text-xs text-[#a09d96]">
                      {item.ch}
                    </span>
                    <span className="leading-relaxed text-[#faf9f5]">
                      {item.title}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="mt-8 w-full rounded-md bg-primary text-primary-foreground hover:bg-[#a9583e]"
              >
                <a href="#">유료 가입하기</a>
              </Button>
              <p className="mt-3 text-center text-xs text-[#a09d96]">
                7일 환불 보장 · 한 번 결제로 평생 접근
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== 가치 강조 ===== */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            ✦ 왜 이 가이드인가
          </p>
          <h2 className="font-serif text-3xl leading-tight md:text-4xl">
            끝까지 만들어 본 사람의
            <br />
            컨텍스트와 과정
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#3d3d3a]">
            시중 LLM 가이드는 대부분 "도구 소개" 또는 "프롬프트 모음".
            <br />
            AICONLAB의 LLM Wiki는 다릅니다 — 1인 기업을 통째로 자동화한 사람의
            실전 컨텍스트와 시행착오가 그대로 담겨있어요.
          </p>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="container mx-auto max-w-3xl px-6 py-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          자주 묻는 질문
        </p>
        <h2 className="mb-12 font-serif text-3xl md:text-4xl">FAQ</h2>

        <div className="space-y-4">
          {[
            {
              q: "무료 버전만으로 충분한가요?",
              a: "큰 그림과 가치를 이해하고 직접 적용해보고 싶다면 무료로 충분합니다. 단, 실전 코드와 프롬프트 패턴, ConGen 같은 구체적인 케이스 스터디는 유료에 있어요.",
            },
            {
              q: "환불은 가능한가요?",
              a: "결제 후 7일 이내 100% 환불 가능합니다. 콘텐츠 다운로드 후라도 신뢰 기반으로 환불 진행돼요.",
            },
            {
              q: "내용은 정기적으로 업데이트되나요?",
              a: "네, 매주 1챕터씩 추가됩니다. 한 번 결제하면 모든 미래 업데이트를 평생 받아볼 수 있어요.",
            },
            {
              q: "카르파티 강의를 이미 봤는데 도움 될까요?",
              a: "네 — 카르파티는 기초/이론, AICONLAB Wiki는 1인 기업 실전 적용에 집중합니다. 보완 관계예요.",
            },
          ].map((faq) => (
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
      </section>
    </div>
  );
}
