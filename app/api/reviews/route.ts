import { NextRequest, NextResponse } from "next/server";

import { getPublishedReviews } from "@/lib/notion/reviews";

const PAGE_SIZE = 12;

/**
 * 리뷰 목록 API — 인피니트 스크롤에서 다음 페이지 fetch에 사용
 * Phase 3에서 lib/notion으로 교체 시 이 핸들러만 수정하면 됨
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tag = searchParams.get("tag") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const { reviews, total } = await getPublishedReviews({ tag, q, page });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return NextResponse.json({
    items: reviews,
    page,
    totalPages,
    hasMore: page < totalPages,
  });
}
