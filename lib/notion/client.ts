/**
 * Notion 클라이언트 — Phase 3에서 @notionhq/client 설치 후 실제 초기화 구현
 * 현재는 필수 env 변수 존재 여부만 검증
 */

/** 필수 Notion 환경 변수 검증 */
export function validateNotionEnv(): void {
  const required = [
    "NOTION_TOKEN",
    "NOTION_REVIEWS_DB_ID",
    "NOTION_COMMENTS_DB_ID",
  ] as const;

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Notion 환경 변수 누락: ${missing.join(", ")}\n.env.local 파일을 확인하세요.`
    );
  }
}

// TODO: Phase 3 — @notionhq/client 설치 후 아래 코드 활성화
// import { Client } from "@notionhq/client";
// export const notion = new Client({ auth: process.env.NOTION_TOKEN });
