import type { Metadata } from "next";
import { Suspense } from "react";

import { getPublishedReviews } from "@/lib/dummy";
import { DUMMY_REVIEWS } from "@/lib/dummy/reviews";
import { ReviewGrid } from "@/components/review/ReviewGrid";
import { TagFilter } from "@/components/review/TagFilter";
import { SearchBox } from "@/components/review/SearchBox";
import { PaginationWrapper } from "@/components/review/PaginationWrapper";

export const metadata: Metadata = {
  title: "북 리뷰 | 독서 모임 아카이브",
  description:
    "50명 규모 독서 모임의 북 리뷰 아카이브. 리뷰를 탐색하고 토론에 참여하세요.",
};

const PAGE_SIZE = 12;

/** 더미 데이터에서 모든 태그를 중복 없이 추출 */
function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const review of DUMMY_REVIEWS) {
    for (const tag of review.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

interface ReviewsPageProps {
  searchParams: Promise<{
    tag?: string;
    q?: string;
    page?: string;
  }>;
}

/**
 * 리뷰 목록 홈 페이지 (RSC)
 * URL 쿼리(tag, q, page)로 필터링·검색·페이지네이션 처리
 * Phase 3에서 getPublishedReviews import 경로를 lib/notion으로 교체
 */
export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const { tag, q, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  // 더미 데이터에서 필터링된 리뷰 목록 조회
  const { reviews, total } = await getPublishedReviews({
    tag,
    q,
    page: currentPage,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const allTags = getAllTags();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-10">
      {/* 페이지 헤더 */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          북 리뷰
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          독서 모임 멤버들의 리뷰를 탐색하세요.
          {total > 0 && (
            <span className="ml-1 font-medium text-foreground">
              ({total}개)
            </span>
          )}
        </p>
      </header>

      {/* 검색 & 필터 영역 */}
      <div className="mb-6 flex flex-col gap-4">
        {/* Suspense로 감싸야 useSearchParams가 동작 */}
        <Suspense fallback={<div className="h-8 w-full animate-pulse rounded-lg bg-muted" />}>
          <SearchBox />
        </Suspense>

        <Suspense fallback={<div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />}>
          <TagFilter tags={allTags} />
        </Suspense>
      </div>

      {/* 필터 상태 안내 */}
      {(tag || q) && (
        <p className="mb-4 text-sm text-muted-foreground">
          {q && <span>&ldquo;{q}&rdquo; 검색 결과</span>}
          {q && tag && <span> · </span>}
          {tag && <span>태그: {tag}</span>}
          {total === 0 && " — 결과 없음"}
        </p>
      )}

      {/* 리뷰 그리드 */}
      <ReviewGrid reviews={reviews} />

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Suspense>
            <PaginationWrapper
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
