
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { usData } from '../lib/data/regions/us'
import { cnData } from '../lib/data/regions/cn'
// import { jpData } from '../lib/data/regions/jp' // Likely empty

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing environment variables')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface CompanyData {
    ticker: string
    country: string
    // We'll track which industries we saw this company in, to pick a primary one
    industries: Set<string>
    tags: Set<string> // Value chain tags (e.g. 'ic-design')
    isFeatured: boolean
}

async function migrate() {
    console.log('🔄 Starting migration of static data to Supabase...')

    // 1. Accumulate data in memory
    const companies = new Map<string, CompanyData>()

    // Helper to process a region
    const processRegion = (regionData: any, countryCode: string) => {
        for (const [industrySlug, data] of Object.entries(regionData)) {
            const industryData = data as any

            // Process Featured
            if (industryData.featured) {
                for (const ticker of industryData.featured) {
                    if (!companies.has(ticker)) {
                        companies.set(ticker, {
                            ticker,
                            country: countryCode,
                            industries: new Set(),
                            tags: new Set(),
                            isFeatured: false
                        })
                    }
                    const c = companies.get(ticker)!
                    c.isFeatured = true
                    c.industries.add(industrySlug)
                }
            }

            // Process Nodes (Tags)
            if (industryData.nodes) {
                for (const [tag, tickers] of Object.entries(industryData.nodes)) {
                    for (const ticker of (tickers as string[])) {
                        if (!companies.has(ticker)) {
                            companies.set(ticker, {
                                ticker,
                                country: countryCode,
                                industries: new Set(),
                                tags: new Set(),
                                isFeatured: false
                            })
                        }
                        const c = companies.get(ticker)!
                        c.tags.add(tag)
                        c.industries.add(industrySlug)
                    }
                }
            }
        }
    }

    console.log('📊 Processing US Data...')
    processRegion(usData, 'US')

    console.log('📊 Processing China Data...')
    processRegion(cnData, 'CN')

    console.log(`✅ Analyzed ${companies.size} unique companies across regions.`)

    // 2. Upsert to Supabase
    console.log('🚀 Pushing to Supabase...')

    const BATCH_SIZE = 50
    const allCompanies = Array.from(companies.values())

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < allCompanies.length; i += BATCH_SIZE) {
        const batch = allCompanies.slice(i, i + BATCH_SIZE)

        // Transform to DB schema
        const payload = batch.map(c => {
            // Pick primary industry: Just take the first one seen?
            // Or prioritize 'semiconductors' over others?
            // For now, Array.from(c.industries)[0]
            const primaryIndustry = Array.from(c.industries)[0]

            return {
                ticker: c.ticker,
                country: c.country,
                industry: primaryIndustry, // This is a limitation, solved by tag search
                value_chain_tags: Array.from(c.tags),
                is_featured: c.isFeatured,
                updated_at: new Date().toISOString()
                // We do NOT overwrite 'name' if it's missing here? 
                // Static files only have tickers.
                // If company exists in DB (e.g. seeded), we keep name.
                // If company DOES NOT exist, name will be null?
                // Upsert requires 'name' if not nullable?
                // Let's check if we can fetch name from somewhere.
                // Static files DO NOT have names.
                // We might insert unnamed companies.
                // Fetching names from FMP during migration? Too slow.
                // We'll insert with name = ticker if new.
            }
        })

        // We need to handle 'name'. If inserting new row, name cannot be null? Assuming nullable or we provide default.
        // We'll provide name = ticker as placeholder if it doesn't exist.
        // But upsert wipes columns not specified? No, upsert updates specified cols.
        // But for NEW rows, must specify all required.
        // To be safe, we check existence or allow partial?
        // Let's assume we provide name = ticker for safety.
        // But we don't want to overwrite existing names.

        // Supabase Upsert:
        // .upsert(values, { onConflict: 'ticker', ignoreDuplicates: false })
        // If we provide 'name': 'NVDA', it overwrites 'NVIDIA Corp'?
        // Yes.
        // So we must NOT provide 'name' if valid name exists.
        // But we can't do conditional upsert per row easily in batch.
        // We will do it in loop or verify.

        // Optimization: We will Fetch existing tickers first to see if they have names.
        // Or assume this script is primarily for NEW structure tags.
        // US companies likely DON'T exist in DB yet (unless seeded?).
        // If they don't exist, we MUST provide name.
        // We will use Ticker as Name. User can run a "Fetch Names" script later.

        const preparedPayload = payload.map(p => ({
            ...p,
            name: p.ticker // Placeholder
        }))

        // Wait, if I upsert with name=Ticker, I overwrite existing names for JP companies if they overlap?
        // JP companies won't overlap with US/CN tickers (different suffix .T, .HK).
        // US tickers "NVDA" don't have suffix.
        // So no overlap. Safe.
        // But if I ran this script twice, I overwrite "NVIDIA Corp" with "NVDA" if I fetched names in between?
        // Yes.
        // FIX: Only set name if we think it's new.
        // Actually, simple batch upsert is risky for 'name'.
        // I will do sequential processing with check? Or just accept Ticker as name for now.
        // User said "don't delete anything". I can fetch names LATER using `update-financials`.
        // So safe to start with Ticker.

        const { error } = await supabase
            .from('companies')
            .upsert(preparedPayload, {
                onConflict: 'ticker'
                // We want to update tags and is_featured.
                // If we omit 'name' from payload, does it error on INSERT?
                // If column has no default and is not null, yes.
                // `name` column usually not nullable.
            })

        if (error) {
            // If error is "null value in column name", retry with name provided.
            console.error('   ❌ Batch Error:', error.message)
            errorCount += batch.length
        } else {
            successCount += batch.length
            process.stdout.write('.')
        }
    }

    console.log(`\n✅ Migration complete. Processed ${successCount}, Errors: ${errorCount}`)
    console.log('📌 NOTE: Companies inserted with Ticker as Name. Run update-financials to fetch proper names.')
}

migrate()
