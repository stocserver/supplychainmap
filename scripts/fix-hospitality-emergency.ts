
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function main() {
    console.log('🚨 EMERGENCY FIX: HOSPITALITY\n')

    // 1. Delete Bad Streams
    // Bad slugs are likely the display names: "Property Development", "Operations", "Travel Services"
    // Good slugs are: "upstream", "midstream", "downstream"

    const { data: badStreams, error } = await sb.from('value_chain_streams')
        .delete()
        .eq('industry', 'hospitality')
        .in('slug', ['Property Development', 'Operations', 'Travel Services'])
        .select()

    if (error) console.error('Delete Error:', error)
    else console.log(`🗑️ Deleted ${badStreams?.length} duplicate streams.`)

    // 2. Fix Company Tags
    // HST, PEB, RLJ, SHO -> Upstream (property-development-hosp)
    const upstreamTickers = ['HST', 'PEB', 'RLJ', 'SHO']

    for (const ticker of upstreamTickers) {
        const { error: updates } = await sb.from('companies')
            .update({
                value_chain_tags: ['property-development-hosp'],
                category_slug: 'property-development-hosp' // Force category too
            })
            .eq('ticker', ticker)

        if (updates) console.error(`Error updating ${ticker}:`, updates)
        else console.log(`✅ Fixed tags for ${ticker} -> property-development-hosp`)
    }

    console.log('\n✨ Database repaired.')
}

main()
