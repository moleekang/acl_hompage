import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { PageTopbar } from "../../_components/page-topbar";
import { PostForm } from "../_post-form";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function EditPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data: p } = await admin.from("posts").select("*").eq("slug", slug).maybeSingle();
  if (!p) notFound();
  return (
    <>
      <PageTopbar title="글 편집" crumb={`/admin/posts/${slug}`} sub="MDX 편집" />
      <PostForm
        mode="edit"
        initial={{
          slug: p.slug, title: p.title, sub: p.sub,
          cat: p.cat, read_time: p.read_time, body_mdx: p.body_mdx,
        }}
      />
    </>
  );
}
