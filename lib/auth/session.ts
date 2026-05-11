import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/** JWT 서명에 사용할 비밀 키 */
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/** 세션 데이터 인터페이스 */
export interface Session {
  email: string;
  role: "member" | "admin";
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

    // role 필드가 없는 기존 JWT는 'member'로 처리 (하위 호환성)
    const role: "member" | "admin" =
      payload.role === "admin" ? "admin" : "member";

    return { email: payload.email, role };
  } catch {
    // 만료 또는 서명 불일치 시 null 반환
    return null;
  }
}

/**
 * 세션 JWT를 발급하고 httpOnly 쿠키에 저장 (14일 만료)
 * @param email 세션에 저장할 이메일
 * @param role 사용자 권한
 */
export async function setSession(
  email: string,
  role: "member" | "admin"
): Promise<void> {
  const token = await new SignJWT({ email, role })
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
 * 로그인된 멤버 여부 확인 (모든 로그인 사용자 허용)
 * @returns 미인증 시 { error: 'unauthorized' }, 인증 시 null
 */
export async function requireMember(): Promise<{ error: string } | null> {
  const session = await getSession();
  if (!session) return { error: "unauthorized" };
  return null;
}

/**
 * 관리자 권한 확인
 * @returns 비관리자 시 { error: 'unauthorized' }, 관리자 시 null
 */
export async function requireAdmin(): Promise<{ error: string } | null> {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "unauthorized" };
  return null;
}

/**
 * 세션 쿠키 삭제 (로그아웃)
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
