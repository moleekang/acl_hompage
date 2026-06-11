// 로그아웃 라우트 — HTML form POST로도 동작하도록 POST 핸들러로 구현.
// JS 없이 <form action="/auth/signout" method="POST"> 로 호출 가능.

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { logActivityEvent } from "@/aicon/log/activity/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  await supabase.auth.signOut();

  // Aicon Log L1 — user_logout (fire-and-forget)
  if (data.user?.email) {
    logActivityEvent("user_logout", { userId: data.user.email });
  }

  const url = new URL(request.url);
  return NextResponse.redirect(`${url.origin}/`, { status: 303 });
}
