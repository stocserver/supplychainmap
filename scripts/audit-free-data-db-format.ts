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

type LatestFact = {
  concept: string
  value: number
  fiscalYear: number
  end: string
  form: string
} | null

type FormatAuditRow = {
  ticker: string
  dbName: string
  freeName: string | null
  country: string | null
  exchange: string | null
  cik: string | null
  secMatched: boolean
  nasdaqMatched: boolean
  hasDbIndustry: boolean
  hasDbTags: boolean
  hasSecRevenue: boolean
  hasSecNetIncome: boolean
  hasSecAssets: boolean
  canonicalPreview: {
    ticker: string
    name: string
    country: string | null
    exchange: string | null
    cik: string | null
    sec_entity_name: string | null
    industry_slug: string | null
    stream_slug: string | null
    category_slug: string | null
    value_chain_tags: string[]
    financials: {
      revenue: LatestFact
      netIncome: LatestFact
      assets: LatestFact
    }
  }
  errors: string[]
}

const SEC_COMPANY_TICKERS_URL = 'https://www.sec.gov/files/company_tickers.json'
const NASDAQ_LISTED_URL = 'https://www.nasdaqtrader.com/dynamic/symdir/nasdaqlisted.txt'
const OTHER_LISTED_URL = 'https://www.nasdaqtrader.com/dynamic/symdir/otherlisted.txt'
const REQUEST_DELAY_MS = Number(process.env.SEC_REQUEST_DELAY_MS || 150)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const userAgent =
  process.env.SEC_USER_AGENT ||
  `SupplyChainMap data audit ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} contact@example.com`

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

function getLimit(): number | null {
  const raw = getArg('limit')
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function getOutputPath(): string {
  return getArg('out') || 'reports/free-data-db-format-audit.json'
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetchWithRetry(url, 'application/json')

  return response.json() as Promise<T>
}

async function fetchText(url: string): Promise<string> {
  const response = await fetchWithRetry(url, 'text/plain,*/*')

  return response.text()
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

function latestFact(companyFacts: any, concepts: string[]): LatestFact {
  const candidates: NonNullable<LatestFact>[] = []

  for (const concept of concepts) {
    const units = companyFacts?.facts?.['us-gaap']?.[concept]?.units
    if (!units) continue

    const annualValues = (Object.values(units).flat() as any[])
      .filter(item => item?.form === '10-K' && item?.fy && item?.val !== undefined)
      .map(item => ({
        concept,
        value: item.val,
        fiscalYear: item.fy,
        end: item.end,
        form: item.form,
      }))

    candidates.push(...annualValues)
  }

  return candidates.sort((a, b) => String(b.end || '').localeCompare(String(a.end || '')))[0] || null
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

async function auditCompany(
  dbCompany: DbCompany,
  nasdaqByTicker: Map<string, NasdaqRecord>,
  secByTicker: Map<string, SecTickerRecord>
): Promise<FormatAuditRow> {
  const normalized = normalizeCompanyClassification(dbCompany)
  const ticker = normalized.ticker.toUpperCase()
  const errors: string[] = []
  const nasdaqRecord = nasdaqByTicker.get(ticker) || null
  const secRecord = secByTicker.get(ticker) || null
  const cik = secRecord ? cikToPadded(secRecord.cik_str) : null

  let revenue: LatestFact = null
  let netIncome: LatestFact = null
  let assets: LatestFact = null

  if (cik) {
    try {
      await sleep(REQUEST_DELAY_MS)
      const companyFacts = await fetchJson<any>(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`)
      revenue = latestFact(companyFacts, ['RevenueFromContractWithCustomerExcludingAssessedTax', 'Revenues', 'SalesRevenueNet'])
      netIncome = latestFact(companyFacts, ['NetIncomeLoss'])
      assets = latestFact(companyFacts, ['Assets'])
    } catch (error: any) {
      errors.push(`SEC companyfacts failed: ${error.message || error}`)
    }
  }

  const exchange = normalized.exchange || (nasdaqRecord ? getNasdaqExchange(nasdaqRecord) : null)
  const freeName = secRecord?.title || nasdaqRecord?.['Security Name'] || nasdaqRecord?.['Company Name'] || null

  return {
    ticker,
    dbName: normalized.name,
    freeName,
    country: normalized.country || 'US',
    exchange,
    cik,
    secMatched: Boolean(secRecord),
    nasdaqMatched: Boolean(nasdaqRecord),
    hasDbIndustry: Boolean(normalized.industry_slug),
    hasDbTags: normalized.value_chain_tags.length > 0,
    hasSecRevenue: Boolean(revenue),
    hasSecNetIncome: Boolean(netIncome),
    hasSecAssets: Boolean(assets),
    canonicalPreview: {
      ticker,
      name: freeName || normalized.name,
      country: normalized.country || 'US',
      exchange,
      cik,
      sec_entity_name: secRecord?.title || null,
      industry_slug: normalized.industry_slug,
      stream_slug: normalized.stream_slug || null,
      category_slug: normalized.category_slug || null,
      value_chain_tags: normalized.value_chain_tags,
      financials: {
        revenue,
        netIncome,
        assets,
      },
    },
    errors,
  }
}

function pct(part: number, total: number): string {
  if (total === 0) return '0.0%'
  return `${((part / total) * 100).toFixed(1)}%`
}

async function main() {
  const limit = getLimit()
  const outPath = getOutputPath()

  console.log(`Loading ${limit ? `first ${limit}` : 'all'} US companies from Supabase...`)
  const dbCompanies = await fetchDbCompanies(limit)
  console.log(`Loaded ${dbCompanies.length} US company rows`)

  console.log('Fetching Nasdaq and SEC free reference data...')
  const [nasdaqListedText, otherListedText, secTickerMap] = await Promise.all([
    fetchText(NASDAQ_LISTED_URL),
    fetchText(OTHER_LISTED_URL),
    fetchJson<Record<string, SecTickerRecord>>(SEC_COMPANY_TICKERS_URL),
  ])

  const nasdaqRows = [...parsePipeFile(nasdaqListedText), ...parsePipeFile(otherListedText)]
  const nasdaqByTicker = new Map<string, NasdaqRecord>()
  nasdaqRows.forEach(row => {
    const symbol = getNasdaqSymbol(row)
    if (symbol) nasdaqByTicker.set(symbol, row)
  })

  const secByTicker = new Map<string, SecTickerRecord>()
  Object.values(secTickerMap).forEach(record => secByTicker.set(record.ticker.toUpperCase(), record))

  console.log(`Reference data: ${nasdaqByTicker.size} Nasdaq rows, ${secByTicker.size} SEC ticker rows`)

  const rows: FormatAuditRow[] = []
  for (const [index, company] of dbCompanies.entries()) {
    const row = await auditCompany(company, nasdaqByTicker, secByTicker)
    rows.push(row)

    if ((index + 1) % 25 === 0 || index + 1 === dbCompanies.length) {
      console.log(`Audited ${index + 1}/${dbCompanies.length}`)
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    totalDbCompanies: rows.length,
    secMatched: rows.filter(row => row.secMatched).length,
    nasdaqMatched: rows.filter(row => row.nasdaqMatched).length,
    hasDbIndustry: rows.filter(row => row.hasDbIndustry).length,
    hasDbTags: rows.filter(row => row.hasDbTags).length,
    hasSecRevenue: rows.filter(row => row.hasSecRevenue).length,
    hasSecNetIncome: rows.filter(row => row.hasSecNetIncome).length,
    hasSecAssets: rows.filter(row => row.hasSecAssets).length,
    errors: rows.filter(row => row.errors.length > 0).length,
  }

  const coverage = {
    secMatched: pct(summary.secMatched, rows.length),
    nasdaqMatched: pct(summary.nasdaqMatched, rows.length),
    hasDbIndustry: pct(summary.hasDbIndustry, rows.length),
    hasDbTags: pct(summary.hasDbTags, rows.length),
    hasSecRevenue: pct(summary.hasSecRevenue, rows.length),
    hasSecNetIncome: pct(summary.hasSecNetIncome, rows.length),
    hasSecAssets: pct(summary.hasSecAssets, rows.length),
    errors: pct(summary.errors, rows.length),
  }

  const report = {
    summary,
    coverage,
    rows,
  }

  const resolvedOutPath = path.resolve(process.cwd(), outPath)
  mkdirSync(path.dirname(resolvedOutPath), { recursive: true })
  writeFileSync(resolvedOutPath, JSON.stringify(report, null, 2))

  console.log('\nCoverage summary')
  console.table(coverage)
  console.log(`Report written to ${resolvedOutPath}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
