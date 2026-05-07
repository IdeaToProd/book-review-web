import { SignJWT, jwtVerify } from "jose";

/** JWT 서명에 사용할 비밀 키 (환경 변수에서 읽음) */
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/**
 * 매직 링크용 단기 JWT 토큰 발급 (15분 만료)
 * @param email 로그인 요청 이메일
 * @returns 서명된 JWT 문자열
 */
export async function signMagicToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

/**
 * 매직 링크 토큰 검증 후 이메일 반환 (만료·무효 시 null)
 * @param token 검증할 JWT 문자열
 * @returns 이메일 문자열 또는 null
 */
export async function verifyMagicToken(
  token: string
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    // 만료·서명 불일치 등 모든 검증 오류는 null 반환
    return null;
  }
}
