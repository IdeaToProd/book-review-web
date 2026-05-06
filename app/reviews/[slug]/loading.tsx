import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

/**
 * 리뷰 상세 페이지 로딩 스켈레톤
 * ReviewBody 레이아웃과 동일한 구조 (메타 헤더 + 본문 + 댓글 섹션)
 */
export default function ReviewDetailLoading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12" aria-busy="true" aria-label="리뷰 상세 불러오는 중">
      {/* 헤더 영역 스켈레톤 */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        {/* 책 표지 */}
        <Skeleton className="mx-auto h-56 w-40 shrink-0 rounded-xl sm:mx-0 sm:h-64 sm:w-44" />

        {/* 메타 정보 */}
        <div className="flex flex-1 flex-col gap-3">
          {/* 태그 */}
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-10 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>

          {/* 제목 */}
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />

          {/* 저자 */}
          <Skeleton className="h-5 w-32" />

          {/* 별점 */}
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="size-5 rounded-sm" />
            ))}
          </div>

          {/* 요약 */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />

          {/* 리뷰어 & 날짜 */}
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      <Separator className="mb-10" />

      {/* 본문 블록 스켈레톤 */}
      <div className="flex flex-col gap-3">
        {/* heading_2 */}
        <Skeleton className="h-6 w-40" />
        {/* paragraph */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />

        <div className="mt-2" />

        {/* heading_2 */}
        <Skeleton className="h-6 w-48" />
        {/* bulleted list */}
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex gap-2 pl-4">
            <Skeleton className="mt-1.5 size-2 shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1" style={{ maxWidth: `${75 + i * 10}%` }} />
          </div>
        ))}

        <div className="mt-2" />

        {/* quote */}
        <div className="border-l-4 border-muted pl-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-3/4" />
        </div>

        <div className="mt-2" />

        {/* paragraph */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-9/12" />

        <div className="mt-2" />

        {/* code block */}
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>

      <Separator className="my-12" />

      {/* 댓글 섹션 스켈레톤 */}
      <div>
        <Skeleton className="mb-6 h-6 w-16" />

        {/* 댓글 목록 */}
        <div className="space-y-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>

        {/* 댓글 입력 */}
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-20 w-full rounded-lg" />
          <div className="flex justify-end">
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
