
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log('🕵️ Checking for market_cap data...')

    // Try to select market_cap from a few rows
    const { data, error } = await supabase
        .from('companies')
        .select('ticker, name, market_cap') // Will error if column doesn't exist
        .limit(5)

    if (error) {
        console.error('❌ Error selecting market_cap:', error.message)
        // Check if it's a column error
        return
    }

    console.log('✅ Column exists. Sample data:')
    console.table(data)

    // Check if data is populated
    const populated = data?.filter(r => r.market_cap != null && r.market_cap > 0)
    console.log(`Populated rows in sample: ${populated?.length}/${data?.length}`)
}

main()
