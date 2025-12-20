
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log('📊 Counting companies by country...')

    // Fetch all countries
    const { data, error } = await supabase
        .from('companies')
        .select('country, ticker')

    if (error) {
        console.error('Error:', error)
        return
    }

    const counts: Record<string, number> = {}
    let total = 0

    data.forEach(c => {
        const ctry = c.country || 'NULL'
        counts[ctry] = (counts[ctry] || 0) + 1
        total++
    })

    console.table(counts)
    console.log(`Total DB Rows: ${total}`)
}

main()
