// 인사이트 관리 — notes + author fetch
import { fetchNotesAdmin } from "@/lib/admin/fetchers";
import { PageTopbar } from "../_components/page-topbar";
import { NotesTable, type NoteRow } from "./_notes-table";

export const dynamic = "force-dynamic";

// Supabase join은 배열로 반환 — 첫 번째 요소 추출
function extractAuthor(raw: unknown): NoteRow["author"] {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    const a = raw[0];
    if (!a) return null;
    return { id: a.id, nickname: a.nickname ?? null, avatar_url: a.avatar_url ?? null };
  }
  const a = raw as { id: string; nickname?: string | null; avatar_url?: string | null };
  return { id: a.id, nickname: a.nickname ?? null, avatar_url: a.avatar_url ?? null };
}

export default async function NotesAdminPage() {
  const notes = await fetchNotesAdmin();
  const rows: NoteRow[] = notes.map((n) => ({
    slug: n.slug,
    title: n.title,
    sub: n.sub,
    cat: n.cat,
    read_time: n.read_time,
    published_at: n.published_at,
    author_id: n.author_id,
    author: extractAuthor(n.author),
    visibility: n.visibility,
  }));
  return (
    <>
      <PageTopbar title="인사이트" crumb="/admin/notes" sub="MDX · 임시저장 · 발행" />
      <NotesTable notes={rows} />
    </>
  );
}
