"use server";

// 멤버 관리 Server Actions — role/status 변경.
// 호출 권한은 admin layout이 이미 보장. service_role로 mutate.
// role_changed_by는 본인 세션의 user.id로 기록.

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "./_auth";
import { logAdminAction, logActivityEventForCurrentUser } from "@/aicon/log/activity/server";

type Role = "guest" | "member" | "admin";
type Status = "active" | "suspended";

async function actorId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function updateMemberRole(userId: string, role: Role) {
  await requireAdmin();
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
  logAdminAction("member_role_update"); // Aicon Log L3
  if (role === "member" || role === "admin") {
    // Aicon Log L3 — guest → member/admin 승격
    logActivityEventForCurrentUser("profile_role_upgrade", {
      label: role,
      properties: { target_profile_id: userId, new_role: role },
    });
  }
  revalidatePath("/admin/members");
  revalidatePath("/admin");
}

export async function updateMemberStatus(userId: string, status: Status) {
  await requireAdmin();
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
  logAdminAction("member_status_update"); // Aicon Log L3
  revalidatePath("/admin/members");
  revalidatePath("/admin");
}
