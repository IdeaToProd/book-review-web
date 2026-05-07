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
    // URL-safe slug 검증 후 page.id fallback
    // '?' 등 URL 예약 문자를 slug로 입력한 경우 page.id를 사용해 정상 접근 보장
    slug: (() => {
      const raw =
        props.Slug?.type === "rich_text"
          ? (props.Slug.rich_text[0]?.plain_text ?? "")
          : "";
      return raw && /^[a-z0-9가-힣ㄱ-ㅎ_.-]+$/i.test(raw) ? raw : page.id;
    })(),
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

/** Notion page.id 형식(UUID) 여부 확인 */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** 공통 블록 fetch 헬퍼 */
async function fetchBlocks(pageId: string) {
  const blocksResponse = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });
  return blocksResponse.results
    .filter(isFullBlock)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((block) => ({ id: block.id, type: block.type, ...(block as any) }));
}

/**
 * slug로 단일 리뷰와 페이지 블록을 조회합니다.
 * slug가 UUID 형식이면 page.id로 직접 조회합니다 (Slug 속성 미입력 리뷰 지원).
 */
async function fetchReviewBySlug(slug: string): Promise<Review | null> {
  try {
    // UUID fallback: Slug 속성을 입력하지 않은 리뷰는 page.id를 slug로 사용
    if (UUID_PATTERN.test(slug)) {
      const page = await notion.pages.retrieve({ page_id: slug });
      if (!isFullPage(page)) return null;
      return { ...pageToReview(page), blocks: await fetchBlocks(page.id) };
    }

    // 일반 slug: Notion DB "Slug" 속성으로 검색
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_REVIEWS_DB_ID!,
      filter: { property: "Slug", rich_text: { equals: slug } },
      page_size: 1,
    });

    const page = response.results.find(isFullPage);
    if (!page) return null;

    return { ...pageToReview(page), blocks: await fetchBlocks(page.id) };
  } catch (error) {
    console.error(`[Notion] fetchReviewBySlug("${slug}") 실패:`, error);
    return null;
  }
}

/**
 * 빌드 시 generateStaticParams용 — Published 리뷰 slug 목록만 조회
 * 최대 200개 (50명 규모에서 충분)
 */
async function fetchAllPublishedSlugs(): Promise<string[]> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_REVIEWS_DB_ID!,
      filter: { property: "Status", status: { equals: "완료" } },
      sorts: [{ property: "PublishedAt", direction: "descending" }],
      page_size: 200,
    });

    return response.results
      .filter(isFullPage)
      .map((page) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const props = page.properties as Record<string, any>;
        return props.Slug?.type === "rich_text"
          ? (props.Slug.rich_text[0]?.plain_text ?? "")
          : "";
      })
      .filter(Boolean);
  } catch (error) {
    console.error("[Notion] fetchAllPublishedSlugs 실패:", error);
    return [];
  }
}

// generateStaticParams 전용 — 빌드 타임 1회 호출이므로 캐시 불필요
export const getAllPublishedSlugs = fetchAllPublishedSlugs;

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
 * keyParts에 파라미터를 명시해 필터·페이지 조합별로 캐시 분리
 */
export function getPublishedReviews(
  params: GetPublishedReviewsParams
): Promise<GetPublishedReviewsResult> {
  const tag = params.tag ?? "";
  const q = params.q ?? "";
  const page = String(params.page ?? 1);
  return unstable_cache(
    () => fetchPublishedReviews(params),
    ["getPublishedReviews", tag, q, page],
    { tags: ["reviews"], revalidate: 60 }
  )();
}

/**
 * slug로 단일 리뷰 조회 (페이지 블록 포함)
 * ISR 60초 캐시 + "reviews", "review:{slug}" 태그
 * keyParts에 slug를 명시해 리뷰별 캐시 분리
 */
export function getReviewBySlug(slug: string): Promise<Review | null> {
  return unstable_cache(
    () => fetchReviewBySlug(slug),
    ["getReviewBySlug", slug],
    { tags: ["reviews", `review:${slug}`], revalidate: 60 }
  )();
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
  // 동일 slug라도 tags·limit 조합이 다르면 다른 캐시 엔트리로 분리
  const tagKey = [...tags].sort().join(",");
  return unstable_cache(
    () => fetchRelatedReviews(currentSlug, tags, limit),
    ["getRelatedReviews", currentSlug, tagKey, String(limit)],
    { tags: ["reviews"], revalidate: 60 }
  )();
}
