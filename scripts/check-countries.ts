// Check what countries exist in the database
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
    // 1. Get distinct countries
    console.log('📊 Distinct countries in database:\n')
    const { data: companies } = await supabase
        .from('companies')
        .select('country')

    const countries = new Map<string, number>()
    for (const c of companies || []) {
        const cnt = countries.get(c.country) || 0
        countries.set(c.country, cnt + 1)
    }

    for (const [country, count] of countries.entries()) {
        console.log(`  ${country}: ${count} companies`)
    }

    // 2. Get Japanese companies specifically
    console.log('\n🇯🇵 Japanese companies (country = JP):\n')
    const { data: jpCompanies } = await supabase
        .from('companies')
        .select('ticker, name, country, market_cap')
        .eq('country', 'JP')

    if (!jpCompanies || jpCompanies.length === 0) {
        console.log('  No companies with country = JP')
    } else {
        for (const c of jpCompanies) {
            console.log(`  ${c.ticker} - ${c.name} (${c.country}) - $${(c.market_cap / 1e9).toFixed(2)}B`)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Fatal:', err)
        process.exit(1)
    })
