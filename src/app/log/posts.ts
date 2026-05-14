// /log 카테고리 메타데이터 + DB → UI 어댑터.
// 데이터(글 목록)는 Supabase posts 테이블에서 조회한다 — 이 모듈은 표현 토큰만 보관.

import { createClient } from "@/lib/supabase/server";

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

// UI가 소비하는 Post 형태 — DB row를 이 모양으로 정규화.
export type Post = {
  slug: string;
  cat: CatKey;
  title: string;
  sub: string;
  body_mdx: string;
  date: string;     // YYYY-MM-DD
  readTime: string;
};

// DB cat 문자열을 알려진 CatKey로 폴백 (모르는 값이면 'dev'로).
function normalizeCat(value: string | null | undefined): CatKey {
  if (value && value in categories) return value as CatKey;
  return "dev";
}

type PostRow = {
  slug: string;
  title: string;
  sub: string | null;
  body_mdx: string | null;
  cat: string;
  read_time: string | null;
  published_at: string | null;
};

function toPost(row: PostRow): Post {
  return {
    slug: row.slug,
    cat: normalizeCat(row.cat),
    title: row.title,
    sub: row.sub ?? "",
    body_mdx: row.body_mdx ?? "",
    date: (row.published_at ?? "").slice(0, 10),
    readTime: row.read_time ?? "",
  };
}

const POST_COLS = "slug,title,sub,body_mdx,cat,read_time,published_at";

// 발행된 글 전체 — 최신순.
export async function fetchPosts(limit?: number): Promise<Post[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select(POST_COLS)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as PostRow[]).map(toPost);
}

// 단일 글 by slug.
export async function fetchPost(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLS)
    .eq("slug", slug)
    .not("published_at", "is", null)
    .maybeSingle();
  if (error || !data) return null;
  return toPost(data as PostRow);
}

// 관련 글: 같은 카테고리 우선, 부족하면 다른 카테고리로 채움.
export async function fetchRelatedPosts(
  currentSlug: string,
  n = 3,
): Promise<Post[]> {
  const all = await fetchPosts();
  const current = all.find((p) => p.slug === currentSlug);
  if (!current) return all.slice(0, n);
  const sameCat = all.filter(
    (p) => p.slug !== currentSlug && p.cat === current.cat,
  );
  const others = all.filter(
    (p) => p.slug !== currentSlug && p.cat !== current.cat,
  );
  return [...sameCat, ...others].slice(0, n);
}
