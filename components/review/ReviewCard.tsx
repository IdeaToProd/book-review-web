import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"
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
      <Card className="h-full pt-0 transition-all duration-200 group-hover:ring-2 group-hover:ring-ring/30 group-hover:shadow-md">
        {/* 책 표지 이미지 — 16:9 비율 */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          {cover ? (
            <Image
              src={cover}
              alt={`${title} 표지`}
              fill
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            /* 표지 없을 때 플레이스홀더 */
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-3xl text-muted-foreground/30">📚</span>
            </div>
          )}
        </div>

        {/*
          gap-* 대신 각 요소에 mt-* 를 개별 적용해 성격별 차등 간격 구성
          - 태그: 콘텐츠 시작점, 상단 패딩(pt-3)만 사용
          - 제목: 태그와 카테고리↔콘텐츠 구분을 위해 mt-2
          - 저자: 제목의 보조 정보이므로 mt-1 로 밀착
          - 별점: 저자와 성격이 달라 mt-2 로 시각적 분리
          - 요약: 별점 뒤 부가 설명, mt-2
        */}
        <CardContent className="flex flex-col pt-3">
          {/* 태그 목록 — -ml-1 로 칩 px 패딩을 상쇄해 제목/저자와 좌측 정렬 */}
          {tags.length > 0 && (
            <div className="-ml-1 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 책 제목 — 태그와 카테고리↔콘텐츠 구분을 위해 mt-2 */}
          <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>

          {/* 저자 — 제목의 보조 정보, mt-1 로 밀착 배치 */}
          <p className="mt-1 text-xs text-muted-foreground">{author}</p>

          {/* 별점 — 저자와 성격이 달라 mt-2 로 시각적 분리 */}
          <div className="mt-2">
            <StarRating rating={rating} />
          </div>

          {/* 요약 — 별점 뒤 부가 설명, mt-2 */}
          {summary && (
            <p className="mt-2 mb-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {summary}
            </p>
          )}

          {/*
            리뷰어 — mt-auto 로 카드 하단 고정 (flex 잔여 공간 흡수)
            pt-3 으로 구분선과 텍스트 사이 내부 여백 확보
            구분선 위 시각적 여백은 mt-auto 가 충분히 처리함
          */}
          <p className="mt-auto border-t border-border pt-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{reviewer}</span>의 리뷰
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
