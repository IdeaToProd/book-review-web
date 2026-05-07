/**
 * Notion 클라이언트 싱글턴
 * 서버 전용 모듈 — 클라이언트 번들에 포함되지 않도록 주의
 */

import { Client } from "@notionhq/client";
import { env } from "@/lib/env";

/** Notion API 클라이언트 싱글턴 인스턴스 — 모듈 로드 시 env 검증 자동 실행 */
export const notion = new Client({ auth: env.NOTION_TOKEN });
