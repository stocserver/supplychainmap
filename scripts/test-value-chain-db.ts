/**
 * Test the value-chain-db.ts logic directly
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
    const industry = 'agtech'

    // Fetch streams
    const { data: streams } = await supabase
        .from('value_chain_streams')
        .select('*')
        .eq('industry', industry)
        .order('sort_order')

    console.log(`Streams: ${streams?.length}`)

    // Fetch categories  
    const { data: categories } = await supabase
        .from('value_chain_categories')
        .select('*')
        .in('stream_id', streams?.map(s => s.id) || [])
        .order('sort_order')

    console.log(`Categories: ${categories?.length}`)

    // Fetch products
    const { data: products } = await supabase
        .from('value_chain_products')
        .select('*')
        .in('category_id', categories?.map(c => c.id) || [])
        .order('sort_order')

    console.log(`Products: ${products?.length}`)

    // Collect all slugs
    const allSlugs = [
        ...(categories || []).map(c => c.slug),
        ...(products || []).map(p => p.slug)
    ]
    console.log(`All slugs: ${allSlugs.join(', ')}`)

    // Primary companies
    const { data: primaryCompanies } = await supabase
        .from('companies')
        .select('ticker, name, value_chain_tags')
        .eq('industry', industry)

    console.log(`\nPrimary (industry=agtech): ${primaryCompanies?.length}`)

    // Cross-industry companies
    const { data: allCompanies } = await supabase
        .from('companies')
        .select('ticker, name, value_chain_tags')
        .neq('industry', industry)
        .limit(500)

    const crossIndustry = (allCompanies || []).filter(co => {
        const tags = co.value_chain_tags || []
        return tags.some((t: string) => allSlugs.includes(t))
    })

    console.log(`Cross-industry: ${crossIndustry.length}`)

    // Combined
    const companies = [...(primaryCompanies || []), ...crossIndustry]
    console.log(`Total companies: ${companies.length}`)

    // Now check food-processing sub-products
    const foodProcessing = categories?.find(c => c.slug === 'food-processing')
    console.log(`\nFood Processing category ID: ${foodProcessing?.id}`)

    const foodSubProducts = products?.filter(p => p.category_id === foodProcessing?.id)
    console.log(`Food Processing sub-products: ${foodSubProducts?.map(p => p.slug).join(', ')}`)

    // Check companies matching grain-processing
    const grainProcessingProduct = foodSubProducts?.find(p => p.slug === 'grain-processing')
    console.log(`\nGrain Processing product ID: ${grainProcessingProduct?.id}`)

    const grainCompanies = companies.filter(co =>
        (co.value_chain_tags || []).includes('grain-processing')
    )
    console.log(`Companies with grain-processing tag: ${grainCompanies.length}`)
    grainCompanies.forEach(c => console.log(`  ${c.ticker}: ${c.name}`))
}

main()
