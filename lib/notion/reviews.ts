/**
 * Notion Reviews DB 조회 함수 모음
 * @notionhq/client v5에서는 databases.query() 대신 dataSources.query()를 사용합니다.
 *
 * - getPublishedReviews: 목록 조회 (태그 필터, 검색, 페이지네이션)
 * - getReviewBySlug: 단일 리뷰 + 블록 조회
 * - getRelatedReviews: 태그 기반 관련 리뷰 조회
 */

import { unstable_cache } from "next/cache";
import { isFullPage, isFullBlock } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints/common";

import { notion } from "./client";
import type { Review } from "./types";

export interface GetPublishedReviewsParams {
  tag?: string;
  q?: string;
  page?: number;
}

export interface GetPublishedReviewsResult {
  reviews: Review[];
  total: number;
}

const PAGE_SIZE = 12;

// ─────────────────────────────────────────────
// 헬퍼 함수
// ─────────────────────────────────────────────

/**
 * Files & media 속성에서 첫 번째 파일 URL을 추출합니다.
 * Notion 내부 파일(type="file")과 외부 URL(type="external") 모두 처리합니다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCoverUrl(coverProp: any): string | null {
  if (!coverProp || coverProp.type !== "files") return null;
  const files = coverProp.files as Array<{
    type: "file" | "external";
    file?: { url: string };
    external?: { url: string };
  }>;
  if (files.length === 0) return null;
  const first = files[0];
  if (first.type === "file") return first.file?.url ?? null;
  if (first.type === "external") return first.external?.url ?? null;
  return null;
}

/**
 * Notion PageObjectResponse를 Review 타입으로 변환합니다.
 */
function pageToReview(page: PageObjectResponse): Review {
  // properties는 Record<string, any> 형태로 타입 우회 처리
  // (v5 타입이 복잡한 유니온이라 직접 타입 단언 사용)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = page.properties as Record<string, any>;

  return {
    id: page.id,
    title:
      props.Title?.type === "title"
        ? (props.Title.title[0]?.plain_text ?? "")
        : "",
    author:
      props.Author?.type === "rich_text"
        ? (props.Author.rich_text[0]?.plain_text ?? "")
        : "",
    slug:
      props.Slug?.type === "rich_text"
        ? (props.Slug.rich_text[0]?.plain_text ?? "")
        : "",
    reviewer:
      props.Reviewer?.type === "people"
        ? (props.Reviewer.people[0]?.name ?? "")
        : "",
    reviewerEmail:
      props.ReviewerEmail?.type === "email"
        ? (props.ReviewerEmail.email ?? "")
        : "",
    rating:
      props.Rating?.type === "number" ? (props.Rating.number ?? 0) : 0,
    tags:
      props.Tags?.type === "multi_select"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? props.Tags.multi_select.map((t: any) => t.name as string)
        : [],
    cover: getCoverUrl(props.Cover),
    status:
      props.Status?.type === "status"
        ? ((props.Status.status?.name ?? "Draft") as Review["status"])
        : "Draft",
    publishedAt:
      props.PublishedAt?.type === "created_time"
        ? (props.PublishedAt.created_time ?? "")
        : props.PublishedAt?.type === "date"
          ? (props.PublishedAt.date?.start ?? "")
          : "",
    summary:
      props.Summary?.type === "rich_text"
        ? (props.Summary.rich_text[0]?.plain_text ?? null)
        : null,
  };
}

// ─────────────────────────────────────────────
// 내부 fetch 함수 (unstable_cache가 감싸는 대상)
// ─────────────────────────────────────────────

/**
 * Notion DB에서 Published 리뷰를 최대 200개까지 가져옵니다.
 * @notionhq/client v5: databases.query() → dataSources.query()
 */
async function fetchPublishedReviews(
  params: GetPublishedReviewsParams
): Promise<GetPublishedReviewsResult> {
  const { tag, q, page = 1 } = params;

  // 기본 필터: Status = 완료 (Notion status 타입)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const andFilters: any[] = [
    { property: "Status", status: { equals: "완료" } },
  ];

  // 태그 필터 추가
  if (tag) {
    andFilters.push({ property: "Tags", multi_select: { contains: tag } });
  }

  // 검색어 필터: Title OR Author OR Summary에 포함
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterObj: any =
    q
      ? {
          and: [
            ...andFilters,
            {
              or: [
                { property: "Title", title: { contains: q } },
                { property: "Author", rich_text: { contains: q } },
                { property: "Summary", rich_text: { contains: q } },
              ],
            },
          ],
        }
      : andFilters.length === 1
        ? andFilters[0]
        : { and: andFilters };

  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_REVIEWS_DB_ID!,
      filter: filterObj,
      sorts: [{ property: "PublishedAt", direction: "descending" }],
      page_size: 200, // 총 리뷰 수가 적으므로 전체 fetch 후 슬라이스
    });

    const reviews = response.results
      .filter(isFullPage)
      .map(pageToReview);

    const total = reviews.length;
    const start = (page - 1) * PAGE_SIZE;
    const paginated = reviews.slice(start, start + PAGE_SIZE);

    return { reviews: paginated, total };
  } catch (error) {
    console.error("[Notion] fetchPublishedReviews 실패:", error);
    return { reviews: [], total: 0 };
  }
}

/**
 * slug로 단일 리뷰와 페이지 블록을 조회합니다.
 */
async function fetchReviewBySlug(slug: string): Promise<Review | null> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_REVIEWS_DB_ID!,
      filter: { property: "Slug", rich_text: { equals: slug } },
      page_size: 1,
    });

    const page = response.results.find(isFullPage);
    if (!page) return null;

    const review = pageToReview(page);

    // 페이지 본문 블록 fetch
    const blocksResponse = await notion.blocks.children.list({
      block_id: page.id,
      page_size: 100,
    });

    return {
      ...review,
      blocks: blocksResponse.results
        .filter(isFullBlock)
        .map((block) => ({
          id: block.id,
          type: block.type,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(block as any),
        })),
    };
  } catch (error) {
    console.error(`[Notion] fetchReviewBySlug("${slug}") 실패:`, error);
    return null;
  }
}

/**
 * 태그가 겹치는 관련 리뷰를 조회합니다.
 */
async function fetchRelatedReviews(
  currentSlug: string,
  tags: string[],
  limit: number
): Promise<Review[]> {
  if (tags.length === 0) return [];

  try {
    // 태그 OR 필터 구성 (각 태그를 contains로)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tagFilters: any[] = tags.map((tag) => ({
      property: "Tags",
      multi_select: { contains: tag },
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterObj: any = {
      and: [
        { property: "Status", status: { equals: "완료" } },
        { or: tagFilters },
      ],
    };

    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_REVIEWS_DB_ID!,
      filter: filterObj,
      sorts: [{ property: "PublishedAt", direction: "descending" }],
      page_size: 50,
    });

    const reviews = response.results
      .filter(isFullPage)
      .map(pageToReview)
      .filter((r) => r.slug !== currentSlug);

    // 태그 교집합 점수 계산 후 내림차순 정렬
    const scored = reviews
      .map((r) => ({
        review: r,
        score: r.tags.filter((t) => tags.includes(t)).length,
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (
          new Date(b.review.publishedAt).getTime() -
          new Date(a.review.publishedAt).getTime()
        );
      });

    return scored.slice(0, limit).map(({ review }) => review);
  } catch (error) {
    console.error("[Notion] fetchRelatedReviews 실패:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// 캐시 적용 후 export
// ─────────────────────────────────────────────

/**
 * Published 상태 리뷰 목록 조회 (태그 필터, 검색, 페이지네이션)
 * ISR 60초 캐시 + "reviews" 태그
 */
export const getPublishedReviews = unstable_cache(
  fetchPublishedReviews,
  ["getPublishedReviews"],
  { tags: ["reviews"], revalidate: 60 }
);

/**
 * slug로 단일 리뷰 조회 (페이지 블록 포함)
 * ISR 60초 캐시 + "reviews", "review:{slug}" 태그
 */
export async function getReviewBySlug(slug: string): Promise<Review | null> {
  return fetchReviewBySlug(slug);
}

/**
 * 태그 기반 관련 리뷰 조회 (점수 내림차순, limit 슬라이스)
 * ISR 60초 캐시 + "reviews" 태그
 */
export async function getRelatedReviews(
  currentSlug: string,
  tags: string[],
  limit = 4
): Promise<Review[]> {
  return unstable_cache(
    () => fetchRelatedReviews(currentSlug, tags, limit),
    [`getRelatedReviews-${currentSlug}`],
    { tags: ["reviews"], revalidate: 60 }
  )();
}
