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

async function fetchFundamentals(ticker: string, minIntervalMs: number) {
  try {
    console.log(`  📊 Fetching quote...`)
    const quoteUrl = `https://financialmodelingprep.com/stable/quote?symbol=${ticker}&apikey=${FMP_API_KEY}`
    const quoteResponse = await limitedFetch(quoteUrl, minIntervalMs)
    
    if (!quoteResponse.ok) {
      throw new Error(`Quote API error: ${quoteResponse.status}`)
    }
    
    const quoteData = await quoteResponse.json()
    const quote = quoteData[0]

    console.log(`  📄 Fetching profile...`)
    const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${ticker}&apikey=${FMP_API_KEY}`
    const profileResponse = await limitedFetch(profileUrl, minIntervalMs)
    
    if (!profileResponse.ok) {
      throw new Error(`Profile API error: ${profileResponse.status}`)
    }
    
    const profileData = await profileResponse.json()
    const profile = profileData[0]

    // Fetch Income Statement (Annual)
    console.log(`  📈 Fetching income statement...`)
    const incomeUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
    const incomeResponse = await limitedFetch(incomeUrl, minIntervalMs)
    const incomeStatements = incomeResponse.ok ? await incomeResponse.json() : []

    // Fetch Balance Sheet (Annual)
    console.log(`  📊 Fetching balance sheet...`)
    const balanceUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
    const balanceResponse = await limitedFetch(balanceUrl, minIntervalMs)
    const balanceSheets = balanceResponse.ok ? await balanceResponse.json() : []

    // Fetch Cash Flow (Annual)
    console.log(`  💰 Fetching cash flow statement...`)
    const cashFlowUrl = `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
    const cashFlowResponse = await limitedFetch(cashFlowUrl, minIntervalMs)
    const cashFlowStatements = cashFlowResponse.ok ? await cashFlowResponse.json() : []

    // Fetch Key Metrics
    console.log(`  📊 Fetching key metrics...`)
    const metricsUrl = `https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=${ticker}&limit=1&apikey=${FMP_API_KEY}`
    const metricsResponse = await limitedFetch(metricsUrl, minIntervalMs)
    const keyMetrics = metricsResponse.ok ? await metricsResponse.json() : []

    // Fetch Financial Ratios
    console.log(`  📐 Fetching financial ratios...`)
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
  } catch (error: any) {
    throw new Error(`Failed to fetch ${ticker}: ${error.message}`)
  }
}

async function importFundamentals() {
  console.log('🚀 Starting comprehensive fundamental data import...\n')
  console.log(`📡 API Calls per company: ~7 (quote, profile, income, balance, cashflow, metrics, ratios)`)
  console.log(`⚠️  250 calls/day limit = ~35 companies max\n`)
  
  // Optional CLI flags
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

  // Get tickers
  let allTickers: string[] = []
  if (usOnly || fromDb) {
    console.log('🌎 US-only mode: loading tickers from Supabase companies table')
    const { data, error } = await supabase
      .from('companies')
      .select('ticker, exchange, country')
      .order('market_cap', { ascending: false })
      .limit(2000)
    if (!error && data) {
      if (usOnly) {
        const usExchanges = new Set(['NASDAQ', 'NYSE', 'NYSE MKT', 'AMEX', 'NYSEARCA', 'BATS', 'ARCA'])
        allTickers = Array.from(new Set(
          data
            .filter((c: any) => (c.country === 'US') || (c.exchange && usExchanges.has(String(c.exchange).toUpperCase())))
            .map((c: any) => c.ticker)
        ))
      } else {
        allTickers = Array.from(new Set(data.map((c: any) => c.ticker)))
      }
    }
    if (allTickers.length === 0) {
      console.log('⚠️  No US tickers from DB; falling back to local list')
    }
  }
  if (allTickers.length === 0) {
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
      console.log(`${progress} Processing ${ticker}...`)
      
      const data = await fetchFundamentals(ticker, minIntervalMs)
      apiCallsUsed += 7 // Approximate
      
      console.log(`  ✅ Data fetched: ${(data.profile && data.profile.companyName) || ticker}`)
      console.log(`     Price: $${data.quote.price} | Market Cap: $${(Number(data.quote.marketCap || 0) / 1e9).toFixed(2)}B`)
      console.log(`     Income Statements: ${data.incomeStatements.length} years`)
      console.log(`     Balance Sheets: ${data.balanceSheets.length} years`)
      console.log(`     Cash Flows: ${data.cashFlowStatements.length} years`)
      
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
            // Current Quote Data
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
            
            // Company Profile
            profile: {
              companyName: data.profile.companyName,
              cik: data.profile.cik,
              isin: data.profile.isin,
              cusip: data.profile.cusip,
              ipoDate: data.profile.ipoDate,
              beta: data.profile.beta,
            },
            
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
            
            // Historical Statements (last 5 years)
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
  
  console.log(`\n📡 API Calls Used (estimated): ${apiCallsUsed} / 250 daily limit`)
  console.log(`   Remaining today: ~${250 - apiCallsUsed}`)
  
  console.log('\n✨ Fundamental data import completed!')
  console.log('\n💡 Each company now includes:')
  console.log('   ✅ Current stock quote')
  console.log('   ✅ Company profile')
  console.log('   ✅ Income statement (5 years)')
  console.log('   ✅ Balance sheet (5 years)')
  console.log('   ✅ Cash flow statement (5 years)')
  console.log('   ✅ Key metrics (TTM)')
  console.log('   ✅ Financial ratios (TTM)')
}

importFundamentals()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })

