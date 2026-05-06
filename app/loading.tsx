import { Skeleton } from "@/components/ui/skeleton";

/**
 * 리뷰 목록 로딩 스켈레톤
 * ReviewGrid 레이아웃과 동일한 구조로 12개 카드 표시
 */
function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl ring-1 ring-foreground/10">
      {/* 표지 이미지 영역 */}
      <Skeleton className="h-48 w-full rounded-t-xl rounded-b-none sm:h-56" />

      {/* 카드 본문 */}
      <div className="flex flex-col gap-2 p-4">
        {/* 태그 */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-10 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>

        {/* 제목 */}
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        {/* 저자 */}
        <Skeleton className="h-3.5 w-20" />

        {/* 별점 */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="size-3.5 rounded-sm" />
          ))}
        </div>

        {/* 요약 */}
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />

        {/* 리뷰어 */}
        <Skeleton className="mt-2 h-3.5 w-28 border-t border-border pt-2" />
      </div>
    </div>
  );
}

/**
 * 홈 페이지 로딩 상태 (Next.js 라우트 세그먼트 로딩)
 * Suspense 경계가 자동으로 이 컴포넌트를 스트리밍 중에 표시
 */
export default function HomeLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-10">
      {/* 헤더 스켈레톤 */}
      <div className="mb-8 flex flex-col gap-2">
        <Skeleton className="h-8 w-32 sm:h-9 sm:w-40" />
        <Skeleton className="h-4 w-64 sm:h-5" />
      </div>

      {/* 검색 & 필터 스켈레톤 */}
      <div className="mb-6 flex flex-col gap-4">
        <Skeleton className="h-8 w-full" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-7 w-14 rounded-md" />
          ))}
        </div>
      </div>

      {/* 그리드 스켈레톤 — ReviewGrid와 동일한 반응형 구조 */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-busy="true"
        aria-label="리뷰 목록 불러오는 중"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
