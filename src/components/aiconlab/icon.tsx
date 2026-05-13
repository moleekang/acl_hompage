// Lucide-like 미니 인라인 아이콘 시스템
// 24개 아이콘만 inline SVG로 두어 외부 패키지 없이 가벼움
// 1.75px stroke + currentColor (디자인 시스템 가이드 준수)
import type { JSX } from "react";

type IconName =
  | "spark" | "play" | "arrow" | "check" | "heart" | "target"
  | "bolt"  | "eye"  | "book"  | "chat"  | "users" | "flask"
  | "layers" | "mic" | "grid"  | "handshake" | "code"
  | "youtube" | "wiki" | "flag" | "rocket";

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

// 각 아이콘의 path 정의 — viewBox는 모두 24x24
const PATHS: Record<IconName, JSX.Element> = {
  spark: (
    <>
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M5 5l3 3" />
      <path d="M16 16l3 3" />
      <path d="M5 19l3-3" />
      <path d="M16 8l3-3" />
    </>
  ),
  play: <polygon points="6 4 20 12 6 20 6 4" />,
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </>
  ),
  check: <path d="M5 12l5 5 9-11" />,
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  bolt: <path d="M13 2 3 14h7l-1 8 10-12h-7z" />,
  eye: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  chat: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3v8L4 21h16L15 11V3" />
      <path d="M9 3h6" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
      <path d="M12 19v3" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </>
  ),
  handshake: (
    <>
      <path d="M11 17 8 14" />
      <path d="m13 17 6-6" />
      <path d="m18 12-3-3" />
      <path d="M21 13.5 13.5 21" />
      <path d="M3 13.5 10.5 6" />
      <path d="M6 9 9 6" />
    </>
  ),
  code: (
    <>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </>
  ),
  youtube: (
    <>
      <path d="M22 8.5a3 3 0 0 0-2.1-2.1C18 6 12 6 12 6s-6 0-7.9.4A3 3 0 0 0 2 8.5C1.6 10.4 1.6 12 1.6 12s0 1.6.4 3.5a3 3 0 0 0 2.1 2.1C6 18 12 18 12 18s6 0 7.9-.4a3 3 0 0 0 2.1-2.1c.4-1.9.4-3.5.4-3.5s0-1.6-.4-3.5z" />
      <polygon points="10 9.5 15 12 10 14.5 10 9.5" />
    </>
  ),
  wiki: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z" />
      <path d="M9 7h7M9 11h7" />
    </>
  ),
  flag: (
    <>
      <path d="M4 22V4" />
      <path d="M4 4h12l-2 4 2 4H4" />
    </>
  ),
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
};

export function Icon({ name, size = 22, color = "currentColor" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={color}
      strokeWidth={1.75}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.spark}
    </svg>
  );
}

export type { IconName };
