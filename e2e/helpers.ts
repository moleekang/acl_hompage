import { type Page, expect } from "@playwright/test";

// 운영 DB 보호용 prefix — 모든 테스트 레코드를 이 prefix로 식별해 cleanup.
export const TEST_PREFIX = `[E2E-TEST-${Date.now()}]`;

/** 로그인 페이지로 가서 admin 약식 로그인 (`@aiconlab.local` 자동 부착) 후 /admin 진입. */
export async function loginAsAdmin(page: Page) {
  // ?next=/admin이면 이메일 탭이 default라 input이 바로 노출됨.
  await page.goto("/login?next=/admin");
  await page.getByPlaceholder(/이메일 또는 ID/).fill("admin");
  await page.getByPlaceholder("비밀번호").first().fill("qkddlehd1234");
  await page.getByRole("button", { name: "이메일 로그인" }).click();
  // pathname이 /admin*로 바뀌어야 진짜 로그인 성공. /login?next=/admin은 제외.
  await page.waitForURL((u) => u.pathname.startsWith("/admin"), { timeout: 15_000 }).catch(async () => {
    const errText = await page.locator("body").innerText();
    throw new Error(`로그인 후 admin으로 진입 실패. 현재 URL: ${page.url()}\n페이지 일부: ${errText.slice(0, 300)}`);
  });
}

/** form 필드(name 속성)에 값 입력 — input/textarea/select만 매치 (페이지 meta 태그 제외). */
export async function fillField(page: Page, name: string, value: string) {
  const locator = page.locator(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`).first();
  const tag = await locator.evaluate((el) => el.tagName.toLowerCase());
  if (tag === "select") {
    await locator.selectOption(value);
  } else {
    await locator.fill(value);
  }
}

/** confirm() 다이얼로그 자동 수락 — 삭제 버튼 같은 곳에서 사용. */
export function autoAcceptDialogs(page: Page) {
  page.on("dialog", (d) => d.accept().catch(() => {}));
}

/** Service role로 prefix 매칭 행 모두 삭제 — afterAll 안전망. */
export async function cleanupByPrefix(opts: {
  table: "testimonials" | "journal_entries" | "site_tools" | "site_resources";
  column: string;
  prefix: string;
}): Promise<number> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env not loaded for cleanup");

  const endpoint = `${url}/rest/v1/${opts.table}?${opts.column}=like.${encodeURIComponent(opts.prefix + "%")}`;
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Cleanup failed (${res.status}): ${t}`);
  }
  const json = (await res.json()) as unknown[];
  return json.length;
}
