
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
        .select('ticker, name, value_chain_tags, updated_at, industry')
        .ilike('name', '%Bayer%')

    if (error) {
        console.error(error)
        return
    }

    companies.forEach(c => {
        console.log(`\n${c.name} (${c.ticker}):`)
        console.log(`  Industry: '${c.industry}'`)
        console.log(`  Tags: ${JSON.stringify(c.value_chain_tags)}`)
    })
}

main()
