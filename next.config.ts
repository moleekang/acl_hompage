import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 썸네일/제품 hero 이미지 업로드 한도(5MB)에 맞춰 여유 1MB 추가.
      // 기본 1MB라 그대로 두면 1MB 초과 파일이 "unexpected response" 에러로 떨어진다.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
