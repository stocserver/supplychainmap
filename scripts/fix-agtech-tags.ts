
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const fixes = [
    { ticker: 'CTVA', add: ['seed-genetics', 'seeds-biotech'], industry: 'agtech' },
    { ticker: 'BAYRY', add: ['seed-genetics', 'seeds-biotech', 'crop-protection'], industry: 'agtech' },
    { ticker: 'FMC', add: ['crop-protection', 'specialty-nutrients'], industry: 'agtech' }, // Was chemicals
    { ticker: 'SMG', add: ['seeds-biotech'], industry: 'agtech' }
]

async function main() {
    console.log("Fixing AgTech tags...")
    for (const fix of fixes) {
        const { data: company } = await supabase.from('companies').select('value_chain_tags').eq('ticker', fix.ticker).single()
        if (company) {
            const current = company.value_chain_tags || []
            const next = Array.from(new Set([...current, ...fix.add]))
            const updatePayload: any = { value_chain_tags: next }
            if ((fix as any).industry) updatePayload.industry = (fix as any).industry

            const { error } = await supabase.from('companies').update(updatePayload).eq('ticker', fix.ticker)
            if (!error) console.log(`Fixed ${fix.ticker}`)
            else console.error(`Error ${fix.ticker}:`, error)
        } else {
            console.log(`Missing ${fix.ticker}`)
        }
    }
}

main()
