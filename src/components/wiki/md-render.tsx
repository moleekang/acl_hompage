// 매우 간단한 markdown-ish 렌더러 (위키/블로그 미리보기·뷰 양쪽에서 사용).
// 본격 MDX 파서는 추후 react-markdown 등으로 교체.

import type { ReactNode } from "react";

export function MdRender({ body }: { body: string }) {
  const lines = body.split("\n");
  const out: ReactNode[] = [];
  let listBuf: ReactNode[] = [];

  const flushList = () => {
    if (listBuf.length) {
      out.push(
        <ul key={out.length} style={{ paddingLeft: 20, marginBottom: 12 }}>
          {listBuf.map((t, i) => <li key={i}>{t}</li>)}
        </ul>,
      );
      listBuf = [];
    }
  };

  const inline = (s: string): ReactNode[] => {
    const parts: ReactNode[] = [];
    const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(s)) !== null) {
      if (m.index > last) parts.push(s.slice(last, m.index));
      const tok = m[0];
      if (tok.startsWith("**")) parts.push(<b key={parts.length}>{tok.slice(2, -2)}</b>);
      else if (tok.startsWith("`")) parts.push(<code key={parts.length}>{tok.slice(1, -1)}</code>);
      else parts.push(<i key={parts.length}>{tok.slice(1, -1)}</i>);
      last = m.index + tok.length;
    }
    if (last < s.length) parts.push(s.slice(last));
    return parts;
  };

  lines.forEach((l, i) => {
    if (/^#\s/.test(l)) {
      flushList();
      out.push(<h1 key={"h1" + i} style={{ fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 12 }}>{l.replace(/^#\s/, "")}</h1>);
      return;
    }
    if (/^##\s/.test(l)) {
      flushList();
      out.push(<h2 key={"h2" + i} style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "18px 0 6px" }}>{l.replace(/^##\s/, "")}</h2>);
      return;
    }
    if (/^>\s/.test(l)) {
      flushList();
      out.push(
        <blockquote
          key={"q" + i}
          style={{
            borderLeft: "3px solid var(--text-mint)",
            paddingLeft: 12, margin: "12px 0",
            color: "var(--fg-2)",
          }}
        >
          {inline(l.replace(/^>\s/, ""))}
        </blockquote>,
      );
      return;
    }
    if (/^-\s/.test(l)) {
      listBuf.push(inline(l.replace(/^-\s/, "")));
      return;
    }
    if (l.trim() === "") {
      flushList();
      return;
    }
    flushList();
    out.push(<p key={"p" + i} style={{ margin: "0 0 12px", color: "var(--fg-2)" }}>{inline(l)}</p>);
  });
  flushList();
  return <>{out}</>;
}
