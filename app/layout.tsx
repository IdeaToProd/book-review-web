import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "북 리뷰 아카이브",
    template: "%s | 북 리뷰 아카이브",
  },
  description: "독서 모임 멤버들이 함께 만드는 북 리뷰 아카이브. 노션으로 쓰고 웹으로 나눕니다.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "북 리뷰 아카이브",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
  },
};

/**
 * 루트 레이아웃
 * ThemeProvider로 전체 앱을 감싸 다크모드 지원
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 스킵 내비게이션 — 키보드 사용자가 반복 헤더를 건너뛰고 본문으로 이동 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:shadow-md focus:ring-2 focus:ring-ring"
        >
          본문으로 바로가기
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          {/* 토스트 알림 (sonner) — richColors로 성공/오류 색상 구분 */}
          <Toaster richColors />
          {/* Vercel Web Vitals 수집 */}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
