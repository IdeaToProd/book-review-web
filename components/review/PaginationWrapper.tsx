"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"

import { Pagination } from "@/components/ui/pagination"

interface PaginationWrapperProps {
  currentPage: number
  totalPages: number
}

/**
 * 페이지네이션 래퍼 컴포넌트
 * URL ?page= 쿼리와 동기화하는 클라이언트 컴포넌트
 * RSC 페이지에서 Pagination을 URL과 연동하기 위해 분리
 */
export function PaginationWrapper({
  currentPage,
  totalPages,
}: PaginationWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  /** 페이지 변경 핸들러 */
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      if (page === 1) {
        params.delete("page")
      } else {
        params.set("page", String(page))
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  )
}
