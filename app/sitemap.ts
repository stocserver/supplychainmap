import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static top-level routes
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/industries",
    "/companies",
    "/about",
  ].map((route) => ({
    url: `${siteUrl}${route || "/"}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }))

  // We could expand with dynamic routes from DB later
  return [...staticRoutes]
}


