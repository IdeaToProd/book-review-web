"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"

import { cn } from "@/lib/utils"

interface TagFilterProps {
  /** 표시할 태그 목록 */
  tags: string[]
  className?: string
}

/** 알약형 칩 — 활성/비활성 상태에 따라 스타일 변경 */
function Chip({
  active,
  onClick,
  children,
  "aria-pressed": ariaPressed,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  "aria-pressed": boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ariaPressed}
      className={cn(
        "inline-flex cursor-pointer items-center rounded-full border px-3.5 py-1 text-sm transition-colors",
        active
          ? "border-primary bg-primary font-medium text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary"
      )}
    >
      {children}
    </button>
  )
}

/**
 * 태그 필터 컴포넌트
 * 알약형 칩 토글 — URL ?tag= 쿼리와 동기화
 */
export function TagFilter({ tags, className }: TagFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTag = searchParams.get("tag") ?? ""

  const handleTagClick = useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (tag === currentTag) {
        params.delete("tag")
      } else {
        params.set("tag", tag)
        params.delete("page")
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [currentTag, pathname, router, searchParams]
  )

  if (tags.length === 0) return null

  return (
    <nav aria-label="태그 필터" className={cn("flex flex-wrap gap-2", className)}>
      {/* 전체 칩 */}
      <Chip
        active={currentTag === ""}
        aria-pressed={currentTag === ""}
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString())
          params.delete("tag")
          params.delete("page")
          router.push(`${pathname}?${params.toString()}`)
        }}
      >
        전체
      </Chip>

      {/* 태그 칩 목록 */}
      {tags.map((tag) => (
        <Chip
          key={tag}
          active={currentTag === tag}
          aria-pressed={currentTag === tag}
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </Chip>
      ))}
    </nav>
  )
}
