
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log('🗑️  Deleting companies with NO value chain tags (Uncategorized)...')

    // 1. Fetch all companies
    // We can filter in DB query for empty array or null?
    // Supabase filtering on array length is tricky. Easier to fetch and filter.

    // Actually, we can check if array is empty.

    let totalDeleted = 0
    const batchSize = 1000
    let rangeStart = 0

    while (true) {
        const { data: companies, error } = await supabase
            .from('companies')
            .select('ticker, name, value_chain_tags')
            .range(rangeStart, rangeStart + batchSize - 1)

        if (error) {
            console.error('Error fetching:', error)
            break
        }
        if (!companies || companies.length === 0) break

        const toDelete = companies.filter(c => {
            return !c.value_chain_tags || c.value_chain_tags.length === 0
        }).map(c => c.ticker)

        if (toDelete.length > 0) {
            console.log(`Found ${toDelete.length} uncategorized companies in this batch. Deleting...`)

            const { error: delError } = await supabase
                .from('companies')
                .delete()
                .in('ticker', toDelete)

            if (delError) {
                console.error('Error deleting:', delError)
            } else {
                totalDeleted += toDelete.length
                console.log(`   Deleted: ${toDelete.slice(0, 3).join(', ')}...`)
            }
        } else {
            // Only increment range if we didn't delete (shift happens if we delete? No, range is based on query snapshots maybe?)
            // Actually, if we delete, the offsets might shift. 
            // Safest to just process and then... wait.
            // If I delete rows 0-10, the next rows become 0-10.
            // So if I detected deletions, I should NOT increment rangeStart?
            // BUT Supabase query might be consistent?
            // SAFE APPROACH: Just fetch ALL tickers with empty tags.
        }

        // Let's rely on a specific query
        // But assuming we are iterating through pages... 
        // Better: Query specifically for empty tags.
        // We can't easily query "empty array" in Supabase js client simple filters sometimes.
        // Let's just use the JS filter approach but with pagination handling.

        rangeStart += batchSize
    }

    // BETTER APPROACH: Query purely for empty tags using raw filter or check
    // But 'is' null works. Array empty is harder.
    // Let's just do the JS loop.

    console.log(`\n✅ Total Deleted: ${totalDeleted}`)
}

// Actually, let's optimize the loop.
// If we just loop until we find none?
async function robustMain() {
    try {
        console.log('🗑️  Starting Robust Deletion of Uncategorized Companies...')

        let totalDeleted = 0

        while (true) {
            // Fetch ALL companies (might need higher limit or pagination if >1000)
            // default limit is usually 1000 in supabase-js if not specified? 
            // Actually limit is usually 1000. We should explicitly set a high limit or paginate.
            const { data: allCompanies, error } = await supabase
                .from('companies')
                .select('ticker, value_chain_tags')
                .range(0, 9999) // Fetch substantially all

            if (error) {
                console.error('Fetch error:', error)
                throw error
            }

            if (!allCompanies) break

            const toDelete = allCompanies.filter(c => !c.value_chain_tags || c.value_chain_tags.length === 0).map(c => c.ticker)

            if (toDelete.length === 0) {
                console.log('No uncategorized companies found.')
                break
            }

            console.log(`Found ${toDelete.length} total uncategorized companies. Deleting in batches...`)

            // Delete in chunks of 500
            for (let i = 0; i < toDelete.length; i += 500) {
                const batch = toDelete.slice(i, i + 500)
                const { error: delErr } = await supabase
                    .from('companies')
                    .delete()
                    .in('ticker', batch)

                if (delErr) console.error('Deletion error:', delErr)
                else {
                    totalDeleted += batch.length
                    process.stdout.write('.')
                }
            }
            break // Done
        }

        console.log(`\n✅ Operation Complete. Deleted ${totalDeleted} companies.`)
    } catch (err) {
        console.error("CRITICAL ERROR:", err)
    }
}

robustMain()
