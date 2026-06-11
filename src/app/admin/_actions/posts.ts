"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "./_auth";
import { nextSlug } from "./_slug";
import { logAdminAction } from "@/aicon/log/activity/server";

async function actorId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

type PostInput = {
  title: string;
  sub?: string;
  body_mdx?: string;
  cat: string;
  read_time?: string;
  thumbnail_url?: string | null;
  visibility?: "public" | "member";
};

export async function createPost(input: PostInput) {
  await requireAdmin();
  const by = await actorId();
  const admin = createAdminClient();
  const slug = await nextSlug("posts", input.cat);
  const { error } = await admin.from("posts").insert({
    slug,
    title: input.title,
    sub: input.sub,
    body_mdx: input.body_mdx ?? "",
    cat: input.cat,
    read_time: input.read_time,
    thumbnail_url: input.thumbnail_url ?? null,
    visibility: input.visibility ?? "public",
    author_id: by,
    published_at: null,
  });
  if (error) throw new Error(error.message);
  logAdminAction("post_create"); // Aicon Log L3
  revalidatePath("/admin/posts");
}

export async function updatePost(slug: string, patch: Partial<PostInput>) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("posts").update(patch).eq("slug", slug);
  if (error) throw new Error(error.message);
  logAdminAction("post_update"); // Aicon Log L3
  revalidatePath("/admin/posts");
  revalidatePath(`/log/${slug}`);
}

export async function publishPost(slug: string, publish: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("posts")
    .update({ published_at: publish ? new Date().toISOString() : null })
    .eq("slug", slug);
  if (error) throw new Error(error.message);
  logAdminAction(publish ? "post_publish" : "post_unpublish"); // Aicon Log L3
  revalidatePath("/admin/posts");
  revalidatePath("/log");
  revalidatePath(`/log/${slug}`);
}

export async function deletePost(slug: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("posts").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  logAdminAction("post_delete"); // Aicon Log L3
  revalidatePath("/admin/posts");
  revalidatePath("/log");
}
