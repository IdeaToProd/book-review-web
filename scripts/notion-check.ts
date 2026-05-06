/**
 * 노션 DB 연결 및 접근 권한 검증 스크립트
 * 실행: npx tsx scripts/notion-check.ts
 * 사전 요건: .env.local에 NOTION_TOKEN, NOTION_REVIEWS_DB_ID, NOTION_COMMENTS_DB_ID 설정
 *
 * @notionhq/client 신버전(2026-03-11 API)에서 DB 스키마 속성은
 * databases.retrieve 응답에 포함되지 않음. DB 접근 가능 여부만 검증.
 */

import { Client, isFullDatabase } from "@notionhq/client";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_REVIEWS_DB_ID = process.env.NOTION_REVIEWS_DB_ID;
const NOTION_COMMENTS_DB_ID = process.env.NOTION_COMMENTS_DB_ID;

/** 환경 변수 검증 */
function validateEnv(): void {
  const missing: string[] = [];
  if (!NOTION_TOKEN) missing.push("NOTION_TOKEN");
  if (!NOTION_REVIEWS_DB_ID) missing.push("NOTION_REVIEWS_DB_ID");
  if (!NOTION_COMMENTS_DB_ID) missing.push("NOTION_COMMENTS_DB_ID");

  if (missing.length > 0) {
    console.error("❌ 누락된 환경 변수:", missing.join(", "));
    process.exit(1);
  }
  console.log("✅ 환경 변수 확인 완료");
}

/** DB 접근 가능 여부 및 기본 정보 검증 */
async function checkDbAccess(
  notion: Client,
  dbId: string,
  dbName: string
): Promise<void> {
  console.log(`\n📋 ${dbName} DB 검증 중... (ID: ${dbId})`);

  const db = await notion.databases.retrieve({ database_id: dbId });

  if (!isFullDatabase(db)) {
    console.log(`  ⚠️ ${dbName}: DB에 접근했으나 읽기 권한이 없음`);
    console.log(`     → 노션 Integration 공유 설정 확인 필요`);
    return;
  }

  const title = db.title.map((t) => t.plain_text).join("");
  console.log(`  ✅ DB 접근 성공`);
  console.log(`  📌 DB 제목: ${title}`);
  console.log(`  🔗 URL: ${db.url}`);

  /** 권장 속성 목록 (노션에서 수동으로 확인할 것) */
  const requiredProps =
    dbName === "Book Reviews"
      ? ["Title", "Author", "Slug", "Reviewer", "ReviewerEmail", "Rating", "Tags", "Cover", "Status", "PublishedAt", "Summary"]
      : ["Author", "AuthorEmail", "Book Reviews", "Body", "CreatedAt", "Deleted"];

  console.log(`\n  📝 수동으로 확인할 필수 속성 목록:`);
  requiredProps.forEach((prop) => console.log(`     - ${prop}`));
  console.log(`\n  → 노션 DB에 위 속성이 모두 있는지 직접 확인하세요.`);
  console.log(`  → 특히 Cover(Files&media), Body(Rich text) 속성은 직접 추가 필요할 수 있습니다.`);
}

async function main(): Promise<void> {
  console.log("=== 노션 DB 검증 스크립트 ===\n");
  console.log("⚠️  주의: @notionhq/client 신버전(2026-03-11 API)에서");
  console.log("   databases.query → dataSources.query 로 변경됨.");
  console.log("   Phase 3 구현 시 docs/notion-schema.md 참고할 것.\n");

  validateEnv();

  const notion = new Client({ auth: NOTION_TOKEN! });

  await checkDbAccess(notion, NOTION_REVIEWS_DB_ID!, "Book Reviews");
  await checkDbAccess(notion, NOTION_COMMENTS_DB_ID!, "Book Comments");

  console.log("\n=== 검증 완료 ===");
}

main().catch((err) => {
  console.error("오류 발생:", err);
  process.exit(1);
});
