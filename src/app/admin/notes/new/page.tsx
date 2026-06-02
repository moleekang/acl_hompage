import { PageTopbar } from "../../_components/page-topbar";
import { NoteForm } from "../_note-form";

export default function NewNotePage() {
  return (
    <>
      <PageTopbar title="새 글 작성" crumb="/admin/notes/new" sub="MDX 작성" />
      <NoteForm
        mode="new"
        initial={{ slug: "", title: "", sub: "", cat: "ai", read_time: "5분", body_mdx: "" }}
      />
    </>
  );
}
