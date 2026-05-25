// 위키 페이지 뷰.
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MdRender } from "@/components/wiki/md-render";
import { formatDateKr } from "@/lib/format-date";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function WikiViewPage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("wiki_pages")
    .select("id, slug, title, body_mdx, updated_at, updated_by")
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (!page) notFound();

  return (
    <main className="aicon-section" style={{ paddingTop: 56, paddingBottom: 96, background: "var(--bg-canvas)" }}>
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: 18, fontSize: 13, color: "var(--fg-3)" }}>
          <Link href="/llm-wiki" style={{ color: "var(--text-mint)", fontWeight: 700, textDecoration: "none" }}>
            ← 위키 목록
          </Link>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
          <code className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>/{page.slug}</code>
          <div style={{ display: "flex", gap: 8 }}>
            <Link
              href={`/llm-wiki/${page.slug}/history`}
              style={{
                fontSize: 13, color: "var(--fg-2)",
                padding: "6px 12px",
                background: "var(--surface-1)",
                border: "1px solid var(--border-2)",
                borderRadius: 8, textDecoration: "none",
              }}
            >
              수정 이력
            </Link>
            <Link
              href={`/llm-wiki/${page.slug}/edit`}
              style={{
                fontSize: 13, fontWeight: 700,
                color: "var(--ink-900)",
                background: "var(--mint-400)",
                border: "1.5px solid var(--ink-900)",
                boxShadow: "2px 2px 0 var(--ink-900)",
                padding: "6px 12px", borderRadius: 8,
                textDecoration: "none",
              }}
            >
              편집
            </Link>
          </div>
        </div>

        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-1)",
            borderRadius: 14,
            padding: "36px 40px",
            fontSize: 15, lineHeight: 1.75,
          }}
        >
          <MdRender body={`# ${page.title}\n\n${page.body_mdx ?? ""}`} />
        </div>

        <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 14, textAlign: "right" }}>
          마지막 수정: {formatDateKr(page.updated_at)}
        </div>
      </article>
    </main>
  );
}
