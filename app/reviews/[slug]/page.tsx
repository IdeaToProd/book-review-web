import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { getReviewBySlug, getCommentsByReviewId } from "@/lib/dummy";
import { ReviewBody } from "@/components/review/ReviewBody";
import { CommentList } from "@/components/comment/CommentList";
import { CommentForm } from "@/components/comment/CommentForm";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * 동적 메타데이터 생성
 * Phase 3에서 Notion API로 교체 시 그대로 사용 가능
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const review = await getReviewBySlug(slug);

  if (!review) {
    return { title: "리뷰를 찾을 수 없습니다" };
  }

  return {
    title: `${review.title} — ${review.author} 리뷰 | 북 리뷰 아카이브`,
    description: review.summary ?? `${review.reviewer}의 ${review.title} 리뷰`,
  };
}

/**
 * 리뷰 상세 페이지 (RSC)
 * 개발용 세션: __dev_session 쿠키 값을 이메일로 사용
 * (예: 쿠키 값 "hyunwoo@example.com" 설정 시 해당 이메일로 로그인된 상태 시뮬레이션)
 * Phase 3에서 getSession()으로 교체
 */
export default async function ReviewDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const review = await getReviewBySlug(slug);

  // 해당 슬러그의 리뷰가 없으면 404
  if (!review) {
    notFound();
  }

  // 더미 댓글 조회
  const comments = await getCommentsByReviewId(review.id);

  // 개발용 임시 세션: __dev_session 쿠키로 로그인 상태 시뮬레이션
  const cookieStore = await cookies();
  const devSession = cookieStore.get("__dev_session");
  const currentUserEmail = devSession?.value ?? null;
  const isLoggedIn = currentUserEmail != null;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* 리뷰 본문 (메타 + 블록 렌더링) */}
      <ReviewBody review={review} />

      {/* 댓글 섹션 */}
      <Separator className="my-12" />
      <section aria-label="토론 댓글">
        <h2 className="mb-6 text-lg font-semibold">
          토론
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({comments.length})
            </span>
          )}
        </h2>

        {/* 댓글 목록 */}
        <CommentList
          comments={comments}
          currentUserEmail={currentUserEmail}
          className="mb-8"
        />

        {/* 댓글 작성 폼 */}
        <CommentForm
          reviewId={review.id}
          isLoggedIn={isLoggedIn}
        />
      </section>
    </div>
  );
}
