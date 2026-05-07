"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { softDeleteComment } from "@/app/actions/comments"

interface DeleteCommentButtonProps {
  commentId: string
}

/**
 * 본인 댓글 삭제 버튼 (클라이언트 컴포넌트)
 * softDeleteComment Server Action을 호출하고 결과에 따라 토스트 표시
 */
export function DeleteCommentButton({ commentId }: DeleteCommentButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await softDeleteComment(commentId)
        if (!result.success) {
          toast.error(result.error ?? "댓글 삭제에 실패했습니다.")
          return
        }
        toast.success("댓글이 삭제되었습니다.")
      } catch {
        toast.error("댓글 삭제 중 오류가 발생했습니다.")
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className="text-muted-foreground hover:text-destructive"
      aria-label="댓글 삭제"
      disabled={isPending}
      onClick={handleDelete}
    >
      <Trash2 />
    </Button>
  )
}
