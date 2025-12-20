// Import fundamentals for companies from specific product files
import * as dotenv from 'dotenv'
import * as path from 'path'
import { pathToFileURL } from 'url'
import { createClient } from '@supabase/supabase-js'
import type { ValueChainStageProducts, ProductCategory } from '../lib/data/industries'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!FMP_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Collect all tickers from products
function collectTickers(products: any[]): Set<string> {
  const tickers = new Set<string>()
  for (const p of products) {
    if (p.companiesDetailed && Array.isArray(p.companiesDetailed)) {
      for (const c of p.companiesDetailed) {
        if (c.ticker) tickers.add(c.ticker)
      }
    }
    if (p.subProducts && Array.isArray(p.subProducts)) {
      const subTickers = collectTickers(p.subProducts)
      subTickers.forEach(t => tickers.add(t))
    }
  }
  return tickers
}

async function loadProductFile(fileName: string): Promise<Set<string>> {
  const filePath = path.resolve(process.cwd(), 'lib', 'industries', fileName)
  try {
    const mod = await import(pathToFileURL(filePath).href)
    let allTickers = new Set<string>()
    
    // Find the exported value chain stages
    for (const value of Object.values(mod)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item && typeof item === 'object' && 'products' in item && Array.isArray(item.products)) {
            const tickers = collectTickers(item.products)
            tickers.forEach(t => allTickers.add(t))
          }
        }
      }
    }
    
    return allTickers
  } catch (e: any) {
    console.error(`❌ Failed to load ${fileName}: ${e.message}`)
    return new Set()
  }
}

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

async function main() {
  const rpm = 300
  const minIntervalMs = Math.ceil(60000 / rpm)
  
  console.log('🔍 Loading companies from product files...\n')
  
  const productFiles = [
    'banking.products.ts',
    'chemicals.products.ts',
    'cloud-computing.products.ts',
    'construction-engineering.products.ts',
    'consumer-products.products.ts',
    'electric-vehicles.products.ts'
  ]
  
  let allTickers = new Set<string>()
  
  for (const file of productFiles) {
    console.log(`📂 Loading ${file}...`)
    const tickers = await loadProductFile(file)
    console.log(`   Found ${tickers.size} companies`)
    tickers.forEach(t => allTickers.add(t))
  }
  
  const tickersArray = Array.from(allTickers).sort()
  console.log(`\n📊 Total unique companies: ${tickersArray.length}`)
  console.log(`⚙️  Rate limit: ${rpm} calls per minute (${minIntervalMs}ms between calls)\n`)
  console.log('='.repeat(80) + '\n')
  
  let successCount = 0
  let errorCount = 0
  const errors: string[] = []
  
  for (let i = 0; i < tickersArray.length; i++) {
    const ticker = tickersArray[i]
    console.log(`[${i + 1}/${tickersArray.length}] Processing ${ticker}...`)
    
    try {
      const data = await fetchFundamentals(ticker, minIntervalMs)
      
      if (!data.quote || !data.quote.price) {
        throw new Error('No quote data available')
      }
      
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
      console.log(`     Income: ${data.incomeStatements.length} years | Balance: ${data.balanceSheets.length} years | Cash Flow: ${data.cashFlowStatements.length} years`)
      successCount++
      
      if (i < tickersArray.length - 1) {
        console.log(`  ⏳ Waiting 2 seconds...\n`)
        await wait(2000)
      }
    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`)
      errors.push(`${ticker}: ${error.message}`)
      errorCount++
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log(`\n📊 Import Summary:`)
  console.log(`  ✅ Successful: ${successCount}`)
  console.log(`  ❌ Failed: ${errorCount}`)
  console.log(`  📈 Total Processed: ${tickersArray.length}`)
  console.log(`  🎯 Success Rate: ${((successCount / tickersArray.length) * 100).toFixed(1)}%`)
  
  if (errors.length > 0) {
    console.log(`\n❌ Errors:`)
    errors.slice(0, 10).forEach(err => console.log(`  - ${err}`))
    if (errors.length > 10) {
      console.log(`  ... and ${errors.length - 10} more`)
    }
  }
  
  const apiCallsUsed = tickersArray.length * 7
  console.log(`\n📡 API Calls Used (estimated): ${apiCallsUsed}`)
  console.log(`   Rate: ${rpm} calls per minute`)
  console.log('\n✨ Import complete!')
}

main().catch(console.error)

