"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ReviewCard } from "@/components/review/ReviewCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Review } from "@/lib/notion/types";

interface InfiniteReviewListProps {
  initialReviews: Review[];
  totalPages: number;
  tag?: string;
  q?: string;
}

/** 스켈레톤 카드 3개 — 로딩 중 표시 */
function ReviewSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="aspect-[3/4] w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </>
  );
}

/**
 * 인피니트 스크롤 리뷰 목록
 * Intersection Observer로 sentinel이 뷰포트에 진입하면 다음 페이지 자동 로드
 * tag/q 변경 시 부모에서 key로 리마운트해 누적 상태 초기화
 */
export function InfiniteReviewList({
  initialReviews,
  totalPages,
  tag,
  q,
}: InfiniteReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = currentPage < totalPages;

  /** 다음 페이지 fetch 후 누적 */
  const loadNextPage = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage + 1));
      if (tag) params.set("tag", tag);
      if (q) params.set("q", q);

      const res = await fetch(`/api/reviews?${params.toString()}`);
      if (!res.ok) throw new Error("fetch error");

      const data = await res.json();
      setReviews((prev) => [...prev, ...data.items]);
      setCurrentPage((p) => p + 1);
    } catch {
      // 네트워크 오류 시 조용히 무시 — 다음 스크롤 시 재시도
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasMore, isLoading, q, tag]);

  /** sentinel 관찰 */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadNextPage]);

  if (reviews.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        리뷰가 없습니다.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reviews.map((review, i) => (
          <ReviewCard
            key={review.id}
            review={review}
            priority={i < 3}
          />
        ))}
        {/* 스크린 리더용 로딩 상태 알림 */}
        {isLoading && (
          <div role="status" aria-live="polite" aria-label="리뷰 로딩 중" className="sr-only">
            리뷰를 불러오는 중입니다.
          </div>
        )}
        {isLoading && <ReviewSkeleton />}
      </div>

      {/* 센티넬 — 뷰포트 진입 시 다음 페이지 fetch */}
      {hasMore && !isLoading && (
        <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
      )}

      {!hasMore && reviews.length > 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          모든 리뷰를 불러왔습니다.
        </p>
      )}
    </>
  );
}
