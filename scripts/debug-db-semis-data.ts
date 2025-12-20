import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log('🔍 Checking Semiconductor Data...\n')

    const { data: companies } = await supabase
        .from('companies')
        .select('ticker, name, category_slug, value_chain_tags')
        .eq('industry', 'semiconductors')
        .limit(20)

    console.log(`Found ${companies?.length} companies (sample):`)
    companies?.forEach(c => {
        console.log(`${c.ticker}: Cat='${c.category_slug}', Tags=[${c.value_chain_tags?.join(', ')}]`)
    })
}

main()
