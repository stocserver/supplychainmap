/**
 * Fix Broken Stage Keys
 * Reverts the 'stage' property to 'upstream'/'midstream'/'downstream' 
 * while keeping the descriptive 'stageLabel'.
 * 
 * Usage: npx tsx scripts/fix-broken-stages.ts
 */

import fs from 'fs'
import path from 'path'

const INDUSTRIES_DIR = path.resolve(__dirname, '../lib/industries')

async function fixFile(filename: string) {
    const filePath = path.join(INDUSTRIES_DIR, filename)
    let content = fs.readFileSync(filePath, 'utf-8')

    // We assume the structure is:
    // export const ... = [
    //   { stage: '...', stageLabel: '...' },  <-- Index 0 = Upstream
    //   { stage: '...', stageLabel: '...' },  <-- Index 1 = Midstream
    //   { stage: '...', stageLabel: '...' }   <-- Index 2 = Downstream
    // ]

    // Regex is tricky because of nested objects.
    // Instead, we can look for the "stage: '...'" pattern and replace them sequentially?
    // Or just look for `stage: 'Anything that is not upstream/midstream/downstream'`?

    // Better approach: Read file, find `stage: '...'` occurrences.
    // Replace the first one with `stage: 'upstream'`, second with `stage: 'midstream'`, etc.

    let stageCount = 0
    const stages = ['upstream', 'midstream', 'downstream']

    let changes = 0

    // Replace logic:
    // Find keys `stage: 'some value'`
    // Check if value is NOT upstream/mid/down.
    // If not, replace it with correct one based on count.

    const newContent = content.replace(/stage:\s*'([^']+)'/g, (match, currentValue) => {
        if (['upstream', 'midstream', 'downstream'].includes(currentValue)) {
            stageCount++
            return match // Already correct
        }

        if (stageCount < 3) {
            const newValue = stages[stageCount]
            stageCount++
            changes++
            return `stage: '${newValue}'`
        }

        return match
    })

    if (changes > 0) {
        fs.writeFileSync(filePath, newContent)
        console.log(`✅ Fixed ${filename}: Reverted ${changes} stage keys.`)
    } else {
        // console.log(`  OK: ${filename}`)
    }
}

async function main() {
    console.log('🚀 Fixing Broken Stage Keys...\n')

    const files = fs.readdirSync(INDUSTRIES_DIR).filter(f => f.endsWith('.products.ts'))

    for (const file of files) {
        await fixFile(file)
    }

    console.log('\n✨ All files processed.')
}

main()
