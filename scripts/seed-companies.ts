import * as dotenv from 'dotenv'
import * as path from 'path'
import { pathToFileURL } from 'url'
import { promises as fs } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { industries } from '../lib/data/industries'
import type { ValueChainStageProducts, ProductCategory } from '../lib/data/industries'

type CompanyRef = { name: string; ticker?: string }

function collectFromProducts(products: any[]): CompanyRef[] {
  const results: CompanyRef[] = []
  for (const p of products) {
    const direct: CompanyRef[] = (p.companiesDetailed || []).map((c: any) => ({ name: c.name, ticker: c.ticker }))
    results.push(...direct)
    if (p.subProducts && p.subProducts.length) {
      results.push(...collectFromProducts(p.subProducts))
    }
  }
  return results
}

function isStageArray(value: any): value is ValueChainStageProducts[] {
  return Array.isArray(value)
    && value.length > 0
    && typeof value[0] === 'object'
    && value[0] !== null
    && ['upstream', 'midstream', 'downstream'].includes((value[0] as any).stage)
    && Array.isArray((value[0] as any).products)
}

async function loadAllProductStages(): Promise<ValueChainStageProducts[]> {
  const dir = path.resolve(process.cwd(), 'lib', 'industries')
  const entries = await fs.readdir(dir)
  const files = entries.filter(f => f.endsWith('.products.ts'))
  const all: ValueChainStageProducts[] = []
  for (const file of files) {
    const full = path.resolve(dir, file)
    try {
      const mod = await import(pathToFileURL(full).href)
      for (const value of Object.values(mod)) {
        if (isStageArray(value)) all.push(...value)
      }
    } catch (e: any) {
      console.warn(`⚠️  Failed to import ${file}: ${e.message}`)
    }
  }
  return all
}

async function main() {
  // Load env from .env.local (same convention as other scripts)
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  // 1) Aggregate from ALL product-centric maps dynamically
  const stages = await loadAllProductStages()
  const productCompanyRefs: CompanyRef[] = []
  for (const stage of stages) {
    const products = (stage as any).products as ProductCategory[]
    productCompanyRefs.push(...collectFromProducts(products))
  }

  // 2) Aggregate from classic industries lists (featured + valueChain companies)
  function collectIndustryTickers(): CompanyRef[] {
    const refs: CompanyRef[] = []
    for (const ind of industries) {
      // featured companies
      if (ind.featured_companies) {
        for (const t of ind.featured_companies) refs.push({ name: t, ticker: t })
      }
      // valueChain companies
      if (ind.valueChain) {
        const stages = [
          ...(ind.valueChain.upstream || []),
          ...(ind.valueChain.midstream || []),
          ...(ind.valueChain.downstream || []),
        ]
        for (const seg of stages) {
          if (seg.companies) {
            for (const t of seg.companies) refs.push({ name: t, ticker: t })
          }
          if (seg.subcategories) {
            for (const sub of seg.subcategories) {
              if (sub.companies) {
                for (const t of sub.companies) refs.push({ name: t, ticker: t })
              }
            }
          }
        }
      }
    }
    return refs
  }

  const classicCompanies = collectIndustryTickers()

  // Merge with preference for named entries (from product map)
  const tickerToName = new Map<string, string>()
  for (const ref of [
    ...classicCompanies,
    ...productCompanyRefs,
  ]) {
    if (!ref.ticker) continue
    const t = ref.ticker.toUpperCase()
    if (!tickerToName.has(t) || (ref.name && ref.name !== ref.ticker)) {
      tickerToName.set(t, ref.name || t)
    }
  }

  const toUpsert = Array.from(tickerToName.entries()).map(([ticker, name]) => ({ ticker, name: name || ticker }))

  console.log(`Preparing to upsert ${toUpsert.length} companies to Supabase...`)

  const { error } = await supabase.from('companies').upsert(toUpsert, { onConflict: 'ticker' })
  if (error) {
    console.error('Upsert error:', error.message)
    process.exit(1)
  }

  console.log('✅ Seeded basic company rows (ticker, name).')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


