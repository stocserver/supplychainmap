
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function check() {
    const { data: all } = await supabase
        .from('companies')
        .select('ticker, name, industry, value_chain_tags')
        .eq('country', 'JP')

    if (!all) return

    const unmapped = all.filter(c => !c.value_chain_tags || c.value_chain_tags.length === 0)

    console.log(`Total JP Companies: ${all.length}`)
    console.log(`Mapped: ${all.length - unmapped.length}`)
    console.log(`Unmapped: ${unmapped.length}`)

    console.log('--- ANALYSIS OF UNMAPPED COMPANIES ---')

    // Group by current industry (likely 'unclassified')
    const byIndustry: Record<string, number> = {}
    unmapped.forEach(c => {
        const ind = c.industry || 'null'
        byIndustry[ind] = (byIndustry[ind] || 0) + 1
    })
    console.log('Counts by Industry:', byIndustry)

    console.log('\n--- SAMPLE UNMAPPED NAMES ---')
    unmapped.slice(0, 50).forEach(c => {
        console.log(`${c.ticker} | ${c.name}`)
    })
}

check()
