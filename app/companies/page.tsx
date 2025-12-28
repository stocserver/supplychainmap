
import { Suspense } from 'react'
import { Metadata } from 'next'
import { supabaseServer } from '@/lib/supabase/server'
import { CompaniesClient } from '@/components/companies/companies-client'
import dataRedis from '@/lib/redis'
import { COUNTRY_MAP, DEFAULT_COUNTRY } from '@/lib/data/constants'

export const revalidate = 0 // Disable cache for debugging

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Top Public Companies | SupplyChainMap',
  description: 'Explore the largest public companies in supply chain and manufacturing globally.',
  alternates: { canonical: `${siteUrl}/companies` },
  openGraph: {
    title: 'Top Public Companies | SupplyChainMap',
    description: 'Explore the largest public companies in supply chain and manufacturing globally.',
    url: `${siteUrl}/companies`,
    type: 'website',
  },
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: { region?: string }
}) {
  const countryCode = searchParams.region || DEFAULT_COUNTRY
  const countryFilter = COUNTRY_MAP[countryCode] || COUNTRY_MAP['US']

  const COMPANIES_CACHE_KEY = `companies_list_v2_${countryCode}`
  const INDUSTRIES_CACHE_KEY = 'industries_list'
  const MAPPING_CACHE_KEY = 'industry_mappings'

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
        await dataRedis.set(cacheKey, JSON.stringify(data), 'EX', 300) // 5 minutes TTL
      } catch (err) {
        console.error(`Redis SET error for ${cacheKey}:`, err)
      }
    }

    return data
  }

  // Build the companies query - fetch ALL companies for the country (cached)
  const fetchCompanies = async () => {
    // Primary attempt: Smart Financials (Fetch specific fields to avoid timeout)
    try {
      const { data, error } = await supabaseServer
        .from('companies')
        // Fetch just the incomeStatement part of the JSON (much smaller than full data)
        .select('ticker, name, market_cap, industry, country, logo_url, value_chain_tags, incomeStatement:data->incomeStatement')
        .gt('market_cap', 0)
        .in('country', countryFilter)
        .order('market_cap', { ascending: false, nullsFirst: false })
        .limit(2000)

      if (error) throw error

      // Map to flattened structure (matching cache warmer)
      const mappedData = (data || []).map((c: any) => ({
        ...c,
        revenue: c.incomeStatement?.revenue || 0,
        netIncome: c.incomeStatement?.netIncome || 0,
        // VisualMap checks data.incomeStatement too, so we can reconstruction it if needed,
        // but since it checks c.revenue/c.netIncome, this is sufficient.
        // But let's be safe and provide data structure too if VisualMap depends on deep checking
        data: { incomeStatement: c.incomeStatement }
      }))

      return { data: mappedData }

    } catch (err) {
      console.error('Primary fetch (Smart Financials) failed. Retrying with Survival Mode (No Financials)...', err)

      // Fallback: Survival Mode - Fetch 2000 items WITHOUT any JSONB data access
      // This is guaranteed to be fast and should never timeout for 2000 rows
      try {
        const { data, error } = await supabaseServer
          .from('companies')
          .select('ticker, name, market_cap, industry, country, logo_url, value_chain_tags')
          .gt('market_cap', 0)
          .in('country', countryFilter)
          .order('market_cap', { ascending: false, nullsFirst: false })
          .limit(2000)

        if (error) {
          console.error('Survival Mode failed:', error)
          return { data: [] }
        }
        return { data: data || [] }
      } catch (errSurvival) {
        console.error('Survival Mode critical error:', errSurvival)
        return { data: [] }
      }
    }
  }

  const fetchAvailableIndustries = async () => {
    const { data } = await supabaseServer
      .from('companies')
      .select('industry')
      .in('country', countryFilter)
      .not('industry', 'is', null)

    if (!data) return []
    return [...new Set(data.map(d => d.industry))] as string[]
  }

  const [companies, industries, mapping, availableIndustries] = await Promise.all([
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
    ),
    // Cache specific to country list of industries
    getCachedOrFetch<string[]>(`${COMPANIES_CACHE_KEY}_industries`, async () => ({ data: await fetchAvailableIndustries() }))
  ])

  // Fallback to empty arrays
  const safeCompanies = companies || []
  const safeIndustries = industries || []
  const safeMapping = mapping || []
  const safeAvailableIndustries = availableIndustries || []

  // Debug log
  console.log(`[Companies] Country: ${countryCode}, Filter: ${countryFilter.join(',')}, Results: ${safeCompanies.length}, Industries: ${safeAvailableIndustries.length}`)

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
      url: `${siteUrl}/companies/${c.ticker}`,
      image: c.logo_url
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="p-8 text-center">Loading companies...</div>}>
        <CompaniesClient
          initialCompanies={safeCompanies}
          initialIndustries={safeIndustries}
          initialMapping={safeMapping}
          availableIndustries={safeAvailableIndustries}
          country={countryCode}
        />
      </Suspense>
    </>
  )
}
