// 팀 블로그 목업 데이터
// /log/page.tsx (리스트)와 /log/[slug]/page.tsx (상세)에서 공유
// 추후 위키 log.md 자동 발행 또는 MDX 시스템으로 교체 예정

// 카테고리 정의 — label + 메인 색상 + 글로우 색상 (썸네일 배경용)
export const categories = {
  dev: {
    label: "개발",
    color: "var(--text-mint)",
    glow: "rgba(77,224,166,0.18)",
  },
  retro: {
    label: "회고",
    color: "var(--text-sun)",
    glow: "rgba(255,210,63,0.22)",
  },
  insight: {
    label: "인사이트",
    color: "var(--text-electric)",
    glow: "rgba(90,124,255,0.16)",
  },
  ops: {
    label: "운영",
    color: "var(--text-hot)",
    glow: "rgba(255,107,71,0.14)",
  },
  tool: {
    label: "AI 도구",
    color: "var(--text-electric)",
    glow: "rgba(90,124,255,0.16)",
  },
  brand: {
    label: "브랜드",
    color: "var(--text-hot)",
    glow: "rgba(255,107,71,0.14)",
  },
} as const;

export type CatKey = keyof typeof categories;

export type Post = {
  slug: string;       // URL용 영문 슬러그
  cat: CatKey;        // 카테고리 키
  title: string;      // 제목
  sub: string;        // 한 줄 부제
  date: string;       // 발행 날짜 (YYYY-MM-DD)
  readTime: string;   // 예상 읽기 시간 (예: "8 min")
};

// 더미 글 9개 — 카테고리·날짜 다양하게
export const posts: Post[] = [
  {
    slug: "congen-v03-pipeline",
    cat: "dev",
    title: "Congen v0.3 출시 — 6단계 파이프라인 가다듬기",
    sub: "베타 버전에서 가장 큰 변화는 로컬·클라우드 분리. 무거운 렌더링은 PC에서.",
    date: "2026-05-12",
    readTime: "8 min",
  },
  {
    slug: "youtube-automation-hardest",
    cat: "retro",
    title: "유튜브 영상 자동화에서 가장 어려웠던 한 가지",
    sub: "기술이 아니라 '컨텍스트'였습니다. 프롬프트 너머의 것.",
    date: "2026-05-08",
    readTime: "6 min",
  },
  {
    slug: "selfishclub-learnings",
    cat: "insight",
    title: "셀피시클럽 분석하며 배운 5가지",
    sub: "카탈로그형 페이지의 깔때기 설계 노트. AICONLAB과의 본질적 차이.",
    date: "2026-05-04",
    readTime: "12 min",
  },
  {
    slug: "wiki-30-pages",
    cat: "ops",
    title: "위키 30페이지 돌파 — 이걸로 깨달은 것",
    sub: "정보가 아닌 컨텍스트가 자산이 된다. 토큰 절약 원칙도 함께.",
    date: "2026-04-28",
    readTime: "5 min",
  },
  {
    slug: "tts-comparison",
    cat: "tool",
    title: "ElevenLabs vs Gemini TTS, 직접 비교해봤습니다",
    sub: "Congen에 어떤 TTS를 쓸지 결정하는 기준 — 비용·자연스러움·속도 3축.",
    date: "2026-04-22",
    readTime: "9 min",
  },
  {
    slug: "claude-skills-packaging",
    cat: "dev",
    title: "Claude Code 스킬, 어떻게 패키징할 것인가",
    sub: "ACL Skills 출시 전 고민 정리. 코어 우선 vs 전체 공개의 트레이드오프.",
    date: "2026-04-16",
    readTime: "7 min",
  },
  {
    slug: "tagline-real-lab",
    cat: "brand",
    title: '"진짜의 실험실"이라는 태그라인, 이렇게 정해졌습니다',
    sub: "8번의 폐기 끝에 나온 한 문장. 거절당한 후보 7개도 함께 공개.",
    date: "2026-04-10",
    readTime: "10 min",
  },
  {
    slug: "build-in-public-fear",
    cat: "retro",
    title: "Build in Public, 처음 시작할 때 어려웠던 점",
    sub: "실패까지 공개한다는 게 무서웠던 이유. 그리고 그걸 넘은 순간.",
    date: "2026-04-02",
    readTime: "8 min",
  },
  {
    slug: "audience-9490",
    cat: "insight",
    title: "AICONLAB 시청자 9,490명 — 누가 보고 있나",
    sub: "유튜브 애널리틱스로 본 페르소나 검증. 직장인 60% · 프리랜서 30%.",
    date: "2026-03-28",
    readTime: "11 min",
  },
];

// 헬퍼 — slug로 글 찾기
export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

// 헬퍼 — 현재 글 제외 + 같은 카테고리 우선으로 관련 글 N개 반환
export function getRelatedPosts(currentSlug: string, n = 3): Post[] {
  const current = getPost(currentSlug);
  if (!current) return posts.slice(0, n);
  // 같은 카테고리 우선, 부족하면 다른 글로 채움
  const sameCat = posts.filter(
    (p) => p.slug !== currentSlug && p.cat === current.cat
  );
  const others = posts.filter(
    (p) => p.slug !== currentSlug && p.cat !== current.cat
  );
  return [...sameCat, ...others].slice(0, n);
}
