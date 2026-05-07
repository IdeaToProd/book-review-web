/**
 * Notion 클라이언트 싱글턴
 * 서버 전용 모듈 — 클라이언트 번들에 포함되지 않도록 주의
 */

import { Client } from "@notionhq/client";

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

/** Notion API 클라이언트 싱글턴 인스턴스 */
export const notion = new Client({ auth: process.env.NOTION_TOKEN });
