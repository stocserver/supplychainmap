import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config()

type SecTickerRecord = {
  cik_str: number
  ticker: string
  title: string
}

type NasdaqRecord = Record<string, string>

const SEC_COMPANY_TICKERS_URL = 'https://www.sec.gov/files/company_tickers.json'
const NASDAQ_LISTED_URL = 'https://www.nasdaqtrader.com/dynamic/symdir/nasdaqlisted.txt'
const OTHER_LISTED_URL = 'https://www.nasdaqtrader.com/dynamic/symdir/otherlisted.txt'

const DEFAULT_TICKERS = ['AAPL', 'NVDA', 'JPM']
const REQUEST_DELAY_MS = 150

const userAgent =
  process.env.SEC_USER_AGENT ||
  `SupplyChainMap data test ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} contact@example.com`

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getTickersFromArgs(): string[] {
  const tickersArg = process.argv.find(arg => arg.startsWith('--tickers='))?.split('=')[1]
  const positionalTickers = process.argv
    .slice(2)
    .filter(arg => !arg.startsWith('--'))

  const raw = tickersArg
    ? tickersArg.split(',')
    : positionalTickers.length > 0
      ? positionalTickers
      : DEFAULT_TICKERS

  return [...new Set(raw.map(t => t.trim().toUpperCase()).filter(Boolean))]
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`)
  }

  return response.json() as Promise<T>
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
      Accept: 'text/plain,*/*',
    },
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`)
  }

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

function cikToPadded(cik: number): string {
  return String(cik).padStart(10, '0')
}

function getRecentFilings(submissions: any) {
  const recent = submissions?.filings?.recent
  if (!recent?.form || !recent?.filingDate || !recent?.accessionNumber) return []

  return recent.form.slice(0, 10).map((form: string, index: number) => ({
    form,
    filingDate: recent.filingDate[index],
    accessionNumber: recent.accessionNumber[index],
    primaryDocument: recent.primaryDocument?.[index],
  }))
}

function latestFact(companyFacts: any, concepts: string[]) {
  const candidates: any[] = []

  for (const concept of concepts) {
    const units = companyFacts?.facts?.['us-gaap']?.[concept]?.units
    if (!units) continue

    const unitValues = Object.values(units).flat() as any[]
    const annualValues = unitValues
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

async function main() {
  const tickers = getTickersFromArgs()

  console.log(`Testing free data sources for: ${tickers.join(', ')}`)
  console.log(`SEC User-Agent: ${userAgent}`)

  console.log('\nFetching Nasdaq symbol directories...')
  const [nasdaqListedText, otherListedText] = await Promise.all([
    fetchText(NASDAQ_LISTED_URL),
    fetchText(OTHER_LISTED_URL),
  ])

  const nasdaqRows = [...parsePipeFile(nasdaqListedText), ...parsePipeFile(otherListedText)]
  console.log(`Loaded ${nasdaqRows.length} Nasdaq Trader symbol rows`)

  console.log('\nFetching SEC ticker map...')
  const secTickerMap = await fetchJson<Record<string, SecTickerRecord>>(SEC_COMPANY_TICKERS_URL)
  const secRecords = Object.values(secTickerMap)
  console.log(`Loaded ${secRecords.length} SEC ticker records`)

  for (const ticker of tickers) {
    console.log(`\n=== ${ticker} ===`)

    const nasdaqRecord = nasdaqRows.find(row => getNasdaqSymbol(row) === ticker)
    if (nasdaqRecord) {
      console.log(`Nasdaq: ${nasdaqRecord['Security Name'] || nasdaqRecord['Security Name'] || nasdaqRecord['Company Name'] || 'name unavailable'}`)
      console.log(`Exchange: ${nasdaqRecord.Exchange || 'NASDAQ'} | ETF: ${nasdaqRecord.ETF || 'N'} | Test Issue: ${nasdaqRecord['Test Issue'] || 'N'}`)
    } else {
      console.log('Nasdaq: no symbol-directory match')
    }

    const secRecord = secRecords.find(record => record.ticker.toUpperCase() === ticker)
    if (!secRecord) {
      console.log('SEC: no ticker-to-CIK match')
      continue
    }

    const cik = cikToPadded(secRecord.cik_str)
    console.log(`SEC: ${secRecord.title} | CIK ${cik}`)

    try {
      await sleep(REQUEST_DELAY_MS)
      const submissions = await fetchJson<any>(`https://data.sec.gov/submissions/CIK${cik}.json`)
      const recentFilings = getRecentFilings(submissions)
      console.log(`Recent filings: ${recentFilings.map((f: any) => `${f.form} ${f.filingDate}`).join(', ') || 'none'}`)
    } catch (error: any) {
      console.log(`Recent filings: failed (${error.message || error})`)
    }

    try {
      await sleep(REQUEST_DELAY_MS)
      const companyFacts = await fetchJson<any>(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`)
      const revenue = latestFact(companyFacts, ['Revenues', 'RevenueFromContractWithCustomerExcludingAssessedTax', 'SalesRevenueNet'])
      const netIncome = latestFact(companyFacts, ['NetIncomeLoss'])
      const assets = latestFact(companyFacts, ['Assets'])

      console.log(`Revenue: ${revenue ? `${revenue.value} (${revenue.concept}, FY${revenue.fiscalYear})` : 'not found'}`)
      console.log(`Net income: ${netIncome ? `${netIncome.value} (${netIncome.concept}, FY${netIncome.fiscalYear})` : 'not found'}`)
      console.log(`Assets: ${assets ? `${assets.value} (${assets.concept}, FY${assets.fiscalYear})` : 'not found'}`)
    } catch (error: any) {
      console.log(`Company facts: failed (${error.message || error})`)
    }
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
