
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Map of tickers to their sub-product level tags
const subProductTags: Record<string, string[]> = {
    // Grain & Oilseed Processing
    'ADM': ['grain-processing'],  // Already has it
    'BG': ['grain-processing'],   // Already has it
    'INGR': ['grain-processing'], // Already has it

    // Protein Processing  
    'TSN': ['protein-processing'],  // Already has it
    'HRL': ['protein-processing'],  // Already has it

    // Animal Health sub-products
    'ZTS': ['animal-pharma', 'livestock-management'],
    'ELAN': ['animal-pharma', 'livestock-management'],

    // More food processing companies that might need grain-processing
    'LW': ['grain-processing'],  // Lamb Weston - potato processing
}

async function main() {
    console.log("Adding sub-product level tags to companies...\n")

    for (const [ticker, newTags] of Object.entries(subProductTags)) {
        const { data: company } = await supabase
            .from('companies')
            .select('ticker, name, value_chain_tags')
            .eq('ticker', ticker)
            .single()

        if (!company) {
            console.log(`${ticker}: Not found`)
            continue
        }

        const existingTags = company.value_chain_tags || []
        const tagsToAdd = newTags.filter(t => !existingTags.includes(t))

        if (tagsToAdd.length === 0) {
            console.log(`${ticker} (${company.name}): Already has all tags`)
            continue
        }

        const mergedTags = [...existingTags, ...tagsToAdd]

        const { error } = await supabase
            .from('companies')
            .update({ value_chain_tags: mergedTags })
            .eq('ticker', ticker)

        if (error) {
            console.log(`${ticker}: Error - ${error.message}`)
        } else {
            console.log(`${ticker} (${company.name}): Added ${tagsToAdd.join(', ')}`)
        }
    }

    console.log("\n✅ Done!")
}

main()
