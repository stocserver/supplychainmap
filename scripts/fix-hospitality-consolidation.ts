
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function main() {
    console.log('🔄 CONSOLIDATING HOSPITALITY STREAMS\n')

    // 1. Get All Streams
    const { data: streams } = await sb.from('value_chain_streams')
        .select('*')
        .eq('industry', 'hospitality')

    if (!streams) return

    // Identify Good vs Bad
    const goodFn = (s: any) => ['upstream', 'midstream', 'downstream'].includes(s.slug)
    const goodStreams = streams.filter(goodFn)
    const badStreams = streams.filter(s => !goodFn(s))

    console.log(`Found ${goodStreams.length} target streams and ${badStreams.length} duplicate streams.`)

    // Map of matching pairs (e.g. Bad "Property Development" -> Good "upstream")
    // Note: display_name for "upstream" is "Property Development" too.

    for (const bad of badStreams) {
        // Find matching good stream by Display Name
        const target = goodStreams.find(g => g.display_name === bad.display_name)

        if (target) {
            console.log(`Running consolidation: "${bad.slug}" (${bad.id}) -> "${target.slug}" (${target.id})`)

            // Move Categories
            const { error: moveErr } = await sb.from('value_chain_categories')
                .update({ stream_id: target.id })
                .eq('stream_id', bad.id)

            if (moveErr) console.error('  ❌ Move failed:', moveErr)
            else console.log('  ✅ Categories moved.')

            // Delete Bad Stream
            const { error: delErr } = await sb.from('value_chain_streams')
                .delete()
                .eq('id', bad.id)

            if (delErr) console.error('  ❌ Delete failed:', delErr)
            else console.log('  🗑️  Duplicate stream deleted.')

        } else {
            console.warn(`⚠️ No matching target for "${bad.slug}"`)
        }
    }

    console.log('\n✨ Streams consolidated.')
}

main()
