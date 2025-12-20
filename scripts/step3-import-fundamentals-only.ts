// Import fundamentals only (no quotes) from FMP to Supabase
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!FMP_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing environment variables (FMP_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

let lastFetchAt = 0
let fetchQueue: Promise<void> = Promise.resolve()
function wait(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }
async function limitedFetch(url: string, minIntervalMs: number) {
  await (fetchQueue = fetchQueue.then(async () => {
    const now = Date.now()
    const toWait = Math.max(0, minIntervalMs - (now - lastFetchAt))
    if (toWait > 0) await wait(toWait)
    lastFetchAt = Date.now()
  }))
  return fetch(url)
}

async function fetchFundamentalsOnly(ticker: string, minIntervalMs: number) {
  const qs = (s: string) => encodeURIComponent(s)
  const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${qs(ticker)}&apikey=${FMP_API_KEY}`
  const incomeUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${qs(ticker)}&period=annual&limit=5&apikey=${FMP_API_KEY}`
  const balanceUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${qs(ticker)}&period=annual&limit=5&apikey=${FMP_API_KEY}`
  const cashUrl = `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${qs(ticker)}&period=annual&limit=5&apikey=${FMP_API_KEY}`
  const incomeQUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${qs(ticker)}&period=quarter&limit=5&apikey=${FMP_API_KEY}`
  const balanceQUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${qs(ticker)}&period=quarter&limit=5&apikey=${FMP_API_KEY}`
  const cashQUrl = `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${qs(ticker)}&period=quarter&limit=5&apikey=${FMP_API_KEY}`
  const metricsUrl = `https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=${qs(ticker)}&limit=1&apikey=${FMP_API_KEY}`
  const ratiosUrl = `https://financialmodelingprep.com/stable/ratios-ttm?symbol=${qs(ticker)}&limit=1&apikey=${FMP_API_KEY}`

  const profileRes = await limitedFetch(profileUrl, minIntervalMs)
  if (!profileRes.ok) throw new Error(`Profile API error: ${profileRes.status}`)
  const profileData = await profileRes.json()
  const profile = profileData?.[0] || null

  const [incomeRes, balanceRes, cashRes, incomeQRes, balanceQRes, cashQRes, metricsRes, ratiosRes] = await Promise.all([
    limitedFetch(incomeUrl, minIntervalMs),
    limitedFetch(balanceUrl, minIntervalMs),
    limitedFetch(cashUrl, minIntervalMs),
    limitedFetch(incomeQUrl, minIntervalMs),
    limitedFetch(balanceQUrl, minIntervalMs),
    limitedFetch(cashQUrl, minIntervalMs),
    limitedFetch(metricsUrl, minIntervalMs),
    limitedFetch(ratiosUrl, minIntervalMs),
  ])

  const incomeStatements = incomeRes.ok ? await incomeRes.json() : []
  const balanceSheets = balanceRes.ok ? await balanceRes.json() : []
  const cashFlowStatements = cashRes.ok ? await cashRes.json() : []
  const incomeStatementsQuarterly = incomeQRes.ok ? await incomeQRes.json() : []
  const balanceSheetsQuarterly = balanceQRes.ok ? await balanceQRes.json() : []
  const cashFlowStatementsQuarterly = cashQRes.ok ? await cashQRes.json() : []
  const keyMetrics = metricsRes.ok ? await metricsRes.json() : []
  const ratios = ratiosRes.ok ? await ratiosRes.json() : []

  return {
    profile,
    incomeStatements,
    balanceSheets,
    cashFlowStatements,
    incomeStatementsQuarterly,
    balanceSheetsQuarterly,
    cashFlowStatementsQuarterly,
    keyMetrics: keyMetrics?.[0] || null,
    ratios: ratios?.[0] || null,
  }
}

async function upsertCompanyFundamentals(ticker: string, minIntervalMs: number) {
  const data = await fetchFundamentalsOnly(ticker, minIntervalMs)

  const latestIncome = (data.incomeStatements as any[])?.[0]
  const latestBalance = (data.balanceSheets as any[])?.[0]
  const latestCash = (data.cashFlowStatements as any[])?.[0]

  const mappedIncome = latestIncome ? {
    date: latestIncome.date,
    revenue: latestIncome.revenue,
    costOfRevenue: latestIncome.costOfRevenue,
    grossProfit: latestIncome.grossProfit,
    grossProfitRatio: latestIncome.grossProfitRatio ?? (latestIncome.revenue ? latestIncome.grossProfit / latestIncome.revenue : null),
    operatingIncome: latestIncome.operatingIncome,
    operatingIncomeRatio: latestIncome.operatingIncomeRatio ?? (latestIncome.revenue ? latestIncome.operatingIncome / latestIncome.revenue : null),
    netIncome: latestIncome.netIncome,
    netIncomeRatio: latestIncome.netIncomeRatio ?? (latestIncome.revenue ? latestIncome.netIncome / latestIncome.revenue : null),
    eps: latestIncome.eps,
    epsdiluted: latestIncome.epsDiluted ?? latestIncome.epsdiluted,
    ebitda: latestIncome.ebitda,
    ebitdaratio: latestIncome.ebitdaRatio ?? latestIncome.ebitdaratio ?? (latestIncome.revenue ? latestIncome.ebitda / latestIncome.revenue : null),
  } : null

  const mappedBalance = latestBalance ? {
    date: latestBalance.date,
    totalAssets: latestBalance.totalAssets,
    totalLiabilities: latestBalance.totalLiabilities,
    totalEquity: latestBalance.totalStockholdersEquity,
    cashAndCashEquivalents: latestBalance.cashAndCashEquivalents,
    totalDebt: latestBalance.totalDebt,
    netDebt: latestBalance.netDebt,
  } : null

  const mappedCash = latestCash ? {
    date: latestCash.date,
    operatingCashFlow: latestCash.operatingCashFlow,
    capitalExpenditure: latestCash.capitalExpenditure,
    freeCashFlow: latestCash.freeCashFlow,
    dividendsPaid: latestCash.dividendsPaid,
  } : null

  const profile = (data as any).profile || {}

  const inferredMarketCap = (profile && (profile.marketCap || profile.mktCap)) || (data.keyMetrics && (data.keyMetrics.marketCap || data.keyMetrics.MarketCap)) || null

  const { error } = await supabase
    .from('companies')
    .upsert({
      ticker,
      name: profile.companyName || ticker,
      sector: profile.sector || null,
      industry: profile.industry || null,
      description: profile.description || null,
      website: profile.website || null,
      logo_url: profile.image || null,
      country: profile.country || null,
      exchange: profile.exchangeShortName || null,
      employees: profile.fullTimeEmployees || 0,
      market_cap: inferredMarketCap ? Math.trunc(Number(inferredMarketCap)) : null,
      data: {
        profile: {
          companyName: profile.companyName,
          cik: profile.cik,
          isin: profile.isin,
          cusip: profile.cusip,
          ipoDate: profile.ipoDate,
          beta: profile.beta,
        },
        incomeStatement: mappedIncome,
        balanceSheet: mappedBalance,
        cashFlow: mappedCash,
        keyMetrics: data.keyMetrics,
        ratios: data.ratios,
         historicalFinancials: {
           incomeStatements: data.incomeStatements,
           balanceSheets: data.balanceSheets,
           cashFlowStatements: data.cashFlowStatements,
           incomeStatementsQuarterly: data.incomeStatementsQuarterly,
           balanceSheetsQuarterly: data.balanceSheetsQuarterly,
           cashFlowStatementsQuarterly: data.cashFlowStatementsQuarterly,
         },
        last_updated: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    }, { onConflict: 'ticker' })

  if (error) throw new Error(error.message)
}

async function main() {
  const limitFlag = process.argv.find(a => a.startsWith('--limit='))
  const maxCompanies = limitFlag ? Math.max(0, parseInt(limitFlag.split('=')[1], 10)) : 0
  const offsetFlag = process.argv.find(a => a.startsWith('--offset='))
  const offset = offsetFlag ? Math.max(0, parseInt(offsetFlag.split('=')[1], 10)) : 0
  const rpmFlag = process.argv.find(a => a.startsWith('--rpm='))
  const rpm = rpmFlag ? Math.max(1, parseInt(rpmFlag.split('=')[1], 10)) : 300
  const minIntervalMs = Math.ceil(60000 / rpm)

  console.log('🚀 Starting fundamentals-only import...')
  console.log(`📡 Endpoints per company: ~5 (profile, income, balance, cashflow, metrics, ratios)`) 
  console.log(`⏱️  Rate limit: ${rpm} rpm (min interval ${minIntervalMs}ms)\n`)

  // Load all tickers from DB
  const { data: companies, error } = await supabase
    .from('companies')
    .select('ticker')
    .order('ticker')
    .limit(2000)

  if (error) throw new Error(error.message)
  let tickers: string[] = Array.from(new Set((companies || []).map((c: any) => c.ticker)))
  if (maxCompanies > 0) tickers = tickers.slice(offset, offset + maxCompanies)

  console.log(`📈 Total to process: ${tickers.length}`)
  let ok = 0
  let fail = 0
  const errors: string[] = []

  for (let i = 0; i < tickers.length; i++) {
    const t = tickers[i]
    const progress = `[${i + 1}/${tickers.length}]`
    try {
      console.log(`${progress} Processing ${t}...`)
      await upsertCompanyFundamentals(t, minIntervalMs)
      ok++
      if (i < tickers.length - 1 && minIntervalMs > 0) {
        // small pacing between companies to avoid burst
        await wait(50)
      }
    } catch (e: any) {
      fail++
      errors.push(`${t}: ${e.message}`)
      console.warn(`✖ Failed ${t}: ${e.message}`)
    }
  }

  console.log('\n===== Summary =====')
  console.log(`Success: ${ok}`)
  console.log(`Failed:  ${fail}`)
  if (errors.length) {
    console.log('\nErrors (top 20):')
    errors.slice(0, 20).forEach(e => console.log(` - ${e}`))
    if (errors.length > 20) console.log(` ... and ${errors.length - 20} more`)
  }
}

main().then(() => process.exit(0)).catch(err => { console.error('Fatal:', err); process.exit(1) })
