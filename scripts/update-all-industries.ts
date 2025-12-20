/**
 * Batch Update ALL industries
 * 1. Migrate Structure (migrate-industry.ts)
 * 2. Seed Companies (seed-industry-companies.ts)
 * 3. Classify Companies (reclassify-industry-generic.ts)
 */

import { execSync } from 'child_process'
import path from 'path'

// LIST OF ALL INDUSTRIES TO PROCESS
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

// Industries to SKIP (e.g. if they are known to be broken or fully manual)
const SKIP: string[] = []

async function main() {
    const args = process.argv.slice(2)
    const targetArg = args.find(a => a.startsWith('--industry='))?.split('=')[1]
    const stepArg = args.find(a => a.startsWith('--step='))?.split('=')[1] // migrate, seed, classify

    console.log('🚀 MASTER UPDATE: Validating & Updating Industries...\n')

    let toProcess = ALL_INDUSTRIES.filter(i => !SKIP.includes(i))

    if (targetArg) {
        if (ALL_INDUSTRIES.includes(targetArg)) {
            toProcess = [targetArg]
            console.log(`🎯 Targeting single industry: ${targetArg}`)
        } else {
            console.error(`❌ Unknown industry: ${targetArg}`)
            process.exit(1)
        }
    }

    console.log(`Target Industries: ${toProcess.length}\n`)

    let success = 0
    let failed = 0
    const errors: { industry: string, step: string, msg: string }[] = []

    for (let i = 0; i < toProcess.length; i++) {
        const industry = toProcess[i]
        console.log(`\n---------------------------------------------------------`)
        console.log(`[${i + 1}/${toProcess.length}] Processing: ${industry.toUpperCase()}`)
        console.log(`---------------------------------------------------------`)

        try {
            // STEP 1: MIGRATE STRUCTURE
            if (!stepArg || stepArg === 'migrate') {
                console.log(`\n📦 Step 1: Migration (Structure)...`)
                execSync(`npx tsx scripts/migrate-industry.ts --industry=${industry}`, {
                    cwd: path.resolve(__dirname, '..'),
                    stdio: 'inherit'
                })
            }

            // STEP 2: SEED COMPANIES
            if (!stepArg || stepArg === 'seed') {
                console.log(`\n🌱 Step 2: Seeding (Companies)...`)
                try {
                    execSync(`npx tsx scripts/seed-industry-companies.ts --industry=${industry}`, {
                        cwd: path.resolve(__dirname, '..'),
                        stdio: 'inherit'
                    })
                } catch (e) {
                    console.warn(`  ⚠️ Seeding warning (check if file exists): ${industry}`)
                }
            }

            // STEP 3: RECLASSIFY
            if (!stepArg || stepArg === 'classify') {
                console.log(`\n🤖 Step 3: Classification (LLM)...`)
                execSync(`npx tsx scripts/reclassify-industry-generic.ts --industry=${industry}`, {
                    cwd: path.resolve(__dirname, '..'),
                    stdio: 'inherit'
                })
            }

            success++
            console.log(`\n✅ ${industry} COMPLETE.`)

        } catch (error: any) {
            console.error(`\n❌ Failed: ${industry}`)
            errors.push({ industry, step: 'Unknown', msg: error.message })
            failed++
        }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 MASTER UPDATE SUMMARY')
    console.log('='.repeat(50))
    console.log(`✅ Success: ${success}`)
    console.log(`❌ Failed: ${failed}`)
    if (errors.length > 0) {
        console.log(`\nFailures:`)
        errors.forEach(e => console.log(`- ${e.industry}: ${e.msg}`))
    }
}

main()
