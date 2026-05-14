// scripts/seed-wiki-pages.mjs — service-role로 wiki_pages 6건 시드.
// profiles가 비어있어 created_by/updated_by는 NULL로 둔다.
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const s = createClient(url, key);

const rows = [
  {
    id: "11111111-0000-0000-0000-000000000001",
    slug: "identity",
    title: "AICONLAB 정체성 정의",
    body_mdx:
      "> AI로 1인 기업을 만들어가는 라이브 다큐멘터리.\n\n## 5대 핵심 가치\n\n1. **기여 우선** — \"1을 주고, N을 받는다.\"\n2. **솔직한 공유** — 실패담까지 공개한다.\n3. **상호 존중** — 권위적 톤 절대 금지.\n4. **실행력** — 결과로 증명한다.\n5. **시간 자유** — 시간을 돌려준다.\n",
    created_at: "2026-03-01T13:22:00Z",
    updated_at: "2026-05-12T22:30:00Z",
    deleted_at: null,
  },
  {
    id: "22222222-0000-0000-0000-000000000002",
    slug: "solo-automation",
    title: "1인 기업 자동화 사고방식",
    body_mdx:
      "## 정체성 → 결과물 → 자동화\n\n이 순서를 절대 바꾸지 않는다. 도구가 먼저 오면 도구에 끌려가고, 결과물이 먼저 오면 노이즈만 만든다.",
    created_at: "2026-04-15T10:00:00Z",
    updated_at: "2026-05-11T14:08:00Z",
    deleted_at: null,
  },
  {
    id: "33333333-0000-0000-0000-000000000003",
    slug: "n8n-catalog",
    title: "n8n 워크플로우 카탈로그",
    body_mdx:
      "## 정착된 워크플로우 3개\n\n- 메모 → 영상 스크립트 (자동)\n- 매주 logs/ 초안 (cron)\n- 댓글 응대 보조 (반자동)",
    created_at: "2026-04-20T09:00:00Z",
    updated_at: "2026-05-10T09:55:00Z",
    deleted_at: null,
  },
  {
    id: "44444444-0000-0000-0000-000000000004",
    slug: "persona-v2",
    title: "시청자 페르소나 v2",
    body_mdx:
      "## 3 세그먼트\n\n- 입문자 직장인 50%\n- 콘텐츠 시도 경험자 30%\n- 1인 사업가 20%",
    created_at: "2026-04-25T18:00:00Z",
    updated_at: "2026-05-08T18:43:00Z",
    deleted_at: null,
  },
  {
    id: "55555555-0000-0000-0000-000000000005",
    slug: "logs-standard",
    title: "logs/ 작성 표준 (W·W·H·N)",
    body_mdx:
      "## 매주 한 편. 4섹션 고정.\n\n- **What** — 이번 주에 한 것\n- **Why** — 왜\n- **How** — 어떻게\n- **Next** — 다음 주 계획 (구체적인 하나만)",
    created_at: "2026-04-01T12:00:00Z",
    updated_at: "2026-04-28T11:02:00Z",
    deleted_at: null,
  },
  {
    id: "66666666-0000-0000-0000-000000000006",
    slug: "pricing-v1",
    title: "구버전 가격표 v1",
    body_mdx: "구버전. 현재는 폐기.",
    created_at: "2026-02-01T10:00:00Z",
    updated_at: "2026-03-04T16:21:00Z",
    deleted_at: "2026-04-10T12:00:00Z",
  },
];

const { error } = await s.from("wiki_pages").upsert(rows, { onConflict: "id" });
if (error) {
  console.error("seed failed:", error.message);
  process.exit(1);
}
const r = await s
  .from("wiki_pages")
  .select("slug,title,deleted_at")
  .order("updated_at", { ascending: false });
console.log("wiki_pages now:", r.data?.length ?? 0, "rows");
r.data?.forEach((p) => console.log(" ", p.slug, p.deleted_at ? "(deleted)" : ""));
