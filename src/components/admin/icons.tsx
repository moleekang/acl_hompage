"use client";

import type { CSSProperties } from "react";

export type IconName =
  | "dashboard" | "users" | "wiki" | "calendar" | "edit" | "box"
  | "settings" | "search" | "plus" | "more" | "close"
  | "chevron-right" | "chevron-left" | "arrow-right"
  | "trash" | "restore" | "external" | "drag" | "check" | "image" | "clock";

type Props = {
  name: IconName;
  size?: number;
  stroke?: number;
  style?: CSSProperties;
  className?: string;
};

// 디자인 시스템 그대로의 인라인 SVG 아이콘 세트. Lucide 대신 직접 보유.
export function Icon({ name, size = 18, stroke = 1.6, style, className }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="1.2" />
          <rect x="14" y="3" width="7" height="5" rx="1.2" />
          <rect x="14" y="11" width="7" height="10" rx="1.2" />
          <rect x="3" y="15" width="7" height="6" rx="1.2" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3 20c0-3.2 2.7-5.5 6-5.5s6 2.3 6 5.5" />
          <circle cx="17" cy="6.5" r="2.6" />
          <path d="M15.5 13c2.5.3 4.5 2.2 4.5 4.7" />
        </svg>
      );
    case "wiki":
      return (
        <svg {...common}>
          <path d="M4 4.5C4 4 4.4 3.5 5 3.5h6.5v17H5c-.6 0-1-.5-1-1V4.5z" />
          <path d="M20 4.5c0-.5-.4-1-1-1h-6.5v17H19c.6 0 1-.5 1-1V4.5z" />
          <path d="M7.5 8h2M7.5 11h2M14.5 8h2M14.5 11h2" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
          <path d="M3.5 9.5h17" />
          <path d="M8 3v4M16 3v4" />
          <rect x="7" y="13" width="3" height="3" rx=".5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "edit":
      return (
        <svg {...common}>
          <path d="M4 20.5h4l10-10-4-4-10 10v4z" />
          <path d="M14 6.5l4 4" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5v-9z" />
          <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.2 5.2l1.8 1.8M17 17l1.8 1.8M5.2 18.8L7 17M17 7l1.8-1.8" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "more":
      return (
        <svg {...common}>
          <circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6l-12 12" />
        </svg>
      );
    case "chevron-right":
      return <svg {...common}><path d="M9 5l7 7-7 7" /></svg>;
    case "chevron-left":
      return <svg {...common}><path d="M15 5l-7 7 7 7" /></svg>;
    case "arrow-right":
      return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7" /></svg>;
    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      );
    case "restore":
      return (
        <svg {...common}>
          <path d="M4 11A8 8 0 0 1 19 9" />
          <path d="M19 4v5h-5" />
          <path d="M20 13a8 8 0 0 1-15 2" />
          <path d="M5 20v-5h5" />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path d="M14 4h6v6" />
          <path d="M20 4l-9 9" />
          <path d="M19 13v6.5c0 .3-.2.5-.5.5H4.5c-.3 0-.5-.2-.5-.5v-14c0-.3.2-.5.5-.5H11" />
        </svg>
      );
    case "drag":
      return (
        <svg {...common}>
          <circle cx="9" cy="6" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="6" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="9" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="9" cy="18" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="18" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "check":
      return <svg {...common}><path d="M5 12.5l4.5 4.5L19 7" /></svg>;
    case "image":
      return (
        <svg {...common}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
          <circle cx="9" cy="10" r="1.6" />
          <path d="M4 18l5-5 4 4 3-3 4 4" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5l3.2 2" />
        </svg>
      );
    default:
      return null;
  }
}
