import { Suspense } from "react"
import { Metadata } from "next"
import { supabaseServer } from "@/lib/supabase/server"
import { CompaniesClient } from "@/components/companies/companies-client"

export const revalidate = 3600 // Revalidate every hour

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: "Public Companies & Supply Chains | SupplyChainMap",
  description: "Browse and analyze US public companies across major industries like AI, Semiconductors, Banking, and Energy. View market cap, ticker symbols, and value chain data.",
  alternates: { canonical: `${siteUrl}/companies` },
  openGraph: {
    title: "Public Companies Database | SupplyChainMap",
    description: "Comprehensive database of US public companies and their industry supply chain positions.",
    url: `${siteUrl}/companies`,
    type: "website",
  },
}

export default async function CompaniesPage() {
  // Parallel data fetching for performance
  const [companiesRes, industriesRes, mappingRes] = await Promise.all([
    supabaseServer
      .from('companies')
      .select('ticker, name, market_cap, industry')
      .gt('market_cap', 0)
      .order('market_cap', { ascending: false, nullsFirst: false })
      .range(0, 49),

    supabaseServer
      .from('industries')
      .select('id, name, slug, description, color, icon'),

    supabaseServer
      .from('industry_featured_companies')
      .select('industry_id, ticker, position_order')
  ])

  const companies = (companiesRes.data || []) as any[]
  const industries = (industriesRes.data || []) as any[]
  const mapping = (mappingRes.data || []) as any[]

  // Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Public Companies",
    description: "Directory of US public companies organized by industry and supply chain position.",
    url: `${siteUrl}/companies`,
    hasPart: companies.slice(0, 20).map(c => ({
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
          initialCompanies={companies}
          initialIndustries={industries}
          initialMapping={mapping}
        />
      </Suspense>
    </>
  )
}
