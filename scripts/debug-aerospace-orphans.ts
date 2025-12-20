/**
 * Debug Aerospace Orphans
 * Identifies companies in 'aerospace-defense' that don't match known product tags
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VALID_TAGS = new Set([
    'titanium-alloys', 'composites',
    'engines', 'avionics',
    'commercial-aircraft', 'business-jets',
    'fighter-aircraft', 'missile-systems',
    'legacy-carriers', 'low-cost-carriers',
    'engine-mro', 'airframe-mro'
])

async function main() {
    console.log('🔍 Checking for Aerospace Orphans...')

    const { data: companies } = await supabase
        .from('companies')
        .select('ticker, name, value_chain_tags')
        .eq('industry', 'aerospace-defense')

    if (!companies) return

    let orphans = 0
    for (const co of companies) {
        const tags = co.value_chain_tags || []
        const hasMatch = tags.some((t: string) => VALID_TAGS.has(t))

        if (!hasMatch) {
            console.log(`❌ ORPHAN: ${co.ticker} (${co.name}) - Tags: [${tags.join(', ')}]`)
            orphans++
        }
    }

    if (orphans === 0) {
        console.log('✅ No orphans found! All 46 companies mapped.')
    } else {
        console.log(`⚠️ Found ${orphans} orphans.`)
    }
}

main()
