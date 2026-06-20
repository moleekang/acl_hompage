// 인사이트(/notes) 외부 등록 API.
// admin 웹 UI(_actions/notes.ts createNote) 없이 Bearer 토큰만으로 글을 등록한다.
// 인증은 세션이 아니라 NOTES_API_KEY 정적 토큰 — 외부 자동화/스킬에서 호출.
// service-role로 insert 하므로(RLS 우회) 토큰 검증을 반드시 먼저 통과해야 한다.

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { nextSlug } from "@/app/admin/_actions/_slug";

// 슬러그 prefix가 되는 카테고리 — notes.ts categories와 동기 유지.
const CATEGORIES = new Set(["youtube", "ai", "domain"]);
const RENDER_MODES = new Set(["embed", "newtab"]);
const CONTENT_TYPES = new Set(["html", "markdown"]);
const VISIBILITIES = new Set(["public", "member"]);

type NotePayload = {
  title?: unknown;
  cat?: unknown;
  sub?: unknown;
  body_mdx?: unknown;
  read_time?: unknown;
  render_mode?: unknown;
  content_type?: unknown;
  thumbnail_url?: unknown;
  visibility?: unknown;
  publish?: unknown;
};

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  // 1) Bearer 토큰 인증
  const key = process.env.NOTES_API_KEY;
  if (!key) return bad("NOTES_API_KEY not configured", 500);
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token || token !== key) return bad("Unauthorized", 401);

  // 2) 본문 파싱 + 검증
  const body = (await request.json().catch(() => null)) as NotePayload | null;
  if (!body || typeof body !== "object") return bad("invalid JSON body");

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return bad("title is required");

  const cat = typeof body.cat === "string" ? body.cat.trim() : "";
  if (!CATEGORIES.has(cat)) {
    return bad(`cat must be one of: ${[...CATEGORIES].join(", ")}`);
  }

  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  const render_mode = str(body.render_mode);
  if (render_mode && !RENDER_MODES.has(render_mode)) {
    return bad(`render_mode must be one of: ${[...RENDER_MODES].join(", ")}`);
  }
  const content_type = str(body.content_type);
  if (content_type && !CONTENT_TYPES.has(content_type)) {
    return bad(`content_type must be one of: ${[...CONTENT_TYPES].join(", ")}`);
  }
  const visibility = str(body.visibility);
  if (visibility && !VISIBILITIES.has(visibility)) {
    return bad(`visibility must be one of: ${[...VISIBILITIES].join(", ")}`);
  }

  const publish = body.publish === true;

  // 3) insert (slug 자동 생성, service-role)
  const admin = createAdminClient();
  const slug = await nextSlug("notes", cat);
  const authorId = process.env.NOTES_API_AUTHOR_ID || null;

  const { error } = await admin.from("notes").insert({
    slug,
    title,
    sub: str(body.sub),
    body_mdx: str(body.body_mdx) ?? "",
    cat,
    read_time: str(body.read_time),
    render_mode,
    content_type,
    thumbnail_url: str(body.thumbnail_url) ?? null,
    visibility: visibility ?? "public",
    author_id: authorId,
    published_at: publish ? new Date().toISOString() : null,
  });
  if (error) return bad(error.message, 500);

  // 4) 캐시 무효화 (발행 시 공개 목록까지)
  revalidatePath("/admin/notes");
  if (publish) {
    revalidatePath("/notes");
    revalidatePath(`/notes/${slug}`);
  }

  return NextResponse.json(
    { ok: true, slug, published: publish, url: `/notes/${slug}` },
    { status: 201 },
  );
}
