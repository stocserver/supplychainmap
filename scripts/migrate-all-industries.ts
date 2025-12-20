/**
 * Batch migrate ALL industries to database
 * Runs migrate-industry.ts for each industry
 */

import { execSync } from 'child_process'
import path from 'path'

const ALL_INDUSTRIES = [
    'aerospace-defense',
    'agtech',
    'artificial-intelligence',
    'asset-management',
    'automotive',
    'banking',
    'biotechnology',
    'chemicals',
    'cloud-computing',
    'construction-engineering',
    'consumer-electronics',
    'consumer-products',
    'cybersecurity',
    'data-centers',
    'digital-health',
    'ecommerce',
    'electric-vehicles',
    'energy-storage',
    'fintech',
    'food-beverage',
    'heavy-industry',
    'hospitality',
    'insurance',
    'media-entertainment',
    'medical-devices',
    'mining-materials',
    'oil-gas',
    'pharmaceuticals',
    'real-estate',
    'retail',
    'robotics-automation',
    'semiconductors',
    'software-saas',
    'solar-energy',
    'space-technology',
    'telecommunications',
    'transportation-logistics',
    'utilities',
    'wholesale-trading',
]

// Skip already migrated
const ALREADY_MIGRATED = ['agtech', 'semiconductors']

async function main() {
    console.log('🚀 Batch migrating all industries to database...\n')

    const toMigrate = ALL_INDUSTRIES.filter(i => !ALREADY_MIGRATED.includes(i))
    console.log(`Industries to migrate: ${toMigrate.length}`)
    console.log(`Already migrated: ${ALREADY_MIGRATED.join(', ')}\n`)

    let success = 0
    let failed = 0
    const errors: string[] = []

    for (let i = 0; i < toMigrate.length; i++) {
        const industry = toMigrate[i]
        console.log(`\n[${i + 1}/${toMigrate.length}] Migrating ${industry}...`)

        try {
            execSync(`npx tsx scripts/migrate-industry.ts --industry=${industry}`, {
                cwd: path.resolve(__dirname, '..'),
                stdio: 'inherit'
            })
            success++
        } catch (error: any) {
            console.error(`❌ Failed: ${industry}`)
            errors.push(industry)
            failed++
        }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 BATCH MIGRATION SUMMARY')
    console.log('='.repeat(50))
    console.log(`✅ Success: ${success}`)
    console.log(`❌ Failed: ${failed}`)
    if (errors.length > 0) {
        console.log(`\nFailed industries: ${errors.join(', ')}`)
    }

    console.log('\n📝 Next steps:')
    console.log('1. Update DB_DRIVEN_INDUSTRIES to include all migrated industries')
    console.log('2. Verify pages work correctly')
}

main()
