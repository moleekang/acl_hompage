// 로그아웃 라우트 — HTML form POST로도 동작하도록 POST 핸들러로 구현.
// JS 없이 <form action="/auth/signout" method="POST"> 로 호출 가능.

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const url = new URL(request.url);
  return NextResponse.redirect(`${url.origin}/`, { status: 303 });
}
