/**
 * Test the dynamic value chain system
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
    const industry = 'semiconductors'

    console.log(`\n📊 Testing Dynamic Value Chain for ${industry}\n`)

    // Fetch streams
    const { data: streams } = await supabase
        .from('value_chain_streams')
        .select('*')
        .eq('industry', industry)
        .order('sort_order')

    console.log(`Streams: ${streams?.length || 0}`)
    streams?.forEach(s => console.log(`  - ${s.display_name} (${s.slug})`))

    // Fetch companies
    const { data: companies } = await supabase
        .from('companies')
        .select('ticker, name, stream_slug, category_slug, value_chain_tags')
        .eq('industry', industry)

    console.log(`\nCompanies: ${companies?.length || 0}`)

    // Group by stream
    const byStream = new Map<string, typeof companies>()
    for (const co of companies || []) {
        const stream = co.stream_slug || 'unknown'
        if (!byStream.has(stream)) byStream.set(stream, [])
        byStream.get(stream)!.push(co)
    }

    console.log('\n📦 Companies by Stream:')
    for (const [stream, cos] of byStream) {
        console.log(`\n${stream}: ${cos.length} companies`)

        // Group by category
        const byCategory = new Map<string, any[]>()
        for (const co of cos) {
            const cat = co.category_slug || co.value_chain_tags?.[0] || 'other'
            if (!byCategory.has(cat)) byCategory.set(cat, [])
            byCategory.get(cat)!.push(co)
        }

        for (const [cat, catCos] of byCategory) {
            console.log(`  ${cat}: ${catCos.map(c => c.ticker).join(', ')}`)
        }
    }

    console.log('\n✅ Test complete!')
}

main()
