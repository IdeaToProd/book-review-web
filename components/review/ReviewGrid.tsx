import { cn } from "@/lib/utils"
import { ReviewCard } from "@/components/review/ReviewCard"
import type { Review } from "@/lib/notion/types"

interface ReviewGridProps {
  reviews: Review[]
  className?: string
}

/**
 * 리뷰 카드 그리드 컴포넌트
 * Mobile First: 1열 → sm 2열 → lg 3열 → xl 4열
 * 첫 번째 카드는 priority 이미지 로드로 LCP 최적화
 */
export function ReviewGrid({ reviews, className }: ReviewGridProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16">
        <span className="text-4xl">📚</span>
        <p className="text-sm text-muted-foreground">아직 리뷰가 없습니다.</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {reviews.map((review, index) => (
        <ReviewCard
          key={review.id}
          review={review}
          // 첫 번째 카드만 priority 이미지 로드
          priority={index === 0}
        />
      ))}
    </div>
  )
}
