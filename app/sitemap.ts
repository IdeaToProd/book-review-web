import type { MetadataRoute } from "next"

import { getPublishedReviews } from "@/lib/notion/reviews"

/** ISR 60초 — 새 리뷰가 발행되면 자동 갱신 */
export const revalidate = 60

/**
 * 사이트맵 생성 — Published 리뷰 slug 목록을 Notion에서 가져와 URL 반환
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.APP_URL ?? "http://localhost:3000"

  // 전체 Published 리뷰 slug 목록 조회 (최대 200개)
  const { reviews } = await getPublishedReviews({ page: 1 })

  const reviewEntries: MetadataRoute.Sitemap = reviews.map((review) => ({
    url: `${siteUrl}/reviews/${review.slug}`,
    lastModified: new Date(review.publishedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...reviewEntries,
  ]
}
