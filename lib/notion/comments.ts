import type { Comment } from "./types";

export interface CreateCommentParams {
  reviewId: string;
  body: string;
  authorEmail: string;
}

/**
 * 리뷰에 달린 댓글 목록 조회 (Deleted=false, CreatedAt 오름차순)
 * TODO: Phase 3 — Notion Comments DB query 구현
 */
export async function getCommentsByReviewId(
  _reviewId: string
): Promise<Comment[]> {
  throw new Error("TODO: Phase 3에서 구현 예정");
}

/**
 * 댓글 생성
 * TODO: Phase 3 — Notion Comments DB insert 구현
 */
export async function createComment(
  _params: CreateCommentParams
): Promise<Comment> {
  throw new Error("TODO: Phase 3에서 구현 예정");
}

/**
 * 댓글 soft delete (Deleted=true 업데이트)
 * TODO: Phase 3 — Notion Comments DB update 구현
 */
export async function softDeleteComment(_commentId: string): Promise<void> {
  throw new Error("TODO: Phase 3에서 구현 예정");
}
