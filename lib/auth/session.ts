export interface Session {
  email: string;
}

/**
 * httpOnly 쿠키에서 JWT를 읽어 세션 반환
 * TODO: Phase 3 — jose 설치 후 JWT 검증 구현
 */
export async function getSession(): Promise<Session | null> {
  throw new Error("TODO: Phase 3에서 구현 예정");
}
