import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { PageTopbar } from "../../_components/page-topbar";
import { ProductForm } from "../_product-form";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type ProductStatus = "beta" | "coming" | "live" | "retired";

export default async function EditProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data: p } = await admin.from("products").select("*").eq("slug", slug).maybeSingle();
  if (!p) notFound();
  return (
    <>
      <PageTopbar title="제품 편집" crumb={`/admin/products/${slug}`} sub="진열 · 상태 · pitch" />
      <ProductForm
        mode="edit"
        initial={{
          slug: p.slug, name: p.name, pitch: p.pitch,
          status: p.status as ProductStatus,
          release_at: p.release_at, body_mdx: p.body_mdx,
          order_idx: p.order_idx, published: p.published,
          hero_image: p.hero_image ?? null,
        }}
      />
    </>
  );
}
