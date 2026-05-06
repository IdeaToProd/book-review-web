import { NextRequest, NextResponse } from "next/server";

/**
 * 매직 링크 토큰 검증 Route Handler
 * TODO: Phase 3 — 실제 구현
 * 1. URL 쿼리에서 token 파라미터 추출
 * 2. HMAC 서명 검증 + 만료(15분) 확인
 * 3. JWT 발급 → httpOnly cookie(14일) 설정
 * 4. / 로 redirect
 */
export async function GET(_request: NextRequest) {
  // TODO: const token = request.nextUrl.searchParams.get("token")
  // TODO: const payload = verifyMagicToken(token)
  // TODO: if (!payload) return NextResponse.json({ error: "유효하지 않은 링크입니다." }, { status: 400 })
  // TODO: const sessionToken = signSessionToken({ email: payload.email })
  // TODO: response.cookies.set("session", sessionToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 14 })
  // TODO: return NextResponse.redirect(new URL("/", request.url))

  return NextResponse.json({ message: "TODO: 매직 링크 검증 미구현" });
}
