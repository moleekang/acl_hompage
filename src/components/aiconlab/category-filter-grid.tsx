// 카테고리 칩 필터 + 그리드 + 더보기를 묶은 클라이언트 컴포넌트.
// 카드는 서버에서 렌더해 node로 주입(RSC children 패턴) → 이 래퍼만 클라이언트.
// 칩 스타일은 페이지 디자인에 맞춰 chip="aicon"(다크 칩) / "shadcn"(페이퍼 버튼) 선택.
"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { LoadMoreGrid } from "./load-more-grid";

export type FilterCat = { key: string; label: string; color?: string };
export type FilterItem = { key: string; cat: string; node: ReactNode };

const ALL = "__all__";

type Props = {
  items: FilterItem[];
  categories: FilterCat[]; // "전체"는 컴포넌트가 자동으로 앞에 추가
  allLabel?: string;
  chip?: "aicon" | "shadcn";
  // 그리드/더보기는 LoadMoreGrid로 위임
  gridClassName?: string;
  buttonClassName?: string;
  buttonStyle?: CSSProperties;
  loadMoreLabel?: string;
  step?: number;
  emptyText?: string;
};

export function CategoryFilterGrid({
  items,
  categories,
  allLabel = "전체",
  chip = "aicon",
  gridClassName,
  buttonClassName,
  buttonStyle,
  loadMoreLabel,
  step,
  emptyText = "이 카테고리에는 아직 항목이 없어요.",
}: Props) {
  const [active, setActive] = useState<string>(ALL);
  const shown = active === ALL ? items : items.filter((i) => i.cat === active);
  const chips: FilterCat[] = [{ key: ALL, label: allLabel }, ...categories];

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 32,
        }}
      >
        {chips.map((c) => {
          const isActive = c.key === active;
          if (chip === "shadcn") {
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setActive(c.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-card/60"
                }`}
              >
                {c.label}
              </button>
            );
          }
          // aicon 다크 칩
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 999,
                background: isActive ? "var(--ink-900)" : "rgba(255,255,255,0.04)",
                color: isActive ? "#fff" : "var(--fg-2)",
                border: `1px solid ${isActive ? "var(--ink-900)" : "var(--border-1)"}`,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {c.color && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: c.color,
                  }}
                />
              )}
              {c.label}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p style={{ color: "var(--fg-3)", fontSize: 15 }}>{emptyText}</p>
      ) : (
        <LoadMoreGrid
          key={active} // 필터 변경 시 더보기 카운트 리셋
          className={gridClassName}
          buttonClassName={buttonClassName}
          buttonStyle={buttonStyle}
          label={loadMoreLabel}
          step={step}
        >
          {shown.map((i) => i.node)}
        </LoadMoreGrid>
      )}
    </>
  );
}
