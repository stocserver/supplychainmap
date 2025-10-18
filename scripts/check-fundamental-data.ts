import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function checkData() {
  console.log('📊 Checking fundamental data in database...\n')

  // Check companies with fundamental data
  const { data: companies, error } = await supabase
    .from('companies')
    .select('ticker, name, data')
    .order('ticker')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log(`Total companies in database: ${companies?.length}\n`)

  const companiesWithFundamentals = companies?.filter(c => 
    c.data?.incomeStatement && 
    c.data?.balanceSheet && 
    c.data?.cashFlow
  )

  console.log(`Companies with full fundamentals: ${companiesWithFundamentals?.length}\n`)
  
  if (companiesWithFundamentals && companiesWithFundamentals.length > 0) {
    console.log('Companies with fundamental data:')
    companiesWithFundamentals.forEach(c => {
      console.log(`  ✅ ${c.ticker} - ${c.name}`)
    })

    // Show detailed data for first company
    const first = companiesWithFundamentals[0]
    console.log(`\n📈 Sample Data for ${first.ticker}:`)
    console.log('\nIncome Statement:')
    console.log(`  Date: ${first.data.incomeStatement.date}`)
    console.log(`  Revenue: $${(first.data.incomeStatement.revenue / 1e9).toFixed(2)}B`)
    console.log(`  Net Income: $${(first.data.incomeStatement.netIncome / 1e9).toFixed(2)}B`)
    console.log(`  EPS: $${first.data.incomeStatement.eps?.toFixed(2)}`)

    console.log('\nBalance Sheet:')
    console.log(`  Date: ${first.data.balanceSheet.date}`)
    console.log(`  Total Assets: $${(first.data.balanceSheet.totalAssets / 1e9).toFixed(2)}B`)
    console.log(`  Total Equity: $${(first.data.balanceSheet.totalEquity / 1e9).toFixed(2)}B`)

    console.log('\nCash Flow:')
    console.log(`  Date: ${first.data.cashFlow.date}`)
    console.log(`  Operating CF: $${(first.data.cashFlow.operatingCashFlow / 1e9).toFixed(2)}B`)
    console.log(`  Free Cash Flow: $${(first.data.cashFlow.freeCashFlow / 1e9).toFixed(2)}B`)
  }

  console.log('\n✅ Check complete!')
}

checkData()


