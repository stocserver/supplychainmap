import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function showABBVData() {
  console.log('🔍 Fetching ABBV financial data from Supabase...\n')

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('ticker', 'ABBV')
    .single()

  if (error) {
    console.log('❌ Error:', error.message)
    return
  }

  if (!data) {
    console.log('❌ ABBV not found')
    return
  }

  console.log('='.repeat(80))
  console.log('🏢 COMPANY PROFILE')
  console.log('='.repeat(80))
  console.log(`Ticker: ${data.ticker}`)
  console.log(`Name: ${data.name}`)
  console.log(`Sector: ${data.sector}`)
  console.log(`Industry: ${data.industry}`)
  console.log(`Employees: ${data.employees?.toLocaleString()}`)
  console.log(`Market Cap: $${(data.market_cap / 1e9).toFixed(2)}B`)
  console.log(`Website: ${data.website}`)

  if (data.data?.incomeStatement) {
    console.log('\n' + '='.repeat(80))
    console.log('💰 INCOME STATEMENT')
    console.log('='.repeat(80))
    const income = data.data.incomeStatement
    console.log(`Fiscal Year: ${income.date}`)
    console.log(`Revenue: $${(income.revenue / 1e9).toFixed(2)}B`)
    console.log(`Gross Profit: $${(income.grossProfit / 1e9).toFixed(2)}B`)
    console.log(`Operating Income: $${(income.operatingIncome / 1e9).toFixed(2)}B`)
    console.log(`Net Income: $${(income.netIncome / 1e9).toFixed(2)}B`)
    console.log(`EPS (Basic): $${income.eps?.toFixed(2)}`)
    console.log(`EPS (Diluted): $${income.epsdiluted?.toFixed(2)}`)
    console.log(`EBITDA: $${(income.ebitda / 1e9).toFixed(2)}B`)
    console.log(`\nMargins:`)
    console.log(`  Gross Margin: ${(income.grossProfitRatio * 100).toFixed(2)}%`)
    console.log(`  Operating Margin: ${(income.operatingIncomeRatio * 100).toFixed(2)}%`)
    console.log(`  Net Margin: ${(income.netIncomeRatio * 100).toFixed(2)}%`)
    console.log(`  EBITDA Margin: ${(income.ebitdaratio * 100).toFixed(2)}%`)
  } else {
    console.log('\n❌ No income statement data')
  }

  if (data.data?.balanceSheet) {
    console.log('\n' + '='.repeat(80))
    console.log('📊 BALANCE SHEET')
    console.log('='.repeat(80))
    const balance = data.data.balanceSheet
    console.log(`As of: ${balance.date}`)
    console.log(`Total Assets: $${(balance.totalAssets / 1e9).toFixed(2)}B`)
    console.log(`Total Liabilities: $${(balance.totalLiabilities / 1e9).toFixed(2)}B`)
    console.log(`Total Equity: $${(balance.totalEquity / 1e9).toFixed(2)}B`)
    console.log(`Cash & Equivalents: $${(balance.cashAndCashEquivalents / 1e9).toFixed(2)}B`)
    console.log(`Total Debt: $${(balance.totalDebt / 1e9).toFixed(2)}B`)
    console.log(`Net Debt: $${(balance.netDebt / 1e9).toFixed(2)}B`)
  } else {
    console.log('\n❌ No balance sheet data')
  }

  if (data.data?.cashFlow) {
    console.log('\n' + '='.repeat(80))
    console.log('💵 CASH FLOW STATEMENT')
    console.log('='.repeat(80))
    const cashFlow = data.data.cashFlow
    console.log(`Fiscal Year: ${cashFlow.date}`)
    console.log(`Operating Cash Flow: $${(cashFlow.operatingCashFlow / 1e9).toFixed(2)}B`)
    console.log(`Capital Expenditure: $${(cashFlow.capitalExpenditure / 1e9).toFixed(2)}B`)
    console.log(`Free Cash Flow: $${(cashFlow.freeCashFlow / 1e9).toFixed(2)}B`)
    console.log(`Dividends Paid: $${(Math.abs(cashFlow.dividendsPaid) / 1e9).toFixed(2)}B`)
  } else {
    console.log('\n❌ No cash flow data')
  }

  if (data.data?.keyMetrics) {
    console.log('\n' + '='.repeat(80))
    console.log('📈 KEY METRICS (TTM)')
    console.log('='.repeat(80))
    const metrics = data.data.keyMetrics
    if (metrics.peRatioTTM) console.log(`P/E Ratio: ${metrics.peRatioTTM.toFixed(2)}`)
    if (metrics.priceToSalesRatioTTM) console.log(`P/S Ratio: ${metrics.priceToSalesRatioTTM.toFixed(2)}`)
    if (metrics.ptbRatioTTM) console.log(`P/B Ratio: ${metrics.ptbRatioTTM.toFixed(2)}`)
    if (metrics.roeTTM) console.log(`ROE: ${(metrics.roeTTM * 100).toFixed(2)}%`)
    if (metrics.roaTTM) console.log(`ROA: ${(metrics.roaTTM * 100).toFixed(2)}%`)
    if (metrics.debtToEquityTTM) console.log(`Debt/Equity: ${metrics.debtToEquityTTM.toFixed(2)}`)
  }

  if (data.data?.ratios) {
    console.log('\n' + '='.repeat(80))
    console.log('📐 FINANCIAL RATIOS (TTM)')
    console.log('='.repeat(80))
    const ratios = data.data.ratios
    console.log('Liquidity Ratios:')
    if (ratios.currentRatioTTM) console.log(`  Current Ratio: ${ratios.currentRatioTTM.toFixed(2)}`)
    if (ratios.quickRatioTTM) console.log(`  Quick Ratio: ${ratios.quickRatioTTM.toFixed(2)}`)
    console.log('\nProfitability Ratios:')
    if (ratios.grossProfitMarginTTM) console.log(`  Gross Margin: ${(ratios.grossProfitMarginTTM * 100).toFixed(2)}%`)
    if (ratios.operatingProfitMarginTTM) console.log(`  Operating Margin: ${(ratios.operatingProfitMarginTTM * 100).toFixed(2)}%`)
    if (ratios.netProfitMarginTTM) console.log(`  Net Margin: ${(ratios.netProfitMarginTTM * 100).toFixed(2)}%`)
  }

  if (data.data?.historicalFinancials) {
    console.log('\n' + '='.repeat(80))
    console.log('📚 HISTORICAL DATA (5 YEARS)')
    console.log('='.repeat(80))
    const hist = data.data.historicalFinancials
    console.log(`Income Statements: ${hist.incomeStatements?.length || 0} years`)
    console.log(`Balance Sheets: ${hist.balanceSheets?.length || 0} years`)
    console.log(`Cash Flow Statements: ${hist.cashFlowStatements?.length || 0} years`)
    
    if (hist.incomeStatements && hist.incomeStatements.length > 0) {
      console.log('\nRevenue History:')
      hist.incomeStatements.slice(0, 5).forEach((stmt: any) => {
        console.log(`  ${stmt.date}: $${(stmt.revenue / 1e9).toFixed(2)}B`)
      })
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('✅ ALL FINANCIAL DATA IS STORED IN SUPABASE!')
  console.log('='.repeat(80))
}

showABBVData()


