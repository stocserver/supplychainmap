/**
 * Audit Database Companies
 * Outputs a summary of companies per industry and a detailed JSON file.
 * 
 * Usage: npx tsx scripts/audit-db-companies.ts
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

async function main() {
    console.log('📊 Auditing Database Companies...\n')

    let companies: any[] = []
    let from = 0
    const batchSize = 1000

    process.stdout.write('Fetching companies')
    while (true) {
        const { data, error } = await supabase
            .from('companies')
            .select('name, ticker, industry, category_slug, value_chain_tags')
            .order('industry')
            .range(from, from + batchSize - 1)

        if (error) {
            console.error('Error fetching companies:', error.message)
            return
        }

        if (data && data.length > 0) {
            companies = [...companies, ...data]
            process.stdout.write('.')
            if (data.length < batchSize) break
        } else {
            break
        }
        from += batchSize
    }
    console.log('\n')

    // 1. Calculate Counts
    const counts: Record<string, number> = {}
    let unknownCount = 0

    for (const co of companies) {
        const ind = co.industry || 'Unknown'
        counts[ind] = (counts[ind] || 0) + 1
    }

    console.log('--- Industry Counts ---')
    const sortedIndustries = Object.entries(counts).sort((a, b) => b[1] - a[1])
    for (const [ind, count] of sortedIndustries) {
        console.log(`${ind.padEnd(30)}: ${count}`)
    }
    console.log('-----------------------')
    console.log(`Total Companies: ${companies.length}`)

    // 2. Prepare Detailed Output
    const output = {
        summary: counts,
        details: companies.map(c => ({
            ticker: c.ticker,
            name: c.name,
            industry: c.industry || 'Unknown',
            category: c.category_slug,
            tags: c.value_chain_tags
        }))
    }

    // 3. Write to File
    const outputPath = path.resolve(__dirname, '../db_audit_summary.json')
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))

    console.log(`\n✅ Detailed audit saved to: ${outputPath}`)
}

main()
