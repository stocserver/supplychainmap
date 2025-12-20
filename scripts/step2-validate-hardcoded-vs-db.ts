import * as dotenv from 'dotenv'
import * as path from 'path'
import { pathToFileURL } from 'url'
import { promises as fs } from 'fs'
import { createClient } from '@supabase/supabase-js'
import type { ValueChainStageProducts, ProductCategory, ProductCompanyRef } from '../lib/data/industries'
import { industries } from '../lib/data/industries'

type PublicListing = 'US' | 'ADR' | 'Foreign'

type ProductCompanyRefWithSource = ProductCompanyRef & {
  __source?: { file: string; productId?: string }
}

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function isStageArray(value: any): value is ValueChainStageProducts[] {
  return Array.isArray(value)
    && value.length > 0
    && typeof value[0] === 'object'
    && value[0] !== null
    && ['upstream', 'midstream', 'downstream'].includes((value[0] as any).stage)
    && Array.isArray((value[0] as any).products)
}

function collectCompaniesFromProduct(product: ProductCategory, sourceFile: string, bucket: ProductCompanyRefWithSource[]) {
  const detailed = (product as any).companiesDetailed as ProductCompanyRef[] | undefined
  if (detailed && detailed.length) {
    for (const c of detailed) bucket.push({ ...c, __source: { file: sourceFile, productId: product.id } })
  }
  const subs = (product as any).subProducts as ProductCategory[] | undefined
  if (subs && subs.length) {
    for (const sp of subs) collectCompaniesFromProduct(sp, sourceFile, bucket)
  }
}

async function loadAllProductStages(): Promise<{ file: string; stages: ValueChainStageProducts[] }[]> {
  const dir = path.resolve(process.cwd(), 'lib', 'industries')
  const entries = await fs.readdir(dir)
  const files = entries.filter(f => f.endsWith('.products.ts'))
  const results: { file: string; stages: ValueChainStageProducts[] }[] = []
  for (const file of files) {
    const full = path.resolve(dir, file)
    try {
      const mod = await import(pathToFileURL(full).href)
      for (const [key, value] of Object.entries(mod)) {
        if (isStageArray(value)) {
          results.push({ file, stages: value })
        }
      }
    } catch (e: any) {
      console.warn(`⚠️  Failed to import ${file}: ${e.message}`)
    }
  }
  return results
}

function collectTickersFromIndustries(): string[] {
  const acc: string[] = []
  for (const ind of industries) {
    if (ind.featured_companies) acc.push(...ind.featured_companies)
    if (ind.valueChain) {
      const stages = [
        ...(ind.valueChain.upstream || []),
        ...(ind.valueChain.midstream || []),
        ...(ind.valueChain.downstream || []),
      ]
      for (const seg of stages) {
        if ((seg as any).companies) acc.push(...((seg as any).companies as string[]))
        if ((seg as any).subcategories) {
          for (const sub of (seg as any).subcategories) {
            if (sub.companies) acc.push(...(sub.companies as string[]))
          }
        }
      }
    }
  }
  return acc
}

async function main() {
  const shouldSeed = process.argv.includes('--seed')

  console.log('🔎 Validating hardcoded companies vs Supabase DB...')
  const stageFiles = await loadAllProductStages()

  // Collect ProductCompanyRef entries
  const productCompanies: ProductCompanyRefWithSource[] = []
  for (const { file, stages } of stageFiles) {
    for (const stage of stages) {
      for (const p of stage.products) collectCompaniesFromProduct(p, file, productCompanies)
    }
  }

  // Build map ticker -> name (prefer product entries with explicit names)
  const tickerToName = new Map<string, string>()
  for (const c of productCompanies) {
    if (c.ticker) {
      const t = c.ticker.toUpperCase()
      if (!tickerToName.has(t) || (c.name && c.name !== c.ticker)) tickerToName.set(t, c.name || t)
    }
  }

  // Add classic tickers
  for (const t of collectTickersFromIndustries()) {
    const T = t.toUpperCase()
    if (!tickerToName.has(T)) tickerToName.set(T, T)
  }

  const codeTickers = new Set<string>(Array.from(tickerToName.keys()))

  // Load DB tickers
  const { data: dbRows, error } = await supabase.from('companies').select('ticker')
  if (error) {
    console.error('❌ Supabase error:', error.message)
    process.exit(1)
  }
  const dbTickers = new Set<string>((dbRows || []).map(r => String((r as any).ticker).toUpperCase()))

  // Diffs
  const missingTickers = Array.from(codeTickers).filter(t => !dbTickers.has(t)).sort()
  const publicWithoutTicker = productCompanies
    .filter(c => !c.ticker && (['US', 'ADR', 'Foreign'] as PublicListing[]).includes((c.listing as PublicListing)))
    .map(c => ({ name: c.name, listing: c.listing, source: c.__source }))

  console.log(`\n📦 In code (unique tickers): ${codeTickers.size}`)
  console.log(`🗄️  In DB (unique tickers):   ${dbTickers.size}`)
  console.log(`⚠️  Missing in DB:            ${missingTickers.length}`)
  console.log(`⚠️  Public entries without ticker: ${publicWithoutTicker.length}`)

  if (publicWithoutTicker.length > 0) {
    console.log('\n❗ Public companies missing ticker (top 20):')
    for (const item of publicWithoutTicker.slice(0, 20)) {
      console.log(` - ${item.name} [${item.listing}] ${item.source ? `(${item.source.file}${item.source.productId ? ' #' + item.source.productId : ''})` : ''}`)
    }
  }

  if (missingTickers.length > 0) {
    console.log('\n❗ Tickers present in code but missing from DB (top 50):')
    console.log(missingTickers.slice(0, 50).join(', '))
  }

  if (shouldSeed && missingTickers.length > 0) {
    const rows = missingTickers.map(t => ({ ticker: t, name: tickerToName.get(t) || t }))
    console.log(`\n🧩 Seeding ${rows.length} missing companies into DB...`)
    const { error: upsertErr } = await supabase.from('companies').upsert(rows, { onConflict: 'ticker' })
    if (upsertErr) {
      console.error('❌ Upsert error:', upsertErr.message)
      process.exit(1)
    }
    console.log('✅ Seeded missing tickers.')
  }

  const hasErrors = publicWithoutTicker.length > 0 || (!shouldSeed && missingTickers.length > 0)
  if (hasErrors) {
    console.log('\n❌ Validation failed. Fix entries above, run seed, or re-run with --seed.')
    process.exit(1)
  }

  console.log('\n✅ Validation passed.')
}

main().catch((e) => {
  console.error('💥 Fatal error:', e)
  process.exit(1)
})
