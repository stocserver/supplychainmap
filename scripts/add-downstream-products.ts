
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log("Adding downstream products to lookup tables...\n")

    // Get downstream stream id
    const { data: streams } = await supabase
        .from('value_chain_streams')
        .select('id')
        .eq('industry', 'agtech')
        .eq('slug', 'downstream')

    const stream = streams?.[0]
    if (!stream) {
        console.error("Downstream stream not found!")
        return
    }
    console.log('Downstream stream ID:', stream.id)

    // Add Animal Health category
    const { data: animalHealth, error: ahError } = await supabase
        .from('value_chain_categories')
        .upsert({
            stream_id: stream.id,
            slug: 'animal-health',
            display_name: 'Animal Health',
            description: 'Livestock health and management',
            sort_order: 3
        }, { onConflict: 'stream_id,slug' })
        .select()

    if (ahError) console.error("Animal Health error:", ahError)
    console.log('Animal Health category added:', animalHealth?.[0]?.id)

    // Add products for Animal Health
    if (animalHealth?.[0]) {
        await supabase.from('value_chain_products').upsert([
            { category_id: animalHealth[0].id, slug: 'animal-pharma', display_name: 'Animal Pharmaceuticals & Vaccines', sort_order: 1 },
            { category_id: animalHealth[0].id, slug: 'livestock-management', display_name: 'Livestock Management Solutions', sort_order: 2 }
        ], { onConflict: 'category_id,slug' })
        console.log('Animal Health products added')
    }

    // Add products for Food Processing
    const { data: foodProc } = await supabase
        .from('value_chain_categories')
        .select('id')
        .eq('slug', 'food-processing')

    if (foodProc?.[0]) {
        await supabase.from('value_chain_products').upsert([
            { category_id: foodProc[0].id, slug: 'grain-processing', display_name: 'Grain & Oilseed Processing', sort_order: 1 },
            { category_id: foodProc[0].id, slug: 'protein-processing', display_name: 'Protein Processing', sort_order: 2 }
        ], { onConflict: 'category_id,slug' })
        console.log('Food Processing products added')
    }

    console.log('\n✅ Done!')
}

main()
