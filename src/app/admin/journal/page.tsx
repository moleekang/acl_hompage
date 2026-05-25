import { PageTopbar } from "@/app/admin/_components/page-topbar";
import { ContentManager, type FieldDef } from "@/app/admin/_components/content-manager";
import { fetchJournalEntries } from "@/lib/admin/fetchers";

const FIELDS: FieldDef[] = [
  { key: "entry_date",   label: "날짜",       type: "date",     required: true,  placeholder: "2026-05-25" },
  { key: "day_label",    label: "Day 표기",   type: "text",                       placeholder: "Day 12" },
  { key: "category",     label: "카테고리",   type: "select",   required: true, options: ["사색", "회고", "의문", "결과물", "관찰", "결정", "삽질"] },
  { key: "title",        label: "제목",       type: "text",     required: true },
  { key: "preview",      label: "본문 미리보기", type: "textarea", required: true, hideInList: true },
  { key: "output_label", label: "결과물 라벨", type: "text",                       placeholder: "결과물 → ..." },
  { key: "output_href",  label: "결과물 링크", type: "text",                       placeholder: "/path 또는 https://..." },
  { key: "order_idx",    label: "순서",        type: "number" },
];

export default async function JournalAdminPage() {
  const rows = await fetchJournalEntries();
  return (
    <>
      <PageTopbar
        title="작업 일지"
        crumb="컨텐츠"
        sub="/journal 페이지의 시간순 작업 노트"
      />
      <div style={{ padding: 24 }}>
        <ContentManager
          table="journal_entries"
          fields={FIELDS}
          rows={rows}
          primaryColumns={["entry_date", "category", "title", "order_idx"]}
        />
      </div>
    </>
  );
}
