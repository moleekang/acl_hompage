// 위키 revisions — DB에서 fetch + 복원 액션
import { notFound } from "next/navigation";
import { fetchWikiRevisions, fetchMembers } from "@/lib/admin/fetchers";
import { PageTopbar } from "../../../_components/page-topbar";
import { RevisionsView, type RevisionItem } from "./_revisions-view";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function RevisionsPage({ params }: { params: Params }) {
  const { id } = await params;
  const [{ page, revisions }, members] = await Promise.all([
    fetchWikiRevisions(id),
    fetchMembers(),
  ]);
  if (!page) notFound();

  const nameById = new Map(members.map((m) => [m.id, m.name]));
  const data: RevisionItem[] = revisions.map((r) => ({
    id: r.id,
    title: r.title,
    edited_at: r.edited_at,
    edited_by: r.edited_by,
    note: r.note,
    editorName: r.edited_by ? nameById.get(r.edited_by) ?? "—" : "—",
  }));

  return (
    <>
      <PageTopbar title="수정 이력" crumb={`/admin/wiki/${page.id}/revisions`} sub="버전 비교 · 복원" />
      <RevisionsView pageId={page.id} pageTitle={page.title} pageSlug={page.slug} revisions={data} />
    </>
  );
}
