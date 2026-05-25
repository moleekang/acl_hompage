import { PageTopbar } from "@/app/admin/_components/page-topbar";
import { ContentManager, type FieldDef } from "@/app/admin/_components/content-manager";
import { fetchTestimonials } from "@/lib/admin/fetchers";

const FIELDS: FieldDef[] = [
  { key: "name",         label: "이름",     type: "text",     required: true,  placeholder: "김OO" },
  { key: "role",         label: "역할",     type: "text",                       placeholder: "1인 콘텐츠 크리에이터" },
  { key: "body",         label: "후기 본문", type: "textarea", required: true, hideInList: true },
  { key: "contribution", label: "기여",     type: "text",                       placeholder: "베타 테스터 + 사용 후기" },
  { key: "order_idx",    label: "순서(작을수록 위)", type: "number" },
];

export default async function TestimonialsAdminPage() {
  const rows = await fetchTestimonials();
  return (
    <>
      <PageTopbar
        title="시청자 후기"
        crumb="컨텐츠"
        sub="/community 페이지에 노출되는 후기 — published만 공개"
      />
      <div style={{ padding: 24 }}>
        <ContentManager
          table="testimonials"
          fields={FIELDS}
          rows={rows}
          primaryColumns={["name", "role", "contribution", "order_idx"]}
        />
      </div>
    </>
  );
}
