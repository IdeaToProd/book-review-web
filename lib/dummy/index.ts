/**
 * Phase 2 개발용 더미 데이터 provider.
 * Phase 3에서 실제 Notion API로 교체 시 import 경로만 변경하면 됨.
 * 함수 시그니처는 lib/notion/reviews.ts, lib/notion/comments.ts와 완전 동일.
 */

import type { Comment, Review } from "@/lib/notion/types";
import type {
  GetPublishedReviewsParams,
  GetPublishedReviewsResult,
} from "@/lib/notion/reviews";
import type { CreateCommentParams } from "@/lib/notion/comments";
import { DUMMY_REVIEWS } from "./reviews";
import { DUMMY_COMMENTS } from "./comments";

const PAGE_SIZE = 12;

/**
 * Published 상태 리뷰 목록 조회 (태그 필터, 검색, 페이지네이션)
 */
export async function getPublishedReviews(
  params: GetPublishedReviewsParams = {}
): Promise<GetPublishedReviewsResult> {
  const { tag, q, page = 1 } = params;

  let reviews = DUMMY_REVIEWS.filter((r) => r.status === "Published");

  if (tag) {
    reviews = reviews.filter((r) =>
      r.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  if (q) {
    const keyword = q.toLowerCase();
    reviews = reviews.filter(
      (r) =>
        r.title.toLowerCase().includes(keyword) ||
        r.author.toLowerCase().includes(keyword) ||
        (r.summary?.toLowerCase().includes(keyword) ?? false)
    );
  }

  reviews = [...reviews].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const total = reviews.length;
  const start = (page - 1) * PAGE_SIZE;
  const paginated = reviews.slice(start, start + PAGE_SIZE);

  return { reviews: paginated, total };
}

/**
 * slug로 단일 리뷰 조회 (페이지 블록 포함)
 */
export async function getReviewBySlug(slug: string): Promise<Review | null> {
  const review = DUMMY_REVIEWS.find((r) => r.slug === slug) ?? null;
  if (!review) return null;

  return {
    ...review,
    blocks: getDummyBlocks(review.title),
  };
}

/**
 * 리뷰에 달린 댓글 목록 조회 (deleted=false, createdAt 오름차순)
 */
export async function getCommentsByReviewId(reviewId: string): Promise<Comment[]> {
  const comments = DUMMY_COMMENTS[reviewId] ?? [];
  return comments
    .filter((c) => !c.deleted)
    .sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

/**
 * 댓글 생성 (더미 — 실제로는 저장하지 않고 즉시 반환)
 */
export async function createComment(params: CreateCommentParams): Promise<Comment> {
  return {
    id: `cmt-${Date.now()}`,
    reviewId: params.reviewId,
    author: params.authorEmail.split("@")[0],
    authorEmail: params.authorEmail,
    body: params.body,
    createdAt: new Date().toISOString(),
    deleted: false,
  };
}

/**
 * 댓글 soft delete (더미 — 실제 삭제 없이 성공만 반환)
 */
export async function softDeleteComment(_commentId: string): Promise<void> {
  // 더미에서는 실제 삭제 없이 성공
}

/** 리뷰 상세용 더미 노션 블록 */
function getDummyBlocks(title: string) {
  return [
    {
      id: "block-001",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", plain_text: "왜 이 책을 골랐나", annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-002",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", plain_text: `《${title}》은 독서 모임 큐레이션 목록에서 처음 발견했다. 제목부터 강렬하게 끌렸고, 리뷰들을 보니 한 번쯤 꼭 읽어야 할 책이라는 생각이 들었다.`, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-003",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", plain_text: "인상적인 부분들", annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-004",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [{ type: "text", plain_text: "서사 구조가 탄탄하고 캐릭터 묘사가 입체적이었다.", annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-005",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [{ type: "text", plain_text: "작가의 통찰이 군더더기 없이 전달된다는 점이 좋았다.", annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-006",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [{ type: "text", plain_text: "독자로 하여금 스스로 질문하게 만드는 힘이 있다.", annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-007",
      type: "quote",
      quote: {
        rich_text: [{ type: "text", plain_text: "가장 기억에 남는 문장: \"우리는 모두 자신이 선택한 이야기의 주인공이다.\"", annotations: { bold: false, italic: true, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-008",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", plain_text: "아쉬운 점", annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-009",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", plain_text: "후반부가 다소 급하게 마무리된다는 느낌이 있었다. 좀 더 여운을 살렸으면 하는 아쉬움이 남는다. 그럼에도 불구하고 충분히 가치 있는 독서 경험이었다.", annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-010",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", plain_text: "추천 대상", annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-011",
      type: "numbered_list_item",
      numbered_list_item: {
        rich_text: [{ type: "text", plain_text: "이 주제에 평소 관심이 있었던 사람", annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-012",
      type: "numbered_list_item",
      numbered_list_item: {
        rich_text: [{ type: "text", plain_text: "가볍게 읽으면서도 깊은 생각을 하고 싶은 사람", annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-013",
      type: "numbered_list_item",
      numbered_list_item: {
        rich_text: [{ type: "text", plain_text: "독서 모임 토론 소재로 활용하고 싶은 모든 분", annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
    {
      id: "block-014",
      type: "code",
      code: {
        language: "typescript",
        rich_text: [{ type: "text", plain_text: "// 책에서 영감 받은 코드 스니펫\nconst findNextBook = (interests: string[]) =>\n  library.filter(book =>\n    book.tags.some(tag => interests.includes(tag))\n  ).sort((a, b) => b.rating - a.rating)[0];", annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }, href: null }],
      },
    },
  ];
}
