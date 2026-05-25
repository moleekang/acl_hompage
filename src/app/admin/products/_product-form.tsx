"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { createProduct, updateProduct } from "../_actions/products";
import { uploadProductImage } from "../_actions/uploads";

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
  hero_image: string | null;
};

function parseMeta(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch {
    // ignore
  }
  return {};
}

export function ProductForm({ mode, initial }: { mode: Mode; initial: Initial }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [uploading, startUpload] = useTransition();
  const [slug, setSlug] = useState(initial.slug);
  const [name, setName] = useState(initial.name);
  const [pitch, setPitch] = useState(initial.pitch);
  const [status, setStatus] = useState<ProductStatus>(initial.status);
  const [releaseAt, setReleaseAt] = useState(initial.release_at ?? "");
  const [orderIdx, setOrderIdx] = useState(initial.order_idx);
  const [published, setPublished] = useState(initial.published);
  const [heroImage, setHeroImage] = useState<string | null>(initial.hero_image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse body_mdx JSON into per-field state
  const initialMeta = parseMeta(initial.body_mdx);
  const [desc, setDesc] = useState<string>(
    typeof initialMeta.desc === "string" ? initialMeta.desc : ""
  );
  const [tagsInput, setTagsInput] = useState<string>(
    Array.isArray(initialMeta.tags) ? (initialMeta.tags as string[]).join(", ") : ""
  );
  const [price, setPrice] = useState<string>(
    typeof initialMeta.price === "string" ? initialMeta.price : ""
  );
  const [ctaLabel, setCtaLabel] = useState<string>(
    initialMeta.cta && typeof (initialMeta.cta as Record<string, unknown>).label === "string"
      ? (initialMeta.cta as Record<string, unknown>).label as string
      : ""
  );
  const [ctaHref, setCtaHref] = useState<string>(
    initialMeta.cta && typeof (initialMeta.cta as Record<string, unknown>).href === "string"
      ? (initialMeta.cta as Record<string, unknown>).href as string
      : ""
  );
  const [thumb, setThumb] = useState<string>(
    typeof initialMeta.thumb === "string" ? initialMeta.thumb : ""
  );

  function buildBodyMdx(): string {
    const meta: Record<string, unknown> = {};

    if (desc.trim()) meta.desc = desc.trim();

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length > 0) meta.tags = tags;

    if (price.trim()) meta.price = price.trim();

    if (ctaLabel.trim() && ctaHref.trim()) {
      meta.cta = { label: ctaLabel.trim(), href: ctaHref.trim() };
    }

    if (thumb) meta.thumb = thumb;

    if (Object.keys(meta).length === 0) return "";
    return JSON.stringify(meta);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    startUpload(async () => {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const { url } = await uploadProductImage(fd);
        setHeroImage(url);
      } catch (err) {
        alert("이미지 업로드 실패: " + (err instanceof Error ? err.message : String(err)));
      }
    });
  }

  function save() {
    start(async () => {
      try {
        const body_mdx = buildBodyMdx();
        if (mode === "new") {
          await createProduct({
            slug,
            name,
            pitch,
            status,
            release_at: releaseAt,
            body_mdx,
            order_idx: orderIdx,
            published,
            hero_image: heroImage,
          });
        } else {
          await updateProduct(initial.slug, {
            name,
            pitch,
            status,
            release_at: releaseAt,
            body_mdx,
            order_idx: orderIdx,
            published,
            hero_image: heroImage,
          });
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
        <button type="button" className="btn btn-primary" onClick={save} disabled={busy || uploading || !name || !slug}>
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

          {/* 썸네일 / 히어로 이미지 */}
          <div style={{ gridColumn: "span 2" }}>
            <label className="field-label">썸네일 / 히어로 이미지</label>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              {/* 미리보기 */}
              {heroImage ? (
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImage}
                    alt="히어로 이미지 미리보기"
                    style={{
                      width: 120,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: "var(--r-input)",
                      border: "1px solid var(--border-2)",
                      display: "block",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: 120,
                    height: 80,
                    borderRadius: "var(--r-input)",
                    border: "1px dashed var(--border-2)",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--fg-3)",
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >
                  없음
                </div>
              )}

              {/* 업로드 버튼 영역 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || busy}
                >
                  {uploading
                    ? "업로드 중..."
                    : heroImage
                    ? "교체"
                    : "이미지 업로드"}
                </button>
                {heroImage && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ color: "var(--text-hot)", fontSize: 11 }}
                    onClick={() => {
                      setHeroImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    disabled={uploading || busy}
                  >
                    제거
                  </button>
                )}
                <span style={{ fontSize: 11, color: "var(--fg-3)" }}>
                  JPG · PNG · WEBP · GIF · SVG, 최대 5MB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card elevated">
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>카드 표시 옵션</span>
          <span style={{ fontSize: 11, color: "var(--fg-3)", marginLeft: 10 }}>
            JSON으로 자동 저장됩니다. 어드민에서는 JSON을 직접 만지지 않아도 됩니다.
          </span>
        </div>
        <div className="stack" style={{ gap: 14 }}>
          <div>
            <label className="field-label">카드 설명 (desc)</label>
            <textarea
              className="textarea input"
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="grid-2" style={{ gap: 14 }}>
            <div>
              <label className="field-label">태그 (tags)</label>
              <input
                className="input"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="태그1, 태그2, 태그3"
              />
            </div>
            <div>
              <label className="field-label">가격/일정 텍스트 (price)</label>
              <input
                className="input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="무료 베타 / 월 9,900원 예정"
              />
            </div>
            <div>
              <label className="field-label">CTA 버튼 라벨 (cta.label)</label>
              <input
                className="input"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="신청하기"
              />
            </div>
            <div>
              <label className="field-label">CTA 버튼 링크 (cta.href)</label>
              <input
                className="input"
                value={ctaHref}
                onChange={(e) => setCtaHref(e.target.value)}
                placeholder="https://... 또는 /경로"
              />
            </div>
          </div>
          <div>
            <label className="field-label">썸네일 모드</label>
            <select
              className="select"
              value={thumb}
              onChange={(e) => setThumb(e.target.value)}
            >
              <option value="">(없음) — hero_image 사용</option>
              <option value="play">데모 플레이 버튼 (play)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
