/**
 * Seed Japanese companies back into Supabase from seed file
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const seedFile = path.resolve(__dirname, '../lib/data/companies-seed.json')

async function main() {
    console.log('🌱 Re-seeding Japanese companies...')

    // Read seed file
    const seedData = JSON.parse(fs.readFileSync(seedFile, 'utf-8'))
    const jpCompanies = seedData.filter((c: any) => c.country === 'JP')

    console.log(`Found ${jpCompanies.length} JP companies in seed file.`)

    // Insert into Supabase
    // Using upsert to handle potential duplicates if any (though we just deleted)
    const { error } = await supabase
        .from('companies')
        .upsert(jpCompanies.map((c: any) => ({
            ...c,
            industry: null, // Reset industry
            value_chain_tags: [] // Reset tags
        })), { onConflict: 'ticker' })

    if (error) {
        console.error('❌ Error re-seeding companies:', error)
    } else {
        console.log(`✅ Successfully re-seeded ${jpCompanies.length} Japanese companies.`)
    }
}

main()
