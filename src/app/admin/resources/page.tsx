import { PageTopbar } from "@/app/admin/_components/page-topbar";
import { ContentManager, type FieldDef } from "@/app/admin/_components/content-manager";
import { fetchSiteResources } from "@/lib/admin/fetchers";

const FIELDS: FieldDef[] = [
  { key: "slug",             label: "Slug (URL 키)", type: "text",     required: true,  placeholder: "checklist-automation" },
  { key: "name",             label: "이름",          type: "text",     required: true,  placeholder: "1인 기업 자동화 체크리스트" },
  { key: "type",             label: "타입",          type: "select",   required: true, options: ["체크리스트", "템플릿", "프로그램", "가이드"] },
  { key: "description",      label: "설명",          type: "textarea", required: true, hideInList: true },
  { key: "icon_emoji",       label: "아이콘 이모지", type: "text",                       placeholder: "📄" },
  { key: "tier",             label: "공개 등급",     type: "select",   required: true, options: ["free", "members"] },
  { key: "file_url",         label: "일반 파일 URL", type: "text",                       placeholder: "https://..." },
  { key: "download_url_mac", label: "macOS 다운로드 URL", type: "text",                  placeholder: "https://..." },
  { key: "download_url_win", label: "Windows 다운로드 URL", type: "text",                placeholder: "https://..." },
  { key: "order_idx",        label: "순서",          type: "number" },
];

export default async function ResourcesAdminPage() {
  const rows = await fetchSiteResources();
  return (
    <>
      <PageTopbar
        title="자료 / 다운로드"
        crumb="컨텐츠"
        sub="/resources 페이지의 작은 자료 그리드 (ConGen 플래그십은 별도 하드코딩)"
      />
      <div style={{ padding: 24 }}>
        <ContentManager
          table="site_resources"
          fields={FIELDS}
          rows={rows}
          primaryColumns={["icon_emoji", "name", "type", "tier", "order_idx"]}
        />
      </div>
    </>
  );
}
