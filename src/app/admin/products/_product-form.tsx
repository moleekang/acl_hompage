"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { createProduct, updateProduct } from "../_actions/products";

type Mode = "new" | "edit";
type ProductStatus = "beta" | "coming" | "live" | "retired";

type Initial = {
  slug: string;
  name: string;
  pitch: string;
  status: ProductStatus;
  release_at: string | null;
  body_mdx: string | null;
  order_idx: number;
  published: boolean;
};

export function ProductForm({ mode, initial }: { mode: Mode; initial: Initial }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [slug, setSlug] = useState(initial.slug);
  const [name, setName] = useState(initial.name);
  const [pitch, setPitch] = useState(initial.pitch);
  const [status, setStatus] = useState<ProductStatus>(initial.status);
  const [releaseAt, setReleaseAt] = useState(initial.release_at ?? "");
  const [body, setBody] = useState(initial.body_mdx ?? "");
  const [orderIdx, setOrderIdx] = useState(initial.order_idx);
  const [published, setPublished] = useState(initial.published);

  function save() {
    start(async () => {
      try {
        if (mode === "new") {
          await createProduct({ slug, name, pitch, status, release_at: releaseAt, body_mdx: body, order_idx: orderIdx, published });
        } else {
          await updateProduct(initial.slug, { name, pitch, status, release_at: releaseAt, body_mdx: body, order_idx: orderIdx, published });
        }
        router.push("/admin/products");
      } catch (e) {
        alert("실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  return (
    <div className="stack" style={{ gap: 18, opacity: busy ? 0.7 : 1 }}>
      <div className="row" style={{ gap: 10 }}>
        <Link href="/admin/products" className="btn btn-secondary btn-sm"><Icon name="chevron-left" size={14} /> 제품 목록</Link>
        <div className="grow" />
        <button type="button" className="btn btn-primary" onClick={save} disabled={busy || !name || !slug}>
          {busy ? "저장 중..." : "저장"}
        </button>
      </div>

      <div className="card elevated">
        <div className="grid-2" style={{ gap: 14 }}>
          <div>
            <label className="field-label">이름</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} style={{ fontWeight: 700 }} />
          </div>
          <div>
            <label className="field-label">슬러그 (URL)</label>
            <input
              className="input mono"
              value={slug}
              onChange={(e) => mode === "new" && setSlug(e.target.value.replace(/[^a-z0-9-]/gi, "-").toLowerCase())}
              disabled={mode === "edit"}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label className="field-label">한 줄 pitch</label>
            <input className="input" value={pitch} onChange={(e) => setPitch(e.target.value)} />
          </div>
          <div>
            <label className="field-label">상태</label>
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)}>
              <option value="beta">베타</option>
              <option value="coming">예정</option>
              <option value="live">운영 중</option>
              <option value="retired">종료</option>
            </select>
          </div>
          <div>
            <label className="field-label">출시 일정 (자유 표기)</label>
            <input className="input" value={releaseAt} onChange={(e) => setReleaseAt(e.target.value)} placeholder="2026 Q3 예정" />
          </div>
          <div>
            <label className="field-label">진열 순서</label>
            <input className="input mono" type="number" value={orderIdx} onChange={(e) => setOrderIdx(Number(e.target.value))} />
          </div>
          <div>
            <label className="field-label">발행</label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "10px 0" }}>
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              {published ? "공개 중" : "비공개"}
            </label>
          </div>
        </div>
      </div>

      <div>
        <div className="micro" style={{ marginBottom: 8 }}>본문 (MDX)</div>
        <textarea className="input textarea mdx" value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
    </div>
  );
}
