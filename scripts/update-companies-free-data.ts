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

type ListingStatus = 'active' | 'needs_review' | 'inactive_candidate'
type ListingType = 'US' | 'ADR' | 'Foreign' | 'OTC' | 'Unknown'
type FreeDataStatus = 'active_us_listed' | 'foreign_or_adr' | 'likely_stale_or_acquired' | 'sec_only' | 'nasdaq_only' | 'unmatched'

type LatestFact = {
  concept: string
  value: number
  fiscalYear: number
  fiscalPeriod?: string
  end: string
  form: string
} | null

type FactPoint = NonNullable<LatestFact>

const QUARTERLY_MIN_END_DATE = process.env.SEC_QUARTERLY_MIN_END_DATE || '2018-01-01'

const SEC_COMPANY_TICKERS_URL = 'https://www.sec.gov/files/company_tickers.json'
const NASDAQ_LISTED_URL = 'https://www.nasdaqtrader.com/dynamic/symdir/nasdaqlisted.txt'
const OTHER_LISTED_URL = 'https://www.nasdaqtrader.com/dynamic/symdir/otherlisted.txt'
const REQUEST_DELAY_MS = Number(process.env.SEC_REQUEST_DELAY_MS || 150)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const userAgent =
  process.env.SEC_USER_AGENT ||
  `SupplyChainMap free data updater ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} contact@example.com`

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getArg(name: string): string | undefined {
  return process.argv.find(arg => arg.startsWith(`--${name}=`))?.split('=')[1]
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`)
}

function getLimit(): number | null {
  const raw = getArg('limit')
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function getTickers(): string[] | null {
  const raw = getArg('tickers')
  if (!raw) return null
  const tickers = raw
    .split(',')
    .map(ticker => ticker.trim().toUpperCase())
    .filter(Boolean)

  return tickers.length > 0 ? [...new Set(tickers)] : null
}

function getOutputPath(): string {
  return getArg('out') || 'reports/free-data-update-result-us.json'
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
      if (attempt < 3) await sleep(1000 * attempt)
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

function inferListingType(ticker: string, name: string, nasdaqRecord: NasdaqRecord | null): ListingType {
  if (!nasdaqRecord && ticker.length >= 5 && (ticker.endsWith('Y') || ticker.endsWith('F'))) return ticker.endsWith('F') ? 'OTC' : 'ADR'
  if (isLikelyForeignOrAdr(ticker, name, nasdaqRecord)) return ticker.length >= 5 && ticker.endsWith('F') ? 'OTC' : 'ADR'
  if (nasdaqRecord) return 'US'
  return 'Unknown'
}

function classifyStatus(
  ticker: string,
  name: string,
  secRecord: SecTickerRecord | null,
  nasdaqRecord: NasdaqRecord | null
): { status: FreeDataStatus; reason: string; listingStatus: ListingStatus } {
  const foreignOrAdr = isLikelyForeignOrAdr(ticker, name, nasdaqRecord)

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

function factCandidates(companyFacts: any, concepts: string[], forms: string[], minEndDate?: string): FactPoint[] {
  const candidates: FactPoint[] = []

  for (const concept of concepts) {
    const units = companyFacts?.facts?.['us-gaap']?.[concept]?.units
    if (!units) continue

    const values = (Object.values(units).flat() as any[])
      .filter(item =>
        forms.includes(item?.form) &&
        item?.fy &&
        item?.val !== undefined &&
        (!minEndDate || String(item?.end || '') >= minEndDate)
      )
      .map(item => ({
        concept,
        value: item.val,
        fiscalYear: item.fy,
        fiscalPeriod: item.fp,
        end: item.end,
        form: item.form,
      }))

    candidates.push(...values)
  }

  return candidates.sort((a, b) => String(b.end || '').localeCompare(String(a.end || '')))
}

function latestFact(companyFacts: any, concepts: string[], forms = ['10-K'], minEndDate?: string): LatestFact {
  const candidates = factCandidates(companyFacts, concepts, forms, minEndDate)
  return candidates.sort((a, b) => String(b.end || '').localeCompare(String(a.end || '')))[0] || null
}

function factHistory(companyFacts: any, concepts: string[], forms: string[], limit = 8, minEndDate?: string): FactPoint[] {
  const byEnd = new Map<string, FactPoint>()

  for (const candidate of factCandidates(companyFacts, concepts, forms, minEndDate)) {
    const key = `${candidate.end}-${candidate.fiscalPeriod || ''}`
    if (!byEnd.has(key)) {
      byEnd.set(key, candidate)
    }
  }

  return Array.from(byEnd.values())
    .sort((a, b) => String(b.end || '').localeCompare(String(a.end || '')))
    .slice(0, limit)
}

async function fetchDbCompanies(limit: number | null, tickers: string[] | null): Promise<DbCompany[]> {
  if (tickers) {
    const { data, error } = await supabase
      .from('companies')
      .select('ticker, name, country, exchange, industry, industry_slug, stream_slug, category_slug, value_chain_tags, product_tags, market_cap, description, website, employees, data')
      .in('ticker', tickers)
      .order('ticker')

    if (error) throw error
    return data || []
  }

  const rows: DbCompany[] = []
  const batchSize = 1000
  let from = 0

  while (true) {
    const to = limit ? Math.min(from + batchSize - 1, limit - 1) : from + batchSize - 1
    const { data, error } = await supabase
      .from('companies')
      .select('ticker, name, country, exchange, industry, industry_slug, stream_slug, category_slug, value_chain_tags, product_tags, market_cap, description, website, employees, data')
      .in('country', COUNTRY_MAP.US)
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

function buildDataPatch(params: {
  company: DbCompany
  secRecord: SecTickerRecord | null
  nasdaqRecord: NasdaqRecord | null
  cik: string | null
  listingType: ListingType
  listingStatus: ListingStatus
  freeDataStatus: FreeDataStatus
  reviewReason: string
  companyFacts: any | null
  financials: {
    revenue: LatestFact
    netIncome: LatestFact
    assets: LatestFact
  }
  latestQuarter: {
    revenue: LatestFact
    netIncome: LatestFact
    assets: LatestFact
  }
  quarterlyHistory: {
    revenue: FactPoint[]
    netIncome: FactPoint[]
    assets: FactPoint[]
  }
  errors: string[]
}) {
  const existing = params.company.data && typeof params.company.data === 'object' ? params.company.data : {}
  const now = new Date().toISOString()

  return {
    ...existing,
    freeData: {
      ...(existing.freeData || {}),
      source: 'sec+nasdaq-trader',
      last_sync_at: now,
      listing_status: params.listingStatus,
      listing_type: params.listingType,
      free_data_status: params.freeDataStatus,
      review_reason: params.reviewReason,
      errors: params.errors,
    },
    sec: {
      ...(existing.sec || {}),
      cik: params.cik,
      entity_name: params.secRecord?.title || null,
      ticker_matched: Boolean(params.secRecord),
      facts_fetched_at: params.companyFacts ? now : existing.sec?.facts_fetched_at || null,
    },
    nasdaq: {
      ...(existing.nasdaq || {}),
      symbol_matched: Boolean(params.nasdaqRecord),
      security_name: params.nasdaqRecord?.['Security Name'] || null,
      exchange: params.nasdaqRecord ? getNasdaqExchange(params.nasdaqRecord) : null,
      etf: params.nasdaqRecord?.ETF || null,
      test_issue: params.nasdaqRecord?.['Test Issue'] || null,
      fetched_at: now,
    },
    financials: {
      ...(existing.financials || {}),
      source: 'sec_companyfacts',
      latestAnnual: params.financials,
      latestQuarter: params.latestQuarter,
      quarterlyHistory: params.quarterlyHistory,
      updated_at: params.companyFacts ? now : existing.financials?.updated_at || null,
    },
  }
}

async function main() {
  const limit = getLimit()
  const tickers = getTickers()
  const apply = hasFlag('apply')
  const outPath = getOutputPath()

  const scope = tickers ? tickers.join(', ') : limit ? `first ${limit}` : 'all'
  console.log(`${apply ? 'Applying' : 'Dry-running'} free-data updates for ${scope} US companies...`)
  const companies = await fetchDbCompanies(limit, tickers)
  console.log(`Loaded ${companies.length} US company rows`)

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

  const results: any[] = []
  let updated = 0
  let skipped = 0
  let factMatches = 0

  for (const [index, company] of companies.entries()) {
    const normalized = normalizeCompanyClassification(company)
    const ticker = normalized.ticker.toUpperCase()
    const secRecord = secByTicker.get(ticker) || null
    const nasdaqRecord = nasdaqByTicker.get(ticker) || null
    const cik = secRecord ? cikToPadded(secRecord.cik_str) : null
    const listingType = inferListingType(ticker, normalized.name, nasdaqRecord)
    const classification = classifyStatus(ticker, normalized.name, secRecord, nasdaqRecord)
    const errors: string[] = []

    let companyFacts: any | null = null
    const financials = {
      revenue: null as LatestFact,
      netIncome: null as LatestFact,
      assets: null as LatestFact,
    }
    const latestQuarter = {
      revenue: null as LatestFact,
      netIncome: null as LatestFact,
      assets: null as LatestFact,
    }
    const quarterlyHistory = {
      revenue: [] as FactPoint[],
      netIncome: [] as FactPoint[],
      assets: [] as FactPoint[],
    }

    if (cik) {
      try {
        await sleep(REQUEST_DELAY_MS)
        companyFacts = await fetchJson<any>(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`)
        financials.revenue = latestFact(companyFacts, ['RevenueFromContractWithCustomerExcludingAssessedTax', 'Revenues', 'SalesRevenueNet'])
        financials.netIncome = latestFact(companyFacts, ['NetIncomeLoss'])
        financials.assets = latestFact(companyFacts, ['Assets'])
        latestQuarter.revenue = latestFact(companyFacts, ['RevenueFromContractWithCustomerExcludingAssessedTax', 'Revenues', 'SalesRevenueNet'], ['10-Q'], QUARTERLY_MIN_END_DATE)
        latestQuarter.netIncome = latestFact(companyFacts, ['NetIncomeLoss'], ['10-Q'], QUARTERLY_MIN_END_DATE)
        latestQuarter.assets = latestFact(companyFacts, ['Assets'], ['10-Q'], QUARTERLY_MIN_END_DATE)
        quarterlyHistory.revenue = factHistory(companyFacts, ['RevenueFromContractWithCustomerExcludingAssessedTax', 'Revenues', 'SalesRevenueNet'], ['10-Q'], 8, QUARTERLY_MIN_END_DATE)
        quarterlyHistory.netIncome = factHistory(companyFacts, ['NetIncomeLoss'], ['10-Q'], 8, QUARTERLY_MIN_END_DATE)
        quarterlyHistory.assets = factHistory(companyFacts, ['Assets'], ['10-Q'], 8, QUARTERLY_MIN_END_DATE)
        if (financials.revenue || financials.netIncome || financials.assets || latestQuarter.revenue || latestQuarter.netIncome || latestQuarter.assets) factMatches += 1
      } catch (error: any) {
        errors.push(`SEC companyfacts failed: ${error.message || error}`)
      }
    }

    const nextExchange = normalized.exchange || (nasdaqRecord ? getNasdaqExchange(nasdaqRecord) : null)
    const dataPatch = buildDataPatch({
      company,
      secRecord,
      nasdaqRecord,
      cik,
      listingType,
      listingStatus: classification.listingStatus,
      freeDataStatus: classification.status,
      reviewReason: classification.reason,
      companyFacts,
      financials,
      latestQuarter,
      quarterlyHistory,
      errors,
    })

    const updatePayload = {
      exchange: nextExchange,
      data: dataPatch,
    }

    if (apply) {
      const { error } = await supabase
        .from('companies')
        .update(updatePayload)
        .eq('ticker', ticker)

      if (error) {
        errors.push(`Supabase update failed: ${error.message}`)
        skipped += 1
      } else {
        updated += 1
      }
    }

    results.push({
      ticker,
      name: normalized.name,
      apply,
      wouldUpdate: true,
      updated: apply && errors.every(error => !error.startsWith('Supabase update failed')),
      exchange: {
        before: normalized.exchange,
        after: nextExchange,
      },
      freeData: dataPatch.freeData,
      sec: dataPatch.sec,
      nasdaq: dataPatch.nasdaq,
      financials: dataPatch.financials.latestAnnual,
      latestQuarter: dataPatch.financials.latestQuarter,
      quarterlyHistoryCounts: {
        revenue: dataPatch.financials.quarterlyHistory.revenue.length,
        netIncome: dataPatch.financials.quarterlyHistory.netIncome.length,
        assets: dataPatch.financials.quarterlyHistory.assets.length,
      },
      errors,
    })

    if ((index + 1) % 25 === 0 || index + 1 === companies.length) {
      console.log(`${apply ? 'Processed' : 'Prepared'} ${index + 1}/${companies.length}`)
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    apply,
    total: companies.length,
    updated: apply ? updated : 0,
    skipped,
    prepared: results.length,
    factMatches,
    quarterMatches: results.filter(row => row.latestQuarter.revenue || row.latestQuarter.netIncome || row.latestQuarter.assets).length,
    active: results.filter(row => row.freeData.listing_status === 'active').length,
    needsReview: results.filter(row => row.freeData.listing_status === 'needs_review').length,
    inactiveCandidates: results.filter(row => row.freeData.listing_status === 'inactive_candidate').length,
    errors: results.filter(row => row.errors.length > 0).length,
  }

  const report = {
    summary,
    results,
  }

  const resolvedOutPath = path.resolve(process.cwd(), outPath)
  mkdirSync(path.dirname(resolvedOutPath), { recursive: true })
  writeFileSync(resolvedOutPath, JSON.stringify(report, null, 2))

  console.log('\nUpdate summary')
  console.table(summary)
  console.log(`Report written to ${resolvedOutPath}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
