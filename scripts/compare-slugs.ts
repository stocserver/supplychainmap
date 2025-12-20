/**
 * Compare industry slugs across: 
 * 1. DB (what companies have)
 * 2. Structure.ts (what frontend uses for cards)
 * 3. Products files (what LLM classifier references)
 */

import { industriesStructure } from '../lib/data/structure'
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
    console.log('=== SLUG COMPARISON REPORT ===\n')

    // 1. Get slugs from structure.ts (frontend)
    const frontendSlugs = new Set(industriesStructure.map(i => i.slug))
    console.log(`Frontend structure.ts has ${frontendSlugs.size} industries:`)
    console.log([...frontendSlugs].sort().join(', '))
    console.log()

    // 2. Get slugs from valid_product_ids (LLM reference)
    const productIdsFile = path.resolve(__dirname, 'valid_product_ids_by_industry.json')
    const productIds: Record<string, string[]> = JSON.parse(fs.readFileSync(productIdsFile, 'utf-8'))
    const llmSlugs = new Set(Object.keys(productIds))
    console.log(`LLM reference (products files) has ${llmSlugs.size} industries:`)
    console.log([...llmSlugs].sort().join(', '))
    console.log()

    // 3. Get slugs from DB (JP companies)
    const { data: jpCompanies } = await supabase
        .from('companies')
        .select('industry')
        .eq('country', 'JP')

    const dbSlugs = new Set<string>()
    const dbSlugCounts: Record<string, number> = {}
    jpCompanies?.forEach(c => {
        if (c.industry) {
            dbSlugs.add(c.industry)
            dbSlugCounts[c.industry] = (dbSlugCounts[c.industry] || 0) + 1
        }
    })
    console.log(`DB (JP companies) uses ${dbSlugs.size} unique industry slugs:`)
    Object.entries(dbSlugCounts).sort((a, b) => b[1] - a[1]).forEach(([slug, count]) => {
        console.log(`  ${slug}: ${count}`)
    })
    console.log()

    // 4. Find mismatches
    console.log('=== MISMATCHES ===\n')

    // Slugs in DB but NOT in frontend structure
    const dbNotInFrontend = [...dbSlugs].filter(s => !frontendSlugs.has(s))
    if (dbNotInFrontend.length > 0) {
        console.log('❌ DB slugs NOT in frontend structure (companies will not show on cards):')
        dbNotInFrontend.forEach(s => console.log(`   - "${s}" (${dbSlugCounts[s]} JP companies)`))
        console.log()
    } else {
        console.log('✅ All DB slugs exist in frontend structure\n')
    }

    // Slugs in LLM reference but NOT in frontend
    const llmNotInFrontend = [...llmSlugs].filter(s => !frontendSlugs.has(s))
    if (llmNotInFrontend.length > 0) {
        console.log('⚠️  LLM reference slugs NOT in frontend structure:')
        llmNotInFrontend.forEach(s => console.log(`   - "${s}"`))
        console.log()
    }

    // Frontend slugs NOT in LLM reference (LLM can't assign to these)
    const frontendNotInLlm = [...frontendSlugs].filter(s => !llmSlugs.has(s))
    if (frontendNotInLlm.length > 0) {
        console.log('⚠️  Frontend slugs that LLM cannot assign (no products file):')
        frontendNotInLlm.forEach(s => console.log(`   - "${s}"`))
    }
}

main()
