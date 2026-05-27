// /notes/[slug]/raw — 인사이트 본문을 완성 HTML 페이지로 반환하는 Route Handler.
// newtab 모드에서 새 탭에 통째로 렌더될 때 사용.
// markdown이면 typography wrapper 적용, html이면 그대로 반환.

import { NextResponse } from "next/server";
import { fetchNote } from "../../notes";
import { renderNoteBody } from "@/lib/notes/render";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const note = await fetchNote(slug);

  if (!note) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const html = renderNoteBody(note.body_mdx, note.contentType);

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
