// 카드 그리드 + "더보기" 점진 노출.
// 자식(카드 노드)을 받아 초기 STEP개만 렌더하고, 남은 게 있을 때만 버튼 노출.
// 카드 자체는 서버 컴포넌트로 두고 children으로 주입 → 이 래퍼만 클라이언트.
"use client";

import { Children, useState, type CSSProperties, type ReactNode } from "react";

type LoadMoreGridProps = {
  children: ReactNode;
  // 한 번에 노출/추가할 항목 수 (기본 9 = grid-3 × 3행)
  step?: number;
  // 그리드 컨테이너 클래스 — aicon 페이지는 "grid-3", shadcn/Tailwind 페이지는 직접 지정
  className?: string;
  // 더보기 버튼 클래스/스타일/라벨 — 페이지 디자인 시스템에 맞춰 교체
  buttonClassName?: string;
  buttonStyle?: CSSProperties;
  label?: string;
};

export function LoadMoreGrid({
  children,
  step = 9,
  className = "grid-3",
  buttonClassName = "btn btn-secondary btn-lg",
  buttonStyle = { minWidth: 200 },
  label = "더 많은 글 보기",
}: LoadMoreGridProps) {
  const items = Children.toArray(children);
  const [visible, setVisible] = useState(step);
  const hasMore = visible < items.length;

  return (
    <>
      <div className={className}>{items.slice(0, visible)}</div>
      {hasMore && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 56,
          }}
        >
          <button
            type="button"
            className={buttonClassName}
            style={buttonStyle}
            onClick={() => setVisible((v) => v + step)}
          >
            {label}
          </button>
        </div>
      )}
    </>
  );
}
