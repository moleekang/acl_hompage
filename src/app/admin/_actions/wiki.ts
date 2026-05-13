"use server";

// 위키 페이지 관리 Server Actions.
// snapshot 트리거가 wiki_revisions를 자동 INSERT하므로 본문/제목 변경만 신경 쓰면 됨.

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function actorId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function softDeleteWikiPage(id: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("wiki_pages")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/wiki");
}

export async function restoreWikiPage(id: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("wiki_pages")
    .update({ deleted_at: null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/wiki");
}

export async function purgeWikiPage(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("wiki_pages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/wiki");
}

export async function restoreWikiRevision(pageId: string, revisionId: string) {
  const admin = createAdminClient();
  const { data: rev, error: revErr } = await admin
    .from("wiki_revisions")
    .select("title, body_mdx")
    .eq("id", revisionId)
    .maybeSingle();
  if (revErr || !rev) throw new Error(revErr?.message ?? "revision not found");

  const by = await actorId();
  const { error: updErr } = await admin
    .from("wiki_pages")
    .update({ title: rev.title, body_mdx: rev.body_mdx, updated_by: by })
    .eq("id", pageId);
  if (updErr) throw new Error(updErr.message);

  revalidatePath(`/admin/wiki/${pageId}/revisions`);
  revalidatePath("/admin/wiki");
  revalidatePath("/llm-wiki");
}
