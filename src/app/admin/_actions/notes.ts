"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "./_auth";

async function actorId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

type NoteInput = {
  slug: string;
  title: string;
  sub?: string;
  body_mdx?: string;
  cat: string;
  read_time?: string;
  render_mode?: "embed" | "newtab";
  content_type?: "html" | "markdown";
  thumbnail_url?: string | null;
};

export async function createNote(input: NoteInput) {
  await requireAdmin();
  const by = await actorId();
  const admin = createAdminClient();
  const { error } = await admin.from("notes").insert({
    slug: input.slug,
    title: input.title,
    sub: input.sub,
    body_mdx: input.body_mdx ?? "",
    cat: input.cat,
    read_time: input.read_time,
    render_mode: input.render_mode,
    content_type: input.content_type,
    thumbnail_url: input.thumbnail_url ?? null,
    author_id: by,
    published_at: null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/notes");
}

export async function updateNote(slug: string, patch: Partial<NoteInput>) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("notes").update(patch).eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/notes");
  revalidatePath(`/notes/${slug}`);
}

export async function publishNote(slug: string, publish: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("notes")
    .update({ published_at: publish ? new Date().toISOString() : null })
    .eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/notes");
  revalidatePath("/notes");
  revalidatePath(`/notes/${slug}`);
}

export async function deleteNote(slug: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("notes").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/notes");
  revalidatePath("/notes");
}
