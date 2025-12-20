// Check what Chinese companies we have
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
        .select('ticker, name, country, exchange, market_cap')
        .eq('country', 'CN')
        .order('market_cap', { ascending: false })

    console.log('🇨🇳 Chinese companies in database:\n')
    for (const c of data || []) {
        console.log(`  ${c.ticker.padEnd(12)} ${c.exchange?.padEnd(10) || 'N/A'.padEnd(10)} $${(c.market_cap / 1e9).toFixed(2)}B - ${c.name}`)
    }
    console.log(`\nTotal: ${data?.length || 0} companies`)
}

main().then(() => process.exit(0))
