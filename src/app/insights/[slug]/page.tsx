// 공유회 상세 + 본인 RSVP.
// 본인이 초대 안 된 이벤트는 RLS에서 자연스럽게 거부 → notFound.
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MdRender } from "@/components/wiki/md-render";
import { RsvpButtons } from "./_rsvp-buttons";
import { logActivityEvent } from "@/aicon/log/activity/server";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

const STATUS_LABEL: Record<string, string> = {
  draft: "초안", open: "모집 중", closed: "마감", done: "완료",
};

export default async function InsightDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: ev } = await supabase
    .from("events")
    .select("id, slug, title, body_mdx, starts_at, ends_at, location, capacity, status")
    .eq("slug", slug)
    .maybeSingle();
  if (!ev) notFound();

  const { data: userResult } = await supabase.auth.getUser();
  const userId = userResult.user?.id;

  // Aicon Log L2 — 공유회 상세 열람 (fire-and-forget)
  logActivityEvent("event_page_view", {
    userId: userResult.user?.email ?? undefined,
    pagePath: `/insights/${slug}`,
    label: slug,
  });

  let myRsvp: "going" | "declined" | "pending" | null = null;
  if (userId) {
    const { data: inv } = await supabase
      .from("event_invitations")
      .select("rsvp")
      .eq("event_id", ev.id)
      .eq("user_id", userId)
      .maybeSingle();
    myRsvp = (inv?.rsvp as "going" | "declined" | "pending" | null) ?? null;

    // viewed_at 기록 (best-effort, 실패 무시)
    if (inv) {
      await supabase
        .from("event_invitations")
        .update({ viewed_at: new Date().toISOString() })
        .eq("event_id", ev.id)
        .eq("user_id", userId);
    }
  }

  return (
    <main className="aicon-section" style={{ paddingTop: 56, paddingBottom: 96, background: "var(--bg-canvas)" }}>
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: 18, fontSize: 13 }}>
          <Link href="/insights" style={{ color: "var(--text-mint)", fontWeight: 700, textDecoration: "none" }}>
            ← 공유회 목록
          </Link>
        </div>

        <span
          style={{
            display: "inline-block",
            fontSize: 11,
            background: ev.status === "open" ? "var(--mint-soft, #E7FBF1)" : "var(--surface-2)",
            color: ev.status === "open" ? "var(--text-mint)" : "var(--fg-3)",
            padding: "3px 10px",
            borderRadius: 999,
            fontWeight: 700,
            letterSpacing: "0.04em",
            marginBottom: 12,
          }}
        >
          ● {STATUS_LABEL[ev.status] ?? ev.status}
        </span>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, lineHeight: 1.15, marginBottom: 14 }}>
          {ev.title}
        </h1>

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 28, fontSize: 14, color: "var(--fg-2)" }}>
          <div>
            <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginBottom: 2 }}>일시</div>
            <div>{new Date(ev.starts_at).toLocaleString("ko-KR")}</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginBottom: 2 }}>위치</div>
            <div>{ev.location ?? "—"}</div>
          </div>
          {ev.capacity && (
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginBottom: 2 }}>정원</div>
              <div>{ev.capacity}명</div>
            </div>
          )}
        </div>

        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-1)",
            borderRadius: 14,
            padding: "32px 36px",
            marginBottom: 24,
            fontSize: 15, lineHeight: 1.75,
          }}
        >
          <MdRender body={ev.body_mdx ?? ""} />
        </div>

        {userId && myRsvp !== null && ev.status === "open" && (
          <RsvpButtons eventId={ev.id} initial={myRsvp} />
        )}
      </article>
    </main>
  );
}
