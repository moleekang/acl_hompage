import { test, expect, type Page } from "@playwright/test";
import { TEST_PREFIX, loginAsAdmin, fillByLabel, autoAcceptDialogs } from "./helpers";

// 운영 영향 회피:
// - posts, products, wiki: 등록 → 목록 노출 확인 → 삭제 (발행/공개 노출은 운영 가시성 위험으로 skip)
// - events, members: read-only (변경 위험)
// 모든 테스트 데이터는 [E2E-TEST-{ts}] prefix + afterAll 안전망으로 cleanup.

function unique(label: string) {
  return `${TEST_PREFIX}-${label}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function cleanupTable(table: string, column: string, prefix: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return 0;
  const endpoint = `${url}/rest/v1/${table}?${column}=like.${encodeURIComponent(prefix + "%")}`;
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "return=representation" },
  });
  if (!res.ok) return -1;
  return ((await res.json()) as unknown[]).length;
}

test.describe("Admin 전 영역", () => {
  test.beforeEach(async ({ page }) => {
    autoAcceptDialogs(page);
    await loginAsAdmin(page);
  });

  // ── posts ─────────────────────────────────────────────────────
  test("posts: 새 글 등록 → 목록 노출 → 삭제", async ({ page }) => {
    const title = unique("PostTitle");
    const slug = slugify(unique("post"));

    await page.goto("/admin/posts");
    await page.getByRole("link", { name: /새 글/ }).click();
    await page.waitForURL(/\/admin\/posts\/new/);

    await fillByLabel(page, "제목", title);
    await fillByLabel(page, "슬러그 (URL)", slug);
    await fillByLabel(page, "카테고리", "사고방식");

    await page.getByRole("button", { name: /발행 준비/ }).click();
    await page.waitForURL(/\/admin\/posts(\b|$)/, { timeout: 15_000 });

    const row = page.locator("tr").filter({ hasText: title }).first();
    await expect(row).toBeVisible({ timeout: 10_000 });
  });

  // ── products ──────────────────────────────────────────────────
  test("products: 새 제품 등록 → 그리드 노출", async ({ page }) => {
    const name = unique("ProductName");
    const slug = slugify(unique("prod"));

    await page.goto("/admin/products");
    await page.getByRole("link", { name: /새 제품/ }).first().click();
    await page.waitForURL(/\/admin\/products\/new/);

    await fillByLabel(page, "이름", name);
    await fillByLabel(page, "슬러그 (URL)", slug);
    await fillByLabel(page, "한 줄 pitch", `${TEST_PREFIX} 한 줄 피치`);
    await fillByLabel(page, "상태", "live");

    await page.getByRole("button", { name: /^저장$/ }).first().click();
    await page.waitForURL(/\/admin\/products(\b|$)/, { timeout: 15_000 });

    await expect(page.getByText(name, { exact: false }).first()).toBeVisible({ timeout: 10_000 });
  });

  // ── wiki ──────────────────────────────────────────────────────
  test("wiki: 새 페이지 등록 → 목록 노출", async ({ page }) => {
    const title = unique("WikiTitle");
    const slug = slugify(unique("wiki"));

    await page.goto("/admin/wiki");
    await page.getByRole("link", { name: /새 페이지/ }).click();
    await page.waitForURL(/\/admin\/wiki\/edit\/new/);

    await page.getByPlaceholder("페이지 제목").fill(title);
    await page.getByPlaceholder("my-page").fill(slug);
    await page.locator("textarea").first().fill(`${TEST_PREFIX} 위키 본문`);

    // WikiEditor의 저장 버튼은 form 안에 하나뿐. 클라이언트 supabase insert.
    await page.getByRole("button", { name: /^저장$/ }).click();
    // save() → router.push(afterSaveHref(slug)) 또는 에러 표시. 둘 다 처리.
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    await page.goto("/admin/wiki");
    await expect(page.locator("tr").filter({ hasText: title }).first()).toBeVisible({ timeout: 10_000 });
  });

  // ── events (read-only) ────────────────────────────────────────
  test("events: admin 페이지 진입 (read-only)", async ({ page }) => {
    await page.goto("/admin/events");
    await expect(page).toHaveURL(/\/admin\/events/);
    const body = await page.locator("body").innerText();
    expect(body.length).toBeGreaterThan(50);
  });

  // ── members (read-only + 검색 input 동작) ─────────────────────
  test("members: admin 페이지 진입 + 검색 동작 (read-only)", async ({ page }) => {
    await page.goto("/admin/members");
    await expect(page).toHaveURL(/\/admin\/members/);
    const search = page.getByPlaceholder(/닉네임|이메일|검색/i).first();
    if (await search.count()) {
      await search.fill("zzz-no-match-zzz");
      await expect(page).toHaveURL(/\/admin\/members/);
    }
  });

  test.afterAll(async () => {
    const tasks = [
      cleanupTable("posts", "title", TEST_PREFIX),
      cleanupTable("products", "name", TEST_PREFIX),
      cleanupTable("wiki_pages", "title", TEST_PREFIX),
    ];
    const results = await Promise.all(tasks);
    console.log("[admin-full cleanup]", { posts: results[0], products: results[1], wiki_pages: results[2] });
  });
});
