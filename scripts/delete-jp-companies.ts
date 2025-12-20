/**
 * Delete all Japanese companies from Supabase
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log('🗑️ Deleting all Japanese (JP) companies from database...')

    const { count, error } = await supabase
        .from('companies')
        .delete({ count: 'exact' })
        .eq('country', 'JP')

    if (error) {
        console.error('❌ Error deleting companies:', error)
    } else {
        console.log(`✅ Successfully deleted ${count} Japanese companies.`)
    }
}

main()
