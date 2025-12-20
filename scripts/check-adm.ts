
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    // Check ADM tags
    const { data } = await supabase
        .from('companies')
        .select('ticker, name, value_chain_tags')
        .eq('ticker', 'ADM')

    console.log("ADM tags:", JSON.stringify(data?.[0]?.value_chain_tags, null, 2))
}

main()
