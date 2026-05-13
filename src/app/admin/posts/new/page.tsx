import { PageTopbar } from "../../_components/page-topbar";
import { PostForm } from "../_post-form";

export default function NewPostPage() {
  return (
    <>
      <PageTopbar title="새 글 작성" crumb="/admin/posts/new" sub="MDX 작성" />
      <PostForm
        mode="new"
        initial={{ slug: "", title: "", sub: "", cat: "사고방식", read_time: "5분", body_mdx: "" }}
      />
    </>
  );
}
