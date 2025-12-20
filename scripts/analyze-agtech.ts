
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log("Fetching AgTech companies...")

    const { data: companies, error } = await supabase
        .from('companies')
        .select('ticker, name, industry, value_chain_tags')
        .eq('industry', 'agtech')
        .order('name')

    if (error) {
        console.error("Error:", error)
        return
    }

    console.log(`\nFound ${companies.length} AgTech companies:\n`)

    // Collect all unique tags
    const allTags = new Set<string>()

    companies.forEach(c => {
        console.log(`${c.ticker || 'N/A'} - ${c.name}`)
        console.log(`  Tags: ${JSON.stringify(c.value_chain_tags)}`)

        if (c.value_chain_tags) {
            c.value_chain_tags.forEach((t: string) => allTags.add(t))
        }
    })

    console.log(`\n--- Unique Tags Found (${allTags.size}) ---`)
    Array.from(allTags).sort().forEach(t => console.log(`  - ${t}`))
}

main()
