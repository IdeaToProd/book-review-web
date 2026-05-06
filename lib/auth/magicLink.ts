/**
 * HMAC 서명 토큰 생성 (만료 15분)
 * TODO: Phase 3 — jose 설치 후 구현
 */
export async function signMagicToken(_email: string): Promise<string> {
  throw new Error("TODO: Phase 3에서 구현 예정");
}

/**
 * 매직 링크 토큰 검증 후 이메일 반환 (만료/무효 시 null)
 * TODO: Phase 3 — jose 설치 후 구현
 */
export async function verifyMagicToken(
  _token: string
): Promise<string | null> {
  throw new Error("TODO: Phase 3에서 구현 예정");
}
