"use client";

// 인사이트 본문 — AI가 만든 완성 HTML(스크립트 포함)을 안전하게 격리해 표시한다.
//
// 보안:
//   sandbox="allow-scripts" 만 부여 → iframe origin이 null이 되어 부모 쿠키·localStorage·DOM 접근 불가.
//   본문 안 <script>가 우리 사이트 토큰을 훔칠 수 없고, 페이지 CSS도 침범 못 함.
//
// 높이 동기화:
//   부모가 iframe DOM에 직접 접근할 수 없으므로(다른 origin 취급), HTML 끝에 측정 스니펫을 주입.
//   스니펫이 ResizeObserver + load 이벤트로 height를 postMessage로 보내고, 부모가 받아 iframe 높이를 맞춤.

import { useEffect, useRef, useState } from "react";

const MESSAGE_TYPE = "__aiconlab_note_resize__";

const RESIZE_SCRIPT = `
<script>
(function(){
  function send() {
    var h = Math.max(
      document.documentElement ? document.documentElement.scrollHeight : 0,
      document.body ? document.body.scrollHeight : 0
    );
    if (h > 0) parent.postMessage({ type: ${JSON.stringify(MESSAGE_TYPE)}, height: h }, "*");
  }
  function init() {
    send();
    [50, 200, 600, 1500].forEach(function(t){ setTimeout(send, t); });
    if (window.ResizeObserver && document.body) {
      new ResizeObserver(send).observe(document.body);
    }
    window.addEventListener("load", send);
  }
  if (document.readyState === "complete" || document.readyState === "interactive") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
</script>
`;

export function HtmlBody({ html }: { html: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(640);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // 같은 iframe에서 온 메시지만 신뢰
      if (e.source !== ref.current?.contentWindow) return;
      const d = e.data as { type?: unknown; height?: unknown } | undefined;
      if (
        d &&
        d.type === MESSAGE_TYPE &&
        typeof d.height === "number" &&
        d.height > 0 &&
        d.height < 20_000
      ) {
        setHeight(d.height);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // 본문 HTML 끝에 측정 스니펫을 붙인다 — 본문이 완전한 HTML 문서든 fragment든 둘 다 동작.
  const srcDoc = html + RESIZE_SCRIPT;

  return (
    <iframe
      ref={ref}
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      title="note content"
      style={{
        width: "100%",
        height,
        border: 0,
        background: "transparent",
        display: "block",
      }}
    />
  );
}
