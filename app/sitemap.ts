import type { MetadataRoute } from "next"
import { supabaseServer } from "@/lib/supabase/server"

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

  // Dynamic routes from database
  const dynamicRoutes: MetadataRoute.Sitemap = []

  try {
    // Fetch all industries
    const { data: industries } = await supabaseServer
      .from('industries')
      .select('slug')
      .not('slug', 'is', null)

    if (industries) {
      industries.forEach((industry) => {
        dynamicRoutes.push({
          url: `${siteUrl}/industries/${industry.slug}`,
          changeFrequency: "weekly",
          priority: 0.6,
        })
      })
    }

    // Fetch all companies (limit to avoid sitemap being too large)
    const { data: companies } = await supabaseServer
      .from('companies')
      .select('ticker')
      .not('ticker', 'is', null)
      .gt('market_cap', 1000000000) // Only companies with >$1B market cap
      .order('market_cap', { ascending: false })
      .limit(1000) // Limit to top 1000 companies

    if (companies) {
      companies.forEach((company) => {
        dynamicRoutes.push({
          url: `${siteUrl}/companies/${company.ticker}`,
          changeFrequency: "daily",
          priority: 0.5,
        })
      })
    }
  } catch (error) {
    console.error('Error fetching dynamic routes for sitemap:', error)
  }

  return [...staticRoutes, ...dynamicRoutes]
}


