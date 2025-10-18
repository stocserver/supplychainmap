// Show actual income statement data stored in Supabase
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function showIncomeStatementData() {
  console.log('🔍 Showing Income Statement Data from Supabase...\n')

  // Get a company with full fundamentals
  const { data: company, error } = await supabase
    .from('companies')
    .select('ticker, name, data')
    .eq('ticker', 'ABBV')
    .single()

  if (error) {
    console.log('❌ Error:', error.message)
    return
  }

  if (!company) {
    console.log('❌ Company not found')
    return
  }

  console.log('='.repeat(80))
  console.log(`📊 ${company.ticker} - ${company.name}`)
  console.log('='.repeat(80))
  console.log('')

  if (!company.data) {
    console.log('❌ No data field found for this company')
    return
  }

  // Show the data structure
  console.log('📦 DATA STRUCTURE (companies.data JSONB field):\n')
  console.log('The income statement is stored in: companies.data.incomeStatement')
  console.log('')

  if (company.data.incomeStatement) {
    const income = company.data.incomeStatement
    
    console.log('✅ INCOME STATEMENT DATA FOUND:\n')
    console.log(JSON.stringify(income, null, 2))
    
    console.log('\n\n💡 How it displays in the UI:\n')
    console.log(`   Date: ${income.date}`)
    console.log(`   Revenue: $${(income.revenue / 1e9).toFixed(2)}B`)
    console.log(`   Gross Profit: $${(income.grossProfit / 1e9).toFixed(2)}B`)
    console.log(`   Operating Income: $${(income.operatingIncome / 1e9).toFixed(2)}B`)
    console.log(`   Net Income: $${(income.netIncome / 1e9).toFixed(2)}B`)
    console.log('')
    
    // Check for the fixed fields
    console.log('✓ Fixed Field Validation:\n')
    console.log(`   ${income.grossProfitRatio ? '✅' : '❌'} grossProfitRatio: ${income.grossProfitRatio ? (income.grossProfitRatio * 100).toFixed(2) + '%' : 'MISSING'}`)
    console.log(`   ${income.operatingIncomeRatio ? '✅' : '❌'} operatingIncomeRatio: ${income.operatingIncomeRatio ? (income.operatingIncomeRatio * 100).toFixed(2) + '%' : 'MISSING'}`)
    console.log(`   ${income.netIncomeRatio ? '✅' : '❌'} netIncomeRatio: ${income.netIncomeRatio ? (income.netIncomeRatio * 100).toFixed(2) + '%' : 'MISSING'}`)
    console.log(`   ${income.epsdiluted ? '✅' : '❌'} epsdiluted: ${income.epsdiluted ? '$' + income.epsdiluted.toFixed(2) : 'MISSING'}`)
    console.log(`   ${income.ebitdaratio ? '✅' : '❌'} ebitdaratio: ${income.ebitdaratio ? (income.ebitdaratio * 100).toFixed(2) + '%' : 'MISSING'}`)
    
  } else {
    console.log('❌ No income statement data for this company')
  }

  console.log('\n\n' + '='.repeat(80))
  console.log('📝 HOW TO VIEW IN SUPABASE DASHBOARD:\n')
  console.log('1. Go to Supabase Dashboard → Table Editor → companies')
  console.log('2. Click on any company row')
  console.log('3. Look for the "data" column (it\'s a JSON object)')
  console.log('4. Expand the "data" JSON to see:')
  console.log('   - incomeStatement')
  console.log('   - balanceSheet')
  console.log('   - cashFlow')
  console.log('   - keyMetrics')
  console.log('   - ratios')
  console.log('   - quote')
  console.log('   - profile')
  console.log('')
  console.log('The data is NOT in separate columns - it\'s all inside the JSONB "data" field!')
  console.log('='.repeat(80))
}

showIncomeStatementData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })


