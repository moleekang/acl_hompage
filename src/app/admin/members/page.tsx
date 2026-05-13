// 멤버 관리 — Supabase에서 profiles + auth.users.email 합쳐 fetch.
import { fetchMembers } from "@/lib/admin/fetchers";
import { PageTopbar } from "../_components/page-topbar";
import { MembersTable } from "./_members-table";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await fetchMembers();
  return (
    <>
      <PageTopbar
        title="멤버 관리"
        crumb="/admin/members"
        sub="guest · member · admin · suspended"
      />
      <MembersTable members={members} />
    </>
  );
}
