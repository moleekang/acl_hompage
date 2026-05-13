"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function actorId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

type EventStatus = "draft" | "open" | "closed" | "done";

export async function createEvent(input: {
  slug: string;
  title: string;
  body_mdx?: string;
  starts_at: string;
  location?: string;
  capacity?: number;
}) {
  const admin = createAdminClient();
  const { error } = await admin.from("events").insert({
    slug: input.slug,
    title: input.title,
    body_mdx: input.body_mdx ?? "",
    starts_at: input.starts_at,
    location: input.location,
    capacity: input.capacity,
    status: "draft",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
}

export async function updateEventStatus(id: string, status: EventStatus) {
  const admin = createAdminClient();
  const { error } = await admin.from("events").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
}

export async function deleteEvent(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
}

export async function inviteMembers(eventId: string, userIds: string[]) {
  if (userIds.length === 0) return;
  const by = await actorId();
  const admin = createAdminClient();
  const rows = userIds.map((uid) => ({
    event_id: eventId,
    user_id: uid,
    invited_by: by,
    rsvp: "pending" as const,
  }));
  const { error } = await admin
    .from("event_invitations")
    .upsert(rows, { onConflict: "event_id,user_id", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath("/admin/events");
}

export async function removeInvite(eventId: string, userId: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("event_invitations")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath("/admin/events");
}
