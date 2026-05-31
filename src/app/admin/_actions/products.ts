"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "./_auth";
import { nextSlug } from "./_slug";

type ProductStatus = "beta" | "coming" | "live" | "retired";

type ProductInput = {
  name: string;
  pitch: string;
  status: ProductStatus;
  body_mdx?: string;
  release_at?: string;
  order_idx?: number;
  published?: boolean;
  hero_image?: string | null;
};

export async function createProduct(input: ProductInput) {
  await requireAdmin();
  const admin = createAdminClient();
  const slug = await nextSlug("products", "p");
  const { error } = await admin.from("products").insert({
    slug,
    name: input.name,
    pitch: input.pitch,
    status: input.status,
    body_mdx: input.body_mdx ?? "",
    release_at: input.release_at,
    order_idx: input.order_idx ?? 0,
    published: input.published ?? false,
    hero_image: input.hero_image ?? null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function updateProduct(slug: string, patch: Partial<ProductInput>) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("products").update(patch).eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function toggleProductPublish(slug: string, published: boolean) {
  await requireAdmin();
  return updateProduct(slug, { published });
}

export async function deleteProduct(slug: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
