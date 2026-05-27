"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { requireAdmin } from "./_auth";

const BUCKET = "public-assets";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
// 화이트리스트로 정확히 통제 — SVG는 <script> 내장 가능 → stored-XSS 위험이라 제외.
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// 파일명에서 알파벳·숫자·점·하이픈만 남기고 나머지는 하이픈으로 치환
function safeFilename(original: string): string {
  return original.replace(/[^a-zA-Z0-9.\-]/g, "-").toLowerCase();
}

// 공통 이미지 업로드 — prefix로 스토리지 폴더 분기 (products | posts | notes)
export async function uploadAdminImage(
  formData: FormData,
  prefix: "products" | "posts" | "notes",
): Promise<{ url: string }> {
  await requireAdmin();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("file 필드가 없거나 File 타입이 아닙니다.");
  }
  if (!ALLOWED_MIMES.includes(file.type)) {
    throw new Error(`허용되지 않는 형식입니다. 가능: ${ALLOWED_MIMES.join(", ")}`);
  }
  if (file.size > MAX_SIZE) {
    throw new Error("파일 크기는 5MB 이하여야 합니다.");
  }

  const ext = safeFilename(file.name);
  const path = `${prefix}/${randomUUID()}-${ext}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const admin = createAdminClient();
  const { error } = await admin.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(`업로드 실패: ${error.message}`);

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

// products 전용 래퍼 — 기존 호출처 호환
export async function uploadProductImage(formData: FormData): Promise<{ url: string }> {
  return uploadAdminImage(formData, "products");
}
