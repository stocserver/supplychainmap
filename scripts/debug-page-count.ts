/**
 * Debug Page Count
 * Replicates Logic from app/industries/page.tsx
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
    console.log('SEARCH PARAMS: country="US"')
    const country = 'US'

    let dbRows: any[] = []
    let from = 0
    const batchSize = 1000

    while (true) {
        // EXACT QUERY FROM page.tsx
        const { data, error } = await supabase
            .from('companies')
            .select('ticker, name, industry, value_chain_tags')
            .eq('country', country)
            .range(from, from + batchSize - 1)

        if (error) {
            console.error("Fetch error:", error)
            break
        }
        if (data && data.length > 0) {
            dbRows = [...dbRows, ...data]
            if (data.length < batchSize) break
        } else {
            break
        }
        from += batchSize
    }

    console.log(`Fetched ${dbRows.length} rows for US.`)

    // Calculate counts for tile badges
    const counts: Record<string, number> = {}
    if (dbRows) {
        dbRows.forEach((r: any) => {
            if (r.industry) {
                counts[r.industry] = (counts[r.industry] || 0) + 1
            }
        })
    }

    console.log('--- COUNTS ---')
    console.log(`semiconductors: ${counts['semiconductors']}`)
    console.log(`agtech: ${counts['agtech']}`)
    console.log(`heavy-industry: ${counts['heavy-industry']}`)
}

main()
