/**
 * Sync valid product IDs from database lookup tables
 * This ensures the LLM classifier uses the latest DB-driven taxonomy
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log("Fetching valid product IDs from database lookup tables...\n")

    // For now, just update AgTech from DB (other industries still use hardcoded)
    const dbIndustries = ['agtech']

    // Load existing valid_product_ids
    const existingPath = path.resolve(__dirname, 'valid_product_ids_by_industry.json')
    let validProductIds: Record<string, string[]> = {}

    if (fs.existsSync(existingPath)) {
        validProductIds = JSON.parse(fs.readFileSync(existingPath, 'utf-8'))
        console.log(`Loaded existing file with ${Object.keys(validProductIds).length} industries`)
    }

    // Fetch AgTech categories and products from DB
    for (const industry of dbIndustries) {
        const { data: streams } = await supabase
            .from('value_chain_streams')
            .select('id')
            .eq('industry', industry)

        if (!streams?.length) continue

        const { data: categories } = await supabase
            .from('value_chain_categories')
            .select('slug')
            .in('stream_id', streams.map(s => s.id))

        const { data: products } = await supabase
            .from('value_chain_products')
            .select('slug')
            .in('category_id', (await supabase
                .from('value_chain_categories')
                .select('id')
                .in('stream_id', streams.map(s => s.id))
            ).data?.map(c => c.id) || [])

        // Combine all slugs
        const allSlugs = [
            ...(categories || []).map(c => c.slug),
            ...(products || []).map(p => p.slug)
        ]

        console.log(`\n${industry}: ${allSlugs.length} tags from DB:`)
        console.log(`  Categories: ${(categories || []).map(c => c.slug).join(', ')}`)
        console.log(`  Products: ${(products || []).map(p => p.slug).join(', ')}`)

        // Update the valid product IDs
        validProductIds[industry] = allSlugs
    }

    // Save updated file
    fs.writeFileSync(existingPath, JSON.stringify(validProductIds, null, 2))
    console.log(`\n✅ Updated ${existingPath}`)
}

main()
