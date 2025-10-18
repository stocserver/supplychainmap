import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function hasFundamentals(data: any): boolean {
	if (!data) return false
	if (data.incomeStatement || data.balanceSheet || data.cashFlow) return true
	const hist = data.historicalFinancials
	if (hist) {
		if ((hist.incomeStatements && hist.incomeStatements.length > 0)
			|| (hist.balanceSheets && hist.balanceSheets.length > 0)
			|| (hist.cashFlowStatements && hist.cashFlowStatements.length > 0)) {
			return true
		}
	}
	if (data.financials || data.financialStatements || data.statements) return true
	return false
}

async function verifyData() {
  console.log('🔍 Verifying Supabase data storage...\n')

  // Check AAPL first
  const { data: aapl, error: aaplError } = await supabase
    .from('companies')
    .select('*')
    .eq('ticker', 'AAPL')
    .single()

  console.log('='.repeat(80))
  console.log('📊 AAPL Data Check:')
  console.log('='.repeat(80))
  
  if (aaplError) {
    console.log('❌ Error fetching AAPL:', aaplError.message)
  } else if (!aapl) {
    console.log('❌ AAPL not found in database')
  } else {
    console.log('✅ AAPL found in database')
    console.log(`   Ticker: ${aapl.ticker}`)
    console.log(`   Name: ${aapl.name}`)
    console.log(`   Market Cap: $${(aapl.market_cap / 1e9).toFixed(2)}B`)
    
    // Check if data field exists
    if (aapl.data) {
      console.log('\n📦 Data field structure:')
      console.log(`   Has quote: ${!!aapl.data.quote}`)
      console.log(`   Has profile: ${!!aapl.data.profile}`)
      console.log(`   Has incomeStatement: ${!!aapl.data.incomeStatement}`)
      console.log(`   Has balanceSheet: ${!!aapl.data.balanceSheet}`)
      console.log(`   Has cashFlow: ${!!aapl.data.cashFlow}`)
      console.log(`   Has keyMetrics: ${!!aapl.data.keyMetrics}`)
      console.log(`   Has ratios: ${!!aapl.data.ratios}`)
      console.log(`   Has historicalFinancials: ${!!aapl.data.historicalFinancials}`)
      console.log(`   Has fundamentals (any): ${hasFundamentals(aapl.data)}`)
      
      if (aapl.data.incomeStatement) {
        console.log('\n💰 Income Statement Data:')
        console.log(`   Date: ${aapl.data.incomeStatement.date}`)
        console.log(`   Revenue: $${(aapl.data.incomeStatement.revenue / 1e9).toFixed(2)}B`)
        console.log(`   Net Income: $${(aapl.data.incomeStatement.netIncome / 1e9).toFixed(2)}B`)
        console.log(`   EPS: $${aapl.data.incomeStatement.eps?.toFixed(2)}`)
      }
      
      if (aapl.data.balanceSheet) {
        console.log('\n📊 Balance Sheet Data:')
        console.log(`   Date: ${aapl.data.balanceSheet.date}`)
        console.log(`   Total Assets: $${(aapl.data.balanceSheet.totalAssets / 1e9).toFixed(2)}B`)
        console.log(`   Total Equity: $${(aapl.data.balanceSheet.totalEquity / 1e9).toFixed(2)}B`)
      }
      
      if (aapl.data.cashFlow) {
        console.log('\n💵 Cash Flow Data:')
        console.log(`   Date: ${aapl.data.cashFlow.date}`)
        console.log(`   Operating CF: $${(aapl.data.cashFlow.operatingCashFlow / 1e9).toFixed(2)}B`)
        console.log(`   Free Cash Flow: $${(aapl.data.cashFlow.freeCashFlow / 1e9).toFixed(2)}B`)
      }
      if (aapl.data.historicalFinancials) {
        const h = aapl.data.historicalFinancials
        console.log('\n🗂️  Historical Financials:')
        console.log(`   Income Statements: ${h.incomeStatements?.length || 0}`)
        console.log(`   Balance Sheets: ${h.balanceSheets?.length || 0}`)
        console.log(`   Cash Flow Statements: ${h.cashFlowStatements?.length || 0}`)
      }
    } else {
      console.log('\n❌ No data field found!')
    }
  }

  // Check all companies
  console.log('\n' + '='.repeat(80))
  console.log('📋 All Companies Summary:')
  console.log('='.repeat(80))
  
  const { data: allCompanies, error: allError } = await supabase
    .from('companies')
    .select('ticker, name, data')
    .order('ticker')

  if (allError) {
    console.log('❌ Error fetching companies:', allError.message)
  } else {
    console.log(`\nTotal companies: ${allCompanies?.length}\n`)
    
    const withFundamentals = allCompanies?.filter(c => hasFundamentals(c.data))
    const withQuoteOnly = allCompanies?.filter(c => c.data?.quote && !hasFundamentals(c.data))
    const withNoData = allCompanies?.filter(c => !c.data || (!c.data.quote && !hasFundamentals(c.data)))
    
    console.log(`✅ Companies with FULL fundamentals: ${withFundamentals?.length}`)
    withFundamentals?.forEach(c => {
      console.log(`   - ${c.ticker}: ${c.name}`)
    })
    
    console.log(`\n📈 Companies with quote only: ${withQuoteOnly?.length}`)
    withQuoteOnly?.slice(0, 5).forEach(c => {
      console.log(`   - ${c.ticker}: ${c.name}`)
    })
    if (withQuoteOnly && withQuoteOnly.length > 5) {
      console.log(`   ... and ${withQuoteOnly.length - 5} more`)
    }
    
    console.log(`\n⚠️  Companies with no data: ${withNoData?.length}`)
    withNoData?.forEach(c => {
      console.log(`   - ${c.ticker}: ${c.name}`)
    })
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('✅ Verification complete!')
}

verifyData()


