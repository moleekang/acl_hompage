// 손도장 풍 스티커 SVG 컴포넌트 4종
// 강조 모먼트 전용 (히어로, 섹션 콜아웃) — UI에는 사용 X
// 디자인 시스템의 sun(노랑) / mint(민트) / hot(빨강 stamp) / 손그림 화살표
import type { CSSProperties } from "react";

type StickerProps = {
  style?: CSSProperties;
};

// 1. 콜아웃 — 노란 말풍선 + Gaegu 손글씨 텍스트
export function StickerCallout({
  text = "이거 보세요!",
  style,
}: StickerProps & { text?: string }) {
  return (
    <svg viewBox="0 0 200 80" width="160" height="64" style={style}>
      <g transform="translate(100 40) rotate(-6)">
        <path
          d="M -90 -22 Q -94 -24 -92 -18 L -90 18 Q -92 24 -86 22 L 86 24 Q 94 22 90 16 L 92 -18 Q 94 -24 86 -22 Z"
          fill="#FFD23F"
          stroke="#0E1116"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontFamily="Gaegu, cursive"
          fontSize="22"
          fontWeight={700}
          fill="#0E1116"
        >
          {text}
        </text>
      </g>
    </svg>
  );
}

// 2. 화살표 — 민트색 손그림 화살표 (그림자 + 화살촉)
export function StickerArrow({ style }: StickerProps) {
  return (
    <svg viewBox="0 0 100 80" width="80" height="64" style={style}>
      <g transform="translate(10 40)">
        <path
          d="M 0 0 Q 25 -8 50 -2 Q 65 2 78 -4"
          fill="none"
          stroke="#7CF5C4"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 70 -14 L 84 -2 L 68 6"
          fill="none"
          stroke="#7CF5C4"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// 3. 동그라미 — Hot 색 손그림 두 겹 원 (강조 표시용)
export function StickerCircle({
  size = 200,
  style,
}: StickerProps & { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={style}>
      <g transform="translate(60 60) rotate(-3)">
        <ellipse
          cx="0"
          cy="0"
          rx="50"
          ry="46"
          fill="none"
          stroke="#FF6B47"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <ellipse
          cx="2"
          cy="-2"
          rx="48"
          ry="44"
          fill="none"
          stroke="#FF6B47"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

// 4. 스탬프 — Hot 색 직사각형 도장 (★ NEW, ★ REAL 같은 라벨)
export function StickerStamp({
  text = "★ NEW",
  style,
}: StickerProps & { text?: string }) {
  return (
    <svg viewBox="0 0 140 60" width="120" height="52" style={style}>
      <g transform="translate(70 30) rotate(-8)">
        <rect
          x="-58"
          y="-22"
          width="116"
          height="44"
          rx="4"
          fill="#FF6B47"
          stroke="#0E1116"
          strokeWidth="2.5"
        />
        <text
          x="0"
          y="8"
          textAnchor="middle"
          fontFamily="Gowun Dodum, sans-serif"
          fontSize="20"
          fontWeight={800}
          fill="#F5F1E8"
        >
          {text}
        </text>
      </g>
    </svg>
  );
}
