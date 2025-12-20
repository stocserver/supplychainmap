import { industriesStructure, Industry, ValueChain, ValueChainSegment, ValueChainStageProducts, ProductCategory, ProductCompanyRef } from './structure'
import { usData } from './regions/us'
import { cnData } from './regions/cn'
import { jpData } from './regions/jp'
// import { euData } from './regions/eu'

// Re-export types for compatibility
export type { Industry, ValueChain, ValueChainSegment, ValueChainStageProducts, ProductCategory, ProductCompanyRef } from './structure'

const REGION_DATA: Record<string, any> = {
  'US': usData,
  'CN': cnData,
  'JP': jpData,
  'EU': {}, // euData
}

// Helper to deep merge structure with regional data
function mergeIndustryData(structure: Industry, regionCode: string = 'US'): Industry {
  const data = REGION_DATA[regionCode] || usData
  const industryData = data[structure.id] || data[structure.slug] // Try both id and slug just in case

  if (!industryData) return structure

  // Clone to avoid mutation
  const industry = JSON.parse(JSON.stringify(structure))

  // 1. Override featured companies
  if (industryData.featured) {
    industry.featured_companies = industryData.featured
  }

  // 2. Override node companies in ValueChain
  if (industry.valueChain && industryData.nodes) {
    // Helper to traverse and update segments
    const updateSegments = (segments: any[]) => {
      segments.forEach(segment => {
        // If this segment has a matching ID in our data node map
        if (industryData.nodes[segment.id]) {
          segment.companies = industryData.nodes[segment.id]
        }

        // Recurse for subcategories
        if (segment.subcategories) {
          updateSegments(segment.subcategories)
        }
      })
    }

    if (industry.valueChain.upstream) updateSegments(industry.valueChain.upstream)
    if (industry.valueChain.midstream) updateSegments(industry.valueChain.midstream)
    if (industry.valueChain.downstream) updateSegments(industry.valueChain.downstream)
  }

  return industry
}

export function getIndustries(region: string = 'US'): Industry[] {
  return industriesStructure.map(ind => mergeIndustryData(ind, region))
}

export function getIndustryBySlug(slug: string, region: string = 'US'): Industry | undefined {
  const industries = getIndustries(region)
  return industries.find(i => i.slug === slug)
}

/**
 * Merges the static product stages (from .products.ts files) with 
 * the regional company data (from regions/*.ts) OR dynamic DB data.
 */
export function getRegionallyContextualizedStages(
  stages: ValueChainStageProducts[],
  slug: string,
  region: string = 'US',
  dynamicCompanies?: { ticker: string; name: string; tags: string[]; country: string; marketCap?: number; logoUrl?: string }[]
): ValueChainStageProducts[] {
  // If no dynamic data and region is US, return static (legacy)
  if (!dynamicCompanies && region === 'US') {
    return stages
  }

  // Clone stages to avoid mutation
  const contextStages = JSON.parse(JSON.stringify(stages)) as ValueChainStageProducts[]

  // Build lookup maps
  const nodeToTickers = new Map<string, string[]>()
  const tickerDetails = new Map<string, { name: string; country: string; tags: string[]; marketCap?: number; logoUrl?: string }>()

  // 1. Load Static Data (Base)
  const regionData = REGION_DATA[region]
  const industry = industriesStructure.find(i => i.slug === slug)
  const industryNodes = (industry && regionData) ? regionData[industry.id]?.nodes : null

  if (industryNodes) {
    Object.entries(industryNodes).forEach(([nodeId, tickers]) => {
      const fileTickers = tickers as string[]
      // Initialize with static tickers
      const distinct = new Set(fileTickers)
      nodeToTickers.set(nodeId, Array.from(distinct))

      // Only set country, name defaults to ticker
      fileTickers.forEach(t => tickerDetails.set(t, { name: t, country: region, tags: [] }))
    })
  }

  // 2. Merge Dynamic Data (Overlay)
  if (dynamicCompanies && dynamicCompanies.length > 0) {
    dynamicCompanies.forEach(c => {
      // Update details
      tickerDetails.set(c.ticker, { name: c.name, country: c.country, tags: c.tags || [], marketCap: c.marketCap, logoUrl: c.logoUrl })

      if (c.tags) {
        c.tags.forEach(tag => {
          if (!nodeToTickers.has(tag)) {
            nodeToTickers.set(tag, [])
          }
          const list = nodeToTickers.get(tag)!
          if (!list.includes(c.ticker)) {
            list.push(c.ticker)
          }
        })
      }
    })
  }

  // Recursive helper to update products
  const updateProductCompanies = (products: any[]) => {
    products.forEach(product => {
      const tickers = nodeToTickers.get(product.id)

      if (tickers && tickers.length > 0) {
        // Create full company references
        product.companiesDetailed = tickers.map(t => ({
          name: tickerDetails.get(t)?.name || t,
          ticker: t,
          listing: region === 'US' ? 'US' : 'Foreign',
          country: tickerDetails.get(t)?.country || region,
          tags: tickerDetails.get(t)?.tags || [],
          marketCap: tickerDetails.get(t)?.marketCap,
          logoUrl: tickerDetails.get(t)?.logoUrl
        }))
        // Legacy support
        product.companies = tickers
      } else {
        // Only clear default companies if we are NOT in US
        // For US, we want to fall back to the defaults already in the 'product' object
        // Always clear default companies to enforce DB-only data
        // (Previously preserved hardcoded data for US)
        product.companiesDetailed = []
        product.companies = []
      }

      if (product.subProducts) {
        updateProductCompanies(product.subProducts)
      }
    })
  }

  contextStages.forEach(stage => {
    updateProductCompanies(stage.products)
  })

  return contextStages
}

// Default export for backward compatibility (defaults to US)
export const industries = getIndustries('US')
