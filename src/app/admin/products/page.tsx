// 자동화앱 관리 — products fetch
import { fetchProducts } from "@/lib/admin/fetchers";
import { PageTopbar } from "../_components/page-topbar";
import { ProductsGrid, type ProductRow } from "./_products-grid";

export const dynamic = "force-dynamic";

export default async function ProductsAdminPage() {
  const products = await fetchProducts();
  const rows: ProductRow[] = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    pitch: p.pitch,
    status: p.status,
    release_at: p.release_at,
    published: p.published,
    order_idx: p.order_idx,
  }));
  return (
    <>
      <PageTopbar title="자동화앱" crumb="/admin/products" sub="진열 · 상태 · 출시 일정" />
      <ProductsGrid products={rows} />
    </>
  );
}
