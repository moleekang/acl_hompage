// 스크롤 진입 시 fade + slight slide-up 애니메이션
// IntersectionObserver를 사용해 한 번만 트리거 (성능)
// 사용처: 16섹션 페이지의 모든 entrance 모션
"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

type FadeUpProps = {
  children: ReactNode;
  delay?: number;       // 애니메이션 지연(ms) — 형제 요소 stagger용
  className?: string;
  style?: CSSProperties;
};

export function FadeUp({ children, delay = 0, className = "", style }: FadeUpProps) {
  // ref: 관찰 대상 DOM 노드
  // seen: 한 번이라도 보였는지 (true가 되면 fade-up.in 클래스 부착)
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // prefers-reduced-motion: 모션을 끈 사용자에게는 즉시 visible
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setSeen(true);
      return;
    }

    // 12% 이상 보이면 트리거 → 한 번 트리거 후 disconnect로 메모리 해제
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);

    // 안전망 — 1.2s 안에 트리거 못 받으면 강제로 노출
    // (검색엔진 크롤러, fullPage 스크린샷, 일부 모바일 브라우저 대비)
    const fallback = window.setTimeout(() => setSeen(true), 1200);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-up ${seen ? "in" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}
