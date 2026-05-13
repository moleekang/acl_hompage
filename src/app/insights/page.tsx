// 공유회 — 본인이 초대받은 이벤트만 노출.
// events의 RLS가 event_invitations 존재 여부로 필터하므로 그냥 select 하면 자연스럽게 본인 거만 나옴.
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  draft: "초안", open: "모집 중", closed: "마감", done: "완료",
};

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("slug, title, starts_at, location, status")
    .order("starts_at", { ascending: true });

  return (
    <main className="aicon-section" style={{ paddingTop: 64, paddingBottom: 96, background: "var(--bg-canvas)" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 20px" }}>
        <div className="eyebrow" style={{ fontSize: 12, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          INSIGHTS · 멤버 공유회
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 44, color: "var(--paper-ink)", marginTop: 4, marginBottom: 24 }}>
          초대받은 공유회
        </h1>

        {!events || events.length === 0 ? (
          <div
            style={{
              background: "var(--surface-1)",
              border: "1px dashed var(--border-2)",
              borderRadius: 14,
              padding: 48,
              textAlign: "center",
              color: "var(--fg-3)",
            }}
          >
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--fg-2)", marginBottom: 8 }}>
              아직 초대된 공유회가 없어요
            </div>
            <p style={{ fontSize: 14 }}>
              새 공유회는 운영자가 초대를 보낼 때 여기에 나타나요.
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {events.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/insights/${e.slug}`}
                  style={{
                    display: "block",
                    background: "var(--surface-1)",
                    border: "1px solid var(--border-1)",
                    borderRadius: 14,
                    padding: 20,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: 11,
                        background: e.status === "open" ? "var(--mint-soft, #E7FBF1)" : "var(--surface-2)",
                        color: e.status === "open" ? "var(--text-mint)" : "var(--fg-3)",
                        padding: "3px 9px",
                        borderRadius: 999,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      ● {STATUS_LABEL[e.status] ?? e.status}
                    </span>
                    <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>
                      {new Date(e.starts_at).toLocaleString("ko-KR")}
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                    {e.title}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--fg-2)" }}>{e.location}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
