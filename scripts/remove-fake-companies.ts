/**
 * Remove fake test companies from the database
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// List of fake test companies to remove
const fakeCompanyTickers = [
    // Heavy industry fake companies
    'HEAVY1', 'HEAVY2', 'HEAVY3',
    'HEAVY4', 'HEAVY5', 'HEAVY6',
    'HEAVY7', 'HEAVY8', 'HEAVY9',
    // Space Agriculture test company
    'SPACX'
]

async function main() {
    console.log('🗑️ Removing fake test companies...\n')

    for (const ticker of fakeCompanyTickers) {
        const { error } = await supabase
            .from('companies')
            .delete()
            .eq('ticker', ticker)

        if (error) {
            console.log(`❌ ${ticker}: ${error.message}`)
        } else {
            console.log(`✅ Deleted: ${ticker}`)
        }
    }

    console.log('\n✅ Done!')
}

main()
