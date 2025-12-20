
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    const industry = 'agtech'

    console.log("Testing value chain lookup tables...\n")

    // Fetch streams
    const { data: streams, error: streamsError } = await supabase
        .from('value_chain_streams')
        .select('*')
        .eq('industry', industry)
        .order('sort_order')

    if (streamsError) {
        console.error("Streams error:", streamsError)
        return
    }

    console.log(`Streams (${streams?.length || 0}):`)
    streams?.forEach(s => console.log(`  ${s.id}: ${s.display_name} (${s.slug})`))

    // Fetch categories
    const streamIds = streams?.map(s => s.id) || []
    const { data: categories, error: categoriesError } = await supabase
        .from('value_chain_categories')
        .select('*')
        .in('stream_id', streamIds)
        .order('sort_order')

    if (categoriesError) {
        console.error("Categories error:", categoriesError)
        return
    }

    console.log(`\nCategories (${categories?.length || 0}):`)
    categories?.forEach(c => {
        const stream = streams?.find(s => s.id === c.stream_id)
        console.log(`  ${c.id}: ${c.display_name} (${c.slug}) → ${stream?.display_name}`)
    })

    // Fetch products
    const categoryIds = categories?.map(c => c.id) || []
    const { data: products, error: productsError } = await supabase
        .from('value_chain_products')
        .select('*')
        .in('category_id', categoryIds)
        .order('sort_order')

    if (productsError) {
        console.error("Products error:", productsError)
        return
    }

    console.log(`\nProducts (${products?.length || 0}):`)
    products?.forEach(p => {
        const cat = categories?.find(c => c.id === p.category_id)
        console.log(`  ${p.id}: ${p.display_name} (${p.slug}) → ${cat?.display_name}`)
    })

    // Fetch companies
    const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('ticker, name, stream_slug, category_slug')
        .eq('industry', industry)

    if (companiesError) {
        console.error("Companies error:", companiesError)
        return
    }

    console.log(`\nCompanies (${companies?.length || 0}):`)
    companies?.forEach(c => {
        console.log(`  ${c.ticker}: ${c.name} → ${c.stream_slug}/${c.category_slug}`)
    })

    console.log("\n✅ All lookups successful!")
}

main()
