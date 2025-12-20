/**
 * Analyze exchanges in Supabase
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log('📊 Analyzing exchanges...')

    let allCompanies: any[] = []
    let from = 0
    const step = 999

    while (true) {
        const { data: batch, error } = await supabase
            .from('companies')
            .select('exchange, ticker')
            .range(from, from + step)

        if (error || !batch || batch.length === 0) break
        allCompanies = [...allCompanies, ...batch]
        from += step + 1
    }

    const counts: Record<string, number> = {}
    allCompanies.forEach(c => {
        const ex = c.exchange || 'UNKNOWN'
        counts[ex] = (counts[ex] || 0) + 1
    })

    console.log('\nExchange Distribution:')
    Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([ex, count]) => console.log(`  ${ex}: ${count}`))
}

main()
