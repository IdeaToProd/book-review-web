import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Review } from "@/lib/notion/types"

interface ReviewCardProps {
  review: Review
  /** 첫 번째 카드일 때 이미지를 priority로 로드해 LCP 최적화 */
  priority?: boolean
  className?: string
}

/**
 * 별점을 별 아이콘으로 렌더링
 * @param rating 1~5 사이 정수
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`별점 ${rating}점`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating}.0</span>
    </div>
  )
}

/**
 * 리뷰 카드 컴포넌트
 * 책 표지, 제목, 저자, 리뷰어, 별점, 태그, 요약을 카드 형태로 표시
 */
export function ReviewCard({ review, priority = false, className }: ReviewCardProps) {
  const {
    slug,
    title,
    author,
    reviewer,
    rating,
    tags,
    cover,
    summary,
  } = review

  return (
    <Link
      href={`/reviews/${slug}`}
      className={cn(
        "group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl",
        className
      )}
      aria-label={`${title} - ${author} 리뷰 보기`}
    >
      <Card className="h-full transition-all duration-200 group-hover:ring-2 group-hover:ring-ring/30 group-hover:shadow-md">
        {/* 책 표지 이미지 */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-muted sm:h-56">
          {cover ? (
            <Image
              src={cover}
              alt={`${title} 표지`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            /* 표지 없을 때 플레이스홀더 */
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-4xl text-muted-foreground/30">📚</span>
            </div>
          )}
        </div>

        <CardContent className="flex flex-col gap-2 pt-3">
          {/* 태그 목록 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* 책 제목 */}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* 저자 */}
          <p className="text-xs text-muted-foreground">{author}</p>

          {/* 별점 */}
          <StarRating rating={rating} />

          {/* 요약 */}
          {summary && (
            <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {summary}
            </p>
          )}

          {/* 리뷰어 */}
          <p className="mt-auto pt-1 text-xs text-muted-foreground border-t border-border">
            <span className="font-medium text-foreground">{reviewer}</span>의 리뷰
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
