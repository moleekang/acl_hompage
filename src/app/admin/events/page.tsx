// 공유회 관리 — events + invitations 집계 후 client 테이블.
import { fetchEvents } from "@/lib/admin/fetchers";
import { PageTopbar } from "../_components/page-topbar";
import { EventsTable, type EventTableRow } from "./_events-table";

export const dynamic = "force-dynamic";

export default async function EventsAdminPage() {
  const events = await fetchEvents();
  const rows: EventTableRow[] = events.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    starts_at: e.starts_at,
    location: e.location,
    capacity: e.capacity,
    status: e.status,
    invited: e.invited,
    going: e.going,
    declined: e.declined,
    pending: e.pending,
  }));
  return (
    <>
      <PageTopbar title="공유회 관리" crumb="/admin/events" sub="초대 · RSVP · 발행" />
      <EventsTable rows={rows} />
    </>
  );
}
