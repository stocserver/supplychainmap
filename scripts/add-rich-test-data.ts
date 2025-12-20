
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function main() {
    console.log('🧪 ADDING RICH TEST DATA TO TELECOMMUNICATIONS (WITH SUB-PRODUCTS)\n')

    const INDUSTRY = 'telecommunications'

    // Define rich scenarios
    const scenarios = [
        {
            streamSlugObserved: 'upstream',
            streamSlugAlt: 'infrastructure-equipment',
            catName: 'Test Upstream Proto',
            catSlug: 'test-up-proto-cat',
            products: [
                { name: 'Proto Chipsets', slug: 'proto-chips' },
                { name: 'Experimental Towers', slug: 'exp-towers' }
            ]
        },
        {
            streamSlugObserved: 'midstream',
            streamSlugAlt: 'service-providers', // Likely the correct slug based on UI
            catName: 'Test Midstream Networks',
            catSlug: 'test-mid-net-cat',
            products: [
                { name: '5G Test Grid', slug: '5g-test-grid' },
                { name: 'Legacy Copper', slug: 'legacy-copper' },
                { name: 'Quantum Links', slug: 'quantum-links' }
            ]
        },
        {
            streamSlugObserved: 'downstream',
            streamSlugAlt: 'consumer-enterprise-services',
            catName: 'Test Consumer Solutions',
            catSlug: 'test-down-sol-cat',
            products: [
                { name: 'VR Streaming', slug: 'vr-stream' },
                { name: 'Holo-Calls', slug: 'holo-calls' }
            ]
        }
    ]

    for (const scen of scenarios) {
        console.log(`\n--- Processing Scenario: ${scen.catName} ---`)

        // 1. Find Stream (Try primary then alt)
        let { data: stream } = await sb.from('value_chain_streams')
            .select('id, slug')
            .eq('industry', INDUSTRY)
            .eq('slug', scen.streamSlugObserved)
            .single()

        if (!stream) {
            console.log(`   🔸 Primary slug '${scen.streamSlugObserved}' not found. Trying '${scen.streamSlugAlt}'...`)
            const { data: altStream } = await sb.from('value_chain_streams')
                .select('id, slug')
                .eq('industry', INDUSTRY)
                .eq('slug', scen.streamSlugAlt)
                .single()
            stream = altStream
        }

        if (!stream) {
            console.error(`   ❌ Stream not found (tried both slugs). Skipping.`)
            continue
        }
        console.log(`   ✅ Found Stream: ${stream.slug} (${stream.id})`)

        // 2. Upsert Category
        const { data: catData, error: catErr } = await sb.from('value_chain_categories')
            .upsert({
                stream_id: stream.id,
                slug: scen.catSlug,
                display_name: scen.catName,
                description: `Rich test category for ${stream.slug}.`,
                sort_order: 100 // Bottom
            }, { onConflict: 'stream_id, slug' })
            .select('id')
            .single()

        if (catErr || !catData) {
            console.error(`   ❌ Category Upsert Fail:`, catErr)
            continue
        }
        console.log(`   ✅ Upserted Category: ${scen.catName} (${catData.id})`)

        // 3. Upsert Sub-Products (value_chain_products)
        // CRITICAL: This is what creates the "columns" or "pills" in the card
        for (const prod of scen.products) {
            const { error: prodErr } = await sb.from('value_chain_products')
                .upsert({
                    category_id: catData.id,
                    slug: prod.slug,
                    display_name: prod.name,
                    description: 'Test sub-product',
                    sort_order: Math.floor(Math.random() * 10)
                }, { onConflict: 'category_id, slug' })

            if (prodErr) console.error(`     ❌ Product Fail (${prod.slug}):`, prodErr)
            else console.log(`     ✅ Product: ${prod.name}`)
        }

        // 4. Create Companies for EACH sub-product
        for (const prod of scen.products) {
            // Random number of companies (1-3) per product
            const count = Math.floor(Math.random() * 3) + 1

            for (let i = 0; i < count; i++) {
                const suffix = Math.random().toString(36).substring(7).toUpperCase()
                const ticker = `T-${prod.slug.substring(0, 3).toUpperCase()}-${suffix}`.substring(0, 10)

                const { error: coErr } = await sb.from('companies')
                    .upsert({
                        ticker: ticker,
                        name: `${prod.name} Corp ${i + 1}`,
                        industry: INDUSTRY,
                        country: 'US',
                        description: `Test company for ${prod.name}`,
                        stream_slug: stream.slug,
                        category_slug: scen.catSlug,
                        value_chain_tags: [prod.slug] // CRITICAL: Matches the product slug
                    }, { onConflict: 'ticker' })

                if (coErr) console.error(`       ❌ Company Fail (${ticker}):`, coErr)
                else console.log(`       ✅ Company: ${ticker} -> ${prod.slug}`)
            }
        }
    }

    console.log('\n✨ Rich test data injection complete.')
}

main()
