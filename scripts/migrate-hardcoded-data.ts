
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { industriesStructure, ValueChainStageProducts, ProductCategory } from '@/lib/data/structure'

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log('🚀 Starting migration of TRUTH (Hardcoded Data) to DB...')
    console.log('   (This will OVERWRITE value_chain_tags for matched companies)')

    // Global Map: Ticker -> { name, country, industry, tags: Set<string> }
    const companyMap = new Map<string, {
        name: string,
        country: string,
        industry: string,
        tags: Set<string>
    }>()

    // 1. Iterate all industries and collect tags
    for (const industry of industriesStructure) {
        const slug = industry.slug
        const productsFilePath = path.resolve(__dirname, `../lib/industries/${slug}.products.ts`)

        if (!fs.existsSync(productsFilePath)) {
            console.log(`⏩ Skipping ${slug} (no file)`)
            continue
        }

        console.log(`📦 Reading ${slug}...`)

        try {
            // Dynamic import
            const module = require(productsFilePath)
            // Find export ending in ProductStages
            const exportKeys = Object.keys(module)
            const stagesKey = exportKeys.find(k => k.endsWith('ProductStages'))

            if (!stagesKey) {
                console.log(`   ⚠️ No ProductStages export in ${slug}`)
                continue
            }

            const stages = module[stagesKey] as ValueChainStageProducts[]

            // Recursive extraction
            const extract = (products: ProductCategory[]) => {
                products.forEach(p => {
                    const tag = p.id // e.g. 'battery-materials'

                    if (p.companiesDetailed) {
                        p.companiesDetailed.forEach(c => {
                            if (!c.ticker) return

                            // If new, init
                            if (!companyMap.has(c.ticker)) {
                                companyMap.set(c.ticker, {
                                    name: c.name,
                                    country: c.country || 'US',
                                    industry: slug, // First industry seen becomes primary (can refine later)
                                    tags: new Set()
                                })
                            }

                            // Add tag
                            if (tag) companyMap.get(c.ticker)!.tags.add(tag)
                        })
                    }

                    if (p.subProducts) extract(p.subProducts)
                })
            }

            stages.forEach(s => extract(s.products))

        } catch (e) {
            console.error(`Error processing ${slug}:`, e)
        }
    }

    console.log(`\n💾 Writing ${companyMap.size} companies to Supabase...`)

    // 2. Batch Update
    const companies = Array.from(companyMap.entries()).map(([ticker, data]) => ({
        ticker,
        name: data.name,
        country: data.country,
        industry: data.industry,
        value_chain_tags: Array.from(data.tags), // The Golden Source of Truth
        is_featured: true
    }))

    let updatedCount = 0
    const BATCH_SIZE = 100

    for (let i = 0; i < companies.length; i += BATCH_SIZE) {
        const batch = companies.slice(i, i + BATCH_SIZE)

        const { error } = await supabase.from('companies').upsert(batch, {
            onConflict: 'ticker',
            ignoreDuplicates: false // We explicitly want to UPDATE/OVERWRITE
        })

        if (error) {
            console.error('\n❌ Upsert error:', error.message)
        } else {
            updatedCount += batch.length
            process.stdout.write('.')
        }
    }

    console.log(`\n\n✅ Done! Updated/Restored ${updatedCount} companies.`)
}

main()
