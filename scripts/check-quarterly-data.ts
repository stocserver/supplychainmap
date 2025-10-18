import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function checkQuarterlyData() {
  console.log('🔍 Checking for Quarterly Data in Supabase...\n')

  const { data: company, error } = await supabase
    .from('companies')
    .select('ticker, name, data')
    .eq('ticker', 'ABBV')
    .single()

  if (error || !company) {
    console.log('❌ Error fetching ABBV:', error?.message || 'Not found')
    return
  }

  console.log(`📊 ${company.ticker} - ${company.name}\n`)

  const historicalFinancials = company.data?.historicalFinancials

  if (!historicalFinancials) {
    console.log('❌ No historicalFinancials found in data')
    return
  }

  console.log('📦 Historical Financials Structure:\n')
  
  // Check Annual Data
  console.log('Annual Data:')
  console.log(`  ✓ incomeStatements: ${historicalFinancials.incomeStatements?.length || 0} years`)
  console.log(`  ✓ balanceSheets: ${historicalFinancials.balanceSheets?.length || 0} years`)
  console.log(`  ✓ cashFlowStatements: ${historicalFinancials.cashFlowStatements?.length || 0} years`)
  
  // Check Quarterly Data
  console.log('\nQuarterly Data:')
  console.log(`  ${historicalFinancials.incomeStatementsQuarterly ? '✅' : '❌'} incomeStatementsQuarterly: ${historicalFinancials.incomeStatementsQuarterly?.length || 0} quarters`)
  console.log(`  ${historicalFinancials.balanceSheetsQuarterly ? '✅' : '❌'} balanceSheetsQuarterly: ${historicalFinancials.balanceSheetsQuarterly?.length || 0} quarters`)
  console.log(`  ${historicalFinancials.cashFlowStatementsQuarterly ? '✅' : '❌'} cashFlowStatementsQuarterly: ${historicalFinancials.cashFlowStatementsQuarterly?.length || 0} quarters`)

  if (!historicalFinancials.incomeStatementsQuarterly) {
    console.log('\n⚠️  QUARTERLY DATA IS MISSING!')
    console.log('   The company was imported with the OLD script that only fetches annual data.')
    console.log('\n💡 Solution: Run the reimport script to add quarterly data:')
    console.log('   npm run reimport:fix\n')
  } else {
    console.log('\n✅ Quarterly data exists!')
    
    if (historicalFinancials.incomeStatementsQuarterly.length > 0) {
      console.log('\n📊 Sample Quarterly Income Statements:')
      historicalFinancials.incomeStatementsQuarterly.slice(0, 4).forEach((stmt: any, i: number) => {
        console.log(`  ${i + 1}. ${stmt.period || 'Q?'} ${stmt.date} - Revenue: $${(stmt.revenue / 1e9).toFixed(2)}B`)
      })
    }
  }
}

checkQuarterlyData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })


