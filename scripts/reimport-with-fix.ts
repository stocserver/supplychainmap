// Re-import the 6 companies that have incomplete data
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

async function fetchFundamentals(ticker: string) {
  try {
    console.log(`  📊 Fetching quote...`)
    const quoteUrl = `https://financialmodelingprep.com/stable/quote?symbol=${ticker}&apikey=${FMP_API_KEY}`
    const quoteResponse = await fetch(quoteUrl)
    
    if (!quoteResponse.ok) {
      throw new Error(`Quote API error: ${quoteResponse.status}`)
    }
    
    const quoteData = await quoteResponse.json()
    const quote = quoteData[0]

    console.log(`  📄 Fetching profile...`)
    const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${ticker}&apikey=${FMP_API_KEY}`
    const profileResponse = await fetch(profileUrl)
    
    if (!profileResponse.ok) {
      throw new Error(`Profile API error: ${profileResponse.status}`)
    }
    
    const profileData = await profileResponse.json()
    const profile = profileData[0]

    // Fetch Income Statement (Annual)
    console.log(`  📈 Fetching annual income statement...`)
    const incomeUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
    const incomeResponse = await fetch(incomeUrl)
    const incomeStatements = incomeResponse.ok ? await incomeResponse.json() : []

    // Fetch Income Statement (Quarterly)
    console.log(`  📈 Fetching quarterly income statement...`)
    const incomeQuarterlyUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=quarter&limit=12&apikey=${FMP_API_KEY}`
    const incomeQuarterlyResponse = await fetch(incomeQuarterlyUrl)
    const incomeStatementsQuarterly = incomeQuarterlyResponse.ok ? await incomeQuarterlyResponse.json() : []

    // Fetch Balance Sheet (Annual)
    console.log(`  📊 Fetching annual balance sheet...`)
    const balanceUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
    const balanceResponse = await fetch(balanceUrl)
    const balanceSheets = balanceResponse.ok ? await balanceResponse.json() : []

    // Fetch Balance Sheet (Quarterly)
    console.log(`  📊 Fetching quarterly balance sheet...`)
    const balanceQuarterlyUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${ticker}&period=quarter&limit=12&apikey=${FMP_API_KEY}`
    const balanceQuarterlyResponse = await fetch(balanceQuarterlyUrl)
    const balanceSheetsQuarterly = balanceQuarterlyResponse.ok ? await balanceQuarterlyResponse.json() : []

    // Fetch Cash Flow (Annual)
    console.log(`  💰 Fetching annual cash flow statement...`)
    const cashFlowUrl = `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
    const cashFlowResponse = await fetch(cashFlowUrl)
    const cashFlowStatements = cashFlowResponse.ok ? await cashFlowResponse.json() : []

    // Fetch Cash Flow (Quarterly)
    console.log(`  💰 Fetching quarterly cash flow statement...`)
    const cashFlowQuarterlyUrl = `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&period=quarter&limit=12&apikey=${FMP_API_KEY}`
    const cashFlowQuarterlyResponse = await fetch(cashFlowQuarterlyUrl)
    const cashFlowStatementsQuarterly = cashFlowQuarterlyResponse.ok ? await cashFlowQuarterlyResponse.json() : []

    // Fetch Key Metrics
    console.log(`  📊 Fetching key metrics...`)
    const metricsUrl = `https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=${ticker}&limit=1&apikey=${FMP_API_KEY}`
    const metricsResponse = await fetch(metricsUrl)
    const keyMetrics = metricsResponse.ok ? await metricsResponse.json() : []

    // Fetch Financial Ratios
    console.log(`  📐 Fetching financial ratios...`)
    const ratiosUrl = `https://financialmodelingprep.com/stable/ratios-ttm?symbol=${ticker}&limit=1&apikey=${FMP_API_KEY}`
    const ratiosResponse = await fetch(ratiosUrl)
    const ratios = ratiosResponse.ok ? await ratiosResponse.json() : []

    return {
      quote,
      profile,
      incomeStatements,
      incomeStatementsQuarterly,
      balanceSheets,
      balanceSheetsQuarterly,
      cashFlowStatements,
      cashFlowStatementsQuarterly,
      keyMetrics: keyMetrics[0] || null,
      ratios: ratios[0] || null
    }
  } catch (error: any) {
    throw new Error(`Failed to fetch ${ticker}: ${error.message}`)
  }
}

async function reimportCompanies() {
  console.log('🔧 Re-importing Companies with Fixed Script...\n')
  console.log('This will update the 6 companies with:')
  console.log('  ✅ Fixed profit margin calculations')
  console.log('  ✅ Fixed EPS Diluted field mapping')
  console.log('  ✅ Quarterly financial data (last 12 quarters)\n')
  
  // The 6 companies with fundamentals that need to be re-imported
  const tickersToReimport = ['ABBV', 'ADBE', 'AMD', 'AMZN', 'BA', 'COIN']
  
  console.log('Companies to re-import:')
  tickersToReimport.forEach(t => console.log(`  - ${t}`))
  console.log(`\nAPI calls: ${tickersToReimport.length} x 13 = ${tickersToReimport.length * 13} calls`)
  console.log('  (2 quote/profile + 6 annual + 3 quarterly + 2 metrics/ratios per company)')
  console.log('='.repeat(80) + '\n')
  
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < tickersToReimport.length; i++) {
    const ticker = tickersToReimport[i]
    const progress = `[${i + 1}/${tickersToReimport.length}]`
    
    try {
      console.log(`${progress} Processing ${ticker}...`)
      
      const data = await fetchFundamentals(ticker)
      
      console.log(`  ✅ Data fetched: ${data.profile.companyName}`)
      console.log(`     Annual: ${data.incomeStatements.length} years | Quarterly: ${data.incomeStatementsQuarterly.length} quarters`)
      
      // Get latest financial data
      const latestIncome = data.incomeStatements[0]
      const latestBalance = data.balanceSheets[0]
      const latestCashFlow = data.cashFlowStatements[0]
      
      // Store in Supabase with FIXED mapping
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
          market_cap: data.quote.marketCap || 0,
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
            
            // Latest Income Statement WITH FIXED MAPPING
            incomeStatement: latestIncome ? {
              date: latestIncome.date,
              revenue: latestIncome.revenue,
              costOfRevenue: latestIncome.costOfRevenue,
              grossProfit: latestIncome.grossProfit,
              // ✅ FIX: Calculate ratios if not provided by API
              grossProfitRatio: latestIncome.grossProfitRatio || (latestIncome.revenue ? latestIncome.grossProfit / latestIncome.revenue : null),
              operatingIncome: latestIncome.operatingIncome,
              operatingIncomeRatio: latestIncome.operatingIncomeRatio || (latestIncome.revenue ? latestIncome.operatingIncome / latestIncome.revenue : null),
              netIncome: latestIncome.netIncome,
              netIncomeRatio: latestIncome.netIncomeRatio || (latestIncome.revenue ? latestIncome.netIncome / latestIncome.revenue : null),
              eps: latestIncome.eps,
              // ✅ FIX: Correct casing for epsDiluted
              epsdiluted: latestIncome.epsDiluted || latestIncome.epsdiluted,
              ebitda: latestIncome.ebitda,
              // ✅ FIX: Calculate ebitda ratio
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
            
            // Historical Statements (annual: last 5 years, quarterly: last 12 quarters)
            historicalFinancials: {
              incomeStatements: data.incomeStatements,
              incomeStatementsQuarterly: data.incomeStatementsQuarterly,
              balanceSheets: data.balanceSheets,
              balanceSheetsQuarterly: data.balanceSheetsQuarterly,
              cashFlowStatements: data.cashFlowStatements,
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
      
      console.log(`  💾 Updated in Supabase with FIXED data`)
      console.log(`  ✅ Ratios calculated and stored`)
      successCount++
      
      // Rate limiting
      if (i < tickersToReimport.length - 1) {
        console.log(`  ⏳ Waiting 2 seconds...\n`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}\n`)
      errorCount++
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(80))
  console.log('📊 Re-import Summary:')
  console.log(`  ✅ Successful: ${successCount}`)
  console.log(`  ❌ Failed: ${errorCount}`)
  console.log(`  📈 Total: ${tickersToReimport.length}`)
  
  if (successCount > 0) {
    console.log('\n✨ Companies now have COMPLETE income statement data with:')
    console.log('   ✅ Calculated profit margins (grossProfitRatio, operatingIncomeRatio, netIncomeRatio)')
    console.log('   ✅ EPS Diluted (epsdiluted)')
    console.log('   ✅ EBITDA margin (ebitdaratio)')
  }
}

reimportCompanies()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })

