/**
 * Fix UAL and ALK categories
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
    console.log('🔍 Checking UAL and ALK...')

    const { data } = await supabase
        .from('companies')
        .select('ticker, category_slug, value_chain_tags')
        .in('ticker', ['UAL', 'ALK'])

    console.log(JSON.stringify(data, null, 2))

    if (!data) return

    // Fix them if wrong
    const updates = []
    for (const co of data) {
        if (co.category_slug !== 'airlines') {
            console.log(`🛠️ Fixing ${co.ticker}... changing '${co.category_slug}' to 'airlines'`)
            updates.push(
                supabase.from('companies')
                    .update({ category_slug: 'airlines', value_chain_tags: ['legacy-carriers'] })
                    .eq('ticker', co.ticker)
            )
        }
    }

    if (updates.length > 0) {
        await Promise.all(updates)
        console.log('✅ Fixes applied.')
    } else {
        console.log('✅ No fixes needed (already incorrect? check tags).')
    }
}

main()
