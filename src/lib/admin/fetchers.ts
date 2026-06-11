// Admin 페이지의 데이터 fetch 헬퍼.
// 모든 함수가 service_role admin client 사용 — RLS 우회.
// admin layout이 role=admin guard 통과한 후에만 호출.

import { createAdminClient } from "@/lib/supabase/server";
import type { Role } from "./types";

// ---- Members ----
export type MemberRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "suspended";
  joinedAt: string;
  lastLogin: string;
  bio?: string;
  history: Array<{ at: string; from: Role | null; to: Role; by: string; reason?: string }>;
};

export async function fetchMembers(): Promise<MemberRow[]> {
  const admin = createAdminClient();

  const [profilesRes, usersRes] = await Promise.all([
    admin.from("profiles").select("*").order("created_at", { ascending: false }),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const profiles = profilesRes.data ?? [];
  const users = usersRes.data?.users ?? [];

  return profiles.map((p) => {
    const u = users.find((x) => x.id === p.id);
    const role: Role = (p.status === "suspended" ? "suspended" : (p.role as Role));
    return {
      id: p.id,
      name: p.nickname ?? u?.email?.split("@")[0] ?? "—",
      email: u?.email ?? "",
      role,
      status: p.status,
      joinedAt: (p.created_at ?? "").slice(0, 10),
      lastLogin: (u?.last_sign_in_at ?? "").slice(0, 16).replace("T", " "),
      bio: undefined,
      history: [],
    };
  });
}

// ---- Dashboard counts ----
export async function fetchDashboardCounts() {
  const admin = createAdminClient();

  const [signups, queue, wikiActive, wikiToday, nextEvent, recentEditors] = await Promise.all([
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString()),
    admin.from("profiles").select("*").eq("role", "guest").eq("status", "active").order("created_at", { ascending: false }).limit(3),
    admin.from("wiki_pages").select("id", { count: "exact", head: true }).is("deleted_at", null),
    admin
      .from("wiki_pages")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .gte("updated_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    admin
      .from("events")
      .select("*")
      .in("status", ["open", "draft"])
      .order("starts_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    admin
      .from("wiki_pages")
      .select("updated_by")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  return {
    signupsCount: signups.count ?? 0,
    waitingQueue: queue.data ?? [],
    wikiActiveCount: wikiActive.count ?? 0,
    wikiTodayCount: wikiToday.count ?? 0,
    nextEvent: nextEvent.data ?? null,
    recentEditorIds: Array.from(
      new Set((recentEditors.data ?? []).map((r) => r.updated_by).filter(Boolean)),
    ).slice(0, 3) as string[],
  };
}

// ---- Wiki ----
export async function fetchWikiPages() {
  const admin = createAdminClient();
  const { data: pages } = await admin
    .from("wiki_pages")
    .select("id, slug, title, updated_at, updated_by, deleted_at")
    .order("updated_at", { ascending: false });

  if (!pages || pages.length === 0) return { rows: [], revsByPage: {} };

  const ids = pages.map((p) => p.id);
  const { data: revs } = await admin
    .from("wiki_revisions")
    .select("page_id")
    .in("page_id", ids);

  const counts: Record<string, number> = {};
  (revs ?? []).forEach((r) => {
    counts[r.page_id] = (counts[r.page_id] ?? 0) + 1;
  });

  return { rows: pages, revsByPage: counts };
}

export async function fetchWikiRevisions(pageId: string) {
  const admin = createAdminClient();
  const [page, revs] = await Promise.all([
    admin.from("wiki_pages").select("id, slug, title").eq("id", pageId).maybeSingle(),
    admin.from("wiki_revisions").select("id, edited_at, edited_by, note, title").eq("page_id", pageId).order("edited_at", { ascending: false }),
  ]);
  return { page: page.data, revisions: revs.data ?? [] };
}

// ---- Events ----
export async function fetchEvents() {
  const admin = createAdminClient();
  const { data: events } = await admin.from("events").select("*").order("starts_at", { ascending: true });
  if (!events) return [];

  const ids = events.map((e) => e.id);
  const { data: invs } = await admin
    .from("event_invitations")
    .select("event_id, rsvp")
    .in("event_id", ids);

  const agg: Record<string, { invited: number; going: number; declined: number; pending: number }> = {};
  for (const e of events) agg[e.id] = { invited: 0, going: 0, declined: 0, pending: 0 };
  for (const i of invs ?? []) {
    const a = agg[i.event_id];
    if (!a) continue;
    a.invited += 1;
    if (i.rsvp === "going") a.going += 1;
    else if (i.rsvp === "declined") a.declined += 1;
    else a.pending += 1;
  }

  return events.map((e) => ({ ...e, ...agg[e.id] }));
}

export async function fetchEventDetail(eventId: string) {
  const admin = createAdminClient();
  const [ev, invs] = await Promise.all([
    admin.from("events").select("*").eq("id", eventId).maybeSingle(),
    admin.from("event_invitations").select("user_id, rsvp, invited_at").eq("event_id", eventId),
  ]);
  return { event: ev.data, invitations: invs.data ?? [] };
}

// ---- Posts ----
export async function fetchPosts() {
  const admin = createAdminClient();
  const { data } = await admin.from("posts").select("*").order("published_at", { ascending: false, nullsFirst: false });
  return data ?? [];
}

// ---- Notes ----
export async function fetchNotesAdmin() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("notes")
    .select("slug,title,sub,cat,read_time,published_at,render_mode,content_type,visibility,author_id,author:profiles(id,nickname,avatar_url)")
    .order("published_at", { ascending: false, nullsFirst: false });
  return data ?? [];
}

// ---- Products ----
export async function fetchProducts() {
  const admin = createAdminClient();
  const { data } = await admin.from("products").select("*").order("order_idx", { ascending: true });
  return data ?? [];
}

// ---- Content tables (0009) ----
export async function fetchTestimonials() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("testimonials")
    .select("*")
    .order("order_idx", { ascending: true });
  return data ?? [];
}

export async function fetchJournalEntries() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("journal_entries")
    .select("*")
    .order("entry_date", { ascending: false })
    .order("order_idx", { ascending: true });
  return data ?? [];
}

export async function fetchSiteTools() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("site_tools")
    .select("*")
    .order("order_idx", { ascending: true });
  return data ?? [];
}

export async function fetchSiteResources() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("site_resources")
    .select("*")
    .order("order_idx", { ascending: true });
  return data ?? [];
}
