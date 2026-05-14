// scripts/seed-products.mjs — service-role로 products 3건 시드.
// 추가 메타(desc/tags/price/cta)는 컬럼 부족으로 body_mdx에 JSON으로 담는다.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing env");
  process.exit(1);
}
const s = createClient(url, key);

// status: page status → DB status. "soon" → "coming"
const rows = [
  {
    slug: "congen",
    name: "Congen",
    pitch: '"프롬프트로 유튜브 영상을 끝까지 만드는 AI 자동화 런처"',
    status: "beta",
    body_mdx: JSON.stringify({
      ui_status: "beta",
      desc: "Fal.ai(이미지) + Gemini(대본) + FFmpeg(영상)를 6단계 파이프라인으로 묶은 데스크톱 런처. Electron UI · 로컬 서버 · 클라우드 서버 하이브리드 아키텍처로, 무거운 렌더링은 내 PC에서 핵심 로직은 클라우드에서.",
      tags: ["영상 자동화", "Desktop App", "Electron", "FFmpeg"],
      price: "오픈 베타 · 무료 배포 예정",
      cta: { label: "유튜브에서 보기", href: "https://www.youtube.com/@A-ConLab-b1m" },
      thumb: "play",
    }),
    release_at: "오픈 베타",
    order_idx: 1,
    published: true,
  },
  {
    slug: "congen-cloud",
    name: "(가칭) Congen Cloud",
    pitch: '"내 PC 없이도 브라우저에서 돌아가는 SaaS 버전"',
    status: "coming",
    body_mdx: JSON.stringify({
      ui_status: "soon",
      desc: "데스크톱 런처를 클라우드로 옮긴 SaaS 버전. 설치 없이 브라우저에서 영상 파이프라인을 돌릴 수 있는 형태로 준비 중입니다. 가격 정책·출시 시점은 위키에 라이브로 공유 예정.",
      tags: ["SaaS", "Web App", "Coming"],
      price: "2026 Q3 · 출시 예정",
    }),
    release_at: "2026 Q3",
    order_idx: 2,
    published: true,
  },
  {
    slug: "acl-claude-skills",
    name: "ACL Claude Skills",
    pitch: '"Claude Code에 바로 꽂는 AICONLAB 스킬 팩"',
    status: "coming",
    body_mdx: JSON.stringify({
      ui_status: "soon",
      desc: "자동화 워크플로우·콘텐츠 파이프라인·위키 운영 노하우를 Claude Code 스킬(.md) 형태로 패키징. 코어 그룹에 먼저 공개 후 점진적 오픈 예정.",
      tags: ["Claude Skill", "Workflow"],
      price: "코어 우선 · 출시 미정",
    }),
    release_at: "미정",
    order_idx: 3,
    published: true,
  },
];

// 기존 행 비우고 새로 삽입
const del = await s.from("products").delete().neq("slug", "");
if (del.error) {
  console.error("delete failed:", del.error.message);
  process.exit(1);
}
const ins = await s.from("products").insert(rows);
if (ins.error) {
  console.error("insert failed:", ins.error.message);
  process.exit(1);
}
const r = await s
  .from("products")
  .select("slug,name,status,published,order_idx")
  .order("order_idx");
console.log("products now:", r.data?.length ?? 0, "rows");
r.data?.forEach((p) => console.log(" ", p.order_idx, p.slug, p.status, p.published ? "" : "(unpublished)"));
