// /notes 카테고리 메타데이터 + DB → UI 어댑터.
// 데이터(글 목록)는 Supabase notes 테이블에서 조회한다 — 이 모듈은 표현 토큰만 보관.

import { createClient } from "@/lib/supabase/server";

// 카테고리 정의 — 개인 인사이트 톤 (사색/도구/운영/기록)
export const categories = {
  thought: {
    label: "사색",
    color: "var(--text-electric)",
    glow: "rgba(90,124,255,0.16)",
  },
  tool: {
    label: "도구",
    color: "var(--text-mint)",
    glow: "rgba(77,224,166,0.18)",
  },
  ops: {
    label: "운영",
    color: "var(--text-hot)",
    glow: "rgba(255,107,71,0.14)",
  },
  record: {
    label: "기록",
    color: "var(--text-sun)",
    glow: "rgba(255,210,63,0.22)",
  },
} as const;

export type CatKey = keyof typeof categories;

// 작성자 정보 (profiles join)
export type NoteAuthor = {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
};

// UI가 소비하는 Note 형태 — DB row를 이 모양으로 정규화.
export type Note = {
  slug: string;
  cat: CatKey;
  title: string;
  sub: string;
  body_mdx: string;
  date: string;     // YYYY-MM-DD
  readTime: string;
  author: NoteAuthor | null;
};

// DB cat 문자열을 알려진 CatKey로 폴백 (모르는 값이면 'record'로).
function normalizeCat(value: string | null | undefined): CatKey {
  if (value && value in categories) return value as CatKey;
  return "record";
}

type AuthorShape = { id: string; nickname: string | null; avatar_url: string | null };

// Supabase join은 항상 배열로 반환 — 첫 번째 요소를 추출하는 헬퍼.
function extractAuthor(raw: unknown): AuthorShape | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return (raw[0] as AuthorShape) ?? null;
  return raw as AuthorShape;
}

type RawNoteRow = {
  slug: string;
  title: string;
  sub: string | null;
  body_mdx: string | null;
  cat: string;
  read_time: string | null;
  published_at: string | null;
  author: unknown;
};

function toNote(row: RawNoteRow): Note {
  return {
    slug: row.slug,
    cat: normalizeCat(row.cat),
    title: row.title,
    sub: row.sub ?? "",
    body_mdx: row.body_mdx ?? "",
    date: (row.published_at ?? "").slice(0, 10),
    readTime: row.read_time ?? "",
    author: extractAuthor(row.author),
  };
}

const NOTE_COLS = "slug,title,sub,body_mdx,cat,read_time,published_at,author:profiles(id,nickname,avatar_url)";

// 발행된 글 전체 — 최신순.
export async function fetchNotes(limit?: number): Promise<Note[]> {
  const supabase = await createClient();
  let query = supabase
    .from("notes")
    .select(NOTE_COLS)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as RawNoteRow[]).map(toNote);
}

// 단일 글 by slug.
export async function fetchNote(slug: string): Promise<Note | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select(NOTE_COLS)
    .eq("slug", slug)
    .not("published_at", "is", null)
    .maybeSingle();
  if (error || !data) return null;
  return toNote(data as RawNoteRow);
}

// 관련 글: 같은 카테고리 우선, 부족하면 다른 카테고리로 채움.
export async function fetchRelatedNotes(
  currentSlug: string,
  n = 3,
): Promise<Note[]> {
  const all = await fetchNotes();
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
