import type { MetadataRoute } from "next"

/**
 * robots.txt 생성
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.APP_URL ?? "http://localhost:3000"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/login"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
