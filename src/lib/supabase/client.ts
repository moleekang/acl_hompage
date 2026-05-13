"use client";

// 브라우저(Client Component)에서 사용하는 Supabase 클라이언트.
// 세션은 자동으로 쿠키와 동기화된다.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
