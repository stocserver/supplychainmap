
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    const { data: companies, error } = await supabase
        .from('companies')
        .select('name, value_chain_tags')
        .eq('industry', 'food-beverage')

    if (error) {
        console.error(error)
        return
    }

    const tagCounts: Record<string, number> = {}
    companies.forEach(c => {
        const tags = c.value_chain_tags || []
        tags.forEach((t: string) => {
            tagCounts[t] = (tagCounts[t] || 0) + 1
        })
    })

    console.log("Tag Distribution for Food & Beverage:")
    Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([tag, count]) => console.log(`${tag}: ${count}`))

    console.log("\nTotal Companies:", companies.length)
}

main()
