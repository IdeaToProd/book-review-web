import { isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints/common";

import { notion } from "./client";
import type { Comment } from "./types";

export interface CreateCommentParams {
  reviewId: string;
  body: string;
  authorEmail: string;
  /** 표시 이름 (이메일 앞부분을 기본값으로 사용) */
  author?: string;
}

// ─────────────────────────────────────────────
// 헬퍼 함수
// ─────────────────────────────────────────────

/**
 * Notion PageObjectResponse를 Comment 타입으로 변환합니다.
 */
function pageToComment(page: PageObjectResponse): Comment {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = page.properties as Record<string, any>;

  return {
    id: page.id,
    // "Book Reviews" relation 첫 번째 항목의 id
    reviewId: props["Book Reviews"]?.relation?.[0]?.id ?? "",
    author: props.Author?.rich_text?.[0]?.plain_text ?? "",
    authorEmail: props.AuthorEmail?.email ?? "",
    body: props.Body?.rich_text?.[0]?.plain_text ?? "",
    // created_time은 page 최상위 속성
    createdAt: page.created_time,
    deleted: props.Deleted?.checkbox ?? false,
  };
}

// ─────────────────────────────────────────────
// 공개 함수
// ─────────────────────────────────────────────

/**
 * 특정 리뷰에 달린 댓글 목록 조회 (Deleted=false, CreatedAt 오름차순)
 * @notionhq/client v5: dataSources.query() 사용
 *
 * @param reviewId 조회할 리뷰의 Notion 페이지 ID
 * @returns Comment[] — 작성 시각 오름차순 정렬
 */
export async function getCommentsByReviewId(
  reviewId: string
): Promise<Comment[]> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_COMMENTS_DB_ID!,
      filter: {
        and: [
          // 해당 리뷰에 연결된 댓글 필터
          { property: "Book Reviews", relation: { contains: reviewId } },
          // 소프트 삭제되지 않은 댓글만
          { property: "Deleted", checkbox: { equals: false } },
        ],
      },
      sorts: [
        // 작성 시각 오름차순 (오래된 댓글이 위에)
        { timestamp: "created_time", direction: "ascending" },
      ],
    });

    return response.results.filter(isFullPage).map(pageToComment);
  } catch (error) {
    console.error(`[Notion] getCommentsByReviewId("${reviewId}") 실패:`, error);
    return [];
  }
}

/**
 * 댓글 생성 — Comments DB에 새 행 추가
 * AuthorEmail은 서버(Server Action)에서 session.email로 강제 세팅됩니다.
 *
 * @param params 댓글 생성 파라미터
 * @returns 생성된 Comment 객체
 */
export async function addComment(params: CreateCommentParams): Promise<Comment> {
  const { reviewId, body, authorEmail, author } = params;
  // 표시 이름이 없으면 이메일 앞부분 사용
  const displayName = author ?? authorEmail.split("@")[0];
  // 고유 ID: 타임스탬프 + 랜덤 문자열
  const commentId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const page = await notion.pages.create({
    parent: { database_id: process.env.NOTION_COMMENTS_DB_ID! },
    properties: {
      // Title 속성 (ID 역할) — 실제 속성명은 "ID   " (공백 3개)
      "ID   ": {
        title: [{ text: { content: commentId } }],
      },
      // Reviews DB와의 Relation 연결 — 실제 속성명은 "Book Reviews"
      "Book Reviews": {
        relation: [{ id: reviewId }],
      },
      // 작성자 표시 이름
      Author: {
        rich_text: [{ text: { content: displayName } }],
      },
      // 작성자 이메일 (Server Action에서 session.email로 강제 세팅)
      AuthorEmail: {
        email: authorEmail,
      },
      // 댓글 본문
      Body: {
        rich_text: [{ text: { content: body } }],
      },
      // 소프트 삭제 플래그 (기본값 false)
      Deleted: {
        checkbox: false,
      },
    },
  });

  if (!isFullPage(page)) {
    throw new Error("[Notion] 댓글 생성 응답이 FullPage가 아닙니다.");
  }

  return pageToComment(page);
}

/**
 * 댓글 소프트 삭제 — Deleted 속성을 true로 업데이트
 * @param commentId 삭제할 댓글의 Notion 페이지 ID
 */
export async function softDeleteComment(commentId: string): Promise<void> {
  await notion.pages.update({
    page_id: commentId,
    properties: {
      Deleted: { checkbox: true },
    },
  });
}
