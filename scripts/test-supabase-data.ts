// Simple test to check Supabase connection and data
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Supabase URL:', SUPABASE_URL ? 'SET' : 'MISSING')
console.log('Supabase Key:', SUPABASE_KEY ? `SET (${SUPABASE_KEY.substring(0, 20)}...)` : 'MISSING')

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
    console.log('\n🔍 Fetching a sample company from Supabase...\n')

    // Get first 3 companies to check data structure
    const { data, error } = await supabase
        .from('companies')
        .select('ticker, name, market_cap, country, exchange, data')
        .limit(3)

    if (error) {
        console.error('❌ Supabase error:', error.message)
        return
    }

    if (!data || data.length === 0) {
        console.log('❌ No companies found in database')
        return
    }

    console.log(`✅ Found ${data.length} companies:\n`)

    for (const company of data) {
        console.log(`--- ${company.ticker} ---`)
        console.log(`Name: ${company.name}`)
        console.log(`Market Cap: ${company.market_cap ? `$${(company.market_cap / 1e9).toFixed(2)}B` : 'N/A'}`)
        console.log(`Country: ${company.country || 'N/A'}`)
        console.log(`Exchange: ${company.exchange || 'N/A'}`)

        if (company.data) {
            console.log(`Data fields present:`)
            console.log(`  - quote: ${!!company.data.quote}`)
            console.log(`  - profile: ${!!company.data.profile}`)
            console.log(`  - incomeStatement: ${!!company.data.incomeStatement}`)
            console.log(`  - balanceSheet: ${!!company.data.balanceSheet}`)
            console.log(`  - cashFlow: ${!!company.data.cashFlow}`)
            console.log(`  - keyMetrics: ${!!company.data.keyMetrics}`)
            console.log(`  - ratios: ${!!company.data.ratios}`)
        } else {
            console.log('No data field')
        }
        console.log('')
    }
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Fatal:', err.message)
        process.exit(1)
    })
