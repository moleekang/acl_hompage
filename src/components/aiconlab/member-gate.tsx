// 멤버 전용 글 본문 자리에 표시하는 게이트.
// 비로그인 → 로그인 유도, 로그인했지만 guest → 멤버 신청 안내 (llm-wiki layout 게이트와 같은 톤).

import Link from "next/link";

export function MemberGate({
  loggedIn,
  nextPath,
}: {
  loggedIn: boolean;
  nextPath: string;
}) {
  return (
    <section className="aicon-section" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <div className="aicon-container" style={{ maxWidth: 720 }}>
        <div
          style={{
            padding: "40px 36px",
            borderRadius: 14,
            background: "var(--surface-1)",
            border: "1px solid var(--border-1)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 40 }} aria-hidden>🔒</span>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--fg-1)",
            }}
          >
            이 글은 멤버십 전용이에요
          </div>
          {loggedIn ? (
            <>
              <p style={{ fontSize: 15, color: "var(--fg-2)", margin: 0, lineHeight: 1.7 }}>
                가입은 환영! 멤버십 전용 글을 읽으려면 운영자의 한 번 승급이 필요해요.
                <br />
                아래 메일로 한 줄만 보내주세요 — 어떤 일 하고 계신지.
              </p>
              <a
                href="mailto:contact@aiconlab.xyz?subject=멤버십 신청"
                className="btn btn-primary"
              >
                멤버십 신청하기 →
              </a>
            </>
          ) : (
            <>
              <p style={{ fontSize: 15, color: "var(--fg-2)", margin: 0, lineHeight: 1.7 }}>
                멤버십 회원으로 로그인하면 본문을 읽을 수 있어요.
              </p>
              <Link
                href={`/login?next=${encodeURIComponent(nextPath)}`}
                className="btn btn-primary"
              >
                로그인하고 읽기 →
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
