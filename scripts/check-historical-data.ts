import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function checkHistoricalData() {
  const { data: company } = await supabase
    .from('companies')
    .select('ticker, name, data')
    .eq('ticker', 'ABBV')
    .single()

  if (company?.data?.historicalFinancials) {
    console.log('✅ Historical data exists!')
    console.log(`Income statements: ${company.data.historicalFinancials.incomeStatements?.length || 0} years`)
    console.log(`Balance sheets: ${company.data.historicalFinancials.balanceSheets?.length || 0} years`)
    console.log(`Cash flows: ${company.data.historicalFinancials.cashFlowStatements?.length || 0} years`)
    
    if (company.data.historicalFinancials.incomeStatements?.length > 0) {
      console.log('\nIncome Statement Years:')
      company.data.historicalFinancials.incomeStatements.forEach((stmt: any, i: number) => {
        console.log(`  ${i + 1}. ${stmt.date} - Revenue: $${(stmt.revenue / 1e9).toFixed(2)}B`)
      })
    }
  } else {
    console.log('❌ No historical data found')
  }
}

checkHistoricalData()


