// AICONLAB 풋터 — 모든 페이지 하단 자동 노출
// Claude 시스템 시그니처: dark navy + 4컬럼 (Never inverts)

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--ink-900)] py-16 text-[var(--ink-300)] md:py-20">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* 컬럼 1: 브랜드 */}
          <div>
            <p className="font-serif text-2xl text-[var(--paper)]">✦ AICONLAB</p>
            <p className="mt-3 text-sm leading-relaxed">
              AI Context Lab
              <br />한 사람의 라이브 실험실
            </p>
          </div>

          {/* 컬럼 2: 채널 */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[var(--paper)]">
              채널
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.youtube.com/@A-ConLab-b1m"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--paper)]"
                >
                  유튜브
                </a>
              </li>
              <li>
                <Link
                  href="/community"
                  className="transition-colors hover:text-[var(--paper)]"
                >
                  카카오톡 단톡방
                </Link>
              </li>
            </ul>
          </div>

          {/* 컬럼 3: 콘텐츠 */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[var(--paper)]">
              콘텐츠
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/insights"
                  className="transition-colors hover:text-[var(--paper)]"
                >
                  인사이트
                </Link>
              </li>
              <li>
                <Link
                  href="/content-automation"
                  className="transition-colors hover:text-[var(--paper)]"
                >
                  컨텐츠 자동화
                </Link>
              </li>
              <li>
                <Link
                  href="/automation"
                  className="transition-colors hover:text-[var(--paper)]"
                >
                  자동화
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="transition-colors hover:text-[var(--paper)]"
                >
                  프로젝트
                </Link>
              </li>
              <li>
                <Link
                  href="/llm-wiki"
                  className="ml-3 transition-colors hover:text-[var(--paper)]"
                >
                  └ LLM Wiki
                </Link>
              </li>
              <li>
                <Link
                  href="/log"
                  className="transition-colors hover:text-[var(--paper)]"
                >
                  작업 일지
                </Link>
              </li>
            </ul>
          </div>

          {/* 컬럼 4: 함께 */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[var(--paper)]">
              함께
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/community"
                  className="transition-colors hover:text-[var(--paper)]"
                >
                  단톡방
                </Link>
              </li>
              <li>
                <Link
                  href="/membership"
                  className="transition-colors hover:text-[var(--paper)]"
                >
                  멤버십
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom — 카피라이트 */}
        <div className="mt-16 border-t border-[var(--ink-700)] pt-8 text-xs">
          <p>© 2026 AICONLAB · Build in Public</p>
          <p className="mt-1">통째로 나누며 함께 쌓아갑니다</p>
        </div>
      </div>
    </footer>
  );
}
