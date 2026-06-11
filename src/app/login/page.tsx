// 로그인 페이지 — Google OAuth + 이메일/비밀번호 탭 전환.
// 이메일 입력은 @가 없으면 자동으로 @aiconlab.local을 붙여 Supabase에 보낸다 (관리자 약식 로그인용).

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { trackClientEvent } from "@/aicon/log/activity/client";

type Tab = "google" | "email";
type EmailMode = "login" | "signup";

const INTERNAL_EMAIL_DOMAIN = "aiconlab.local";

/** Open-redirect 방지: 같은 오리진의 경로만 허용한다. */
function safeNext(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return "/";
}

/** "admin" 같은 약식 입력에 @aiconlab.local을 자동으로 붙여준다. */
function toEmail(input: string): string {
  const v = input.trim();
  return v.includes("@") ? v : `${v}@${INTERNAL_EMAIL_DOMAIN}`;
}

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  missing_code: "OAuth 코드가 전달되지 않았습니다. 다시 시도해주세요.",
};

function oauthErrorMessage(code: string | null): string | null {
  if (!code) return null;
  return OAUTH_ERROR_MESSAGES[code] ?? "알 수 없는 오류가 발생했습니다.";
}

function LoginInner() {
  const params = useSearchParams();
  const router = useRouter();
  const oauthError = oauthErrorMessage(params.get("error"));
  const isAdminLogin = (params.get("next") ?? "").startsWith("/admin");

  const [tab, setTab] = useState<Tab>(isAdminLogin ? "email" : "google");
  const [emailMode, setEmailMode] = useState<EmailMode>("login");
  const [busy, setBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function signInWithGoogle() {
    setBusy(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (authError) {
      console.error(authError);
      setBusy(false);
    }
    // 성공 시 Google로 리다이렉트되므로 setBusy(false) 불필요.
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (emailMode === "signup" && password !== confirm) {
      setFormError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const finalEmail = toEmail(email);

    if (emailMode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: finalEmail,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setBusy(false);
      if (error) {
        setFormError(error.message);
        return;
      }
      if (data.session) {
        trackClientEvent("user_signup", { pagePath: "/login" }); // Aicon Log L1
        router.replace("/");
      } else {
        setSuccessMsg(
          "확인 메일을 보냈습니다. 메일의 링크를 클릭하면 가입이 완료됩니다.",
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password,
      });
      setBusy(false);
      if (error) {
        setFormError(error.message);
        return;
      }
      trackClientEvent("user_signin", { pagePath: "/login" }); // Aicon Log L1
      router.replace(safeNext(params.get("next")));
    }
  }

  const tabBtn = (id: Tab, label: string) => (
    <button
      type="button"
      onClick={() => {
        setTab(id);
        setFormError(null);
        setSuccessMsg(null);
      }}
      style={{
        flex: 1,
        padding: "8px 0",
        background: tab === id ? "var(--ink-900)" : "transparent",
        color: tab === id ? "#FFFFFF" : "var(--fg-2)",
        border: "1px solid var(--border-1)",
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background .12s ease, color .12s ease",
      }}
    >
      {label}
    </button>
  );

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    background: "var(--bg-canvas)",
    border: "1px solid var(--border-1)",
    borderRadius: 8,
    fontSize: 14,
    color: "var(--paper-ink)",
    outline: "none",
    boxSizing: "border-box",
  };

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
          {isAdminLogin ? "운영자 로그인" : "AICONLAB 시작하기"}
        </div>
        <p
          style={{
            color: "var(--fg-2)",
            fontSize: 15,
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          {isAdminLogin
            ? "AICONLAB 어드민 콘솔. 운영자 계정으로 로그인하세요."
            : "가입 후 위키 접근은 운영자가 별도로 승급해드립니다."}
        </p>

        {/* 탭 전환 */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {tabBtn("google", "Google로 시작하기")}
          {tabBtn("email", "이메일로 시작하기")}
        </div>

        {/* Google 탭 */}
        {tab === "google" && (
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={busy}
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
              opacity: busy ? 0.7 : 1,
              transition: "transform .12s ease, background .12s ease",
            }}
          >
            <GoogleMark />
            {busy ? "Google로 이동 중..." : "Google로 시작하기"}
          </button>
        )}

        {/* 이메일 탭 */}
        {tab === "email" && (
          <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type={emailMode === "signup" ? "email" : "text"}
              placeholder={emailMode === "signup" ? "이메일" : "이메일 또는 ID (예: admin)"}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete={emailMode === "signup" ? "email" : "username"}
              style={inputStyle}
              disabled={busy}
            />
            <input
              type="password"
              placeholder="비밀번호"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={emailMode === "signup" ? "new-password" : "current-password"}
              style={inputStyle}
              disabled={busy}
            />
            {emailMode === "signup" && (
              <input
                type="password"
                placeholder="비밀번호 확인"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                style={inputStyle}
                disabled={busy}
              />
            )}

            <button
              type="submit"
              disabled={busy}
              style={{
                width: "100%",
                padding: "13px 18px",
                background: "var(--ink-900)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 700,
                cursor: busy ? "wait" : "pointer",
                opacity: busy ? 0.7 : 1,
                transition: "opacity .12s ease",
              }}
            >
              {busy
                ? "처리 중..."
                : emailMode === "login"
                  ? "이메일 로그인"
                  : "가입하기"}
            </button>

            {/* 로그인 ↔ 회원가입 전환 */}
            <div style={{ textAlign: "center", fontSize: 13, color: "var(--fg-2)" }}>
              {emailMode === "login" ? (
                <>
                  계정이 없으신가요?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setEmailMode("signup");
                      setFormError(null);
                      setSuccessMsg(null);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--paper-ink)",
                      fontWeight: 700,
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: 13,
                    }}
                  >
                    회원가입
                  </button>
                </>
              ) : (
                <>
                  이미 계정이 있으신가요?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setEmailMode("login");
                      setFormError(null);
                      setSuccessMsg(null);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--paper-ink)",
                      fontWeight: 700,
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: 13,
                    }}
                  >
                    로그인
                  </button>
                </>
              )}
            </div>
          </form>
        )}

        {/* OAuth 에러 (쿼리 파라미터) */}
        {oauthError && (
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
            {oauthError}
          </div>
        )}

        {/* 폼 에러 */}
        {formError && (
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
            {formError}
          </div>
        )}

        {/* 성공 메시지 (이메일 확인 발송) */}
        {successMsg && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 14px",
              background: "rgba(60,180,80,0.10)",
              border: "1px dashed #3cb450",
              borderRadius: 4,
              color: "#2a7a30",
              fontSize: 13,
            }}
          >
            {successMsg}
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
