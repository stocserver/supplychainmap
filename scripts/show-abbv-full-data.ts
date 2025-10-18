import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function showData() {
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('ticker', 'ABBV')
    .single()

  console.log('ABBV Full Data Structure:')
  console.log('='.repeat(80))
  console.log('\ndata.historicalFinancials keys:')
  console.log(Object.keys(company?.data?.historicalFinancials || {}))
  
  console.log('\nQuarterly data lengths:')
  console.log('  incomeStatementsQuarterly:', company?.data?.historicalFinancials?.incomeStatementsQuarterly?.length || 0)
  console.log('  balanceSheetsQuarterly:', company?.data?.historicalFinancials?.balanceSheetsQuarterly?.length || 0)
  console.log('  cashFlowStatementsQuarterly:', company?.data?.historicalFinancials?.cashFlowStatementsQuarterly?.length || 0)
  
  console.log('\nFirst quarterly income statement:')
  console.log(JSON.stringify(company?.data?.historicalFinancials?.incomeStatementsQuarterly?.[0], null, 2))
}

showData()


