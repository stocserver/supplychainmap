// Import fundamentals for specific tickers
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!FMP_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Get tickers from command line args
const tickersToImport = process.argv.slice(2).filter(t => t && !t.startsWith('--'))

if (tickersToImport.length === 0) {
  console.error('❌ Please provide ticker symbols as arguments')
  console.log('Usage: tsx scripts/import-specific-tickers.ts TTC SQM')
  process.exit(1)
}

console.log(`🚀 Importing fundamentals for: ${tickersToImport.join(', ')}\n`)

// Rate limiting
let lastFetchAt = 0
async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function limitedFetch(url: string, minIntervalMs: number) {
  const now = Date.now()
  const toWait = Math.max(0, minIntervalMs - (now - lastFetchAt))
  if (toWait > 0) await wait(toWait)
  lastFetchAt = Date.now()
  return fetch(url)
}

async function fetchFundamentals(ticker: string, minIntervalMs: number) {
  const quoteUrl = `https://financialmodelingprep.com/stable/quote?symbol=${ticker}&apikey=${FMP_API_KEY}`
  const quoteResponse = await limitedFetch(quoteUrl, minIntervalMs)
  if (!quoteResponse.ok) throw new Error(`Quote API error: ${quoteResponse.status}`)
  const quoteData = await quoteResponse.json()
  const quote = quoteData[0]

  const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${ticker}&apikey=${FMP_API_KEY}`
  const profileResponse = await limitedFetch(profileUrl, minIntervalMs)
  if (!profileResponse.ok) throw new Error(`Profile API error: ${profileResponse.status}`)
  const profileData = await profileResponse.json()
  const profile = profileData[0]

  const incomeUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
  const incomeResponse = await limitedFetch(incomeUrl, minIntervalMs)
  const incomeStatements = incomeResponse.ok ? await incomeResponse.json() : []

  const balanceUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
  const balanceResponse = await limitedFetch(balanceUrl, minIntervalMs)
  const balanceSheets = balanceResponse.ok ? await balanceResponse.json() : []

  const cashFlowUrl = `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
  const cashFlowResponse = await limitedFetch(cashFlowUrl, minIntervalMs)
  const cashFlowStatements = cashFlowResponse.ok ? await cashFlowResponse.json() : []

  const metricsUrl = `https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=${ticker}&limit=1&apikey=${FMP_API_KEY}`
  const metricsResponse = await limitedFetch(metricsUrl, minIntervalMs)
  const keyMetrics = metricsResponse.ok ? await metricsResponse.json() : []

  const ratiosUrl = `https://financialmodelingprep.com/stable/ratios-ttm?symbol=${ticker}&limit=1&apikey=${FMP_API_KEY}`
  const ratiosResponse = await limitedFetch(ratiosUrl, minIntervalMs)
  const ratios = ratiosResponse.ok ? await ratiosResponse.json() : []

  return {
    quote,
    profile,
    incomeStatements,
    balanceSheets,
    cashFlowStatements,
    keyMetrics: keyMetrics[0] || null,
    ratios: ratios[0] || null
  }
}

const minIntervalMs = Math.ceil(60000 / 300) // 300 rpm = 200ms between calls

async function main() {
for (let i = 0; i < tickersToImport.length; i++) {
  const ticker = tickersToImport[i]
  console.log(`[${i + 1}/${tickersToImport.length}] Processing ${ticker}...`)
  
  try {
    const data = await fetchFundamentals(ticker, minIntervalMs)
    
    const latestIncome = data.incomeStatements[0]
    const latestBalance = data.balanceSheets[0]
    const latestCashFlow = data.cashFlowStatements[0]
    
    const { error } = await supabase
      .from('companies')
      .upsert({
        ticker: ticker,
        name: data.profile?.companyName || ticker,
        sector: data.profile?.sector || null,
        industry: data.profile?.industry || null,
        description: data.profile?.description || null,
        website: data.profile?.website || null,
        logo_url: data.profile?.image || null,
        country: data.profile?.country || 'US',
        exchange: data.profile?.exchangeShortName || data.quote?.exchange || null,
        market_cap: Math.trunc(Number(data.quote?.marketCap || 0)),
        employees: data.profile?.fullTimeEmployees || 0,
        data: {
          quote: {
            price: data.quote?.price,
            change: data.quote?.change,
            changesPercentage: data.quote?.changesPercentage,
            volume: data.quote?.volume,
            avgVolume: data.quote?.avgVolume,
            marketCap: data.quote?.marketCap,
            pe: data.quote?.pe,
            eps: data.quote?.eps,
            dayLow: data.quote?.dayLow,
            dayHigh: data.quote?.dayHigh,
            yearLow: data.quote?.yearLow,
            yearHigh: data.quote?.yearHigh,
            sharesOutstanding: data.quote?.sharesOutstanding,
          },
          profile: {
            companyName: data.profile?.companyName,
            cik: data.profile?.cik,
            isin: data.profile?.isin,
            cusip: data.profile?.cusip,
            ipoDate: data.profile?.ipoDate,
            beta: data.profile?.beta,
          },
          incomeStatement: latestIncome ? {
            date: latestIncome.date,
            revenue: latestIncome.revenue,
            costOfRevenue: latestIncome.costOfRevenue,
            grossProfit: latestIncome.grossProfit,
            operatingIncome: latestIncome.operatingIncome,
            netIncome: latestIncome.netIncome,
            eps: latestIncome.eps,
          } : null,
          balanceSheet: latestBalance ? {
            date: latestBalance.date,
            totalAssets: latestBalance.totalAssets,
            totalLiabilities: latestBalance.totalLiabilities,
            totalEquity: latestBalance.totalEquity,
            cashAndCashEquivalents: latestBalance.cashAndCashEquivalents,
            totalDebt: latestBalance.totalDebt,
          } : null,
          cashFlow: latestCashFlow ? {
            date: latestCashFlow.date,
            operatingCashFlow: latestCashFlow.operatingCashFlow,
            capitalExpenditure: latestCashFlow.capitalExpenditure,
            freeCashFlow: latestCashFlow.freeCashFlow,
            netChangeInCash: latestCashFlow.netChangeInCash,
          } : null,
          keyMetrics: data.keyMetrics,
          ratios: data.ratios,
          incomeStatements: data.incomeStatements,
          balanceSheets: data.balanceSheets,
          cashFlowStatements: data.cashFlowStatements,
        },
      }, { onConflict: 'ticker' })
    
    if (error) throw error
    
    const marketCap = (Number(data.quote?.marketCap || 0) / 1e9).toFixed(2)
    console.log(`  ✅ ${data.profile?.companyName || ticker}: $${marketCap}B`)
    console.log(`     Price: $${data.quote?.price} | Market Cap: $${marketCap}B`)
    console.log(`     Income: ${data.incomeStatements.length} years | Balance: ${data.balanceSheets.length} years | Cash Flow: ${data.cashFlowStatements.length} years`)
    
    if (i < tickersToImport.length - 1) {
      console.log(`  ⏳ Waiting 2 seconds...\n`)
      await wait(2000)
    }
  } catch (error: any) {
    console.error(`  ❌ Error importing ${ticker}:`, error.message)
  }
}

console.log('\n✨ Import complete!')
}

main().catch(console.error)

