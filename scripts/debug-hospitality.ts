
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function main() {
    console.log('🔍 Deep Dive Debug: HOSPITALITY\n')

    // 1. Streams
    const { data: streams } = await sb.from('value_chain_streams')
        .select('*')
        .eq('industry', 'hospitality')
        .order('sort_order')

    console.log('1. STREAMS:')
    streams?.forEach(s => console.log(`   - [${s.slug}] ${s.display_name} (ID: ${s.id})`))

    if (!streams || streams.length === 0) return

    // 2. Upstream Categories
    const upstream = streams.find(s => s.slug === 'upstream') || streams[0]
    console.log(`\n2. CATEGORIES for Stream: ${upstream.display_name} (${upstream.slug})`)

    const { data: cats } = await sb.from('value_chain_categories')
        .select('*')
        .eq('stream_id', upstream.id)

    cats?.forEach(c => console.log(`   - [${c.slug}] ${c.display_name}`))

    // 3. Companies
    console.log('\n3. COMPANIES (HST, PEB):')
    const { data: comps } = await sb.from('companies')
        .select('ticker, name, value_chain_tags, category_slug')
        .in('ticker', ['HST', 'PEB'])

    comps?.forEach(c => {
        console.log(`   - ${c.ticker}: tags=[${c.value_chain_tags?.join(', ')}] category_slug=${c.category_slug}`)
    })

    // 4. Tags vs Category Match
    if (cats && comps) {
        console.log('\n4. MATCH ANALYSIS:')
        comps.forEach(co => {
            const hasMatch = co.value_chain_tags?.some(tag => cats.some(c => c.slug === tag))
            const catMatch = cats.some(c => c.slug === co.category_slug)
            console.log(`   - ${co.ticker} matches Upstream? Tags: ${hasMatch}, CatSlug: ${catMatch}`)
        })
    }
}

main()
