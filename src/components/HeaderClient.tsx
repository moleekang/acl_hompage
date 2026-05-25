// 헤더의 클라이언트 파트 — 모바일 토글 상태 + 유저 표시/로그아웃.
// Header(서버 컴포넌트)가 userDisplay를 prop으로 전달한다.

"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

// 헤더 메뉴 정의 — 4개 메뉴 + 멤버십 CTA = 5개
const navItems = [
  { label: "자동화앱", href: "/products" },
  { label: "공유회", href: "/insights" },
  { label: "팀 블로그", href: "/log" },
  { label: "단톡방", href: "/community" },
];

interface Props {
  userDisplay: string | null;
}

export function HeaderClient({ userDisplay }: Props) {
  // 모바일 메뉴 토글 상태
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // /admin 영역에서는 메인 헤더 숨김 (admin 자체 사이드바를 사용)
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        // 헤더 배경 = 순백색 (본문 페이퍼 베이지와 시각 분리)
        background: "var(--surface-1)",
        // 진한 보더 + 부드러운 아래 그림자로 영역 구분 강화
        borderColor: "var(--border-2)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <nav className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* ===== 좌측: 브랜드 로고 ===== */}
        <Link
          href="/"
          className="font-serif text-xl tracking-tight"
          onClick={() => setIsOpen(false)}
        >
          ✦ AICONLAB
        </Link>

        {/* ===== 중앙: 데스크톱 메뉴 (md 이상에서만 노출) ===== */}
        <ul className="hidden md:flex md:items-center md:gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-md px-4 py-2 text-[15px] font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* ===== 우측: 유저 상태 + 멤버십 CTA + 모바일 햄버거 ===== */}
        <div className="flex items-center gap-2">
          {userDisplay ? (
            // 로그인 상태: 닉네임/이메일 표시 + 로그아웃 버튼
            <>
              <span
                className="hidden md:inline text-[13px]"
                style={{ color: "var(--fg-2)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {userDisplay}
              </span>
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="hidden md:inline-flex rounded-md px-3 py-1.5 text-[13px] font-medium"
                  style={{
                    border: "1px solid var(--border-1)",
                    background: "transparent",
                    color: "var(--fg-2)",
                    cursor: "pointer",
                  }}
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            // 비로그인 상태: 로그인 링크
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden md:inline-flex rounded-md px-4"
            >
              <Link href="/login">로그인</Link>
            </Button>
          )}

          {/* 멤버십 — 데스크톱에서만 노출 (모바일은 드로어 안에서 표시) */}
          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex rounded-md bg-primary px-4 text-primary-foreground hover:bg-[var(--ink-700)]"
          >
            <Link href="/membership">멤버십</Link>
          </Button>

          {/* 햄버거 버튼 — 모바일에서만 노출 */}
          <button
            type="button"
            className="rounded-md p-2 text-foreground hover:bg-secondary md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isOpen ? (
              // X 아이콘 (열림 → 닫기)
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              // 햄버거 아이콘 (3줄)
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ===== 모바일 메뉴 (드로어) — 햄버거 눌렀을 때만 노출 ===== */}
      {isOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <ul className="container mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <Button
                asChild
                className="w-full rounded-md bg-primary text-primary-foreground hover:bg-[var(--ink-700)]"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/membership">멤버십 무료 가입</Link>
              </Button>
            </li>
            {/* 모바일 드로어: 로그인/로그아웃 */}
            <li className="mt-1">
              {userDisplay ? (
                <form action="/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="block w-full rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-secondary text-left"
                    onClick={() => setIsOpen(false)}
                  >
                    로그아웃 ({userDisplay})
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="block rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  로그인
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
