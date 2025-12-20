
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    // Check for downstream companies
    const tickers = ['ADM', 'BG', 'INGR', 'TSN', 'HRL', 'ZTS', 'ELAN']

    const { data } = await supabase
        .from('companies')
        .select('ticker, name, industry')
        .in('ticker', tickers)

    console.log("Downstream company status:")
    tickers.forEach(t => {
        const found = data?.find(c => c.ticker === t)
        if (found) {
            console.log(`  ${t}: ${found.name} - industry: ${found.industry}`)
        } else {
            console.log(`  ${t}: NOT IN DATABASE`)
        }
    })
}

main()
