import { PageTopbar } from "@/app/admin/_components/page-topbar";
import { ContentManager, type FieldDef } from "@/app/admin/_components/content-manager";
import { fetchSiteTools } from "@/lib/admin/fetchers";

const FIELDS: FieldDef[] = [
  { key: "slug",        label: "Slug (URL 키)", type: "text",     required: true,  placeholder: "claude" },
  { key: "name",        label: "이름",          type: "text",     required: true,  placeholder: "Claude" },
  { key: "category",    label: "카테고리",      type: "text",     required: true,  placeholder: "AI 채팅" },
  { key: "description", label: "설명",          type: "textarea", required: true, hideInList: true },
  { key: "url",         label: "공식 URL",      type: "text",                       placeholder: "https://..." },
  { key: "icon_emoji",  label: "아이콘 이모지", type: "text",                       placeholder: "🧠" },
  { key: "deal",        label: "멤버 할인 표기", type: "text",                       placeholder: "- 또는 20% 할인" },
  { key: "order_idx",   label: "순서",          type: "number" },
];

export default async function ToolsAdminPage() {
  const rows = await fetchSiteTools();
  return (
    <>
      <PageTopbar
        title="추천 도구"
        crumb="컨텐츠"
        sub="/tools 페이지에 노출되는 AI · 자동화 도구"
      />
      <div style={{ padding: 24 }}>
        <ContentManager
          table="site_tools"
          fields={FIELDS}
          rows={rows}
          primaryColumns={["icon_emoji", "name", "category", "deal", "order_idx"]}
        />
      </div>
    </>
  );
}
