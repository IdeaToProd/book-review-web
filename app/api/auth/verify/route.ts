import { NextRequest, NextResponse } from "next/server";

import { verifyMagicToken } from "@/lib/auth/magicLink";
import { setSession } from "@/lib/auth/session";

/**
 * 매직 링크 토큰 검증 Route Handler
 * GET /api/auth/verify?token=...
 *
 * 1. URL 쿼리에서 token 파라미터 추출
 * 2. JWT 서명·만료 검증
 * 3. 성공: 세션 쿠키 설정 → / 로 redirect
 * 4. 실패: /login?error=invalid 로 redirect
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  // 토큰 파라미터 누락 처리
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url));
  }

  // 토큰 검증
  const email = await verifyMagicToken(token);

  if (!email) {
    // 토큰 만료 또는 서명 불일치
    return NextResponse.redirect(new URL("/login?error=invalid", request.url));
  }

  // 세션 쿠키 설정 (14일 httpOnly)
  await setSession(email);

  // 홈으로 리다이렉트
  return NextResponse.redirect(new URL("/", request.url));
}
