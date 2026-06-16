// /privacy — 개인정보처리방침
// 구글 OAuth consent screen 게시 요건 + 실제 수집 항목(구글 이메일·프로필, Supabase 저장, 활동 로그) 반영.
// 운영 주체: AICON · 개인정보 보호책임자: 박정기 (sunman112233@gmail.com)

import Link from "next/link";
import { FadeUp } from "@/components/aiconlab/fade-up";

export const metadata = {
  title: "개인정보처리방침 · AICONLAB",
  description: "AICON이 수집·이용하는 개인정보 항목과 처리 방침 안내.",
};

const CONTACT_EMAIL = "sunman112233@gmail.com";
const PRIVACY_OFFICER = "박정기";
const EFFECTIVE_DATE = "2026년 6월 16일";

type Section = { heading: string; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    heading: "1. 총칙",
    body: (
      <p>
        AICON(이하 “회사”)은 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」 등 관련
        법령을 준수합니다. 본 방침은 AICONLAB 웹사이트(aicon.lol, 이하 “서비스”)에서 수집하는
        개인정보의 항목과 그 이용·보관·파기에 관한 사항을 안내합니다.
      </p>
    ),
  },
  {
    heading: "2. 수집하는 개인정보 항목",
    body: (
      <>
        <p>회사는 다음의 개인정보를 수집합니다.</p>
        <ul>
          <li>
            <b>구글 계정 로그인 시</b>: 이메일 주소, 프로필 이름(닉네임), 프로필 이미지(아바타)
          </li>
          <li>
            <b>이메일 회원가입 시</b>: 이메일 주소, 비밀번호(암호화 저장)
          </li>
          <li>
            <b>서비스 이용 과정에서 자동 생성</b>: 접속 일시, 로그인·페이지 이용 기록(활동 로그),
            회원 등급·상태
          </li>
        </ul>
        <p>
          회사는 사상·신념, 건강, 성생활 등 민감정보 및 주민등록번호 등 고유식별정보를 수집하지
          않습니다.
        </p>
      </>
    ),
  },
  {
    heading: "3. 개인정보의 수집 및 이용 목적",
    body: (
      <ul>
        <li>회원 식별 및 인증(구글 OAuth·이메일 로그인)</li>
        <li>멤버십 등급 부여·관리 및 멤버 전용 콘텐츠 제공</li>
        <li>서비스 운영, 콘텐츠 작성자 표시, 문의 응대</li>
        <li>서비스 이용 통계 분석을 통한 품질 개선</li>
      </ul>
    ),
  },
  {
    heading: "4. 개인정보의 보유 및 이용 기간",
    body: (
      <p>
        회사는 원칙적으로 회원 탈퇴 시 또는 수집·이용 목적이 달성되면 해당 정보를 지체 없이
        파기합니다. 다만 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다. 회원은
        언제든지 탈퇴를 요청할 수 있으며, 요청 시 보유 정보는 즉시 파기됩니다.
      </p>
    ),
  },
  {
    heading: "5. 개인정보의 처리위탁 및 제3자 제공",
    body: (
      <>
        <p>
          회사는 안정적인 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁하고 있으며, 그 외
          이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
        </p>
        <ul>
          <li>
            <b>Google LLC</b> — 구글 계정 기반 로그인(OAuth) 인증 처리
          </li>
          <li>
            <b>Supabase Inc.</b> — 회원 데이터 저장 및 인증 인프라 운영(데이터베이스·호스팅)
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "6. 쿠키의 사용",
    body: (
      <p>
        회사는 로그인 상태 유지를 위해 인증 세션 쿠키를 사용합니다. 이용자는 브라우저 설정에서
        쿠키 저장을 거부할 수 있으나, 이 경우 로그인 등 일부 기능 이용이 제한될 수 있습니다.
      </p>
    ),
  },
  {
    heading: "7. 이용자의 권리",
    body: (
      <p>
        이용자는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를 요청할 수 있습니다.
        요청은 아래 개인정보 보호책임자의 이메일로 접수하며, 회사는 지체 없이 필요한 조치를
        취합니다.
      </p>
    ),
  },
  {
    heading: "8. 개인정보의 안전성 확보 조치",
    body: (
      <p>
        회사는 비밀번호 암호화 저장, 접근 권한 통제, 전송 구간 암호화(HTTPS) 등 개인정보를
        안전하게 관리하기 위한 기술적·관리적 조치를 시행합니다.
      </p>
    ),
  },
  {
    heading: "9. 개인정보 보호책임자",
    body: (
      <ul>
        <li>운영 주체: AICON</li>
        <li>개인정보 보호책임자: {PRIVACY_OFFICER}</li>
        <li>
          문의: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </li>
      </ul>
    ),
  },
  {
    heading: "10. 방침의 변경",
    body: (
      <p>
        본 개인정보처리방침은 법령·서비스 변경에 따라 수정될 수 있으며, 변경 시 본 페이지를 통해
        공지합니다.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="aicon-section" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div className="aicon-container" style={{ maxWidth: 760 }}>
        <FadeUp>
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            PRIVACY · 개인정보처리방침
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            개인정보처리방침
          </h1>
          <p
            className="mono"
            style={{ fontSize: 13, color: "var(--fg-3)", marginBottom: 40 }}
          >
            시행일: {EFFECTIVE_DATE}
          </p>
        </FadeUp>

        <div
          className="privacy-doc"
          style={{ display: "flex", flexDirection: "column", gap: 32, fontSize: 15, lineHeight: 1.75, color: "var(--fg-2)" }}
        >
          {SECTIONS.map((s) => (
            <FadeUp key={s.heading}>
              <section className="privacy-block">
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--fg-1)",
                    marginBottom: 10,
                  }}
                >
                  {s.heading}
                </h2>
                {s.body}
              </section>
            </FadeUp>
          ))}
        </div>

        <FadeUp>
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px dashed var(--border-1)" }}>
            <Link href="/" style={{ color: "var(--text-mint)", fontWeight: 700, textDecoration: "none" }}>
              ← 메인으로
            </Link>
          </div>
        </FadeUp>
      </div>
    </main>
  );
}
