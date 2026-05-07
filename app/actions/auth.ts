"use server";

import { Resend } from "resend";

import { signMagicToken } from "@/lib/auth/magicLink";

/** Resend 클라이언트 (서버 전용) */
const resend = new Resend(process.env.RESEND_API_KEY!);

/**
 * APP_URL에서 도메인(호스트)을 추출합니다.
 * 예: "https://mybookreview.com" → "mybookreview.com"
 */
function extractDomain(appUrl: string): string {
  try {
    return new URL(appUrl).hostname;
  } catch {
    return "example.com";
  }
}

/**
 * 매직 링크 발송 요청 Server Action
 * 허용/비허용 이메일 모두 동일한 성공 응답 반환 (이메일 존재 여부 노출 방지)
 *
 * @param email 로그인 요청 이메일
 * @returns { success: boolean; error?: string }
 */
export async function requestMagicLink(
  email: string
): Promise<{ success: boolean; error?: string }> {
  // 이메일 형식 검증
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "올바른 이메일 주소를 입력해주세요." };
  }

  // 허용 이메일 화이트리스트 확인
  const allowedEmails = (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  // 허용된 이메일인 경우에만 토큰 생성 및 발송
  if (allowedEmails.includes(email)) {
    try {
      const token = await signMagicToken(email);
      const appUrl = process.env.APP_URL ?? "http://localhost:3000";
      const verifyUrl = `${appUrl}/api/auth/verify?token=${token}`;
      const domain = extractDomain(appUrl);

      await resend.emails.send({
        from: `북 리뷰 아카이브 <noreply@${domain}>`,
        to: email,
        subject: "북 리뷰 로그인 링크",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="font-size: 20px; font-weight: 700; color: #111;">북 리뷰 아카이브 로그인</h2>
            <p style="color: #555; line-height: 1.6;">
              아래 버튼을 클릭해 로그인하세요. 링크는 <strong>15분</strong> 후 만료됩니다.
            </p>
            <a
              href="${verifyUrl}"
              style="display: inline-block; margin: 16px 0; padding: 12px 24px; background-color: #111; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;"
            >
              로그인하기
            </a>
            <p style="font-size: 12px; color: #999;">
              이 이메일을 요청하지 않았다면 무시하셔도 됩니다.
            </p>
          </div>
        `,
      });
    } catch (error) {
      // 이메일 발송 실패 시 서버 로그만 남기고 클라이언트에는 성공 응답
      console.error("[Auth] 매직 링크 발송 실패:", error);
    }
  }

  // 허용/비허용 모두 동일한 성공 응답 반환 (보안: 이메일 존재 여부 노출 금지)
  return { success: true };
}
