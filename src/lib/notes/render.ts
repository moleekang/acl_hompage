// 서버 전용 — 인사이트 본문 렌더링 유틸리티.
// markdown을 HTML로 변환하고 typography 스타일로 감싼다.
// createClient를 쓰지 않으므로 서버 컴포넌트/route handler 어디서든 import 가능.

import { marked } from "marked";

export type ContentType = "html" | "markdown";
export type RenderMode = "embed" | "newtab";

// markdown → wrapper HTML 문서 변환.
// typography 스타일은 인라인 <style> — sandbox iframe의 origin이 null이라 페이지 영향 없음.
function wrapWithTypography(converted: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;max-width:720px;margin:48px auto;padding:0 24px;line-height:1.75;color:#111;font-size:16px}
h1,h2,h3,h4{line-height:1.3;margin-top:1.8em}
h1{font-size:2em;border-bottom:1px solid #eee;padding-bottom:.3em}
h2{font-size:1.5em} h3{font-size:1.2em}
p,ul,ol{margin:1em 0}
code{background:#f4f4f4;padding:2px 6px;border-radius:3px;font-size:.9em;font-family:ui-monospace,Menlo,monospace}
pre{background:#f4f4f4;padding:16px;border-radius:6px;overflow-x:auto}
pre code{background:none;padding:0}
blockquote{border-left:3px solid #ddd;color:#666;padding:.4em 1em;margin:1em 0}
a{color:#2563eb;text-underline-offset:3px}
img{max-width:100%;height:auto}
table{border-collapse:collapse;margin:1em 0}
th,td{border:1px solid #ddd;padding:6px 10px}
</style></head><body>${converted}</body></html>`;
}

// 본문 문자열을 content_type에 따라 렌더링.
// html  → 그대로 반환 (admin이 완성 HTML을 붙여넣었다고 가정)
// markdown → marked로 변환 후 typography wrapper 적용
export function renderNoteBody(body: string, contentType: ContentType): string {
  if (contentType === "markdown") {
    // marked.parse는 string | Promise<string> — synchronous 옵션으로 string 반환
    const converted = marked.parse(body, { async: false }) as string;
    return wrapWithTypography(converted);
  }
  // html: 그대로 반환
  return body;
}
