"use server";

// 0009로 만든 단순 컨텐츠 테이블(테이블 4종)을 위한 제네릭 admin actions.
// 모든 테이블이 동일 패턴(published, order_idx, id PK)이라 하나의 코드로 처리.

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "./_auth";

export type ContentTable =
  | "testimonials"
  | "journal_entries"
  | "site_tools"
  | "site_resources";

// 각 테이블 변경 시 invalidate 해야 하는 경로 목록.
const REVALIDATE_PATHS: Record<ContentTable, string[]> = {
  testimonials: ["/community", "/admin/testimonials"],
  journal_entries: ["/journal", "/admin/journal"],
  site_tools: ["/tools", "/admin/tools"],
  site_resources: ["/resources", "/admin/resources"],
};

function revalidate(table: ContentTable) {
  for (const p of REVALIDATE_PATHS[table]) revalidatePath(p);
}

export async function createContentRow(
  table: ContentTable,
  row: Record<string, unknown>,
) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from(table).insert(row);
  if (error) throw new Error(error.message);
  revalidate(table);
}

export async function updateContentRow(
  table: ContentTable,
  id: string,
  patch: Record<string, unknown>,
) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from(table).update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidate(table);
}

export async function togglePublishContent(
  table: ContentTable,
  id: string,
  publish: boolean,
) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from(table)
    .update({ published: publish })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidate(table);
}

export async function deleteContentRow(table: ContentTable, id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidate(table);
}
