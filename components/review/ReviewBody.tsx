import Image from "next/image"
import { Star, User, BookOpen } from "lucide-react"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { NotionBlockRenderer } from "@/lib/notion/render"
import type { Review } from "@/lib/notion/types"

interface ReviewBodyProps {
  review: Review
  className?: string
}

/**
 * 별점을 별 아이콘으로 렌더링
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`별점 ${rating}점`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-5",
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
      <span className="ml-1.5 text-sm font-semibold text-foreground">
        {rating}<span className="text-muted-foreground font-normal">/5</span>
      </span>
    </div>
  )
}

/**
 * 리뷰 상세 컴포넌트
 * 상단: 책 표지·제목·저자·리뷰어·별점·태그 메타 정보
 * 하단: 노션 블록 본문 렌더링
 */
export function ReviewBody({ review, className }: ReviewBodyProps) {
  const {
    title,
    author,
    reviewer,
    rating,
    tags,
    cover,
    summary,
    publishedAt,
    blocks,
  } = review

  // 게시 날짜 포맷
  const formattedDate = new Date(publishedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className={cn(className)}>
      {/* 상단 메타 영역 */}
      <header className="mb-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* 책 표지 */}
          <div className="relative mx-auto h-56 w-40 shrink-0 overflow-hidden rounded-xl bg-muted shadow-lg sm:mx-0 sm:h-64 sm:w-44">
            {cover ? (
              <Image
                src={cover}
                alt={`${title} 표지`}
                fill
                sizes="(max-width: 640px) 160px, 176px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <BookOpen className="size-12 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* 메타 정보 */}
          <div className="flex flex-1 flex-col gap-3">
            {/* 태그 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* 책 제목 */}
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>

            {/* 저자 */}
            <p className="text-base text-muted-foreground">
              <span className="font-medium text-foreground">{author}</span> 지음
            </p>

            {/* 별점 */}
            <StarRating rating={rating} />

            {/* 요약 */}
            {summary && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {summary}
              </p>
            )}

            {/* 리뷰어 & 날짜 */}
            <div className="mt-auto flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="size-4" aria-hidden />
                <span className="font-medium text-foreground">{reviewer}</span> 작성
              </span>
              <Separator orientation="vertical" className="h-4" />
              <time dateTime={publishedAt}>{formattedDate}</time>
            </div>
          </div>
        </div>
      </header>

      <Separator className="mb-10" />

      {/* 본문 블록 렌더링 */}
      <section aria-label="리뷰 본문">
        {blocks && blocks.length > 0 ? (
          <NotionBlockRenderer blocks={blocks} />
        ) : (
          <p className="text-sm italic text-muted-foreground">
            본문이 아직 없습니다.
          </p>
        )}
      </section>
    </article>
  )
}
