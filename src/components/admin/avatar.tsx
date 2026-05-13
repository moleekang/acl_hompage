import type { CSSProperties } from "react";

// 디자인 시스템의 결정성 아바타 — 이름 해시로 색을 정함.
const PALETTE: Array<{ bg: string; fg: string }> = [
  { bg: "#FFD23F", fg: "#0E1116" },
  { bg: "#4DE0A6", fg: "#0E1116" },
  { bg: "#FF8E72", fg: "#0E1116" },
  { bg: "#9CEBC8", fg: "#0E1116" },
  { bg: "#5A7CFF", fg: "#FFFFFF" },
  { bg: "#EAE5D6", fg: "#1A1813" },
  { bg: "#FFF4C4", fg: "#8A6A00" },
  { bg: "#FCE6DF", fg: "#C13E1F" },
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type Props = {
  name: string;
  size?: "sm" | "md" | "lg";
  style?: CSSProperties;
};

export function Avatar({ name, size = "md", style }: Props) {
  const initials = (name || "?").replace(/\s+/g, "").slice(0, 1).toUpperCase();
  const p = PALETTE[hash(name || "x") % PALETTE.length];
  const cls = "av " + (size === "sm" ? "av-sm" : size === "lg" ? "av-lg" : "");
  return (
    <span className={cls} style={{ background: p.bg, color: p.fg, ...style }}>
      {initials}
    </span>
  );
}
