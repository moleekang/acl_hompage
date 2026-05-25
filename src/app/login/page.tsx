// 로그인 페이지 — Google OAuth + ID/비번 폼.
// ID 입력은 @가 없으면 자동으로 @aiconlab.local 을 붙여 Supabase에 보낸다.

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const INTERNAL_EMAIL_DOMAIN = "aiconlab.local";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const queryError = params.get("error");
  const next = params.get("next") ?? "/";

  const [busy, setBusy] = useState<"google" | "password" | null>(null);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setBusy("google");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (authError) {
      console.error(authError);
      setBusy(null);
    }
    // 성공 시 Google로 리다이렉트되므로 busy 해제 불필요.
  }

  async function signInWithPassword(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!id.trim() || !pw) {
      setFormError("ID와 비밀번호를 입력해주세요.");
      return;
    }

    const email = id.includes("@") ? id.trim() : `${id.trim()}@${INTERNAL_EMAIL_DOMAIN}`;

    setBusy("password");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pw,
    });
    setBusy(null);

    if (authError) {
      setFormError("로그인 실패: ID 또는 비밀번호를 확인해주세요.");
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <main
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
        background: "var(--bg-canvas)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--surface-1)",
          border: "1px solid var(--border-1)",
          borderRadius: 14,
          padding: 36,
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 36,
            color: "var(--paper-ink)",
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          AICONLAB 시작하기
        </div>
        <p
          style={{
            color: "var(--fg-2)",
            fontSize: 15,
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          Google 계정으로 한 번 클릭이면 끝이에요.
          <br />
          가입 후 위키 접근은 운영자가 별도로 승급해드립니다.
        </p>

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={busy !== null}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "14px 18px",
            background: "var(--ink-900)",
            color: "#FFFFFF",
            border: "2px solid var(--ink-900)",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 700,
            cursor: busy ? "wait" : "pointer",
            opacity: busy === "google" ? 0.7 : 1,
            transition: "transform .12s ease, background .12s ease",
          }}
        >
          <GoogleMark />
          {busy === "google" ? "Google로 이동 중..." : "Google로 시작하기"}
        </button>

        {/* 구분선 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "24px 0 20px",
            color: "var(--fg-3)",
            fontSize: 12,
            letterSpacing: "0.08em",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--border-1)" }} />
          <span>또는 ID로 로그인</span>
          <div style={{ flex: 1, height: 1, background: "var(--border-1)" }} />
        </div>

        {/* ID/비번 폼 (관리자 전용) */}
        <form onSubmit={signInWithPassword} style={{ display: "grid", gap: 10 }}>
          <input
            type="text"
            placeholder="ID (예: admin)"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
            disabled={busy !== null}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="current-password"
            disabled={busy !== null}
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={busy !== null}
            style={{
              padding: "12px 16px",
              background: "var(--surface-1)",
              color: "var(--paper-ink)",
              border: "2px solid var(--ink-900)",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: busy ? "wait" : "pointer",
              opacity: busy === "password" ? 0.7 : 1,
            }}
          >
            {busy === "password" ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {(formError || queryError) && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 14px",
              background: "rgba(255,107,71,0.10)",
              border: "1px dashed var(--text-hot)",
              borderRadius: 4,
              color: "var(--text-hot)",
              fontSize: 13,
            }}
          >
            {formError ?? `로그인 실패: ${queryError}`}
          </div>
        )}

        <div
          style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: "1px dashed var(--border-1)",
            fontSize: 12,
            color: "var(--fg-3)",
            lineHeight: 1.6,
          }}
        >
          로그인 시 AICONLAB의 운영 규약에 동의합니다. 콘텐츠는 서로 존중하는
          톤으로 작성해주세요.
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  background: "var(--bg-canvas)",
  color: "var(--paper-ink)",
  border: "1px solid var(--border-1)",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
};

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#FFC107"
        d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.13 4.13 0 0 1-1.79 2.7v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.6Z"
      />
      <path
        fill="#FF3D00"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.58-5.05-3.71H.9v2.33A8.99 8.99 0 0 0 9 18Z"
      />
      <path
        fill="#4CAF50"
        d="M3.95 10.71A5.4 5.4 0 0 1 3.66 9c0-.6.1-1.17.29-1.71V4.96H.9A8.99 8.99 0 0 0 0 9c0 1.45.35 2.83.9 4.04l3.05-2.33Z"
      />
      <path
        fill="#1976D2"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 9 0 8.99 8.99 0 0 0 .9 4.96l3.05 2.33C4.66 5.16 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
