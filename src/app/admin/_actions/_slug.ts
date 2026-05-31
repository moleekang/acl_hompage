import { createAdminClient } from "@/lib/supabase/server";

/**
 * 카테고리 prefix 기준으로 다음 슬러그를 자동 생성한다.
 * 예: nextSlug("notes", "thought") → 기존 thought-1..thought-11 이 있으면 "thought-12"
 *
 * 같은 prefix 의 기존 슬러그 중 가장 큰 번호 + 1 을 쓴다.
 * 삭제로 생긴 빈 번호는 재사용하지 않는다(과거 URL 충돌 방지).
 */
export async function nextSlug(
  table: "posts" | "notes" | "products",
  prefix: string,
): Promise<string> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from(table)
    .select("slug")
    .like("slug", `${prefix}-%`);
  if (error) throw new Error(error.message);

  // prefix 는 우리가 통제하는 영문 고정값이라 정규식 escape 불필요
  const re = new RegExp(`^${prefix}-(\\d+)$`);
  let max = 0;
  for (const row of data ?? []) {
    const m = re.exec((row as { slug: string }).slug);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
  }
  return `${prefix}-${max + 1}`;
}
