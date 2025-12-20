/**
 * Fix UAL and ALK Stream Slug
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
    console.log('🔍 Checking UAL and ALK Stream...')

    const { data } = await supabase
        .from('companies')
        .select('ticker, stream_slug')
        .in('ticker', ['UAL', 'ALK'])

    console.log(JSON.stringify(data, null, 2))

    // Fix them
    const { error } = await supabase
        .from('companies')
        .update({ stream_slug: 'downstream' })
        .in('ticker', ['UAL', 'ALK'])

    if (!error) {
        console.log('✅ Fixed stream_slug to downstream.')
    } else {
        console.error('❌ Error fixing stream:', error)
    }
}

main()
