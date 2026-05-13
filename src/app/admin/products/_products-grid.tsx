"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { RowMenu } from "@/components/admin/row-menu";
import { Status, type StatusKind } from "@/components/admin/badges";
import { toggleProductPublish, deleteProduct } from "../_actions/products";

const STATUS_LABEL: Record<string, string> = {
  live: "운영 중", beta: "베타", coming: "예정", retired: "종료",
};

export type ProductRow = {
  slug: string;
  name: string;
  pitch: string;
  status: string;
  release_at: string | null;
  published: boolean;
  order_idx: number;
};

// 그라데이션 hero — slug 해시로 결정성 색.
const PALETTES: Array<[string, string]> = [
  ["#FFD23F", "#FF8E72"],
  ["#4DE0A6", "#5A7CFF"],
  ["#EAE5D6", "#FFD23F"],
  ["#9CEBC8", "#0A7A4F"],
  ["#FCE6DF", "#C13E1F"],
];
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function ProductsGrid({ products }: { products: ProductRow[] }) {
  const [pending, start] = useTransition();

  function run(action: () => Promise<void>) {
    start(async () => {
      try { await action(); }
      catch (e) { alert("실패: " + (e instanceof Error ? e.message : String(e))); }
    });
  }

  return (
    <div className="stack" style={{ gap: 18, opacity: pending ? 0.7 : 1 }}>
      <div className="row" style={{ gap: 12 }}>
        <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>
          drag-to-reorder는 후속 작업
        </span>
        <div className="grow" />
        <Link href="/admin/products/new" className="btn btn-primary"><Icon name="plus" size={14} /> 새 제품</Link>
      </div>

      <div className="grid-3">
        {products.map((p) => {
          const palette = PALETTES[hash(p.slug) % PALETTES.length];
          return (
            <div key={p.slug} className="card elevated" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{
                position: "relative", height: 160,
                background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`,
                borderBottom: "1px solid var(--border-1)",
              }}>
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <Status kind={p.status as StatusKind} label={STATUS_LABEL[p.status] ?? p.status} />
                </div>
                <div style={{
                  position: "absolute", bottom: 14, left: 16,
                  fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700,
                  color: "var(--ink-900)",
                }}>{p.name}</div>
              </div>
              <div style={{ padding: 16 }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginBottom: 6 }}>/{p.slug}</div>
                <p style={{ fontSize: 14, color: "var(--fg-2)", minHeight: 42 }}>{p.pitch}</p>
                <div className="divider" style={{ margin: "12px 0" }} />
                <div className="between">
                  <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{p.release_at ?? "—"}</span>
                  <div className="row" style={{ gap: 4 }}>
                    <Link href={`/admin/products/${p.slug}`} className="btn btn-ghost btn-sm">
                      <Icon name="edit" size={14} /> 편집
                    </Link>
                    <RowMenu
                      items={[
                        { id: "pub", label: p.published ? "비공개로 전환" : "발행" },
                        { divider: true },
                        { id: "del", label: "삭제", danger: true },
                      ]}
                      onSelect={(id) => {
                        if (id === "pub") run(() => toggleProductPublish(p.slug, !p.published));
                        else if (id === "del") {
                          if (confirm(`"${p.name}"을(를) 삭제할까요?`)) run(() => deleteProduct(p.slug));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <Link href="/admin/products/new" style={{
          background: "transparent", cursor: "pointer",
          border: "1.5px dashed var(--border-2)",
          borderRadius: "var(--r-card)",
          padding: 28, minHeight: 280,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
          color: "var(--fg-3)", fontFamily: "var(--font-body)",
          textDecoration: "none",
        }}>
          <Icon name="plus" size={28} />
          <div className="hand" style={{ fontSize: 20, color: "var(--fg-2)" }}>여기에 새 제품을 추가</div>
          <div className="mono" style={{ fontSize: 11 }}>슬러그 · 이름 · pitch · status</div>
        </Link>
      </div>
    </div>
  );
}
