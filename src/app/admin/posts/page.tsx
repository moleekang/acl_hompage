// 블로그 관리 — posts + members(author name) fetch
import { fetchPosts, fetchMembers } from "@/lib/admin/fetchers";
import { PageTopbar } from "../_components/page-topbar";
import { PostsTable, type PostRow } from "./_posts-table";

export const dynamic = "force-dynamic";

export default async function PostsAdminPage() {
  const [posts, members] = await Promise.all([fetchPosts(), fetchMembers()]);
  const rows: PostRow[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    sub: p.sub,
    cat: p.cat,
    read_time: p.read_time,
    published_at: p.published_at,
    author_id: p.author_id,
    visibility: p.visibility,
  }));
  return (
    <>
      <PageTopbar title="블로그" crumb="/admin/posts" sub="MDX · 임시저장 · 발행" />
      <PostsTable posts={rows} members={members} />
    </>
  );
}
