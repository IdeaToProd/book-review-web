import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getReviewBySlug, getRelatedReviews, getAllPublishedSlugs } from "@/lib/notion/reviews";
import { getSession } from "@/lib/auth/session";
import { getCommentsByReviewId } from "@/lib/notion/comments";
import { ReviewBody } from "@/components/review/ReviewBody";
import { RelatedReviews } from "@/components/review/RelatedReviews";
import { CommentList } from "@/components/comment/CommentList";
import { CommentForm } from "@/components/comment/CommentForm";
import { Separator } from "@/components/ui/separator";

/** 빌드 미생성 slug는 on-demand ISR로 처리 (신규 리뷰 즉시 접근 가능) */
export const dynamicParams = true;

/** 빌드 시 Published 리뷰 전체를 정적 생성 — 신규 리뷰는 ISR 60초로 처리 */
export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const review = await getReviewBySlug(slug);

  if (!review) {
    return { title: "리뷰를 찾을 수 없습니다" };
  }

  const description = review.summary ?? `${review.reviewer}의 ${review.title} 리뷰`;
  const ogImages = review.cover ? [{ url: review.cover, alt: `${review.title} 표지` }] : [];

  return {
    title: `${review.title} — ${review.author}`,
    description,
    openGraph: {
      title: `${review.title} — ${review.author}`,
      description,
      type: "article",
      ...(ogImages.length > 0 && { images: ogImages }),
    },
    twitter: {
      card: review.cover ? "summary_large_image" : "summary",
      title: `${review.title} — ${review.author}`,
      description,
      ...(review.cover && { images: [review.cover] }),
    },
  };
}

/**
 * 리뷰 상세 페이지 (RSC)
 * 세션 JWT 검증 후 댓글 작성·삭제 권한 결정
 */
export default async function ReviewDetailPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const review = await getReviewBySlug(slug);

  if (!review) {
    notFound();
  }

  const [comments, relatedReviews] = await Promise.all([
    getCommentsByReviewId(review.id),
    getRelatedReviews(review.slug, review.tags, 4),
  ]);

  // 실제 세션 조회 (JWT 검증)
  const session = await getSession();
  const currentUserEmail = session?.email ?? null;
  const isLoggedIn = session != null;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
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

        <CommentList
          comments={comments}
          currentUserEmail={currentUserEmail}
          className="mb-8"
        />

        <CommentForm
          reviewId={review.id}
          isLoggedIn={isLoggedIn}
        />
      </section>

      {/* 비슷한 책 섹션 */}
      <RelatedReviews reviews={relatedReviews} currentTag={review.tags[0]} />
    </div>
  );
}
