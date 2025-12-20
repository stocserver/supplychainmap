// Check which Japanese companies need currency conversion
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
        .select('ticker, name, data')
        .eq('country', 'JP')
        .order('market_cap', { ascending: false })

    console.log('🇯🇵 Japanese Company Currency Status\n')
    console.log('Ticker'.padEnd(12), 'Currency'.padEnd(12), 'Revenue')
    console.log('-'.repeat(50))

    let needsConversion = 0
    let converted = 0

    for (const c of data || []) {
        const currency = c.data?.originalCurrency
        const rev = c.data?.incomeStatement?.revenue

        if (currency === 'JPY') {
            converted++
        } else {
            needsConversion++
        }

        console.log(
            c.ticker.padEnd(12),
            (currency || 'NOT CONV').padEnd(12),
            rev ? `$${(rev / 1e9).toFixed(1)}B` : 'N/A'
        )
    }

    console.log('\n' + '-'.repeat(50))
    console.log(`✅ Converted to USD: ${converted}`)
    console.log(`❌ Needs conversion: ${needsConversion}`)
}

main().then(() => process.exit(0))
