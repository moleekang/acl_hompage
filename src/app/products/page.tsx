// AICONLAB 자동화앱 진열 페이지
// 헤더의 "자동화앱" 메뉴와 연결 (/products)
// 셀피쉬클럽의 카드 그리드 패턴 + AICONLAB 페이퍼 톤
//
// 현재 진열 상품:
//   1. Congen (BETA) — 메인 카드
//   2. Congen Cloud — SaaS 버전 (Coming Soon)
//   3. ACL Claude Skills — 클로드 스킬 (Coming Soon)
//
// Note: layout.tsx가 Header/Footer를 감싸므로 본문만 정의

import { FadeUp } from "@/components/aiconlab/fade-up";
import { Icon } from "@/components/aiconlab/icon";
import { StickerStamp } from "@/components/aiconlab/sticker";
import { createClient } from "@/lib/supabase/server";

// DB row 파싱 — body_mdx에 JSON으로 담긴 ui_status/desc/tags/price/cta를 꺼낸다.
type ProductRow = {
  slug: string;
  name: string;
  pitch: string;
  status: string;
  body_mdx: string | null;
  release_at: string | null;
  order_idx: number;
  published: boolean;
  hero_image: string | null;
};

type ProductMeta = {
  ui_status?: "beta" | "live" | "soon";
  desc?: string;
  tags?: string[];
  price?: string;
  cta?: { label: string; href: string };
  thumb?: "play" | string;
};

function parseMeta(body: string | null): ProductMeta {
  if (!body) return {};
  try {
    return JSON.parse(body) as ProductMeta;
  } catch {
    return {};
  }
}

async function fetchProducts(): Promise<ProductRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug,name,pitch,status,body_mdx,release_at,order_idx,published,hero_image")
    .eq("published", true)
    .order("order_idx", { ascending: true });
  if (error || !data) return [];
  return data as ProductRow[];
}

// ──────────────────────────────────────────────────────────
// 1. PRODUCTS HERO — 카테고리 소개
// ──────────────────────────────────────────────────────────
function ProductsHero() {
  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 96, paddingBottom: 48 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            PRODUCTS · 자동화앱
          </div>
        </FadeUp>

        <FadeUp delay={80}>
          <h1
            className="hero-headline"
            style={{ maxWidth: 880, marginBottom: 20 }}
          >
            AICONLAB이 만든
            <br />
            <span className="marker">자동화 앱들.</span>
          </h1>
        </FadeUp>

        <FadeUp delay={160}>
          <p
            style={{
              fontSize: 18,
              color: "var(--fg-2)",
              maxWidth: 720,
              lineHeight: 1.65,
            }}
          >
            프롬프트 너머의 컨텍스트로, 1인 기업의 작업을 통째로 자동화합니다.
            <br />
            지금 운영 중인 앱부터 곧 출시할 SaaS·클로드 스킬까지 한자리에.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 2. PRODUCT CARD — 단일 상품 카드 컴포넌트
// ──────────────────────────────────────────────────────────
type Status = "beta" | "live" | "soon";

type ProductCardProps = {
  status: Status;          // 상태 배지 (BETA / LIVE / SOON)
  name: string;            // 상품 이름
  pitch: string;           // 한 줄 가치 제안
  desc: string;            // 본문 설명
  tags: string[];          // 카테고리 태그 (예: "영상 자동화", "Desktop App")
  price: string;           // 가격 표시 (예: "무료 배포 예정", "오픈 베타")
  thumb?: React.ReactNode; // 썸네일 영역 (커스텀)
  cta?: { label: string; href: string }; // CTA (없으면 빈 자리)
};

function ProductCard({
  status,
  name,
  pitch,
  desc,
  tags,
  price,
  thumb,
  cta,
}: ProductCardProps) {
  // 상태별 색상·라벨 매핑
  const statusMeta = {
    beta: { label: "BETA", color: "var(--text-electric)", bg: "rgba(90,124,255,0.16)" },
    live: { label: "LIVE", color: "var(--text-mint)", bg: "rgba(77,224,166,0.18)" },
    soon: { label: "COMING SOON", color: "var(--fg-3)", bg: "rgba(0,0,0,0.06)" },
  } as const;
  const meta = statusMeta[status];
  const isSoon = status === "soon";

  return (
    <div
      className="card-dark"
      style={{
        height: "100%",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        opacity: isSoon ? 0.72 : 1,
      }}
    >
      {/* ─── 썸네일 영역 (16:9) ─── */}
      <div
        style={{
          aspectRatio: "16/9",
          background: "var(--ink-900)",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--border-1)",
        }}
      >
        {/* 상태 배지 (좌상단) */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            padding: "4px 10px",
            background: meta.bg,
            color: meta.color,
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.1em",
            zIndex: 2,
          }}
        >
          ● {meta.label}
        </div>

        {/* 커스텀 썸네일 또는 기본 플레이스홀더 */}
        {thumb || (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, rgba(124,245,196,0.06), rgba(90,124,255,0.06))",
              color: "var(--fg-3)",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.1em",
            }}
          >
            PREVIEW
          </div>
        )}
      </div>

      {/* ─── 본문 영역 ─── */}
      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: 12,
        }}
      >
        {/* 상품 이름 */}
        <h3
          className="aicon-h2"
          style={{ fontSize: 22, fontWeight: 700, margin: 0 }}
        >
          {name}
        </h3>

        {/* 한 줄 가치 제안 (손글씨 hand 톤) */}
        <p
          className="hand"
          style={{
            color: "var(--text-sun)",
            fontSize: 17,
            margin: 0,
            lineHeight: 1.45,
          }}
        >
          {pitch}
        </p>

        {/* 본문 설명 */}
        <p
          style={{
            fontSize: 14.5,
            color: "var(--fg-2)",
            lineHeight: 1.65,
            margin: 0,
            flex: 1,
          }}
        >
          {desc}
        </p>

        {/* 카테고리 태그 */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
          {tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11,
                padding: "3px 9px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                color: "var(--fg-2)",
                border: "1px solid var(--border-1)",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* 하단 — 가격 + CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 14,
            marginTop: 4,
            borderTop: "1px dashed var(--border-1)",
            gap: 12,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 12,
              color: "var(--fg-3)",
              letterSpacing: "0.06em",
            }}
          >
            {price}
          </div>
          {cta ? (
            <a
              href={cta.href}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--text-mint)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {cta.label} <span aria-hidden>→</span>
            </a>
          ) : (
            <span style={{ fontSize: 13, color: "var(--fg-3)", fontStyle: "italic" }}>
              곧 공개
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 3. PRODUCT GRID — 상품 카드 그리드 (3열)
// ──────────────────────────────────────────────────────────
function ProductGrid({ products }: { products: ProductRow[] }) {
  const total = products.length;
  const beta = products.filter((p) => p.status === "beta").length;
  const soon = products.filter((p) => p.status === "coming").length;
  const live = products.filter((p) => p.status === "live").length;
  const liveCount = live + beta; // "지금 운영 중"

  return (
    <section
      className="aicon-section"
      style={{ paddingTop: 24, paddingBottom: 80 }}
    >
      <div className="aicon-container">
        <FadeUp>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            <h2 className="aicon-h1" style={{ fontSize: 28, fontWeight: 700 }}>
              지금 운영 중 · {liveCount}개
            </h2>
            <div
              className="mono"
              style={{
                fontSize: 12,
                color: "var(--fg-3)",
                letterSpacing: "0.12em",
              }}
            >
              총 {total} · BETA {beta} · SOON {soon}
            </div>
          </div>
        </FadeUp>

        <div className="grid-3">
          {products.map((p, i) => {
            const meta = parseMeta(p.body_mdx);
            const uiStatus: Status =
              meta.ui_status ??
              (p.status === "coming"
                ? "soon"
                : (p.status as Status));
            // 우선순위: meta.thumb === "play" (커스텀 데모) > hero_image (어드민 업로드) > 기본 PREVIEW
            const heroThumb = p.hero_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.hero_image}
                alt={`${p.name} 썸네일`}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : undefined;
            const thumbNode =
              meta.thumb === "play" ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "radial-gradient(ellipse at 30% 30%, rgba(124,245,196,0.22), transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(90,124,255,0.18), transparent 60%)",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 999,
                      background: "var(--mint-400)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "var(--shadow-mint)",
                    }}
                  >
                    <Icon name="play" size={26} color="var(--ink-900)" />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      padding: "4px 10px",
                      background: "rgba(0,0,0,0.55)",
                      borderRadius: 4,
                      fontSize: 11,
                      color: "#fff",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    DEMO · 6 STEPS
                  </div>
                </div>
              ) : undefined;
            return (
              <FadeUp key={p.slug} delay={120 + i * 80}>
                <ProductCard
                  status={uiStatus}
                  name={p.name}
                  pitch={p.pitch}
                  desc={meta.desc ?? ""}
                  tags={meta.tags ?? []}
                  price={meta.price ?? p.release_at ?? ""}
                  cta={meta.cta}
                  thumb={thumbNode ?? heroThumb}
                />
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 4. BUILD IN PUBLIC — 다큐멘터리 안내 (셀피시의 합류 채널 패턴 차용)
// ──────────────────────────────────────────────────────────
function BuildInPublicCTA() {
  return (
    <section
      className="aicon-section"
      style={{
        background: "var(--surface-2)",
        paddingTop: 64,
        paddingBottom: 96,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="aicon-container" style={{ position: "relative" }}>
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            BUILD IN PUBLIC · 만드는 과정도 자산
          </div>
        </FadeUp>

        <FadeUp delay={80}>
          <h2
            className="display-2"
            style={{ maxWidth: 820, marginBottom: 18 }}
          >
            완성된 앱만 보여주지
            <br />
            <span className="marker">않습니다.</span>
          </h2>
        </FadeUp>

        <FadeUp delay={140}>
          <p
            style={{
              fontSize: 17,
              color: "var(--fg-2)",
              maxWidth: 680,
              marginBottom: 32,
              lineHeight: 1.7,
            }}
          >
            만드는 과정 · 시행착오 · 한계점까지 라이브로 공유합니다. 유튜브와
            위키에서 개발 다큐멘터리를 확인해보세요.
          </p>
        </FadeUp>

        <FadeUp delay={200}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              className="btn btn-primary btn-lg"
              href="https://www.youtube.com/@A-ConLab-b1m"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="youtube" size={18} color="var(--ink-900)" /> 유튜브에서
              개발 과정 보기
            </a>
            <a className="btn btn-secondary btn-lg" href="/log">
              <Icon name="book" size={18} /> 작업 일지 둘러보기
            </a>
          </div>
        </FadeUp>

        <StickerStamp
          text="★ LIVE DOC"
          style={{
            position: "absolute",
            top: 32,
            right: 32,
            transform: "rotate(8deg)",
            display: "none",
          }}
        />
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE — 자동화앱 진열 페이지 마스터 조합
// ──────────────────────────────────────────────────────────
export default async function ProductsPage() {
  const products = await fetchProducts();
  return (
    <>
      <ProductsHero />
      <ProductGrid products={products} />
      <BuildInPublicCTA />
    </>
  );
}
