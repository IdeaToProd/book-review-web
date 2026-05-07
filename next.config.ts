import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 더미 데이터용 Unsplash 이미지
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Notion 내부 이미지 — 리전별 S3 버킷 와일드카드 허용
      // (Notion은 사용자 리전에 따라 다른 S3 버킷 사용: us-west-2, ap-northeast-1 등)
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "notion.so",
      },
      {
        protocol: "https",
        hostname: "*.notion.so",
      },
    ],
  },
};

export default nextConfig;
