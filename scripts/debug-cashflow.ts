// Check quarterly cash flow data
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    const { data } = await supabase
        .from('companies')
        .select('data')
        .eq('ticker', '6861.T')
        .single()

    const cfq = data?.data?.historicalFinancials?.cashFlowStatementsQuarterly
    console.log('Quarterly cashflow count:', cfq?.length || 0)

    if (cfq && cfq.length > 0) {
        console.log('\nFirst quarterly cashflow item keys:', Object.keys(cfq[0]))
        console.log('\nOperating fields:')
        console.log('  operatingCashFlow:', cfq[0].operatingCashFlow)
        console.log('  capitalExpenditure:', cfq[0].capitalExpenditure)
        console.log('  freeCashFlow:', cfq[0].freeCashFlow)
        console.log('  netCashProvidedByOperatingActivities:', cfq[0].netCashProvidedByOperatingActivities)
    }
}

main().then(() => process.exit(0))
