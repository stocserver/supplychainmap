/**
 * Delete all companies that are NOT on NASDAQ or NYSE
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
    console.log('🗑️ Deleting all companies NOT on NASDAQ or NYSE...')

    // Supabase doesn't have a simple "not in" for delete, so we'll select then delete or use filter
    // actually .not('exchange', 'in', '("NASDAQ","NYSE")') might work 
    // but typically filter modifiers are safest with select. 
    // Let's verify what we are deleting first.

    const { data: toDelete, error: fetchError } = await supabase
        .from('companies')
        .select('ticker, name, exchange')
        .not('exchange', 'in', '("NASDAQ","NYSE")')

    if (fetchError) {
        console.error('Error fetching companies to delete:', fetchError)
        return
    }

    if (!toDelete || toDelete.length === 0) {
        console.log('✅ No companies to delete found!')
        return
    }

    console.log(`Found ${toDelete.length} companies to delete:`)
    const exchanges = new Set(toDelete.map(c => c.exchange))
    console.log(`Exchanges being removed: ${Array.from(exchanges).join(', ')}`)

    // Show sample
    console.log('Sample deleted companies:')
    toDelete.slice(0, 5).forEach(c => console.log(` - ${c.name} (${c.ticker}): ${c.exchange}`))

    // Perform Delete
    const tickersToDelete = toDelete.map(c => c.ticker)

    // Batch delete to be safe
    const batchSize = 100
    let deletedCount = 0

    for (let i = 0; i < tickersToDelete.length; i += batchSize) {
        const batch = tickersToDelete.slice(i, i + batchSize)
        const { error } = await supabase
            .from('companies')
            .delete()
            .in('ticker', batch)

        if (error) {
            console.error('Error deleting batch:', error)
        } else {
            deletedCount += batch.length
            process.stdout.write('.')
        }
    }

    console.log(`\n\n✅ Successfully deleted ${deletedCount} companies.`)
}

main()
