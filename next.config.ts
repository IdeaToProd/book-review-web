import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 더미 데이터용 Unsplash 이미지
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Notion 내부 이미지 (S3 만료 대비 ISR revalidate 60초와 함께 사용)
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com", // 다른 리전 Notion 워크스페이스 대비 유지
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
