import { ReviewCard } from "@/components/review/ReviewCard";
import type { Review } from "@/lib/notion/types";

interface RelatedReviewsProps {
  reviews: Review[];
  /** 첫 번째 매칭 태그 (섹션 부제목용) */
  currentTag?: string;
}

/**
 * 리뷰 상세 하단 — 같은 카테고리 비슷한 책 섹션
 * reviews가 비어 있으면 아무것도 렌더하지 않음
 */
export function RelatedReviews({ reviews, currentTag }: RelatedReviewsProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="mt-12 border-t pt-10">
      <h2 className="text-xl font-semibold">비슷한 책</h2>
      {currentTag && (
        <p className="mt-1 text-sm text-muted-foreground">
          {currentTag} 카테고리의 다른 리뷰
        </p>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
