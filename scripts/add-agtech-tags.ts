
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Map of tickers to their AgTech-related tags to add
const tagsToAdd: Record<string, string[]> = {
    // Farming Services
    'ADM': ['farming-services', 'food-processing', 'grain-processing'],
    'BG': ['farming-services', 'food-processing', 'grain-processing'],
    'INGR': ['farming-services', 'food-processing', 'grain-processing'],

    // Protein Processing
    'TSN': ['food-processing', 'protein-processing'],
    'HRL': ['food-processing', 'protein-processing'],

    // Animal Health
    'ZTS': ['animal-health', 'animal-pharma'],
    'ELAN': ['animal-health', 'animal-pharma'],
}

async function main() {
    console.log("Adding AgTech-related tags to cross-industry companies...\n")

    for (const [ticker, newTags] of Object.entries(tagsToAdd)) {
        // Get current tags
        const { data: company } = await supabase
            .from('companies')
            .select('ticker, name, value_chain_tags')
            .eq('ticker', ticker)
            .single()

        if (!company) {
            console.log(`${ticker}: Not found in database`)
            continue
        }

        // Merge new tags with existing tags
        const existingTags = company.value_chain_tags || []
        const mergedTags = [...new Set([...existingTags, ...newTags])]

        // Update
        const { error } = await supabase
            .from('companies')
            .update({ value_chain_tags: mergedTags })
            .eq('ticker', ticker)

        if (error) {
            console.log(`${ticker}: Error - ${error.message}`)
        } else {
            console.log(`${ticker} (${company.name}): Added tags ${newTags.join(', ')}`)
        }
    }

    console.log("\n✅ Done!")
}

main()
