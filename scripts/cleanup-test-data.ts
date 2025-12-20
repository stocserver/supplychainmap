
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const TEST_CATEGORY_SLUGS = [
    'test-category-verify',
    'test-mid-svc',
    'test-down-apps',
    'test-up-proto',
    'test-up-proto-cat',
    'test-mid-net-cat',
    'test-down-sol-cat'
]

async function main() {
    console.log('🧹 STARTING TEST DATA CLEANUP\n')

    // 1. Delete Companies
    console.log('--- Companies ---')
    // Delete by category slug
    const { data: result, error: coErr } = await sb.from('companies')
        .delete()
        .in('category_slug', TEST_CATEGORY_SLUGS)
        .select('ticker')

    if (coErr) console.error('❌ Company Delete Error:', coErr)
    else console.log(`✅ Deleted ${result?.length || 0} companies by category.`)

    // Explicit delete for original test company if category slug mismatch
    const { error: coErr2 } = await sb.from('companies')
        .delete()
        .eq('ticker', 'TESTCO')

    if (coErr2) console.error('❌ Company Delete Error (TESTCO):', coErr2)
    else console.log(`✅ Deleted TESTCO (if existed).`)


    // 2. Find Category IDs (needed for products)
    const { data: categories } = await sb.from('value_chain_categories')
        .select('id, slug')
        .in('slug', TEST_CATEGORY_SLUGS)

    if (!categories || categories.length === 0) {
        console.log('✅ No categories found, cleanup done.')
        return
    }

    const catIds = categories.map(c => c.id)
    console.log(`\nFound ${catIds.length} categories to purge: ${categories.map(c => c.slug).join(', ')}`)

    // 3. Delete Products
    console.log('\n--- Products ---')
    const { error: prodErr } = await sb.from('value_chain_products')
        .delete()
        .in('category_id', catIds)

    if (prodErr) console.error('❌ Product Delete Error:', prodErr)
    else console.log(`✅ Deleted products linked to test categories.`)

    // 4. Delete Categories
    console.log('\n--- Categories ---')
    const { error: catErr } = await sb.from('value_chain_categories')
        .delete()
        .in('id', catIds)

    if (catErr) console.error('❌ Category Delete Error:', catErr)
    else console.log(`✅ Deleted ${catIds.length} categories.`)

    console.log('\n✨ Cleanup complete.')
}

main()
