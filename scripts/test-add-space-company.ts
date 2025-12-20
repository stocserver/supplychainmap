
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log("Adding fake Space Agriculture company to test database-driven flow...\n")

    // Step 1: Add new category "Space Ag Equipment" under midstream
    console.log("1. Adding 'Space Ag Equipment' category...")

    // First get the midstream stream_id
    const { data: streams } = await supabase
        .from('value_chain_streams')
        .select('id')
        .eq('industry', 'agtech')
        .eq('slug', 'midstream')

    const midstream = streams?.[0]

    if (!midstream) {
        console.error("Could not find midstream stream!")
        return
    }

    const { data: newCategory, error: catError } = await supabase
        .from('value_chain_categories')
        .upsert({
            stream_id: midstream.id,
            slug: 'space-ag-equipment',
            display_name: 'Space Ag Equipment',
            description: 'Equipment for space-based agriculture',
            sort_order: 10
        }, { onConflict: 'stream_id,slug' })
        .select()
        .single()

    if (catError) {
        console.error("Error adding category:", catError)
        return
    }
    console.log("   ✅ Category added:", newCategory?.display_name)

    // Step 2: Add new product "Space Tractor" under the new category
    console.log("\n2. Adding 'Space Tractor' product...")

    const { data: category } = await supabase
        .from('value_chain_categories')
        .select('id')
        .eq('slug', 'space-ag-equipment')
        .single()

    const { data: newProduct, error: prodError } = await supabase
        .from('value_chain_products')
        .upsert({
            category_id: category?.id,
            slug: 'space-tractor',
            display_name: 'Space Tractor',
            description: 'Tractors designed for extraterrestrial farming',
            sort_order: 1
        }, { onConflict: 'category_id,slug' })
        .select()
        .single()

    if (prodError) {
        console.error("Error adding product:", prodError)
        return
    }
    console.log("   ✅ Product added:", newProduct?.display_name)

    // Step 3: Add the fake company
    console.log("\n3. Adding 'Space Agriculture Company X'...")

    const { error: companyError } = await supabase
        .from('companies')
        .upsert({
            ticker: 'SPACX',
            name: 'Space Agriculture Company X',
            industry: 'agtech',
            country: 'US',
            stream_slug: 'midstream',
            category_slug: 'space-ag-equipment',
            value_chain_tags: ['space-ag-equipment', 'space-tractor']
        }, { onConflict: 'ticker' })

    if (companyError) {
        console.error("Error adding company:", companyError)
        return
    }
    console.log("   ✅ Company added: Space Agriculture Company X (SPACX)")

    // Step 4: Verify by calling the API logic
    console.log("\n4. Verifying the company appears in the structure...")

    const { data: companies } = await supabase
        .from('companies')
        .select('ticker, name, stream_slug, category_slug, value_chain_tags')
        .eq('ticker', 'SPACX')
        .single()

    console.log("   Company in DB:", companies)

    console.log("\n✅ Test complete! Now check http://localhost:3000/api/value-chain?industry=agtech")
    console.log("   You should see 'Space Ag Equipment' category with 'Space Agriculture Company X' inside.")
}

main()
