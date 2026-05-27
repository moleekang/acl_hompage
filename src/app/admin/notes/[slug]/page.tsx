import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { PageTopbar } from "../../_components/page-topbar";
import { NoteForm } from "../_note-form";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function EditNotePage({ params }: { params: Params }) {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data: n } = await admin.from("notes").select("*").eq("slug", slug).maybeSingle();
  if (!n) notFound();
  return (
    <>
      <PageTopbar title="글 편집" crumb={`/admin/notes/${slug}`} sub="MDX 편집" />
      <NoteForm
        mode="edit"
        initial={{
          slug: n.slug, title: n.title, sub: n.sub,
          cat: n.cat, read_time: n.read_time, body_mdx: n.body_mdx,
          published_at: n.published_at,
        }}
      />
    </>
  );
}
