
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mapping from product tags to their category
const tagToCategory: Record<string, string> = {
    // Seeds & Biotech (upstream)
    'seeds-biotech': 'seeds-biotech',
    'seed-genetics': 'seeds-biotech',
    'crop-protection': 'seeds-biotech',

    // Fertilizers (upstream)
    'fertilizers': 'fertilizers',
    'commodity-fertilizers': 'fertilizers',
    'specialty-nutrients': 'fertilizers',

    // Ag Equipment (midstream)
    'ag-equipment': 'ag-equipment',
    'tractors-harvesters': 'ag-equipment',
    'planting-equipment': 'ag-equipment',

    // Precision Ag (midstream)
    'precision-ag': 'precision-ag',
    'guidance-systems': 'precision-ag',
    'irrigation-systems': 'precision-ag',
    'farm-software': 'precision-ag',

    // Farming Services (downstream)
    'farming-services': 'farming-services',

    // Food Processing (downstream)
    'food-processing': 'food-processing',
    'grain-processing': 'food-processing',
    'protein-processing': 'food-processing',
}

// Category to Stream mapping
const categoryToStream: Record<string, string> = {
    'seeds-biotech': 'upstream',
    'fertilizers': 'upstream',
    'ag-equipment': 'midstream',
    'precision-ag': 'midstream',
    'farming-services': 'downstream',
    'food-processing': 'downstream',
}

async function main() {
    console.log("Classifying AgTech companies into streams and categories...\n")

    // Fetch all AgTech companies
    const { data: companies, error } = await supabase
        .from('companies')
        .select('ticker, name, value_chain_tags')
        .eq('industry', 'agtech')

    if (error) {
        console.error("Error fetching companies:", error)
        return
    }

    console.log(`Found ${companies.length} AgTech companies\n`)

    for (const company of companies) {
        const tags = company.value_chain_tags || []

        // Find the best category based on tags
        let bestCategory: string | null = null
        let bestStream: string | null = null

        for (const tag of tags) {
            if (tagToCategory[tag]) {
                bestCategory = tagToCategory[tag]
                bestStream = categoryToStream[bestCategory]
                break // Use first matching tag
            }
        }

        if (bestCategory && bestStream) {
            console.log(`${company.ticker} (${company.name}):`)
            console.log(`  Tags: ${tags.join(', ')}`)
            console.log(`  → Stream: ${bestStream}, Category: ${bestCategory}`)

            // Update the company
            const { error: updateError } = await supabase
                .from('companies')
                .update({
                    stream_slug: bestStream,
                    category_slug: bestCategory
                })
                .eq('ticker', company.ticker)

            if (updateError) {
                console.log(`  ❌ Error updating: ${updateError.message}`)
            } else {
                console.log(`  ✅ Updated!`)
            }
        } else {
            console.log(`${company.ticker} (${company.name}):`)
            console.log(`  Tags: ${tags.join(', ')}`)
            console.log(`  ⚠️ No matching category found`)
        }

        console.log('')
    }

    console.log("Done!")
}

main()
