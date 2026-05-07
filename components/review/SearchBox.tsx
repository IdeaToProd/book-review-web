"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBoxProps {
  className?: string
}

const DEBOUNCE_MS = 300

/**
 * 검색 박스 내부 컴포넌트
 * URL ?q= 쿼리와 동기화, 300ms debounce 적용
 * key prop 변경으로 외부에서 리마운트해 URL 동기화
 */
function SearchBoxInner({ initialValue, className }: { initialValue: string; className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [value, setValue] = useState(initialValue)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /** URL 쿼리 업데이트 함수 */
  const updateQuery = useCallback(
    (keyword: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (keyword.trim()) {
        params.set("q", keyword.trim())
      } else {
        params.delete("q")
      }
      // 검색어 변경 시 페이지 리셋
      params.delete("page")

      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  /** 입력값 변경 핸들러 — 300ms debounce */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        updateQuery(newValue)
      }, DEBOUNCE_MS)
    },
    [updateQuery]
  )

  /** 검색어 초기화 핸들러 */
  const handleClear = useCallback(() => {
    setValue("")
    if (timerRef.current) clearTimeout(timerRef.current)
    updateQuery("")
  }, [updateQuery])

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className={cn("relative focus-within:ring-2 focus-within:ring-ring rounded-full transition-shadow", className)}>
      {/* 검색 아이콘 */}
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />

      {/* 검색 입력창 — 알약형 */}
      <Input
        type="search"
        placeholder="제목, 저자, 내용으로 검색..."
        value={value}
        onChange={handleChange}
        aria-label="리뷰 검색"
        className="h-12 rounded-full border-border bg-background pl-12 pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      {/* 초기화 버튼 — 입력값이 있을 때만 표시 */}
      {value && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleClear}
          aria-label="검색어 지우기"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
        >
          <X />
        </Button>
      )}
    </div>
  )
}

/**
 * 검색 박스 컴포넌트 (Suspense 경계 내에서 사용)
 * URL ?q= 쿼리를 읽어 초기값으로 전달
 */
export function SearchBox({ className }: SearchBoxProps) {
  const searchParams = useSearchParams()
  const initialValue = searchParams.get("q") ?? ""

  // key를 초기값으로 설정해 URL 변경 시 리마운트
  return (
    <SearchBoxInner
      key={initialValue}
      initialValue={initialValue}
      className={className}
    />
  )
}
