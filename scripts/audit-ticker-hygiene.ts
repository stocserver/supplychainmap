import dotenv from 'dotenv'
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { COUNTRY_MAP } from '@/lib/data/constants'
import { normalizeCompanyClassification } from '@/lib/data/company-format'

dotenv.config({ path: '.env.local' })
dotenv.config()

type SecTickerRecord = {
  cik_str: number
  ticker: string
  title: string
}

type NasdaqRecord = Record<string, string>

type DbCompany = {
  ticker: string
  name: string
  country: string | null
  exchange: string | null
  industry: string | null
  industry_slug?: string | null
  stream_slug?: string | null
  category_slug?: string | null
  value_chain_tags?: string[] | null
  product_tags?: string[] | null
  market_cap?: number | string | null
  description?: string | null
  website?: string | null
  employees?: number | null
  data?: any
}

type HygieneStatus =
  | 'active_us_listed'
  | 'foreign_or_adr'
  | 'likely_stale_or_acquired'
  | 'sec_only'
  | 'nasdaq_only'
  | 'unmatched'

type ProposedChange = {
  ticker: string
  name: string
  current: {
    country: string | null
    exchange: string | null
    industry_slug: string | null
    value_chain_tags: string[]
  }
  proposed: {
    cik?: string
    sec_entity_name?: string
    exchange?: string | null
    listing_status: 'active' | 'needs_review' | 'inactive_candidate'
    listing_type: 'US' | 'ADR' | 'Foreign' | 'OTC' | 'Unknown'
    free_data_status: HygieneStatus
    review_reason: string
  }
}

const SEC_COMPANY_TICKERS_URL = 'https://www.sec.gov/files/company_tickers.json'
const NASDAQ_LISTED_URL = 'https://www.nasdaqtrader.com/dynamic/symdir/nasdaqlisted.txt'
const OTHER_LISTED_URL = 'https://www.nasdaqtrader.com/dynamic/symdir/otherlisted.txt'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const userAgent =
  process.env.SEC_USER_AGENT ||
  `SupplyChainMap ticker hygiene audit ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} contact@example.com`

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function getArg(name: string): string | undefined {
  return process.argv.find(arg => arg.startsWith(`--${name}=`))?.split('=')[1]
}

function getLimit(): number | null {
  const raw = getArg('limit')
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function getOutputPath(): string {
  return getArg('out') || 'reports/ticker-hygiene-dry-run-us.json'
}

async function fetchWithRetry(url: string, accept: string): Promise<Response> {
  let lastError: unknown

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          Accept: accept,
        },
      })

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} for ${url}`)
      }

      return response
    } catch (error) {
      lastError = error
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }

  throw lastError
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetchWithRetry(url, 'application/json')
  return response.json() as Promise<T>
}

async function fetchText(url: string): Promise<string> {
  const response = await fetchWithRetry(url, 'text/plain,*/*')
  return response.text()
}

function parsePipeFile(text: string): NasdaqRecord[] {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('File Creation Time'))

  const [headerLine, ...rows] = lines
  const headers = headerLine.split('|')

  return rows.map(row => {
    const values = row.split('|')
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']))
  })
}

function getNasdaqSymbol(row: NasdaqRecord): string {
  return (row.Symbol || row['ACT Symbol'] || '').toUpperCase()
}

function getNasdaqExchange(row: NasdaqRecord): string | null {
  const raw = row.Exchange || ''
  if (raw === 'N') return 'NYSE'
  if (raw === 'A') return 'NYSE American'
  if (raw === 'P') return 'NYSE Arca'
  if (raw === 'Z') return 'Cboe BZX'
  if (raw === 'V') return 'IEX'
  return raw || 'NASDAQ'
}

function cikToPadded(cik: number): string {
  return String(cik).padStart(10, '0')
}

function isLikelyForeignOrAdr(ticker: string, name: string, nasdaqRecord: NasdaqRecord | null): boolean {
  const upperName = name.toUpperCase()
  const securityName = (nasdaqRecord?.['Security Name'] || '').toUpperCase()
  const combined = `${upperName} ${securityName}`
  const legalForeignSuffix = /\b(S\.A\.|N\.V\.|PLC|P\.L\.C\.|AG|SE|LTD\.?|LIMITED)\b/

  return (
    (ticker.length >= 5 && (ticker.endsWith('Y') || ticker.endsWith('F'))) ||
    combined.includes(' ADR') ||
    combined.includes(' AMERICAN DEPOSITARY') ||
    legalForeignSuffix.test(combined)
  )
}

function inferListingType(ticker: string, name: string, nasdaqRecord: NasdaqRecord | null): ProposedChange['proposed']['listing_type'] {
  if (!nasdaqRecord && ticker.length >= 5 && (ticker.endsWith('Y') || ticker.endsWith('F'))) return ticker.endsWith('F') ? 'OTC' : 'ADR'
  if (isLikelyForeignOrAdr(ticker, name, nasdaqRecord)) return ticker.length >= 5 && ticker.endsWith('F') ? 'OTC' : 'ADR'
  if (nasdaqRecord) return 'US'
  return 'Unknown'
}

function classifyStatus(
  ticker: string,
  dbCompany: DbCompany,
  secRecord: SecTickerRecord | null,
  nasdaqRecord: NasdaqRecord | null
): { status: HygieneStatus; reason: string; listingStatus: ProposedChange['proposed']['listing_status'] } {
  const normalized = normalizeCompanyClassification(dbCompany)
  const foreignOrAdr = isLikelyForeignOrAdr(ticker, normalized.name, nasdaqRecord)

  if (secRecord && nasdaqRecord && !foreignOrAdr) {
    return { status: 'active_us_listed', reason: 'Matched both SEC ticker map and Nasdaq Trader symbol directory.', listingStatus: 'active' }
  }

  if (foreignOrAdr) {
    return { status: 'foreign_or_adr', reason: 'Ticker/name/security-name pattern suggests ADR, foreign ordinary, or OTC foreign listing.', listingStatus: 'needs_review' }
  }

  if (secRecord && !nasdaqRecord) {
    return { status: 'sec_only', reason: 'Matched SEC ticker map but not current Nasdaq Trader symbol directory.', listingStatus: 'needs_review' }
  }

  if (!secRecord && nasdaqRecord) {
    return { status: 'nasdaq_only', reason: 'Matched Nasdaq Trader symbol directory but not SEC ticker map.', listingStatus: 'needs_review' }
  }

  return { status: 'likely_stale_or_acquired', reason: 'No match in current SEC ticker map or Nasdaq Trader symbol directory.', listingStatus: 'inactive_candidate' }
}

async function fetchDbCompanies(limit: number | null): Promise<DbCompany[]> {
  const countries = COUNTRY_MAP.US
  const rows: DbCompany[] = []
  const batchSize = 1000
  let from = 0

  while (true) {
    const to = limit ? Math.min(from + batchSize - 1, limit - 1) : from + batchSize - 1
    const { data, error } = await supabase
      .from('companies')
      .select('ticker, name, country, exchange, industry, industry_slug, stream_slug, category_slug, value_chain_tags, product_tags, market_cap, description, website, employees, data')
      .in('country', countries)
      .order('ticker')
      .range(from, to)

    if (error) throw error
    if (!data || data.length === 0) break

    rows.push(...data)
    if (data.length < batchSize || (limit && rows.length >= limit)) break
    from += batchSize
  }

  return rows.slice(0, limit || undefined)
}

function countBy<T extends string>(items: T[]): Record<T, number> {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1
    return acc
  }, {} as Record<T, number>)
}

async function main() {
  const limit = getLimit()
  const outPath = getOutputPath()

  console.log(`Loading ${limit ? `first ${limit}` : 'all'} US companies from Supabase...`)
  const dbCompanies = await fetchDbCompanies(limit)
  console.log(`Loaded ${dbCompanies.length} US company rows`)

  console.log('Fetching free reference data...')
  const [nasdaqListedText, otherListedText, secTickerMap] = await Promise.all([
    fetchText(NASDAQ_LISTED_URL),
    fetchText(OTHER_LISTED_URL),
    fetchJson<Record<string, SecTickerRecord>>(SEC_COMPANY_TICKERS_URL),
  ])

  const nasdaqByTicker = new Map<string, NasdaqRecord>()
  ;[...parsePipeFile(nasdaqListedText), ...parsePipeFile(otherListedText)].forEach(row => {
    const symbol = getNasdaqSymbol(row)
    if (symbol) nasdaqByTicker.set(symbol, row)
  })

  const secByTicker = new Map<string, SecTickerRecord>()
  Object.values(secTickerMap).forEach(record => secByTicker.set(record.ticker.toUpperCase(), record))

  const proposedChanges: ProposedChange[] = dbCompanies.map(dbCompany => {
    const normalized = normalizeCompanyClassification(dbCompany)
    const ticker = normalized.ticker.toUpperCase()
    const secRecord = secByTicker.get(ticker) || null
    const nasdaqRecord = nasdaqByTicker.get(ticker) || null
    const classification = classifyStatus(ticker, dbCompany, secRecord, nasdaqRecord)
    const listingType = inferListingType(ticker, normalized.name, nasdaqRecord)

    return {
      ticker,
      name: normalized.name,
      current: {
        country: normalized.country || null,
        exchange: normalized.exchange || null,
        industry_slug: normalized.industry_slug,
        value_chain_tags: normalized.value_chain_tags,
      },
      proposed: {
        cik: secRecord ? cikToPadded(secRecord.cik_str) : undefined,
        sec_entity_name: secRecord?.title,
        exchange: normalized.exchange || (nasdaqRecord ? getNasdaqExchange(nasdaqRecord) : null),
        listing_status: classification.listingStatus,
        listing_type: listingType,
        free_data_status: classification.status,
        review_reason: classification.reason,
      },
    }
  })

  const byStatus = countBy(proposedChanges.map(row => row.proposed.free_data_status))
  const byListingType = countBy(proposedChanges.map(row => row.proposed.listing_type))
  const byListingStatus = countBy(proposedChanges.map(row => row.proposed.listing_status))
  const needsReview = proposedChanges.filter(row => row.proposed.listing_status !== 'active')
  const inactiveCandidates = proposedChanges.filter(row => row.proposed.listing_status === 'inactive_candidate')

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun: true,
    summary: {
      total: proposedChanges.length,
      byStatus,
      byListingType,
      byListingStatus,
      needsReview: needsReview.length,
      inactiveCandidates: inactiveCandidates.length,
    },
    samples: {
      needsReview: needsReview.slice(0, 50),
      inactiveCandidates: inactiveCandidates.slice(0, 50),
    },
    proposedChanges,
  }

  const resolvedOutPath = path.resolve(process.cwd(), outPath)
  mkdirSync(path.dirname(resolvedOutPath), { recursive: true })
  writeFileSync(resolvedOutPath, JSON.stringify(report, null, 2))

  console.log('\nStatus summary')
  console.table(byStatus)
  console.log('\nListing type summary')
  console.table(byListingType)
  console.log('\nListing status summary')
  console.table(byListingStatus)
  console.log(`Needs review: ${needsReview.length}`)
  console.log(`Inactive candidates: ${inactiveCandidates.length}`)
  console.log(`Report written to ${resolvedOutPath}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
