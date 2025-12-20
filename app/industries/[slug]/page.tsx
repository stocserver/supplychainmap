import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getIndustryBySlug, getRegionallyContextualizedStages } from "@/lib/data/industries"
import { supabaseServer } from "@/lib/supabase/server"
import dataRedis from "@/lib/redis"
import { CompanyCard } from "@/components/companies/company-card"
import { IndustryValueChain } from "@/components/industries/IndustryValueChain"
import { IndustryProductValueChain } from "@/components/industries/IndustryProductValueChain"
import { VisualMap } from "@/components/industries/VisualMap"
import { IndustryViewToggle } from "@/components/industries/IndustryViewToggle"
import { semiconductorProductStages } from "@/lib/industries/semiconductors.products"
import { cloudProductStages } from "@/lib/industries/cloud-computing.products"
import { dataCenterProductStages } from "@/lib/industries/data-centers.products"
import { cyberProductStages } from "@/lib/industries/cybersecurity.products"
import { softwareSaaSProductStages } from "@/lib/industries/software-saas.products"
import { evProductStages } from "@/lib/industries/electric-vehicles.products"
import { solarProductStages } from "@/lib/industries/solar-energy.products"
import { energyStorageProductStages } from "@/lib/industries/energy-storage.products"
import { pharmaceuticalProductStages } from "@/lib/industries/pharmaceuticals.products"
import { bankingProductStages } from "@/lib/industries/banking.products"
import { oilGasProductStages } from "@/lib/industries/oil-gas.products"
import { automotiveProductStages } from "@/lib/industries/automotive.products"
import { retailProductStages } from "@/lib/industries/retail.products"
import { telecommunicationsProductStages } from "@/lib/industries/telecommunications.products"
import { aerospaceProductStages } from "@/lib/industries/aerospace-defense.products"
import { biotechnologyProductStages } from "@/lib/industries/biotechnology.products"
import { insuranceProductStages } from "@/lib/industries/insurance.products"
import { mediaEntertainmentProductStages } from "@/lib/industries/media-entertainment.products"
import { utilitiesProductStages } from "@/lib/industries/utilities.products"
import { fintechProductStages } from "@/lib/industries/fintech.products"
import { medicalDevicesProductStages } from "@/lib/industries/medical-devices.products"
import { ecommerceProductStages } from "@/lib/industries/ecommerce.products"
import { realEstateProductStages } from "@/lib/industries/real-estate.products"
import { assetManagementProductStages } from "@/lib/industries/asset-management.products"
import { chemicalsProductStages } from "@/lib/industries/chemicals.products"
import { foodBeverageProductStages } from "@/lib/industries/food-beverage.products"
import { artificialIntelligenceProductStages } from "@/lib/industries/artificial-intelligence.products"
import { roboticsAutomationProductStages } from "@/lib/industries/robotics-automation.products"
import { transportationLogisticsProductStages } from "@/lib/industries/transportation-logistics.products"
import { spaceTechnologyProductStages } from "@/lib/industries/space-technology.products"
import { digitalHealthProductStages } from "@/lib/industries/digital-health.products"
import { miningMaterialsProductStages } from "@/lib/industries/mining-materials.products"
import { consumerProductsProductStages } from "@/lib/industries/consumer-products.products"
import { hospitalityProductStages } from "@/lib/industries/hospitality.products"
import { constructionEngineeringProductStages } from "@/lib/industries/construction-engineering.products"
import { agtechProductStages } from "@/lib/industries/agtech.products"
import { getValueChainFromDB, DB_DRIVEN_INDUSTRIES } from "@/lib/data/value-chain-db"

export default async function IndustryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { country?: string }
}) {
  const country = searchParams.country || 'US'
  const industry = getIndustryBySlug(params.slug, country)

  if (!industry) {
    notFound()
  }

  // Fetch dynamic companies from DB to augment static data
  // We fetch ALL companies for the country to allow tag-based matching even if primary industry differs
  // Redis Cache Implementation
  const CACHE_KEY = `industry_data_${params.slug}_${country}`
  let dbCompanies: any[] | null = null

  try {
    const cachedData = await dataRedis.get(CACHE_KEY)
    if (cachedData) {
      // console.log('Serving from Redis cache:', CACHE_KEY)
      dbCompanies = JSON.parse(cachedData)
    }
  } catch (err) {
    console.error('Redis Error:', err)
  }

  if (!dbCompanies) {
    const { data } = await supabaseServer
      .from('companies')
      .select('ticker, name, value_chain_tags, country, industry, market_cap, data, logo_url')
      .eq('country', country)
      .eq('industry', params.slug)
      .limit(1000)

    dbCompanies = data

    if (dbCompanies && dbCompanies.length > 0) {
      try {
        await dataRedis.set(CACHE_KEY, JSON.stringify(dbCompanies), 'EX', 30) // 30 seconds TTL
      } catch (err) {
        console.error('Redis Set Error:', err)
      }
    }
  }

  const dynamicCompanies = dbCompanies?.map(c => ({
    ticker: c.ticker,
    name: c.name,
    country: c.country,
    tags: c.value_chain_tags || [],
    industry: c.industry
  })) || []

  // Check if this industry uses database-driven value chain
  const dbValueChain = DB_DRIVEN_INDUSTRIES.includes(params.slug)
    ? await getValueChainFromDB(params.slug)
    : null

  // Filter for primary industry match for the "Featured" list
  const featuredCandidates = dbCompanies?.filter(c => c.industry === params.slug) || []

  if (featuredCandidates.length > 0) {
    // Merge DB companies into featured list, avoiding duplicates
    const existing = new Set(industry.featured_companies || [])
    featuredCandidates.forEach(c => existing.add(c.ticker))
    industry.featured_companies = Array.from(existing)
  }

  // Removed metric card calculations to simplify the page header

  return (
    <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 md:px-8 py-4 md:py-8">
      {/* Back button */}
      <Link href={`/industries${searchParams.country ? `?country=${searchParams.country}` : ''}`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Industries
        </Button>
      </Link>

      {/* Industry Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${industry.color} text-4xl text-white`}>
            {industry.icon}
          </div>
          <div>
            <h1 className="text-4xl font-bold">{industry.name}</h1>
            <p className="mt-2 text-xl text-muted-foreground">{industry.description}</p>
          </div>
        </div>
      </div>

      {/* View Toggle (Visual Map vs Value Chain) */}
      <IndustryViewToggle
        visualMap={
          <div className="mb-12">
            <VisualMap companies={featuredCandidates} />
          </div>
        }
        valueChain={
          (() => {
            const productStagesMap: Record<string, any> = {
              'semiconductors': semiconductorProductStages,
              'cloud-computing': cloudProductStages,
              'data-centers': dataCenterProductStages,
              'cybersecurity': cyberProductStages,
              'software-saas': softwareSaaSProductStages,
              'electric-vehicles': evProductStages,
              'solar-energy': solarProductStages,
              'energy-storage': energyStorageProductStages,
              'pharmaceuticals': pharmaceuticalProductStages,
              'banking': bankingProductStages,
              'oil-gas': oilGasProductStages,
              'automotive': automotiveProductStages,
              'retail': retailProductStages,
              'telecommunications': telecommunicationsProductStages,
              'aerospace-defense': aerospaceProductStages,
              'biotechnology': biotechnologyProductStages,
              'insurance': insuranceProductStages,
              'media-entertainment': mediaEntertainmentProductStages,
              'utilities': utilitiesProductStages,
              'fintech': fintechProductStages,
              'medical-devices': medicalDevicesProductStages,
              'ecommerce': ecommerceProductStages,
              'real-estate': realEstateProductStages,
              'asset-management': assetManagementProductStages,
              'chemicals': chemicalsProductStages,
              'food-beverage': foodBeverageProductStages,
              'artificial-intelligence': artificialIntelligenceProductStages,
              'robotics-automation': roboticsAutomationProductStages,
              'transportation-logistics': transportationLogisticsProductStages,
              'space-technology': spaceTechnologyProductStages,
              'digital-health': digitalHealthProductStages,
              'mining-materials': miningMaterialsProductStages,
              'consumer-products': consumerProductsProductStages,
              'hospitality': hospitalityProductStages,
              'construction-engineering': constructionEngineeringProductStages,
              'agtech': agtechProductStages,
            }

            const rawStages = productStagesMap[industry.slug]

            // Use database-driven value chain if available, otherwise use hardcoded
            const contextualizedStages = dbValueChain
              ? dbValueChain
              : rawStages
                ? getRegionallyContextualizedStages(rawStages, industry.slug, country, dynamicCompanies)
                : null

            if (contextualizedStages) {

              // Orphan Detection Logic (Server-Side)
              // Ensure we capture companies that are primarily in this industry but NOT mapped to a specific product
              const mappedTickers = new Set<string>()
              const collectMapped = (products: any[]) => {
                products.forEach(p => {
                  if (p.companiesDetailed) {
                    p.companiesDetailed.forEach((c: any) => { if (c.ticker) mappedTickers.add(c.ticker) })
                  }
                  if (p.subProducts) collectMapped(p.subProducts)
                })
              }
              contextualizedStages.forEach(stage => collectMapped(stage.products))

              const orphans = dynamicCompanies.filter(c => !mappedTickers.has(c.ticker) && c.industry === industry.slug)

              if (orphans.length > 0 && contextualizedStages.length > 0) {
                const firstStage = contextualizedStages[0]
                const generalId = `${industry.slug}-general`

                // Check if already exists
                if (!firstStage.products.find(p => p.id === generalId)) {
                  firstStage.products.push({
                    id: generalId,
                    name: "General / Uncategorized",
                    description: "Companies not yet categorized into specific segments",
                    companiesDetailed: orphans.map(c => ({
                      name: c.name,
                      ticker: c.ticker,
                      listing: c.country === 'US' ? 'US' : 'Foreign', // Simple mapping
                      country: c.country
                    })),
                    companies: orphans.map(c => c.ticker),
                    subProducts: [],
                    tags: ['Uncategorized']
                  } as any)
                }
              }

              // Convert featuredCandidates (DB matches) to ProductCompanyRef format for the "Others" calculation
              const allJoinableCompanies = featuredCandidates.map(c => ({
                name: c.name,
                ticker: c.ticker,
                listing: (c.country === 'US' ? 'US' : 'Foreign') as any, // Simple mapping
                country: c.country
              }))

              return <IndustryProductValueChain
                stages={contextualizedStages}
                industryName={industry.name}
                industry={industry}
                allJoinableCompanies={allJoinableCompanies}
              />
            }

            if (industry.valueChain) {
              return <IndustryValueChain valueChain={industry.valueChain} industryName={industry.name} />
            }

            if (industry.subcategories) {
              return (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Value Chain Segments</CardTitle>
                    <CardDescription>
                      Key segments within the {industry.name.toLowerCase()} value chain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {industry.subcategories.map((subcategory) => (
                        <div
                          key={subcategory}
                          className="rounded-lg border bg-card p-4 text-center transition-all hover:shadow-md"
                        >
                          <p className="font-medium">{subcategory}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            }

            return null
          })()
        }
      />

      {/* Featured Companies - Showing all players (Static + Dynamic) */}
      {industry.featured_companies && (
        <div className="mt-8">
          <h2 className="mb-6 text-2xl font-bold">Featured Companies</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {industry.featured_companies.map((ticker) => (
              <CompanyCard key={ticker} ticker={ticker} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const industry = getIndustryBySlug(params.slug)
  if (!industry) {
    return {
      title: "Industry | SupplyChainMap",
      description: "Explore industry value chains and featured companies.",
    }
  }

  const title = `${industry.name} Value Chain | SupplyChainMap`
  const description = industry.description
  const url = `${siteUrl}/industries/${industry.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-default.png`,
          width: 1200,
          height: 630,
          alt: `${industry.name} Value Chain`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/og-default.png`],
    },
  }
}

