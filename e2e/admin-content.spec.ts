import { test, expect, type Page } from "@playwright/test";
import { TEST_PREFIX, loginAsAdmin, fillField, autoAcceptDialogs, cleanupByPrefix } from "./helpers";

type TableSpec = {
  table: "testimonials" | "journal_entries" | "site_tools" | "site_resources";
  adminPath: string;
  publicPath: string;
  // 공개 페이지에서 새 항목을 식별할 텍스트 (보통 prefix가 들어간 필드)
  publicMarkerField: string;
  // create 시 채울 필드들 (필수 위주)
  createFields: () => Record<string, string>;
  // 수정 시 변경할 필드 + 새 값
  updateField: string;
  updateValue: string;
  // cleanup 매칭에 쓸 컬럼 (보통 publicMarkerField와 동일)
  cleanupColumn: string;
};

function unique(suffix: string) {
  return `${TEST_PREFIX}-${suffix}-${Math.random().toString(36).slice(2, 8)}`;
}

const SPECS: TableSpec[] = [
  {
    table: "testimonials",
    adminPath: "/admin/testimonials",
    publicPath: "/community",
    publicMarkerField: "name",
    createFields: () => ({
      name: unique("name"),
      role: "QA 자동화",
      body: `${TEST_PREFIX} 자동 생성된 후기입니다. 삭제 대상.`,
      contribution: "E2E 테스트 기여",
      order_idx: "9999",
    }),
    updateField: "role",
    updateValue: "QA 자동화 [수정됨]",
    cleanupColumn: "name",
  },
  {
    table: "journal_entries",
    adminPath: "/admin/journal",
    publicPath: "/journal",
    publicMarkerField: "title",
    createFields: () => ({
      entry_date: new Date().toISOString().slice(0, 10),
      day_label: "Day E2E",
      category: "결과물",
      title: unique("title"),
      preview: `${TEST_PREFIX} 자동 생성된 일지 본문.`,
      order_idx: "9999",
    }),
    updateField: "day_label",
    updateValue: "Day E2E-수정",
    cleanupColumn: "title",
  },
  {
    table: "site_tools",
    adminPath: "/admin/tools",
    publicPath: "/tools",
    publicMarkerField: "name",
    createFields: () => {
      const slug = unique("tool").toLowerCase().replace(/[\[\]\s]/g, "-");
      return {
        slug,
        name: unique("ToolName"),
        category: "E2E 카테고리",
        description: `${TEST_PREFIX} 자동 생성된 도구 설명.`,
        icon_emoji: "🤖",
        deal: "-",
        order_idx: "9999",
      };
    },
    updateField: "category",
    updateValue: "E2E 카테고리 [수정됨]",
    cleanupColumn: "name",
  },
  {
    table: "site_resources",
    adminPath: "/admin/resources",
    publicPath: "/resources",
    publicMarkerField: "name",
    createFields: () => {
      const slug = unique("res").toLowerCase().replace(/[\[\]\s]/g, "-");
      return {
        slug,
        name: unique("ResourceName"),
        type: "체크리스트",
        description: `${TEST_PREFIX} 자동 생성된 자료 설명.`,
        icon_emoji: "📄",
        tier: "free",
        order_idx: "9999",
      };
    },
    updateField: "icon_emoji",
    updateValue: "📌",
    cleanupColumn: "name",
  },
];

async function getRowLocator(page: Page, identifyingText: string) {
  // 새로 만든 행이 테이블에 나타날 때까지 대기 (revalidatePath 이후 SSR refresh)
  const row = page.locator("table.adm-table tbody tr").filter({ hasText: identifyingText }).first();
  await expect(row).toBeVisible({ timeout: 15_000 });
  return row;
}

test.describe("Admin content CRUD + 공개 노출", () => {
  test.beforeEach(async ({ page }) => {
    autoAcceptDialogs(page);
    await loginAsAdmin(page);
  });

  for (const spec of SPECS) {
    test(`${spec.table}: 생성 → 발행 → 공개 노출 → 수정 → 삭제`, async ({ page }) => {
      const fields = spec.createFields();
      const marker = fields[spec.publicMarkerField];

      // 1. admin 페이지로
      await page.goto(spec.adminPath);
      await expect(page.locator("table.adm-table")).toBeVisible();

      // 2. 새 항목 추가
      await page.getByRole("button", { name: "+ 새 항목 추가" }).click();
      for (const [k, v] of Object.entries(fields)) {
        await fillField(page, k, v);
      }
      await page.getByRole("button", { name: "추가" }).click();

      // 3. 생성된 행 확인 (기본 published=false)
      const row = await getRowLocator(page, marker);
      await expect(row.locator(".pill")).toHaveText("비공개");

      // 4. 발행 토글
      await row.locator(".pill").click();
      await expect(row.locator(".pill")).toHaveText("발행됨", { timeout: 10_000 });

      // 5. 공개 페이지에서 노출 확인
      await page.goto(spec.publicPath);
      await expect(page.getByText(marker, { exact: false })).toBeVisible({ timeout: 15_000 });

      // 6. admin 복귀 후 수정
      await page.goto(spec.adminPath);
      const editRow = await getRowLocator(page, marker);
      await editRow.getByRole("button", { name: "수정" }).click();
      await fillField(page, spec.updateField, spec.updateValue);
      await page.getByRole("button", { name: "저장" }).click();

      // 7. 수정값이 행에 반영됐는지 (수정값이 컬럼에 노출되거나, 최소한 다시 행이 보이는지)
      const afterEdit = await getRowLocator(page, marker);
      await expect(afterEdit).toBeVisible();

      // 8. 삭제 (confirm dialog auto-accept)
      await afterEdit.getByRole("button", { name: "삭제" }).click();

      // 9. 행이 사라졌는지
      await expect(
        page.locator("table.adm-table tbody tr").filter({ hasText: marker }),
      ).toHaveCount(0, { timeout: 10_000 });
    });
  }

  test.afterAll(async () => {
    // 안전망: prefix 매칭 모든 행 cleanup (테스트 실패 시 잔여 데이터 제거)
    const results: Array<{ table: string; deleted: number }> = [];
    for (const spec of SPECS) {
      try {
        const deleted = await cleanupByPrefix({
          table: spec.table,
          column: spec.cleanupColumn,
          prefix: TEST_PREFIX,
        });
        results.push({ table: spec.table, deleted });
      } catch (e) {
        results.push({ table: spec.table, deleted: -1 });
        console.warn(`[cleanup] ${spec.table} 실패:`, e);
      }
    }
    console.log("[cleanup] 결과:", results);
  });
});
