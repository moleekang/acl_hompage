// 위키 운영 — wiki_pages + revisions 카운트 + editor 닉네임 join 후 client 테이블에 전달.
import { fetchWikiPages, fetchMembers } from "@/lib/admin/fetchers";
import { PageTopbar } from "../_components/page-topbar";
import { WikiTable, type WikiTableRow } from "./_wiki-table";

export const dynamic = "force-dynamic";

export default async function WikiAdminPage() {
  const [{ rows, revsByPage }, members] = await Promise.all([fetchWikiPages(), fetchMembers()]);
  const nameById = new Map(members.map((m) => [m.id, m.name]));

  const data: WikiTableRow[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    updated_at: r.updated_at,
    updated_by: r.updated_by,
    deleted_at: r.deleted_at,
    revs: revsByPage[r.id] ?? 0,
    editorName: r.updated_by ? nameById.get(r.updated_by) ?? "—" : "—",
  }));

  return (
    <>
      <PageTopbar title="위키 운영" crumb="/admin/wiki" sub="활성 페이지와 휴지통" />
      <WikiTable rows={data} />
    </>
  );
}
