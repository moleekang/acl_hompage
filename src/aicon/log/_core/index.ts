// Aicon Log core — env gate + HTTP transport.
// SERVER ONLY: holds AICON_LOG_API_KEY. Never import from client components
// (client code must go through the /api/aicon-log proxy instead).
// Self-contained (no imports) so node scripts can load it directly for smoke tests.

if (typeof window !== "undefined") {
  throw new Error(
    "[aicon-log] _core is server-only — import it from server code; client components must use the /api/aicon-log proxy",
  );
}

export type AiconLogPath = "/call/logs" | "/menu/logs" | "/event/logs";

export type AiconLogResult = {
  ok: boolean;
  status: number;
  data?: unknown;
} | null;

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

/** Master gate — AICON_LOG_ENABLED=false (or missing BASE_URL/KEY) means zero network calls. */
export function isActive(): boolean {
  const enabled = env("AICON_LOG_ENABLED").toLowerCase();
  if (enabled === "false" || enabled === "0") return false;
  return env("AICON_LOG_BASE_URL") !== "" && env("AICON_LOG_API_KEY") !== "";
}

function timeoutMs(): number {
  const sec = Number(env("AICON_LOG_TIMEOUT_SECONDS") || "5");
  return (Number.isFinite(sec) && sec > 0 ? sec : 5) * 1000;
}

/**
 * Awaitable POST to the Aicon Log server. Never throws — failures return { ok:false }.
 * Returns null when the gate is off (no network call at all).
 */
export async function postAiconLog(
  path: AiconLogPath,
  body: Record<string, unknown>,
  opts?: { testHeader?: boolean },
): Promise<AiconLogResult> {
  if (!isActive()) return null;
  const base = env("AICON_LOG_BASE_URL").replace(/\/+$/, "");
  try {
    const res = await fetch(base + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": env("AICON_LOG_API_KEY"),
        ...(opts?.testHeader ? { "X-AICON-Test": "1" } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs()),
    });
    let data: unknown = null;
    try {
      data = await res.json();
    } catch {
      // non-JSON body — ignore
    }
    if (!res.ok) {
      console.warn(`[aicon-log] ${path} -> ${res.status}`, JSON.stringify(data)?.slice(0, 300));
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.warn(`[aicon-log] ${path} failed:`, err instanceof Error ? err.message : err);
    return { ok: false, status: 0 };
  }
}

/** Fire-and-forget variant — never blocks or throws into the caller's flow. */
export function fireAiconLog(path: AiconLogPath, body: Record<string, unknown>): void {
  if (!isActive()) return;
  try {
    void postAiconLog(path, body);
  } catch {
    // absorb — logging must never break the host request
  }
}
