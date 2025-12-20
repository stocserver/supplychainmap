
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing environment variables')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface CompanySeed {
    ticker: string
    name: string
    industry: string
    country: string
}

async function seedCompanies() {
    console.log('🌱 Seeding companies from lib/data/companies-seed.json...')

    try {
        const seedDataPath = path.resolve(process.cwd(), 'lib/data/companies-seed.json')
        const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8')) as CompanySeed[]

        console.log(`Found ${seedData.length} companies to seed.`)

        let successCount = 0
        let errorCount = 0

        for (const company of seedData) {
            // Check if company exists first to avoid overwriting existing data if we only want to ensure it exists
            // But usually we want to update the name/industry/country if it changed in the seed file.
            // We use upsert, but we should be careful not to wipe out existing financial data if we just upsert a partial object.

            // Supabase upsert merges columns if we specify onConflict. 
            // However, if we just supply ticker, name, industry, country, it might only update those.
            // Using upsert with explicit columns is safer.

            // First, let's fetch the existing company to check if we need to update anything
            const { data: existing } = await supabase
                .from('companies')
                .select('ticker, name, industry, country')
                .eq('ticker', company.ticker)
                .single()

            if (existing) {
                // Update only if changed
                if (existing.name !== company.name || existing.industry !== company.industry || existing.country !== company.country) {
                    const { error } = await supabase
                        .from('companies')
                        .update({
                            name: company.name,
                            industry: company.industry,
                            country: company.country,
                            updated_at: new Date().toISOString()
                        })
                        .eq('ticker', company.ticker)

                    if (error) {
                        console.error(`❌ Error updating ${company.ticker}:`, error.message)
                        errorCount++
                    } else {
                        console.log(`📝 Updated ${company.ticker} (${company.name})`)
                        successCount++
                    }
                } else {
                    // console.log(`✓ ${company.ticker} is up to date`)
                }
            } else {
                // Insert new company
                const { error } = await supabase
                    .from('companies')
                    .insert({
                        ticker: company.ticker,
                        name: company.name,
                        industry: company.industry,
                        country: company.country,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })

                if (error) {
                    console.error(`❌ Error inserting ${company.ticker}:`, error.message)
                    errorCount++
                } else {
                    console.log(`✨ Inserted ${company.ticker} (${company.name})`)
                    successCount++
                }
            }
        }

        console.log(`\n✅ Seeding complete! Updated/Inserted: ${successCount}, Errors: ${errorCount}`)

    } catch (error) {
        console.error('❌ Error seeding companies:', error)
        process.exit(1)
    }
}

seedCompanies()
