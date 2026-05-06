import type { Review } from "./types";

export interface GetPublishedReviewsParams {
  tag?: string;
  q?: string;
  page?: number;
}

export interface GetPublishedReviewsResult {
  reviews: Review[];
  total: number;
}

/**
 * Published 상태 리뷰 목록 조회 (태그 필터, 검색, 페이지네이션)
 * TODO: Phase 3 — Notion Reviews DB query 구현
 */
export async function getPublishedReviews(
  _params: GetPublishedReviewsParams = {}
): Promise<GetPublishedReviewsResult> {
  throw new Error("TODO: Phase 3에서 구현 예정");
}

/**
 * slug로 단일 리뷰 조회 (페이지 블록 포함)
 * TODO: Phase 3 — Notion Reviews DB query + 페이지 블록 fetch 구현
 */
export async function getReviewBySlug(
  _slug: string
): Promise<Review | null> {
  throw new Error("TODO: Phase 3에서 구현 예정");
}
