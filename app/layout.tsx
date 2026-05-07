import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          {/* 토스트 알림 (sonner) — richColors로 성공/오류 색상 구분 */}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
