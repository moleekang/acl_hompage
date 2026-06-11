// menu_map — path → menu catalog (collection plan §5).
// Pure module (no imports, no secrets) — safe for server and node scripts.

export type MenuEntry = { code: string; name: string };

const STATIC_MENU_MAP: Record<string, MenuEntry> = {
  "/": { code: "HOME", name: "홈" },
  "/products": { code: "PRODUCTS", name: "자동화앱" },
  "/insights": { code: "INSIGHTS", name: "공유회" },
  "/log": { code: "BLOG", name: "팀 블로그" },
  "/notes": { code: "NOTES", name: "인사이트" },
  "/community": { code: "COMMUNITY", name: "단톡방" },
  "/about": { code: "ABOUT", name: "정체성" },
  "/automation": { code: "AUTOMATION", name: "자동화 소개" },
  "/content-automation": { code: "CONTENT_AUTOMATION", name: "콘텐츠 자동화" },
  "/tools": { code: "TOOLS", name: "추천 도구" },
  "/projects": { code: "PROJECTS", name: "프로젝트" },
  "/resources": { code: "RESOURCES", name: "자료실" },
  "/llm-wiki": { code: "LLM_WIKI", name: "LLM Wiki" },
  "/journal": { code: "JOURNAL", name: "작업 일지" },
  "/admin": { code: "ADMIN", name: "어드민" },
};

// Dynamic routes roll up to their parent menu (plan §5 note).
const PREFIX_MENU_MAP: Array<[string, MenuEntry]> = [
  ["/log/", STATIC_MENU_MAP["/log"]],
  ["/llm-wiki/", STATIC_MENU_MAP["/llm-wiki"]],
  ["/insights/", STATIC_MENU_MAP["/insights"]],
  ["/notes/", STATIC_MENU_MAP["/notes"]],
  ["/admin/", STATIC_MENU_MAP["/admin"]],
];

// Intentionally untracked paths (do NOT remove from menu_map to hide — keep here).
const EXCLUDED_PATHS = ["/login", "/auth", "/api"];

export function isExcludedPath(path: string): boolean {
  return EXCLUDED_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Resolve a pathname to a menu entry. Unknown paths fall back to the raw path (Tier 0). */
export function resolveMenu(path: string): MenuEntry {
  const norm = path.length > 1 ? path.replace(/\/+$/, "") : path;
  const exact = STATIC_MENU_MAP[norm];
  if (exact) return exact;
  const byPrefix = PREFIX_MENU_MAP.find(([prefix]) => norm.startsWith(prefix));
  if (byPrefix) return byPrefix[1];
  // Tier 0 fallback — never skip: raw path as menu_code so new pages are still counted.
  return { code: norm, name: norm };
}
