// SSR ↔ CSR hydration mismatch 방지용 날짜 포맷터.
// Node ICU와 브라우저 ICU의 toLocaleString 출력이 미묘하게 달라 hydration이 깨지므로
// Asia/Seoul = UTC+9 고정으로 직접 포맷한다. (한국은 DST 없음)

function shiftToSeoul(iso: string | Date): Date {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Date(d.getTime() + 9 * 3600 * 1000);
}

const pad2 = (n: number) => String(n).padStart(2, "0");

// "2026-05-16 14:23" 형식
export function formatDateKr(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = shiftToSeoul(iso);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())} ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`;
}

// "2026-05-16" 형식 (시각 없음)
export function formatDateKrShort(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = shiftToSeoul(iso);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}
