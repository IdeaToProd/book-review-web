"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { LogIn, Send } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createComment } from "@/app/actions/comments"

const MAX_LENGTH = 1000

interface CommentFormValues {
  body: string
}

interface CommentFormProps {
  reviewId: string
  /** 현재 로그인 여부 — false면 로그인 유도 UI 표시 */
  isLoggedIn: boolean
  className?: string
}

/**
 * 댓글 작성 폼 컴포넌트 (클라이언트)
 * 최대 1000자 textarea + 글자수 카운터
 * 로그인 안 된 경우 로그인 유도 안내 표시
 * Phase 3에서 createComment() Server Action 연결
 */
export function CommentForm({
  reviewId,
  isLoggedIn,
  className,
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    defaultValues: { body: "" },
  })

  const bodyValue = watch("body")
  const charCount = bodyValue.length

  /** 댓글 제출 핸들러 */
  const onSubmit = async (data: CommentFormValues) => {
    setIsSubmitting(true)
    try {
      // createComment Server Action 호출
      const result = await createComment({ reviewId, body: data.body })
      if (!result.success) {
        toast.error(result.error ?? "댓글 등록에 실패했습니다.")
        return
      }
      toast.success("댓글이 등록되었습니다.")
      reset()
    } catch {
      toast.error("댓글 등록에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 비로그인 상태 — 로그인 유도 UI
  if (!isLoggedIn) {
    return (
      <Alert className={cn("border-dashed", className)}>
        <LogIn className="size-4" aria-hidden />
        <AlertDescription className="flex items-center gap-2">
          <span>댓글을 작성하려면 로그인이 필요합니다.</span>
          <Button variant="link" size="sm" className="h-auto p-0" nativeButton={false} render={<Link href="/login" />}>
            로그인하기
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-3", className)}
      aria-label="댓글 작성"
      noValidate
    >
      {/* 댓글 입력 textarea */}
      <div className="relative">
        <Textarea
          {...register("body", {
            required: "댓글 내용을 입력해주세요.",
            maxLength: {
              value: MAX_LENGTH,
              message: `댓글은 최대 ${MAX_LENGTH}자까지 작성할 수 있습니다.`,
            },
            validate: (value) =>
              value.trim().length > 0 || "공백만으로는 댓글을 작성할 수 없습니다.",
          })}
          placeholder="독서 모임 멤버들과 생각을 나눠보세요..."
          aria-label="댓글 내용"
          aria-describedby={errors.body ? "comment-error" : "comment-counter"}
          aria-invalid={!!errors.body}
          className={cn(
            "resize-none pb-6",
            errors.body && "border-destructive"
          )}
          rows={3}
          maxLength={MAX_LENGTH}
          disabled={isSubmitting}
        />

        {/* 글자수 카운터 */}
        <span
          id="comment-counter"
          className={cn(
            "absolute bottom-2 right-2.5 text-xs tabular-nums",
            charCount > MAX_LENGTH * 0.9
              ? "text-destructive"
              : "text-muted-foreground"
          )}
          aria-live="polite"
          aria-atomic
        >
          {charCount}/{MAX_LENGTH}
        </span>
      </div>

      {/* 유효성 에러 메시지 */}
      {errors.body && (
        <p
          id="comment-error"
          role="alert"
          className="text-xs text-destructive"
        >
          {errors.body.message}
        </p>
      )}

      {/* 제출 버튼 */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || charCount === 0 || charCount > MAX_LENGTH}
          className="gap-2"
        >
          <Send className="size-3.5" aria-hidden />
          {isSubmitting ? "등록 중..." : "댓글 등록"}
        </Button>
      </div>
    </form>
  )
}
