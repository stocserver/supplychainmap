
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

// Simulating the value-chain-db.ts logic
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    const industry = 'agtech'

    // Fetch streams
    const { data: streams } = await supabase
        .from('value_chain_streams')
        .select('*')
        .eq('industry', industry)
        .order('sort_order')

    // Fetch categories
    const { data: categories } = await supabase
        .from('value_chain_categories')
        .select('*')
        .in('stream_id', streams?.map(s => s.id) || [])
        .order('sort_order')

    // Fetch products
    const { data: products } = await supabase
        .from('value_chain_products')
        .select('*')
        .in('category_id', categories?.map(c => c.id) || [])

    // Collect all slugs
    const allSlugs = [
        ...(categories || []).map(c => c.slug),
        ...(products || []).map(p => p.slug)
    ]
    console.log("All slugs:", allSlugs)

    // Fetch cross-industry companies
    const { data: allCompanies } = await supabase
        .from('companies')
        .select('ticker, name, value_chain_tags')
        .neq('industry', industry)
        .limit(500)

    // Filter by matching tags
    const crossIndustry = (allCompanies || []).filter(co => {
        const tags = co.value_chain_tags || []
        return tags.some((t: string) => allSlugs.includes(t))
    })

    console.log("\nCross-industry companies found:")
    crossIndustry.forEach(c => {
        console.log(`  ${c.ticker}: ${c.name} - tags: ${c.value_chain_tags?.join(', ')}`)
    })
}

main()
