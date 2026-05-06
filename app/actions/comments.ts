"use server";

/**
 * 댓글 Server Action
 * TODO: Phase 3 — 세션 검증 및 Notion Comments DB 연동 구현
 */

/**
 * 댓글 작성
 * TODO: 세션 검증 → 1000자/공백 검증 → Notion insert → revalidateTag
 */
export async function createComment(_params: {
  reviewId: string;
  body: string;
}): Promise<{ success: boolean; error?: string }> {
  // TODO: const session = await getSession()
  // TODO: if (!session) return { success: false, error: "로그인이 필요합니다." }
  // TODO: if (!params.body.trim() || params.body.length > 1000) return { success: false, error: "댓글 내용을 확인하세요." }
  // TODO: await addComment({ reviewId: params.reviewId, body: params.body, authorEmail: session.email })
  // TODO: revalidateTag("comments:" + params.reviewId)
  return { success: false, error: "TODO: 미구현" };
}

/**
 * 댓글 삭제 (soft delete)
 * TODO: AuthorEmail === session.email 검증 후 Notion Deleted=true 업데이트
 */
export async function softDeleteComment(
  _commentId: string
): Promise<{ success: boolean; error?: string }> {
  // TODO: const session = await getSession()
  // TODO: if (!session) return { success: false, error: "로그인이 필요합니다." }
  // TODO: 댓글 조회 → AuthorEmail === session.email 검증
  // TODO: Notion Deleted=true 업데이트
  // TODO: revalidateTag("comments:" + reviewId)
  return { success: false, error: "TODO: 미구현" };
}
