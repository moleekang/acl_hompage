// 공유회 상세 — event + invitations + members
import { notFound } from "next/navigation";
import { fetchEventDetail, fetchMembers } from "@/lib/admin/fetchers";
import { PageTopbar } from "../../_components/page-topbar";
import { EventDetailView } from "./_event-detail-view";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EventDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const [{ event, invitations }, members] = await Promise.all([
    fetchEventDetail(id),
    fetchMembers(),
  ]);
  if (!event) notFound();

  return (
    <>
      <PageTopbar title="공유회 상세" crumb={`/admin/events/${event.id}`} sub="메타 · 본문 · 초대" />
      <EventDetailView
        event={{
          id: event.id, slug: event.slug, title: event.title,
          body_mdx: event.body_mdx, starts_at: event.starts_at,
          location: event.location, capacity: event.capacity, status: event.status,
        }}
        invitations={invitations.map((i) => ({ user_id: i.user_id, rsvp: i.rsvp }))}
        members={members}
      />
    </>
  );
}
