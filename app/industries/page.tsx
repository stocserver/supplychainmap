import { Suspense } from "react"
import { Metadata } from "next"
import { supabaseServer } from "@/lib/supabase/server"
import { IndustriesClient, DbIndustry } from "@/components/industries/industries-client"

export const revalidate = 0 // Disable cache for debugging

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: "Industry Value Chains & Supply Maps | SupplyChainMap",
  description: "Explore detailed value chain maps for industries like Semiconductors, Cloud Computing, and Electric Vehicles. See component-level supply chain data.",
  alternates: { canonical: `${siteUrl}/industries` },
  openGraph: {
    title: "Industry Value Chains | SupplyChainMap",
    description: "Interactive value chain maps for major US industries.",
    url: `${siteUrl}/industries`,
    type: "website",
  },
}

import { COUNTRY_MAP, DEFAULT_COUNTRY } from "@/lib/data/constants"

export default async function IndustriesPage({
  searchParams,
}: {
  searchParams: { country?: string }
}) {
  const country = searchParams.country || DEFAULT_COUNTRY
  const countryFilter = COUNTRY_MAP[country] || COUNTRY_MAP['US']

  // Fetch industries data on the server
  let industriesList: DbIndustry[] = []

  // Skip DB for now and use local file logic directly to test the switch
  // (Since we haven't updated the DB schema to support regions yet)
  try {
    const { getIndustries } = await import('@/lib/data/industries')
    const industriesData = getIndustries(country)

    industriesList = industriesData.map((i: any) => ({
      name: i.name,
      slug: i.slug,
      description: i.description,
      color: i.color,
      icon: i.icon,
      category: (i as any).category || null
    }))
  } catch (e) {
    console.error("Failed to load local industries:", e)
  }

  // Fetch companies for dynamic popup contextualization
  // Pagination required to bypass 1000 row limit
  let dbRows: any[] = []
  let from = 0
  const batchSize = 1000
  while (true) {
    const { data, error } = await supabaseServer
      .from('companies')
      .select('ticker, name, industry, value_chain_tags, market_cap, logo_url')
      .in('country', countryFilter) // Match companies page logic
      .range(from, from + batchSize - 1)

    if (error) {
      console.error("Fetch error:", error)
      break
    }
    if (data && data.length > 0) {
      dbRows = [...dbRows, ...data]
      if (data.length < batchSize) break
    } else {
      break
    }
    from += batchSize
  }

  // Calculate counts for tile badges
  const counts: Record<string, number> = {}
  if (dbRows) {
    dbRows.forEach((r: any) => {
      if (r.industry) {
        counts[r.industry] = (counts[r.industry] || 0) + 1
      }
    })
  }

  // Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Industry Value Chains",
    description: "Directory of industry supply chains and value maps.",
    url: `${siteUrl}/industries`,
    hasPart: industriesList.slice(0, 20).map(i => ({
      "@type": "WebPage",
      name: i.name,
      description: i.description,
      url: `${siteUrl}/industries/${i.slug}`
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Suspense fallback={<div className="container py-8 text-center text-muted-foreground">Loading industries...</div>}>
        <IndustriesClient initialIndustries={industriesList} country={country} companyCounts={counts} companies={dbRows || []} />
      </Suspense>
    </>
  )
}
