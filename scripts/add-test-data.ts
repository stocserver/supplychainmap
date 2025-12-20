
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function main() {
    console.log('🧪 ADDING RANDOMIZED TEST DATA TO TELECOMMUNICATIONS\n')

    const INDUSTRY = 'telecommunications'

    // Define scenarios
    const scenarios = [
        { stream: 'midstream', catName: 'Test Midstream Services', catSlug: 'test-mid-svc', count: Math.floor(Math.random() * 4) + 2 }, // 2-5
        { stream: 'downstream', catName: 'Test Consumer Apps', catSlug: 'test-down-apps', count: Math.floor(Math.random() * 4) + 2 }, // 2-5
        { stream: 'upstream', catName: 'Test Hardware Proto', catSlug: 'test-up-proto', count: Math.floor(Math.random() * 4) + 2 } // 2-5
    ]

    for (const scen of scenarios) {
        console.log(`\n--- Processing ${scen.stream.toUpperCase()} (${scen.count} companies) ---`)

        // 1. Get Stream ID
        const { data: stream } = await sb.from('value_chain_streams')
            .select('id')
            .eq('industry', INDUSTRY)
            .eq('slug', scen.stream)
            .single()

        if (!stream) {
            console.error(`❌ Stream not found: ${scen.stream}`)
            continue
        }

        // 2. Upsert Category
        const { error: catErr } = await sb.from('value_chain_categories')
            .upsert({
                stream_id: stream.id,
                slug: scen.catSlug,
                display_name: scen.catName,
                description: `Randomized test category for ${scen.stream}.`,
                sort_order: 99 // Put at bottom
            }, { onConflict: 'stream_id, slug' })

        if (catErr) console.error(`❌ Category Error (${scen.catSlug}):`, catErr)
        else console.log(`✅ Category: ${scen.catName}`)

        // 3. Upsert Companies
        for (let i = 1; i <= scen.count; i++) {
            const suffix = Math.random().toString(36).substring(7).toUpperCase()
            const ticker = `TST-${scen.stream.substring(0, 2).toUpperCase()}-${i}-${suffix}`.substring(0, 10) // Max 10 chars

            const { error: coErr } = await sb.from('companies')
                .upsert({
                    ticker: ticker,
                    name: `${scen.stream} Test Corp ${i}`,
                    industry: INDUSTRY,
                    country: 'US',
                    description: 'Random test company.',
                    stream_slug: scen.stream,
                    category_slug: scen.catSlug,
                    value_chain_tags: [scen.catSlug]
                }, { onConflict: 'ticker' })

            if (coErr) console.error(`  ❌ Company Error (${ticker}):`, coErr)
            else console.log(`  ✅ Company: ${ticker}`)
        }
    }

    console.log('\n✨ Randomized test data injected.')
}

main()
