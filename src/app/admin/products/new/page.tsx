import { PageTopbar } from "../../_components/page-topbar";
import { ProductForm } from "../_product-form";

export default function NewProductPage() {
  return (
    <>
      <PageTopbar title="새 제품" crumb="/admin/products/new" sub="자동화앱 카드 추가" />
      <ProductForm
        mode="new"
        initial={{ slug: "", name: "", pitch: "", status: "beta", release_at: "", body_mdx: "", order_idx: 99, published: false, hero_image: null }}
      />
    </>
  );
}
