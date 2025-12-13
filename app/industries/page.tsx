import { Suspense } from "react"
import { Metadata } from "next"
import { supabaseServer } from "@/lib/supabase/server"
import { IndustriesClient, DbIndustry } from "@/components/industries/industries-client"

export const revalidate = 3600 // Revalidate every hour

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

export default async function IndustriesPage() {
  // Fetch industries data on the server
  let industriesList: DbIndustry[] = []

  try {
    const { data } = await supabaseServer
      .from('industries')
      .select('name, slug, description, color, icon, category')

    if (data) {
      industriesList = data as DbIndustry[]
    }
  } catch (e) {
    console.error("Failed to fetch industries:", e)
  }

  // Fallback if DB is empty
  if (industriesList.length === 0) {
    try {
      const { industries } = await import('@/lib/data/industries')
      industriesList = industries.map((i: any) => ({
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
        <IndustriesClient initialIndustries={industriesList} />
      </Suspense>
    </>
  )
}
