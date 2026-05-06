"use server";

/**
 * 인증 Server Action
 * TODO: Phase 3 — ALLOWED_EMAILS 검증 및 Resend 매직 링크 발송 구현
 */

/**
 * 매직 링크 발송 요청
 * 허용/비허용 이메일 모두 동일한 성공 응답 반환 (이메일 존재 추측 방지)
 * TODO: ALLOWED_EMAILS 화이트리스트 검증 → Resend로 서명 토큰 포함 링크 발송
 */
export async function requestMagicLink(
  _email: string
): Promise<{ success: boolean; error?: string }> {
  // TODO: if (!_email || !_email.includes("@")) return { success: false, error: "올바른 이메일을 입력하세요." }
  // TODO: const allowedEmails = process.env.ALLOWED_EMAILS?.split(",") ?? []
  // TODO: if (allowedEmails.includes(email)) { 토큰 생성 → Resend 발송 }
  // TODO: 허용/비허용 동일 응답 반환 (보안 — 이메일 존재 여부 노출 금지)
  return { success: false, error: "TODO: 미구현" };
}
