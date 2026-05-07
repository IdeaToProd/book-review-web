import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/** JWT 서명에 사용할 비밀 키 */
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/** 세션 데이터 인터페이스 */
export interface Session {
  email: string;
}

/**
 * httpOnly 쿠키에서 세션 JWT를 읽어 검증 후 세션 반환
 * @returns 세션 객체 또는 null (토큰 없음·만료·서명 불일치)
 */
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (typeof payload.email !== "string") return null;

    return { email: payload.email };
  } catch {
    // 만료 또는 서명 불일치 시 null 반환
    return null;
  }
}

/**
 * 세션 JWT를 발급하고 httpOnly 쿠키에 저장 (14일 만료)
 * @param email 세션에 저장할 이메일
 */
export async function setSession(email: string): Promise<void> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("14d")
    .setIssuedAt()
    .sign(JWT_SECRET);

  const isProduction = process.env.NODE_ENV === "production";
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 14 * 24 * 60 * 60, // 14일 (초 단위)
  });
}

/**
 * 세션 쿠키 삭제 (로그아웃)
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
