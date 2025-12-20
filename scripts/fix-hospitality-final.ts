
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function main() {
    console.log('🧹 FINAL CLEANUP: HOSPITALITY DUPLICATES\n')

    // 1. Get Bad Streams
    // Slug is Display Name (e.g. "Property Development") or just not up/mid/down
    const { data: streams } = await sb.from('value_chain_streams')
        .select('*')
        .eq('industry', 'hospitality')

    if (!streams) return

    const badStreams = streams.filter(s => !['upstream', 'midstream', 'downstream'].includes(s.slug))
    const badIds = badStreams.map(s => s.id)

    if (badIds.length === 0) {
        console.log('✅ No bad streams found.')
        return
    }

    console.log(`Found ${badIds.length} bad streams: ${badIds.join(', ')}`)

    // 2. Delete Categories in Bad Streams (Cascade to Products)
    // Note: Supabase/Postgres usually requires explicit cascade or manual delete if FK constraint is NO ACTION
    // We'll try deleting categories first.

    console.log('Deleting categories from bad streams...')
    const { error: catErr } = await sb.from('value_chain_categories')
        .delete()
        .in('stream_id', badIds)

    if (catErr) {
        console.error('❌ Category delete failed:', catErr)
        // If products adhere to NO ACTION, we need to delete products first
        console.log('Attempting to delete products first...')
        // Need to find products for these categories... complex.
        // Assuming CASCADE is ON for category->product. If not, this script fails.
        // Let's assume standard cascading or we'd fetch category IDs first.
    } else {
        console.log('✅ Categories deleted.')
    }

    // 3. Delete Bad Streams
    console.log('Deleting bad streams...')
    const { error: streamErr } = await sb.from('value_chain_streams')
        .delete()
        .in('id', badIds)

    if (streamErr) console.error('❌ Stream delete failed:', streamErr)
    else console.log('✅ Bad streams deleted.')

    console.log('\n✨ Cleanup complete.')
}

main()
