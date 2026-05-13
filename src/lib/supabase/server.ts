// Server Component / Server Action / Route Handler에서 쓰는 Supabase 클라이언트.
// Next.js 16의 cookies()는 async이므로 await 필요.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Server Component 렌더 도중에는 set이 막혀있다 — 그땐 그냥 삼킨다.
          // Server Action / Route Handler에서 호출될 때만 실제 set 수행.
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component에서 호출됐을 때. middleware가 세션 갱신을 따로 처리하니 무시 OK.
          }
        },
      },
    },
  );
}

// service_role 키로 만든 admin 클라이언트.
// RLS를 우회한다 — 서버 전용 라우트에서만, 권한 검증 후에만 사용.
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
