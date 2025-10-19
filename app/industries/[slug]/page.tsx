import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getIndustryBySlug } from "@/lib/data/industries"
import { CompanyCard } from "@/components/companies/company-card"
import { IndustryValueChain } from "@/components/industries/IndustryValueChain"
import { IndustryProductValueChain } from "@/components/industries/IndustryProductValueChain"
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
import { aerospaceProductStages } from "@/lib/industries/aerospace.products"
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

export default async function IndustryPage({ params }: { params: { slug: string } }) {
  const industry = getIndustryBySlug(params.slug)

  if (!industry) {
    notFound()
  }

  // Removed metric card calculations to simplify the page header

  return (
    <div className="container py-8">
      {/* Back button */}
      <Link href="/industries">
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

      {/* Removed Industry Overview metric cards */}

      {/* Value Chain Visualization */}
      {industry.slug === 'semiconductors' ? (
        <IndustryProductValueChain stages={semiconductorProductStages} industryName={industry.name} />
      ) : industry.slug === 'cloud-computing' ? (
        <IndustryProductValueChain stages={cloudProductStages} industryName={industry.name} />
      ) : industry.slug === 'data-centers' ? (
        <IndustryProductValueChain stages={dataCenterProductStages} industryName={industry.name} />
      ) : industry.slug === 'cybersecurity' ? (
        <IndustryProductValueChain stages={cyberProductStages} industryName={industry.name} />
      ) : industry.slug === 'software-saas' ? (
        <IndustryProductValueChain stages={softwareSaaSProductStages} industryName={industry.name} />
      ) : industry.slug === 'electric-vehicles' ? (
        <IndustryProductValueChain stages={evProductStages} industryName={industry.name} />
      ) : industry.slug === 'solar-energy' ? (
        <IndustryProductValueChain stages={solarProductStages} industryName={industry.name} />
      ) : industry.slug === 'energy-storage' ? (
        <IndustryProductValueChain stages={energyStorageProductStages} industryName={industry.name} />
      ) : industry.slug === 'pharmaceuticals' ? (
        <IndustryProductValueChain stages={pharmaceuticalProductStages} industryName={industry.name} />
      ) : industry.slug === 'banking' ? (
        <IndustryProductValueChain stages={bankingProductStages} industryName={industry.name} />
      ) : industry.slug === 'oil-gas' ? (
        <IndustryProductValueChain stages={oilGasProductStages} industryName={industry.name} />
      ) : industry.slug === 'automotive' ? (
        <IndustryProductValueChain stages={automotiveProductStages} industryName={industry.name} />
      ) : industry.slug === 'retail' ? (
        <IndustryProductValueChain stages={retailProductStages} industryName={industry.name} />
      ) : industry.slug === 'telecommunications' ? (
        <IndustryProductValueChain stages={telecommunicationsProductStages} industryName={industry.name} />
      ) : industry.slug === 'aerospace-defense' ? (
        <IndustryProductValueChain stages={aerospaceProductStages} industryName={industry.name} />
      ) : industry.slug === 'biotechnology' ? (
        <IndustryProductValueChain stages={biotechnologyProductStages} industryName={industry.name} />
      ) : industry.slug === 'insurance' ? (
        <IndustryProductValueChain stages={insuranceProductStages} industryName={industry.name} />
      ) : industry.slug === 'media-entertainment' ? (
        <IndustryProductValueChain stages={mediaEntertainmentProductStages} industryName={industry.name} />
      ) : industry.slug === 'utilities' ? (
        <IndustryProductValueChain stages={utilitiesProductStages} industryName={industry.name} />
      )         : industry.slug === 'fintech' ? (
        <IndustryProductValueChain stages={fintechProductStages} industryName={industry.name} />
      ) : industry.slug === 'medical-devices' ? (
        <IndustryProductValueChain stages={medicalDevicesProductStages} industryName={industry.name} />
      ) : industry.slug === 'ecommerce' ? (
        <IndustryProductValueChain stages={ecommerceProductStages} industryName={industry.name} />
      ) : industry.slug === 'real-estate' ? (
        <IndustryProductValueChain stages={realEstateProductStages} industryName={industry.name} />
      ) : industry.slug === 'asset-management' ? (
        <IndustryProductValueChain stages={assetManagementProductStages} industryName={industry.name} />
      ) : industry.slug === 'chemicals' ? (
        <IndustryProductValueChain stages={chemicalsProductStages} industryName={industry.name} />
      ) : industry.slug === 'food-beverage' ? (
        <IndustryProductValueChain stages={foodBeverageProductStages} industryName={industry.name} />
      ) : industry.slug === 'artificial-intelligence' ? (
        <IndustryProductValueChain stages={artificialIntelligenceProductStages} industryName={industry.name} />
      ) : industry.slug === 'robotics-automation' ? (
        <IndustryProductValueChain stages={roboticsAutomationProductStages} industryName={industry.name} />
      ) : industry.slug === 'transportation-logistics' ? (
        <IndustryProductValueChain stages={transportationLogisticsProductStages} industryName={industry.name} />
      ) : industry.slug === 'space-technology' ? (
        <IndustryProductValueChain stages={spaceTechnologyProductStages} industryName={industry.name} />
      ) : industry.slug === 'digital-health' ? (
        <IndustryProductValueChain stages={digitalHealthProductStages} industryName={industry.name} />
      ) : industry.slug === 'mining-materials' ? (
        <IndustryProductValueChain stages={miningMaterialsProductStages} industryName={industry.name} />
      ) : industry.slug === 'consumer-products' ? (
        <IndustryProductValueChain stages={consumerProductsProductStages} industryName={industry.name} />
      ) : industry.slug === 'hospitality' ? (
        <IndustryProductValueChain stages={hospitalityProductStages} industryName={industry.name} />
      ) : industry.slug === 'construction-engineering' ? (
        <IndustryProductValueChain stages={constructionEngineeringProductStages} industryName={industry.name} />
      ) : industry.slug === 'agtech' ? (
        <IndustryProductValueChain stages={agtechProductStages} industryName={industry.name} />
      ) : industry.valueChain ? (
        <IndustryValueChain valueChain={industry.valueChain} industryName={industry.name} />
      ) : industry.subcategories ? (
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
      ) : null}

      {/* Featured Companies - Only show if not semiconductors (since it's in the value chain) */}
      {industry.featured_companies && !industry.valueChain && (
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

