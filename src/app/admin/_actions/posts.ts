"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function actorId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

type PostInput = {
  slug: string;
  title: string;
  sub?: string;
  body_mdx?: string;
  cat: string;
  read_time?: string;
};

export async function createPost(input: PostInput) {
  const by = await actorId();
  const admin = createAdminClient();
  const { error } = await admin.from("posts").insert({
    slug: input.slug,
    title: input.title,
    sub: input.sub,
    body_mdx: input.body_mdx ?? "",
    cat: input.cat,
    read_time: input.read_time,
    author_id: by,
    published_at: null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/posts");
}

export async function updatePost(slug: string, patch: Partial<PostInput>) {
  const admin = createAdminClient();
  const { error } = await admin.from("posts").update(patch).eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/posts");
  revalidatePath(`/log/${slug}`);
}

export async function publishPost(slug: string, publish: boolean) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("posts")
    .update({ published_at: publish ? new Date().toISOString() : null })
    .eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/posts");
  revalidatePath("/log");
  revalidatePath(`/log/${slug}`);
}

export async function deletePost(slug: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("posts").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/posts");
  revalidatePath("/log");
}
