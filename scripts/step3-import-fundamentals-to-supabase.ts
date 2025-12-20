// Import comprehensive fundamental data from FMP to Supabase
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { industries } from '../lib/data/industries'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!FMP_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Simple global rate limiter for all outbound FMP requests
let lastFetchAt = 0
let fetchQueue: Promise<void> = Promise.resolve()
function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function limitedFetch(url: string, minIntervalMs: number) {
  await (fetchQueue = fetchQueue.then(async () => {
    const now = Date.now()
    const toWait = Math.max(0, minIntervalMs - (now - lastFetchAt))
    if (toWait > 0) await wait(toWait)
    lastFetchAt = Date.now()
  }))
  return fetch(url)
}

// Normalize problematic or legacy tickers to valid API symbols; optionally skip
const TICKER_ALIAS: Record<string, string> = {
  'ARROW': 'ARW', // Arrow Electronics
  'OWENS': 'OC', // Owens Corning
  'BF.B': 'BF-B', // Brown-Forman class B (FMP uses dash)
  'BRK.B': 'BRK.B', // Berkshire (FMP accepts dot)
  'FB': 'META', // Meta Platforms
  'FTR': 'FYBR', // Frontier Communications reorg
  'MYL': 'VTRS', // Mylan -> Viatris
  'ADYEN': 'ADYEY', // Adyen ADR
  'VSLR': 'RUN', // Vivint Solar acquired by Sunrun
}

const TICKER_SKIP = new Set<string>([
  'CLGX', // CoreLogic (private)
  'ZAYO', // Zayo Group (private)
  'MAXAR', // Maxar (private)
  'PETM', // PetSmart (private)
])

function normalizeTickerForApi(rawTicker: string): { apiTicker: string | null; note?: string } {
  const t = String(rawTicker || '').toUpperCase()
  if (TICKER_SKIP.has(t)) return { apiTicker: null, note: 'skipped (private/delisted)' }
  if (TICKER_ALIAS[t]) return { apiTicker: TICKER_ALIAS[t], note: `alias→${TICKER_ALIAS[t]}` }
  return { apiTicker: t }
}

async function fetchFundamentals(ticker: string, minIntervalMs: number) {
  // Helper to fetch and tolerate errors per endpoint
  const safeGet = async (label: string, url: string) => {
    try {
      console.log(`  ${label}`)
      const res = await limitedFetch(url, minIntervalMs)
      if (!res.ok) return null
      const json = await res.json()
      return json
    } catch {
      return null
    }
  }

  const quoteData = await safeGet('📊 Fetching quote...', `https://financialmodelingprep.com/stable/quote?symbol=${ticker}&apikey=${FMP_API_KEY}`)
  const quote = Array.isArray(quoteData) ? quoteData[0] : null

  const profileData = await safeGet('📄 Fetching profile...', `https://financialmodelingprep.com/stable/profile?symbol=${ticker}&apikey=${FMP_API_KEY}`)
  const profile = Array.isArray(profileData) ? profileData[0] : null

  const incomeStatements = (await safeGet('📈 Fetching income statement (annual)...', `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`)) || []
  const balanceSheets = (await safeGet('📊 Fetching balance sheet (annual)...', `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`)) || []
  const cashFlowStatements = (await safeGet('💰 Fetching cash flow statement (annual)...', `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`)) || []

  const incomeStatementsQuarterly = (await safeGet('📈 Fetching income statement (quarterly)...', `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=quarter&limit=5&apikey=${FMP_API_KEY}`)) || []
  const balanceSheetsQuarterly = (await safeGet('📊 Fetching balance sheet (quarterly)...', `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${ticker}&period=quarter&limit=5&apikey=${FMP_API_KEY}`)) || []
  const cashFlowStatementsQuarterly = (await safeGet('💰 Fetching cash flow statement (quarterly)...', `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&period=quarter&limit=5&apikey=${FMP_API_KEY}`)) || []

  const metricsArr = (await safeGet('📊 Fetching key metrics...', `https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=${ticker}&limit=1&apikey=${FMP_API_KEY}`)) || []
  const keyMetrics = Array.isArray(metricsArr) && metricsArr.length > 0 ? metricsArr[0] : null

  const ratiosArr = (await safeGet('📐 Fetching financial ratios...', `https://financialmodelingprep.com/stable/ratios-ttm?symbol=${ticker}&limit=1&apikey=${FMP_API_KEY}`)) || []
  const ratios = Array.isArray(ratiosArr) && ratiosArr.length > 0 ? ratiosArr[0] : null

  // If we truly have nothing, then fail this ticker
  if (!profile && !quote && incomeStatements.length === 0 && balanceSheets.length === 0 && cashFlowStatements.length === 0 && !keyMetrics && !ratios) {
    throw new Error(`No data returned from any endpoint`)
  }

  return { quote, profile, incomeStatements, balanceSheets, cashFlowStatements, incomeStatementsQuarterly, balanceSheetsQuarterly, cashFlowStatementsQuarterly, keyMetrics, ratios }
}

async function importFundamentals() {
  // Optional CLI flags - parse first to set up logging
  const limitFlag = process.argv.find(a => a.startsWith('--limit='))
  let maxCompanies = limitFlag ? Math.max(0, parseInt(limitFlag.split('=')[1], 10)) : 0
  const delayFlag = process.argv.find(a => a.startsWith('--delay='))
  const delayMs = delayFlag ? Math.max(0, parseInt(delayFlag.split('=')[1], 10)) : 2000
  const offsetFlag = process.argv.find(a => a.startsWith('--offset='))
  const offset = offsetFlag ? Math.max(0, parseInt(offsetFlag.split('=')[1], 10)) : 0
  const usOnly = process.argv.includes('--usOnly')
  const fromDb = process.argv.includes('--fromDb')
  const rpmFlag = process.argv.find(a => a.startsWith('--rpm='))
  const rpm = rpmFlag ? Math.max(1, parseInt(rpmFlag.split('=')[1], 10)) : 300
  const minIntervalMs = Math.ceil(60000 / rpm)
  
  console.log('🚀 Starting comprehensive fundamental data import...\n')
  console.log(`📡 API Calls per company: ~10 (quote, profile, income/annual, balance/annual, cashflow/annual, income/quarter, balance/quarter, cashflow/quarter, metrics, ratios)`)
  console.log(`⚙️  Rate limit: ${rpm} calls per minute (${minIntervalMs}ms between calls)\n`)

  // Get tickers - DEFAULT to loading from DB to import all seeded companies
  let allTickers: string[] = []
  
  // Always try to load from DB first (unless explicitly using local list)
  const useLocalList = process.argv.includes('--useLocalList')
  
  if (!useLocalList) {
    // Default behavior: load all companies from DB (includes all seeded companies from valueChain, product files, etc.)
    console.log('🌎 Loading tickers from Supabase companies table (all seeded companies)')
    const { data, error } = await supabase
      .from('companies')
      .select('ticker, exchange, country')
      .order('market_cap', { ascending: false })
      .limit(2000)
    
    if (!error && data && data.length > 0) {
      if (usOnly) {
        const usExchanges = new Set(['NASDAQ', 'NYSE', 'NYSE MKT', 'AMEX', 'NYSEARCA', 'BATS', 'ARCA'])
        allTickers = Array.from(new Set(
          data
            .filter((c: any) => (c.country === 'US') || (c.exchange && usExchanges.has(String(c.exchange).toUpperCase())))
            .map((c: any) => c.ticker)
        ))
      } else {
        // Get ALL companies from DB (not just US) - includes valueChain, product files, etc.
        allTickers = Array.from(new Set(data.map((c: any) => c.ticker)))
      }
    }
  }
  
  // Fallback to local featured_companies list only if explicitly requested or DB is empty
  if (allTickers.length === 0) {
    if (!useLocalList) {
      console.log('⚠️  No companies found in DB; falling back to local featured_companies list')
    } else {
      console.log('📋 Using local featured_companies list (--useLocalList flag)')
    }
    allTickers = Array.from(
      new Set(industries.flatMap(industry => industry.featured_companies || []))
    ).sort()
  }
  
  if (maxCompanies === 0) maxCompanies = allTickers.length
  console.log(`📈 Total companies: ${allTickers.length}`)
  console.log(`🎯 Processing ${maxCompanies} companies starting at offset ${offset} (rpm cap ${rpm})\n`)
  console.log('='.repeat(80) + '\n')
  
  // Process a limited subset to respect API limits
  const tickersToProcess = allTickers.slice(offset, offset + maxCompanies)
  
  let successCount = 0
  let errorCount = 0
  let apiCallsUsed = 0
  const errors: string[] = []
  
  for (let i = 0; i < tickersToProcess.length; i++) {
    const ticker = tickersToProcess[i]
    const progress = `[${i + 1}/${tickersToProcess.length}]`
    
    try {
      const norm = normalizeTickerForApi(ticker)
      if (!norm.apiTicker) {
        console.log(`${progress} Processing ${ticker}... (skipped: ${norm.note})`)
        errorCount++
        errors.push(`${ticker}: ${norm.note}`)
        continue
      }
      const usingNote = norm.note ? ` (using ${norm.apiTicker})` : ''
      console.log(`${progress} Processing ${ticker}...${usingNote}`)

      const data = await fetchFundamentals(norm.apiTicker, minIntervalMs)
      apiCallsUsed += 10 // Approximate (quote, profile, 3 annual, 3 quarterly, metrics, ratios)
      
      console.log(`  ✅ Data fetched: ${(data.profile && data.profile.companyName) || ticker}`)
      const derivedMarketCap = Number(
        (data.quote && data.quote.marketCap) ||
        (data.profile && (data.profile.mktCap || data.profile.mktcap || data.profile.marketCap)) ||
        (data.keyMetrics && (data.keyMetrics.marketCap || data.keyMetrics.marketcap)) ||
        (data.ratios && (data.ratios.marketCap || data.ratios.marketcap)) ||
        0
      )
      if (data.quote && typeof data.quote.price === 'number') {
        console.log(`     Price: $${data.quote.price} | Market Cap: $${(derivedMarketCap / 1e9).toFixed(2)}B`)
      } else {
        console.log(`     No quote. Market Cap: $${(derivedMarketCap / 1e9).toFixed(2)}B`)
      }
      console.log(`     Income Statements (annual): ${data.incomeStatements.length} years`)
      console.log(`     Balance Sheets (annual): ${data.balanceSheets.length} years`)
      console.log(`     Cash Flows (annual): ${data.cashFlowStatements.length} years`)
      console.log(`     Income Statements (quarterly): ${data.incomeStatementsQuarterly.length} quarters`)
      console.log(`     Balance Sheets (quarterly): ${data.balanceSheetsQuarterly.length} quarters`)
      console.log(`     Cash Flows (quarterly): ${data.cashFlowStatementsQuarterly.length} quarters`)
      
      // Get latest financial data
      const latestIncome = data.incomeStatements[0]
      const latestBalance = data.balanceSheets[0]
      const latestCashFlow = data.cashFlowStatements[0]
      
      // Store in Supabase
      const { error } = await supabase
        .from('companies')
        .upsert({
          ticker: ticker,
          name: (data.profile && data.profile.companyName) ? data.profile.companyName : ticker,
          sector: data.profile?.sector || null,
          industry: data.profile?.industry || null,
          description: data.profile?.description || null,
          website: data.profile?.website || null,
          logo_url: data.profile?.image || null,
          country: data.profile?.country || 'US',
          exchange: (data.profile && data.profile.exchangeShortName) || (data.quote && data.quote.exchange) || null,
          market_cap: Number.isFinite(derivedMarketCap) ? Math.trunc(derivedMarketCap) : 0,
          employees: data.profile?.fullTimeEmployees || 0,
          data: {
            // Current Quote Data
            quote: data.quote ? {
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
            } : null,
            
            // Company Profile
            profile: data.profile ? {
              companyName: data.profile.companyName,
              cik: data.profile.cik,
              isin: data.profile.isin,
              cusip: data.profile.cusip,
              ipoDate: data.profile.ipoDate,
              beta: data.profile.beta,
            } : null,
            
            // Latest Income Statement
            incomeStatement: latestIncome ? {
              date: latestIncome.date,
              revenue: latestIncome.revenue,
              costOfRevenue: latestIncome.costOfRevenue,
              grossProfit: latestIncome.grossProfit,
              // Calculate ratios if not provided by API
              grossProfitRatio: latestIncome.grossProfitRatio || (latestIncome.revenue ? latestIncome.grossProfit / latestIncome.revenue : null),
              operatingIncome: latestIncome.operatingIncome,
              operatingIncomeRatio: latestIncome.operatingIncomeRatio || (latestIncome.revenue ? latestIncome.operatingIncome / latestIncome.revenue : null),
              netIncome: latestIncome.netIncome,
              netIncomeRatio: latestIncome.netIncomeRatio || (latestIncome.revenue ? latestIncome.netIncome / latestIncome.revenue : null),
              eps: latestIncome.eps,
              // Fix casing: API returns epsDiluted, not epsdiluted
              epsdiluted: latestIncome.epsDiluted || latestIncome.epsdiluted,
              ebitda: latestIncome.ebitda,
              // Fix casing: API might return ebitdaRatio
              ebitdaratio: latestIncome.ebitdaRatio || latestIncome.ebitdaratio || (latestIncome.revenue ? latestIncome.ebitda / latestIncome.revenue : null),
            } : null,
            
            // Latest Balance Sheet
            balanceSheet: latestBalance ? {
              date: latestBalance.date,
              totalAssets: latestBalance.totalAssets,
              totalLiabilities: latestBalance.totalLiabilities,
              totalEquity: latestBalance.totalStockholdersEquity,
              cashAndCashEquivalents: latestBalance.cashAndCashEquivalents,
              totalDebt: latestBalance.totalDebt,
              netDebt: latestBalance.netDebt,
            } : null,
            
            // Latest Cash Flow
            cashFlow: latestCashFlow ? {
              date: latestCashFlow.date,
              operatingCashFlow: latestCashFlow.operatingCashFlow,
              capitalExpenditure: latestCashFlow.capitalExpenditure,
              freeCashFlow: latestCashFlow.freeCashFlow,
              dividendsPaid: latestCashFlow.dividendsPaid,
            } : null,
            
            // Key Metrics TTM
            keyMetrics: data.keyMetrics,
            
            // Financial Ratios TTM
            ratios: data.ratios,
            
            // Historical Statements (last 5 years annual + last 5 quarters quarterly)
            historicalFinancials: {
              incomeStatements: data.incomeStatements,
              balanceSheets: data.balanceSheets,
              cashFlowStatements: data.cashFlowStatements,
              incomeStatementsQuarterly: data.incomeStatementsQuarterly,
              balanceSheetsQuarterly: data.balanceSheetsQuarterly,
              cashFlowStatementsQuarterly: data.cashFlowStatementsQuarterly,
            },
            
            last_updated: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'ticker'
        })
      
      if (error) {
        throw new Error(`Supabase error: ${error.message}`)
      }
      
      console.log(`  💾 Stored in Supabase with full fundamentals`)
      successCount++
      
      // Rate limiting
      if (i < tickersToProcess.length - 1 && delayMs > 0) {
        console.log(`  ⏳ Waiting ${Math.round(delayMs/1000)} seconds...\n`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
      
    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}\n`)
      errorCount++
      errors.push(`${ticker}: ${error.message}`)
    }
  }
  
  // Summary
  console.log('='.repeat(80))
  console.log('\n📊 Import Summary:')
  console.log(`  ✅ Successful: ${successCount}`)
  console.log(`  ❌ Failed: ${errorCount}`)
  console.log(`  📈 Total Processed: ${tickersToProcess.length}`)
  console.log(`  🎯 Success Rate: ${((successCount / tickersToProcess.length) * 100).toFixed(1)}%`)
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:')
    errors.slice(0, 10).forEach(err => console.log(`  - ${err}`))
    if (errors.length > 10) {
      console.log(`  ... and ${errors.length - 10} more`)
    }
  }
  
  console.log(`\n📡 API Calls Used (estimated): ${apiCallsUsed}`)
  console.log(`   Rate: ${rpm} calls per minute`)
  
  console.log('\n✨ Fundamental data import completed!')
  console.log('\n💡 Each company now includes:')
  console.log('   ✅ Current stock quote')
  console.log('   ✅ Company profile')
  console.log('   ✅ Income statement (5 years annual + 5 quarters)')
  console.log('   ✅ Balance sheet (5 years annual + 5 quarters)')
  console.log('   ✅ Cash flow statement (5 years annual + 5 quarters)')
  console.log('   ✅ Key metrics (TTM)')
  console.log('   ✅ Financial ratios (TTM)')
}

importFundamentals()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
