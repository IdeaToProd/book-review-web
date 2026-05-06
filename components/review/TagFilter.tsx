"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface TagFilterProps {
  /** 표시할 태그 목록 */
  tags: string[]
  className?: string
}

/**
 * 태그 필터 컴포넌트
 * 태그 버튼 클릭 시 URL ?tag= 쿼리와 동기화
 * 이미 선택된 태그 클릭 시 필터 해제
 */
export function TagFilter({ tags, className }: TagFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTag = searchParams.get("tag") ?? ""

  /** 태그 클릭 핸들러 — URL 쿼리 동기화 */
  const handleTagClick = useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (tag === currentTag) {
        // 이미 선택된 태그 클릭 시 필터 해제
        params.delete("tag")
      } else {
        params.set("tag", tag)
        // 태그 변경 시 페이지를 1로 리셋
        params.delete("page")
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [currentTag, pathname, router, searchParams]
  )

  if (tags.length === 0) return null

  return (
    <nav aria-label="태그 필터" className={cn("flex flex-wrap gap-2", className)}>
      {/* 전체 보기 버튼 */}
      <Button
        variant={currentTag === "" ? "default" : "outline"}
        size="sm"
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString())
          params.delete("tag")
          params.delete("page")
          router.push(`${pathname}?${params.toString()}`)
        }}
        aria-pressed={currentTag === ""}
      >
        전체
      </Button>

      {/* 태그 버튼 목록 */}
      {tags.map((tag) => (
        <Button
          key={tag}
          variant={currentTag === tag ? "default" : "outline"}
          size="sm"
          onClick={() => handleTagClick(tag)}
          aria-pressed={currentTag === tag}
        >
          {tag}
        </Button>
      ))}
    </nav>
  )
}
