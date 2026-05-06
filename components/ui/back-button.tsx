"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

/**
 * 이전 페이지로 돌아가는 클라이언트 버튼
 * RSC에서 history.back() 직접 사용 불가 문제 해결용
 */
export function BackButton() {
  const router = useRouter()

  return (
    <Button variant="outline" className="gap-2" onClick={() => router.back()}>
      <ArrowLeft className="size-4" aria-hidden />
      이전 페이지
    </Button>
  )
}
