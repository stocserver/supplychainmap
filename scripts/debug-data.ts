// Check what data is stored for a company
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    const ticker = process.argv[2] || '7203.T'

    const { data } = await supabase
        .from('companies')
        .select('data')
        .eq('ticker', ticker)
        .single()

    if (!data?.data) {
        console.log('No data found')
        return
    }

    const d = data.data
    console.log('=== Data Structure for', ticker, '===\n')
    console.log('Top-level keys:', Object.keys(d))
    console.log('')
    console.log('Has profile:', !!d.profile)
    console.log('Has incomeStatement:', !!d.incomeStatement)
    console.log('Has balanceSheet:', !!d.balanceSheet)
    console.log('Has cashFlow:', !!d.cashFlow)
    console.log('Has historicalFinancials:', !!d.historicalFinancials)

    if (d.historicalFinancials) {
        console.log('\nhistoricalFinancials keys:', Object.keys(d.historicalFinancials))
        console.log('incomeStatements count:', d.historicalFinancials.incomeStatements?.length || 0)
        console.log('balanceSheets count:', d.historicalFinancials.balanceSheets?.length || 0)
        console.log('cashFlowStatements count:', d.historicalFinancials.cashFlowStatements?.length || 0)

        if (d.historicalFinancials.incomeStatements?.length > 0) {
            console.log('\nFirst income statement:', JSON.stringify(d.historicalFinancials.incomeStatements[0], null, 2).substring(0, 500))
        }
    }
}

main().then(() => process.exit(0))
