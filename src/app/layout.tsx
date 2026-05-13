import type { Metadata } from "next";
import { Gaegu, Gowun_Dodum, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

// ============================================================
// AICONLAB 디자인 시스템 v2 — 폰트 로딩
// - Gaegu       : 손글씨 display (모든 헤드라인·강조 카피)
// - Gowun Dodum : 둥근 한글 sans (본문·UI·캡션 — single weight 400)
// - JetBrains Mono : 모노스페이스 (데이터·코드·시간/숫자)
// next/font가 CSS 변수로 주입 → globals.css의 --font-display / --font-body 가 받음
// ============================================================

// 손글씨 display 폰트 (Google Fonts) — 가벼움 300 / 본문 400 / 강조 700
const gaegu = Gaegu({
  variable: "--font-gaegu",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

// 둥근 한글 sans body 폰트 — Gowun Dodum은 단일 weight(400)만 제공
const gowunDodum = Gowun_Dodum({
  variable: "--font-gowun-dodum",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// 코드/숫자용 모노스페이스
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// 메타데이터: 검색·SNS 공유 시 노출되는 정보
export const metadata: Metadata = {
  title: "AICONLAB · AI로 1인 기업을 자동화하는 라이브 실험실",
  description:
    "프롬프트 너머의 컨텍스트로, 1인 기업을 통째로 자동화해 가는 한 사람의 과정을 통째로 나누며 시청자와 함께 쌓아가는 AI 실험실.",
};

// 모든 페이지를 감싸는 최상위 레이아웃
// lang="ko"로 한국어 사이트 명시 → 자동 줄바꿈/접근성 도구가 한국어 처리
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${gaegu.variable} ${gowunDodum.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 헤더는 모든 페이지 상단 고정 (sticky) */}
        <Header />
        {/* 각 페이지 콘텐츠가 들어가는 자리 (flex-1로 풋터를 화면 하단에 고정) */}
        <main className="flex-1">{children}</main>
        {/* 풋터는 모든 페이지 하단 자동 노출 */}
        <Footer />
      </body>
    </html>
  );
}
