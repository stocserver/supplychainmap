/**
 * Test the actual getValueChainFromDB function output
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

    console.log(`\n📊 Testing DB Value Chain for ${industry}\n`)

    // Fetch streams
    const { data: streams, error: streamsError } = await supabase
        .from('value_chain_streams')
        .select('*')
        .eq('industry', industry)
        .order('sort_order')

    if (streamsError) {
        console.log('Stream error:', streamsError)
        return
    }

    console.log(`Streams: ${streams?.length || 0}`)

    // Fetch companies
    const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('ticker, name, stream_slug, category_slug, value_chain_tags, country, industry')
        .eq('industry', industry)

    if (companiesError) {
        console.log('Companies error:', companiesError)
        return
    }

    console.log(`Companies: ${companies?.length || 0}`)

    // Build the result like the actual function
    const result = streams?.map(stream => {
        const streamCompanies = (companies || []).filter(co => co.stream_slug === stream.slug)
        console.log(`\n${stream.display_name}: ${streamCompanies.length} companies`)

        // Group by category
        const categoryMap = new Map()
        for (const company of streamCompanies) {
            const key = company.category_slug || company.value_chain_tags?.[0] || 'other'
            if (!categoryMap.has(key)) categoryMap.set(key, [])
            categoryMap.get(key)!.push(company)
        }

        console.log(`  Categories: ${categoryMap.size}`)
        for (const [cat, cos] of categoryMap) {
            console.log(`    ${cat}: ${(cos as any[]).length} companies`)
        }

        return {
            stage: stream.slug,
            stageLabel: stream.display_name,
            layout: 'grid',
            products: Array.from(categoryMap.entries()).map(([slug, cos]) => ({
                id: slug,
                name: slug,
                companiesDetailed: (cos as any[]).map(c => ({ ticker: c.ticker, name: c.name }))
            }))
        }
    })

    console.log('\n📦 Result:')
    console.log(JSON.stringify(result, null, 2).slice(0, 2000))
}

main()
