// 위키 페이지 수정 이력 (revisions 타임라인).
// 디자인의 admin revisions 화면을 멤버용으로 단순화.
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function WikiHistoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("wiki_pages")
    .select("id, slug, title")
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();
  if (!page) notFound();

  const { data: revs } = await supabase
    .from("wiki_revisions")
    .select("id, title, edited_at, edited_by, note")
    .eq("page_id", page.id)
    .order("edited_at", { ascending: false });

  return (
    <main className="aicon-section" style={{ paddingTop: 56, paddingBottom: 96, background: "var(--bg-canvas)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: 18, fontSize: 13 }}>
          <Link href={`/llm-wiki/${slug}`} style={{ color: "var(--text-mint)", fontWeight: 700, textDecoration: "none" }}>
            ← 페이지로 돌아가기
          </Link>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, marginBottom: 4 }}>{page.title}</h1>
        <div className="mono" style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 24 }}>수정 이력</div>

        {!revs || revs.length === 0 ? (
          <div style={{ padding: 36, textAlign: "center", color: "var(--fg-3)", background: "var(--surface-1)", border: "1px dashed var(--border-2)", borderRadius: 14 }}>
            아직 이력이 없어요. 한 번 더 저장하면 첫 스냅샷이 만들어져요.
          </div>
        ) : (
          <ol style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {revs.map((r, i) => (
              <li
                key={r.id}
                style={{
                  background: "var(--surface-1)",
                  border: "1px solid var(--border-1)",
                  borderRadius: 10,
                  padding: 16,
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {r.title}{" "}
                    {i === 0 && (
                      <span
                        style={{
                          fontSize: 10,
                          background: "var(--mint-soft)",
                          color: "var(--text-mint)",
                          padding: "2px 8px",
                          borderRadius: 999,
                          marginLeft: 6,
                          fontWeight: 700,
                        }}
                      >
                        현재
                      </span>
                    )}
                  </div>
                  {r.note && (
                    <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 4 }}>{r.note}</div>
                  )}
                </div>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", whiteSpace: "nowrap" }}>
                  {new Date(r.edited_at).toLocaleString("ko-KR")}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
