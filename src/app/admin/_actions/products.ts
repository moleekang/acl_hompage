"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

type ProductStatus = "beta" | "coming" | "live" | "retired";

type ProductInput = {
  slug: string;
  name: string;
  pitch: string;
  status: ProductStatus;
  body_mdx?: string;
  release_at?: string;
  order_idx?: number;
  published?: boolean;
};

export async function createProduct(input: ProductInput) {
  const admin = createAdminClient();
  const { error } = await admin.from("products").insert({
    slug: input.slug,
    name: input.name,
    pitch: input.pitch,
    status: input.status,
    body_mdx: input.body_mdx ?? "",
    release_at: input.release_at,
    order_idx: input.order_idx ?? 0,
    published: input.published ?? false,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function updateProduct(slug: string, patch: Partial<ProductInput>) {
  const admin = createAdminClient();
  const { error } = await admin.from("products").update(patch).eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function toggleProductPublish(slug: string, published: boolean) {
  return updateProduct(slug, { published });
}

export async function deleteProduct(slug: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
