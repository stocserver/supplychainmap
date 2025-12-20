import { Suspense } from "react"
import { Metadata } from "next"
import { supabaseServer } from "@/lib/supabase/server"
import dataRedis from "@/lib/redis"
import { CompaniesClient } from "@/components/companies/companies-client"

export const dynamic = 'force-dynamic' // Required for searchParams to work

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: "Public Companies & Supply Chains | SupplyChainMap",
  description: "Browse and analyze public companies across major industries like AI, Semiconductors, Banking, and Energy. View market cap, ticker symbols, and value chain data.",
  alternates: { canonical: `${siteUrl}/companies` },
  openGraph: {
    title: "Public Companies Database | SupplyChainMap",
    description: "Comprehensive database of public companies and their industry supply chain positions.",
    url: `${siteUrl}/companies`,
    type: "website",
  },
}

import { COUNTRY_MAP, DEFAULT_COUNTRY } from "@/lib/data/constants"

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: { country?: string }
}) {
  const countryCode = searchParams.country || DEFAULT_COUNTRY
  const countryFilter = COUNTRY_MAP[countryCode] || COUNTRY_MAP['US']

  // Redis Cache Keys (Bump version to v2 to clear stale "global US" cache)
  const COMPANIES_CACHE_KEY = `companies_list_v2_${countryCode}`
  const INDUSTRIES_CACHE_KEY = `industries_list`
  const MAPPING_CACHE_KEY = `industry_mappings`

  // Helper function to get cached data or fetch from DB
  async function getCachedOrFetch<T>(
    cacheKey: string,
    fetchFn: () => Promise<{ data: T | null }>
  ): Promise<T | null> {
    try {
      const cached = await dataRedis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached) as T
      }
    } catch (err) {
      console.error(`Redis GET error for ${cacheKey}:`, err)
    }

    const { data } = await fetchFn()

    if (data) {
      try {
        await dataRedis.set(cacheKey, JSON.stringify(data), 'EX', 30) // 30 seconds TTL
      } catch (err) {
        console.error(`Redis SET error for ${cacheKey}:`, err)
      }
    }

    return data
  }

  // Build the companies query with country filter applied directly
  const fetchCompanies = async () => {
    let query = supabaseServer
      .from('companies')
      .select('ticker, name, market_cap, industry, country, logo_url, data')
      .gt('market_cap', 0)

    // Apply country filter for non-US regions
    // Apply country filter
    if (countryCode === 'US') {
      // For US, we default to filtering, assuming data has 'US', 'USA', or 'United States'
      // If we confirm database has NULL for US, we might need `.or('country.eq.US,country.is.null')`
      // But for now, strict filtering is safer for "Country Switcher" logic.
      query = query.in('country', countryFilter)
    } else {
      query = query.in('country', countryFilter)
    }

    return query
      .order('market_cap', { ascending: false, nullsFirst: false })
      .range(0, 19)
  }

  const [companies, industries, mapping] = await Promise.all([
    getCachedOrFetch<any[]>(COMPANIES_CACHE_KEY, fetchCompanies),
    getCachedOrFetch<any[]>(INDUSTRIES_CACHE_KEY, async () =>
      supabaseServer
        .from('industries')
        .select('id, name, slug, description, color, icon')
    ),
    getCachedOrFetch<any[]>(MAPPING_CACHE_KEY, async () =>
      supabaseServer
        .from('industry_featured_companies')
        .select('industry_id, ticker, position_order')
    )
  ])

  // Fallback to empty arrays
  const safeCompanies = companies || []
  const safeIndustries = industries || []
  const safeMapping = mapping || []

  // Debug log
  console.log(`[Companies] Country: ${countryCode}, Filter: ${countryFilter.join(',')}, Results: ${safeCompanies.length}`)

  // Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Public Companies",
    description: "Directory of public companies organized by industry and supply chain position.",
    url: `${siteUrl}/companies`,
    hasPart: safeCompanies.slice(0, 20).map(c => ({
      "@type": "Organization",
      name: c.name,
      tickerSymbol: c.ticker,
      url: `${siteUrl}/companies/${c.ticker}`
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Suspense fallback={<div className="container py-8 text-center text-muted-foreground">Loading companies...</div>}>
        <CompaniesClient
          initialCompanies={safeCompanies}
          initialIndustries={safeIndustries}
          initialMapping={safeMapping}
          country={countryCode}
        />
      </Suspense>
    </>
  )
}
