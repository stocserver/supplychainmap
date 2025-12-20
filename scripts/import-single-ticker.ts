// Import a single ticker for testing
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

// Import from step3 script
async function fetchFundamentals(ticker: string, minIntervalMs: number) {
  let lastFetchAt = 0
  let fetchQueue: Promise<void> = Promise.resolve()
  function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  async function limitedFetch(url: string) {
    await (fetchQueue = fetchQueue.then(async () => {
      const now = Date.now()
      const toWait = Math.max(0, minIntervalMs - (now - lastFetchAt))
      if (toWait > 0) await wait(toWait)
      lastFetchAt = Date.now()
    }))
    return fetch(url)
  }

  try {
    const quoteUrl = `https://financialmodelingprep.com/stable/quote?symbol=${ticker}&apikey=${FMP_API_KEY}`
    const quoteResponse = await limitedFetch(quoteUrl)
    if (!quoteResponse.ok) throw new Error(`Quote API error: ${quoteResponse.status}`)
    const quoteData = await quoteResponse.json()
    const quote = quoteData[0]

    const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${ticker}&apikey=${FMP_API_KEY}`
    const profileResponse = await limitedFetch(profileUrl)
    if (!profileResponse.ok) throw new Error(`Profile API error: ${profileResponse.status}`)
    const profileData = await profileResponse.json()
    const profile = profileData[0]

    const incomeUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
    const incomeResponse = await limitedFetch(incomeUrl)
    const incomeStatements = incomeResponse.ok ? await incomeResponse.json() : []

    const balanceUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
    const balanceResponse = await limitedFetch(balanceUrl)
    const balanceSheets = balanceResponse.ok ? await balanceResponse.json() : []

    const cashFlowUrl = `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
    const cashFlowResponse = await limitedFetch(cashFlowUrl)
    const cashFlowStatements = cashFlowResponse.ok ? await cashFlowResponse.json() : []

    const metricsUrl = `https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=${ticker}&limit=1&apikey=${FMP_API_KEY}`
    const metricsResponse = await limitedFetch(metricsUrl)
    const keyMetrics = metricsResponse.ok ? await metricsResponse.json() : []

    const ratiosUrl = `https://financialmodelingprep.com/stable/ratios-ttm?symbol=${ticker}&limit=1&apikey=${FMP_API_KEY}`
    const ratiosResponse = await limitedFetch(ratiosUrl)
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
  } catch (error: any) {
    throw new Error(`Failed to fetch ${ticker}: ${error.message}`)
  }
}

async function importTicker(ticker: string) {
  const rpm = 300
  const minIntervalMs = Math.ceil(60000 / rpm)

  console.log(`🚀 Importing ${ticker}...`)
  const data = await fetchFundamentals(ticker, minIntervalMs)

  console.log(`✅ Data fetched: ${data.profile.companyName}`)
  console.log(`   Price: $${data.quote.price} | Market Cap: $${(Number(data.quote.marketCap || 0) / 1e9).toFixed(2)}B`)

  const latestIncome = data.incomeStatements[0]
  const latestBalance = data.balanceSheets[0]
  const latestCashFlow = data.cashFlowStatements[0]

  const { error } = await supabase
    .from('companies')
    .upsert({
      ticker: ticker,
      name: data.profile.companyName || ticker,
      sector: data.profile.sector || null,
      industry: data.profile.industry || null,
      description: data.profile.description || null,
      website: data.profile.website || null,
      logo_url: data.profile.image || null,
      country: data.profile.country || 'US',
      exchange: data.profile.exchangeShortName || data.quote.exchange || null,
      market_cap: Math.trunc(Number(data.quote.marketCap || 0)),
      employees: data.profile.fullTimeEmployees || 0,
      data: {
        quote: {
          price: data.quote.price,
          change: data.quote.change,
          changesPercentage: data.quote.changesPercentage,
          volume: data.quote.volume,
          avgVolume: data.quote.avgVolume,
          marketCap: data.quote.marketCap,
          pe: data.quote.pe,
          eps: data.quote.eps,
          dayLow: data.quote.dayLow,
          dayHigh: data.quote.dayHigh,
          yearLow: data.quote.yearLow,
          yearHigh: data.quote.yearHigh,
          sharesOutstanding: data.quote.sharesOutstanding,
        },
        profile: {
          companyName: data.profile.companyName,
          cik: data.profile.cik,
          isin: data.profile.isin,
          cusip: data.profile.cusip,
          ipoDate: data.profile.ipoDate,
          beta: data.profile.beta,
        },
        incomeStatement: latestIncome ? {
          date: latestIncome.date,
          revenue: latestIncome.revenue,
          costOfRevenue: latestIncome.costOfRevenue,
          grossProfit: latestIncome.grossProfit,
          grossProfitRatio: latestIncome.grossProfitRatio || (latestIncome.revenue ? latestIncome.grossProfit / latestIncome.revenue : null),
          operatingIncome: latestIncome.operatingIncome,
          operatingIncomeRatio: latestIncome.operatingIncomeRatio || (latestIncome.revenue ? latestIncome.operatingIncome / latestIncome.revenue : null),
          netIncome: latestIncome.netIncome,
          netIncomeRatio: latestIncome.netIncomeRatio || (latestIncome.revenue ? latestIncome.netIncome / latestIncome.revenue : null),
          eps: latestIncome.eps,
          epsdiluted: latestIncome.epsDiluted || latestIncome.epsdiluted,
          ebitda: latestIncome.ebitda,
          ebitdaratio: latestIncome.ebitdaRatio || latestIncome.ebitdaratio || (latestIncome.revenue ? latestIncome.ebitda / latestIncome.revenue : null),
        } : null,
        balanceSheet: latestBalance ? {
          date: latestBalance.date,
          totalAssets: latestBalance.totalAssets,
          totalLiabilities: latestBalance.totalLiabilities,
          totalEquity: latestBalance.totalStockholdersEquity,
          cashAndCashEquivalents: latestBalance.cashAndCashEquivalents,
          totalDebt: latestBalance.totalDebt,
          netDebt: latestBalance.netDebt,
        } : null,
        cashFlow: latestCashFlow ? {
          date: latestCashFlow.date,
          operatingCashFlow: latestCashFlow.operatingCashFlow,
          capitalExpenditure: latestCashFlow.capitalExpenditure,
          freeCashFlow: latestCashFlow.freeCashFlow,
          dividendsPaid: latestCashFlow.dividendsPaid,
        } : null,
        keyMetrics: data.keyMetrics,
        ratios: data.ratios,
        historicalFinancials: {
          incomeStatements: data.incomeStatements,
          balanceSheets: data.balanceSheets,
          cashFlowStatements: data.cashFlowStatements,
        },
        last_updated: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'ticker'
    })

  if (error) throw new Error(`Supabase error: ${error.message}`)
  console.log(`✅ Successfully imported ${ticker} to Supabase`)
}

const ticker = process.argv[2] || 'TRYIY'
importTicker(ticker)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  })
