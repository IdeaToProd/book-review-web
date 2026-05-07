import type { Metadata } from "next";
import { Suspense } from "react";

import { getPublishedReviews } from "@/lib/notion/reviews";
import { InfiniteReviewList } from "@/components/review/InfiniteReviewList";
import { TagFilter } from "@/components/review/TagFilter";
import { SearchBox } from "@/components/review/SearchBox";

export const metadata: Metadata = {
  title: "북 리뷰 | 독서 모임 아카이브",
  description:
    "50명 규모 독서 모임의 북 리뷰 아카이브. 리뷰를 탐색하고 토론에 참여하세요.",
};

const PAGE_SIZE = 12;

/**
 * 리뷰 배열에서 모든 태그를 중복 없이 알파벳 순으로 추출합니다.
 * Notion에서 가져온 실제 데이터를 기반으로 집계합니다.
 */
function extractAllTags(reviews: { tags: string[] }[]): string[] {
  const tagSet = new Set<string>();
  for (const review of reviews) {
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
  }>;
}

/**
 * 리뷰 목록 홈 페이지 (RSC)
 * URL 쿼리(tag, q)로 필터링·검색 처리
 * 페이지네이션은 InfiniteReviewList에서 인피니트 스크롤로 처리
 */
export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const { tag, q } = await searchParams;

  // 첫 페이지 RSC에서 사전 렌더 (LCP 보존)
  const { reviews, total } = await getPublishedReviews({ tag, q, page: 1 });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // 태그 필터 목록: 필터 적용 전 전체 Published 리뷰에서 집계
  // (현재 필터 상태와 무관하게 모든 태그가 UI에 표시되어야 함)
  const { reviews: allReviews } = await getPublishedReviews({});
  const allTags = extractAllTags(allReviews);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-10">
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
        <Suspense fallback={<div className="h-12 w-full animate-pulse rounded-full bg-muted" />}>
          <SearchBox />
        </Suspense>

        <Suspense fallback={<div className="h-8 w-48 animate-pulse rounded-full bg-muted" />}>
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

      {/* 인피니트 스크롤 리뷰 목록 — tag/q 변경 시 key로 리마운트 */}
      <InfiniteReviewList
        key={`${tag ?? ""}-${q ?? ""}`}
        initialReviews={reviews}
        totalPages={totalPages}
        tag={tag}
        q={q}
      />
    </div>
  );
}
