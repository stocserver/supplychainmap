
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    const THRESHOLD = 300_000_000 // 300 Million
    console.log(`🗑️  Deleting companies with market_cap < $${THRESHOLD.toLocaleString()}...`)

    try {
        // Fetch count first
        const { count, error: countError } = await supabase
            .from('companies')
            .select('*', { count: 'exact', head: true })
            .lt('market_cap', THRESHOLD)
            .not('market_cap', 'is', null) // Only check known small caps

        if (countError) throw countError

        console.log(`Found ${count} companies below threshold.`)

        if (count === 0) {
            console.log("No companies to delete.")
            return
        }

        // Delete matches
        const { error: delError } = await supabase
            .from('companies')
            .delete()
            .lt('market_cap', THRESHOLD)
            .not('market_cap', 'is', null)

        if (delError) throw delError

        console.log(`✅ Deleted ${count} companies.`)

    } catch (err) {
        console.error("Error:", err)
    }
}

main()
