// AICONLAB 로고 마크 — 검정 라운드 사각형 + 민트 원 + ▶ 재생 삼각형
// (라이브 다큐멘터리 채널 정체성을 압축)
type LogoMarkProps = {
  size?: number;
};

export function LogoMark({ size = 32 }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <rect width="120" height="120" rx="20" fill="#0E1116" />
      <g transform="translate(60 60)">
        <circle r="38" fill="#7CF5C4" />
        <circle r="38" fill="none" stroke="#0E1116" strokeWidth="3" />
        <path d="M -10 -14 L -10 14 L 16 0 Z" fill="#0E1116" />
      </g>
    </svg>
  );
}
