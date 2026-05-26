import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";

// Next.js dev 서버는 .env.local을 자동 로드하지만 Playwright는 그렇지 않다.
// cleanup 헬퍼가 service role 키를 필요로 해서 여기서 직접 주입.
try {
  const envText = fs.readFileSync(".env.local", "utf8");
  for (const raw of envText.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // .env.local 없을 수도 있음 — 그땐 process.env에 직접 셋된 값을 쓴다.
}

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
