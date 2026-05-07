"use server";

import { updateTag } from "next/cache";
import { isFullPage } from "@notionhq/client";

import { getSession } from "@/lib/auth/session";
import {
  addComment,
  softDeleteComment as notionSoftDeleteComment,
} from "@/lib/notion/comments";
import { notion } from "@/lib/notion/client";

/**
 * 댓글 작성 Server Action
 *
 * 흐름:
 * 1. 세션 검증 — 미로그인 시 에러 반환
 * 2. 본문 유효성 검사 (공백·1000자 초과)
 * 3. Notion Comments DB insert (AuthorEmail은 session.email로 강제 세팅)
 * 4. updateTag로 댓글 캐시 즉시 무효화
 */
export async function createComment(params: {
  reviewId: string;
  body: string;
}): Promise<{ success: boolean; error?: string }> {
  // 세션 검증
  const session = await getSession();
  if (!session) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 본문 유효성 검사
  if (!params.body.trim()) {
    return { success: false, error: "댓글 내용을 입력해주세요." };
  }
  if (params.body.length > 1000) {
    return { success: false, error: "댓글은 최대 1000자까지 작성할 수 있습니다." };
  }

  try {
    // Notion 댓글 생성 (AuthorEmail은 서버에서 session.email로 강제 세팅)
    await addComment({
      reviewId: params.reviewId,
      body: params.body,
      authorEmail: session.email,
    });

    // 해당 리뷰의 댓글 캐시 즉시 무효화 (read-your-own-writes)
    updateTag(`comments:${params.reviewId}`);

    return { success: true };
  } catch (error) {
    console.error("[Action] createComment 실패:", error);
    return { success: false, error: "댓글 등록 중 오류가 발생했습니다." };
  }
}

/**
 * 댓글 소프트 삭제 Server Action
 *
 * 흐름:
 * 1. 세션 검증
 * 2. 댓글 페이지 조회 → AuthorEmail === session.email 검증
 * 3. Deleted=true 업데이트
 * 4. updateTag로 댓글 캐시 즉시 무효화
 */
export async function softDeleteComment(
  commentId: string
): Promise<{ success: boolean; error?: string }> {
  // 세션 검증
  const session = await getSession();
  if (!session) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    // 댓글 페이지 조회하여 권한 확인
    const page = await notion.pages.retrieve({ page_id: commentId });

    if (!isFullPage(page)) {
      return { success: false, error: "댓글을 찾을 수 없습니다." };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = page.properties as Record<string, any>;
    const authorEmail: string = props.AuthorEmail?.email ?? "";

    // 본인 댓글인지 검증
    if (authorEmail !== session.email) {
      return { success: false, error: "본인이 작성한 댓글만 삭제할 수 있습니다." };
    }

    // reviewId 추출 (캐시 무효화에 사용)
    const reviewId: string = props.Review?.relation?.[0]?.id ?? "";

    // 소프트 삭제 실행
    await notionSoftDeleteComment(commentId);

    // 해당 리뷰의 댓글 캐시 즉시 무효화
    if (reviewId) {
      updateTag(`comments:${reviewId}`);
    }

    return { success: true };
  } catch (error) {
    console.error("[Action] softDeleteComment 실패:", error);
    return { success: false, error: "댓글 삭제 중 오류가 발생했습니다." };
  }
}
