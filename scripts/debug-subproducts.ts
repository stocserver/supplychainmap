
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

    // Fetch products for food-processing
    const { data: foodProcessingCat } = await supabase
        .from('value_chain_categories')
        .select('id, slug, display_name')
        .eq('slug', 'food-processing')

    console.log("Food Processing category:", foodProcessingCat)

    if (foodProcessingCat?.[0]) {
        const { data: subProducts } = await supabase
            .from('value_chain_products')
            .select('*')
            .eq('category_id', foodProcessingCat[0].id)

        console.log("\nSub-products under Food Processing:")
        subProducts?.forEach(p => console.log(`  ${p.slug}: ${p.display_name}`))
    }

    // Check companies with grain-processing tag
    const { data: grainCompanies } = await supabase
        .from('companies')
        .select('ticker, name, value_chain_tags')
        .contains('value_chain_tags', ['grain-processing'])

    console.log("\nCompanies with grain-processing tag:")
    grainCompanies?.forEach(c => console.log(`  ${c.ticker}: ${c.name}`))
}

main()
