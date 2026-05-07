import { MessageCircle } from "lucide-react"

import { cn, getAvatarTone } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Comment } from "@/lib/notion/types"
import { DeleteCommentButton } from "./DeleteCommentButton"

interface CommentListProps {
  comments: Comment[]
  /** 현재 로그인된 사용자 이메일 — 본인 댓글 삭제 버튼 표시 여부 결정 */
  currentUserEmail?: string | null
  className?: string
}

/**
 * 작성 시각을 상대 표현으로 변환 (예: "3분 전", "어제")
 */
function formatRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return "방금 전"
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * 이름에서 아바타 이니셜 추출 (예: "김수진" → "김수")
 */
function getInitials(name: string): string {
  return name.slice(0, 2)
}

/**
 * 댓글 목록 컴포넌트 (RSC)
 * 댓글을 작성 시각 오름차순으로 표시
 * currentUserEmail과 일치하는 댓글에만 삭제 버튼 노출
 */
export function CommentList({
  comments,
  currentUserEmail,
  className,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 py-10 text-center",
          className
        )}
      >
        <MessageCircle className="size-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
        </p>
      </div>
    )
  }

  return (
    <ul className={cn("space-y-6", className)} aria-label="댓글 목록">
      {comments.map((comment) => {
        const isOwner =
          currentUserEmail != null &&
          comment.authorEmail === currentUserEmail

        return (
          <li key={comment.id} className="flex gap-3">
            {/* 아바타 */}
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className={cn("text-xs font-medium", getAvatarTone(comment.authorEmail))}>
                {getInitials(comment.author)}
              </AvatarFallback>
            </Avatar>

            {/* 댓글 내용 */}
            <div className="flex-1 min-w-0">
              {/* 작성자 & 시각 */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {comment.author}
                  </span>
                  <time
                    dateTime={comment.createdAt}
                    className="text-xs text-muted-foreground"
                    title={new Date(comment.createdAt).toLocaleString("ko-KR")}
                  >
                    {formatRelativeTime(comment.createdAt)}
                  </time>
                </div>

                {/* 본인 댓글에만 삭제 버튼 표시 */}
                {isOwner && (
                  <DeleteCommentButton commentId={comment.id} />
                )}
              </div>

              {/* 댓글 본문 */}
              <p className="mt-1 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
                {comment.body}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
