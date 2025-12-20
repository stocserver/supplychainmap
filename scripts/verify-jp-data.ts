/**
 * Comprehensive verification of JP company data in Supabase
 * Shows distribution across all industries and validates tags
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

// Load valid product IDs for validation
const validProductIds: Record<string, string[]> = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'valid_product_ids_by_industry.json'), 'utf-8')
)

async function main() {
    console.log('🔍 Comprehensive JP Company Verification\n')

    // Fetch all JP companies
    const { data: companies, error } = await supabase
        .from('companies')
        .select('ticker, name, industry, value_chain_tags, country')
        .eq('country', 'JP')

    if (error || !companies) {
        console.error('Error fetching:', error)
        return
    }

    console.log(`Total JP companies in Supabase: ${companies.length}\n`)

    // Group by industry
    const byIndustry: Record<string, any[]> = {}
    companies.forEach(c => {
        const ind = c.industry || 'UNKNOWN'
        if (!byIndustry[ind]) byIndustry[ind] = []
        byIndustry[ind].push(c)
    })

    // Analyze each industry
    console.log('='.repeat(60))
    console.log('INDUSTRY DISTRIBUTION')
    console.log('='.repeat(60))

    const issues: string[] = []

    Object.entries(byIndustry)
        .sort((a, b) => b[1].length - a[1].length)
        .forEach(([industry, cos]) => {
            const hasValidStructure = validProductIds[industry] !== undefined
            const statusIcon = hasValidStructure ? '✅' : '❌'

            console.log(`\n${statusIcon} ${industry}: ${cos.length} companies`)

            if (!hasValidStructure) {
                issues.push(`Industry "${industry}" has no matching .products.ts file!`)
            }

            // Check tags validity
            const allTags = new Set<string>()
            cos.forEach(c => {
                (c.value_chain_tags || []).forEach((t: string) => allTags.add(t))
            })

            const validTags = validProductIds[industry] || []
            const invalidTags = Array.from(allTags).filter(t => !validTags.includes(t))

            if (invalidTags.length > 0) {
                console.log(`   ⚠️  Invalid tags: ${invalidTags.join(', ')}`)
                issues.push(`Industry "${industry}" has invalid tags: ${invalidTags.join(', ')}`)
            }

            // Sample companies
            console.log(`   Sample: ${cos.slice(0, 3).map(c => c.name).join(', ')}${cos.length > 3 ? '...' : ''}`)
        })

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('SUMMARY')
    console.log('='.repeat(60))
    console.log(`Total industries: ${Object.keys(byIndustry).length}`)
    console.log(`Industries with valid structure: ${Object.keys(byIndustry).filter(i => validProductIds[i]).length}`)
    console.log(`Industries WITHOUT structure: ${Object.keys(byIndustry).filter(i => !validProductIds[i]).length}`)

    if (issues.length > 0) {
        console.log('\n⚠️  ISSUES TO FIX:')
        issues.forEach(i => console.log(`   - ${i}`))
    } else {
        console.log('\n✅ All industries and tags are valid!')
    }

    // Save detailed report
    const report = {
        totalCompanies: companies.length,
        byIndustry: Object.fromEntries(
            Object.entries(byIndustry).map(([ind, cos]) => [
                ind,
                {
                    count: cos.length,
                    hasValidStructure: validProductIds[ind] !== undefined,
                    companies: cos.map(c => ({ ticker: c.ticker, name: c.name, tags: c.value_chain_tags }))
                }
            ])
        ),
        issues
    }

    const reportPath = path.resolve(__dirname, 'jp_verification_report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\nDetailed report saved to: ${reportPath}`)
}

main()
