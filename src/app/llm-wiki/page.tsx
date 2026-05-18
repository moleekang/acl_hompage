// 위키 페이지 목록.
// DB가 비어있는 초기에도 mock으로 대체하지 않고 빈 상태 화면을 보여준다 (현실 동작 확인).
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateKrShort } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export default async function WikiIndexPage() {
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("wiki_pages")
    .select("slug, title, updated_at, updated_by")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  return (
    <main className="aicon-section" style={{ paddingTop: 64, paddingBottom: 96, background: "var(--bg-canvas)" }}>
      <div className="aicon-container" style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
          <div>
            <div className="eyebrow" style={{ fontSize: 12, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              WIKI · 멤버 협업 공간
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 44, color: "var(--paper-ink)", marginTop: 4 }}>
              우리의 위키
            </h1>
          </div>
          <Link
            href="/llm-wiki/new/edit"
            style={{
              background: "var(--mint-400)", color: "var(--ink-900)",
              padding: "10px 16px", borderRadius: 8,
              border: "1.5px solid var(--ink-900)",
              boxShadow: "2px 2px 0 var(--ink-900)",
              fontWeight: 700, textDecoration: "none",
            }}
          >
            + 새 페이지
          </Link>
        </div>

        {!pages || pages.length === 0 ? (
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
              아직 위키 페이지가 없어요
            </div>
            <p style={{ fontSize: 14 }}>위에서 첫 페이지를 만들어 시작해 보세요.</p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {pages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/llm-wiki/${p.slug}`}
                  style={{
                    display: "flex", alignItems: "baseline", gap: 12,
                    padding: "16px 18px",
                    background: "var(--surface-1)",
                    border: "1px solid var(--border-1)",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 16 }}>{p.title}</span>
                  <code
                    className="mono"
                    style={{ fontSize: 11, color: "var(--fg-3)", background: "var(--surface-2)", padding: "2px 6px", borderRadius: 4 }}
                  >
                    /{p.slug}
                  </code>
                  <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>
                    {formatDateKrShort(p.updated_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
