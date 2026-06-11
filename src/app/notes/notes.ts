// /notes 카테고리 메타데이터 + DB → UI 어댑터.
// 데이터(글 목록)는 Supabase notes 테이블에서 조회한다 — 이 모듈은 표현 토큰만 보관.
//
// 멤버 전용 글(visibility='member'): RLS가 비멤버 anon 조회를 차단하므로,
// 목록에 잠금 카드를 보여주기 위해 service-role 클라이언트로 조회하되
// 비멤버에게는 body_mdx를 서버에서 비우고 locked=true로 표시한다.

import { createAdminClient } from "@/lib/supabase/server";
import { getViewerMembership } from "@/lib/membership";

// 카테고리 정의 — 인사이트 주제 (유튜브/AI/도메인)
export const categories = {
  youtube: {
    label: "유튜브",
    color: "var(--text-hot)",
    glow: "rgba(255,107,71,0.14)",
  },
  ai: {
    label: "AI",
    color: "var(--text-electric)",
    glow: "rgba(90,124,255,0.16)",
  },
  domain: {
    label: "도메인",
    color: "var(--text-mint)",
    glow: "rgba(77,224,166,0.18)",
  },
} as const;

export type CatKey = keyof typeof categories;

// 렌더 위치 — embed: 상세 페이지 iframe, newtab: 새 탭 전체 렌더
export type RenderMode = "embed" | "newtab";
// 본문 포맷 — html: 그대로 렌더, markdown: 서버에서 HTML 변환 후 렌더
export type ContentType = "html" | "markdown";

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
  renderMode: RenderMode;
  contentType: ContentType;
  thumbnailUrl: string | null;
  locked: boolean;  // 멤버 전용 글인데 뷰어가 비멤버 — 본문은 비워져 있음
};

// DB cat 문자열을 알려진 CatKey로 폴백 (모르는 값이면 'ai'로).
function normalizeCat(value: string | null | undefined): CatKey {
  if (value && value in categories) return value as CatKey;
  return "ai";
}

// DB render_mode 문자열 정규화 — 모르는 값이면 'embed' 폴백.
function normalizeRenderMode(value: string | null | undefined): RenderMode {
  if (value === "embed" || value === "newtab") return value;
  return "embed";
}

// DB content_type 문자열 정규화 — 모르는 값이면 'html' 폴백.
function normalizeContentType(value: string | null | undefined): ContentType {
  if (value === "html" || value === "markdown") return value;
  return "html";
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
  render_mode: string | null;
  content_type: string | null;
  thumbnail_url: string | null;
  visibility: string | null;
};

// locked면 본문을 서버에서 비워서 클라이언트로 내려보내지 않는다.
function toNote(row: RawNoteRow, isMember: boolean): Note {
  const locked = row.visibility === "member" && !isMember;
  return {
    slug: row.slug,
    cat: normalizeCat(row.cat),
    title: row.title,
    sub: row.sub ?? "",
    body_mdx: locked ? "" : row.body_mdx ?? "",
    date: (row.published_at ?? "").slice(0, 10),
    readTime: row.read_time ?? "",
    author: extractAuthor(row.author),
    renderMode: normalizeRenderMode(row.render_mode),
    contentType: normalizeContentType(row.content_type),
    thumbnailUrl: row.thumbnail_url ?? null,
    locked,
  };
}

const NOTE_COLS = "slug,title,sub,body_mdx,cat,read_time,published_at,render_mode,content_type,thumbnail_url,visibility,author:profiles(id,nickname,avatar_url)";

// 발행된 글 전체 — 최신순.
export async function fetchNotes(limit?: number): Promise<Note[]> {
  const supabase = createAdminClient();
  const { isMember } = await getViewerMembership();
  let query = supabase
    .from("notes")
    .select(NOTE_COLS)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as RawNoteRow[]).map((row) => toNote(row, isMember));
}

// 단일 글 by slug.
export async function fetchNote(slug: string): Promise<Note | null> {
  const supabase = createAdminClient();
  const { isMember } = await getViewerMembership();
  const { data, error } = await supabase
    .from("notes")
    .select(NOTE_COLS)
    .eq("slug", slug)
    .not("published_at", "is", null)
    .maybeSingle();
  if (error || !data) return null;
  return toNote(data as RawNoteRow, isMember);
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
