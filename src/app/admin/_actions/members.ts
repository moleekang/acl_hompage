"use server";

// 멤버 관리 Server Actions — role/status 변경.
// 호출 권한은 admin layout이 이미 보장. service_role로 mutate.
// role_changed_by는 본인 세션의 user.id로 기록.

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

type Role = "guest" | "member" | "admin";
type Status = "active" | "suspended";

async function actorId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function updateMemberRole(userId: string, role: Role) {
  const by = await actorId();
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({
      role,
      role_changed_at: new Date().toISOString(),
      role_changed_by: by,
    })
    .eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/members");
  revalidatePath("/admin");
}

export async function updateMemberStatus(userId: string, status: Status) {
  const by = await actorId();
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({
      status,
      role_changed_at: new Date().toISOString(),
      role_changed_by: by,
    })
    .eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/members");
  revalidatePath("/admin");
}
