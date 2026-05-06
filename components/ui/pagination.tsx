import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/** 페이지네이션 컨테이너 Props */
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

/**
 * 페이지네이션 컴포넌트
 * 이전/다음 버튼 + 페이지 번호 버튼으로 구성
 * 페이지가 많을 때 줄임표(…)로 생략 처리
 */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  /** 표시할 페이지 번호 배열 생성 */
  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      // 전체 페이지가 7개 이하면 모두 표시
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | "ellipsis")[] = [1]

    if (currentPage <= 4) {
      // 앞쪽에 가까울 때
      pages.push(2, 3, 4, 5, "ellipsis", totalPages)
    } else if (currentPage >= totalPages - 3) {
      // 뒤쪽에 가까울 때
      pages.push(
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      )
    } else {
      // 중간일 때
      pages.push(
        "ellipsis",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "ellipsis",
        totalPages
      )
    }

    return pages
  }

  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers()

  return (
    <nav
      role="navigation"
      aria-label="페이지 이동"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {/* 이전 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft />
      </Button>

      {/* 페이지 번호 버튼 */}
      {pageNumbers.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex size-7 items-center justify-center text-muted-foreground"
            aria-hidden
          >
            <MoreHorizontal className="size-4" />
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => onPageChange(page)}
            aria-label={`${page}페이지`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        )
      )}

      {/* 다음 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="다음 페이지"
      >
        <ChevronRight />
      </Button>
    </nav>
  )
}

export { Pagination }
export type { PaginationProps }
