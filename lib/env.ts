/** 서버 런타임 필수 환경변수 목록 */
const requiredEnvVars = [
  "NOTION_TOKEN",
  "NOTION_REVIEWS_DB_ID",
  "NOTION_COMMENTS_DB_ID",
  "RESEND_API_KEY",
  "JWT_SECRET",
  "ALLOWED_EMAILS",
  "APP_URL",
] as const;

/** 빌드 또는 서버 기동 시 필수 환경변수 누락 감지 */
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`[env] 환경변수 ${key}가 설정되지 않았습니다. .env.local 또는 Vercel Dashboard를 확인하세요.`);
  }
}

export const env = {
  NOTION_TOKEN: process.env.NOTION_TOKEN!,
  NOTION_REVIEWS_DB_ID: process.env.NOTION_REVIEWS_DB_ID!,
  NOTION_COMMENTS_DB_ID: process.env.NOTION_COMMENTS_DB_ID!,
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  JWT_SECRET: process.env.JWT_SECRET!,
  ALLOWED_EMAILS: process.env.ALLOWED_EMAILS!,
  APP_URL: process.env.APP_URL!,
} as const;
