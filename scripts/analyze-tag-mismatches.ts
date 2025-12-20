/**
 * This script scans all .products.ts files to extract valid product IDs,
 * then compares them against the tags in the database dumps.
 * Output: A mapping report showing which tags need to be corrected.
 */

import fs from 'fs'
import path from 'path'

const industriesDir = path.resolve(__dirname, '../lib/industries')
const dumpJp = path.resolve(__dirname, 'dump_jp_companies.json')
const dumpUs = path.resolve(__dirname, 'dump_us_companies.json')

// Extract all product IDs from a .products.ts file
function extractProductIds(fileContent: string): string[] {
    const ids: string[] = []
    // Match id: 'something' or id: "something"
    const idRegex = /id:\s*['"]([^'"]+)['"]/g
    let match
    while ((match = idRegex.exec(fileContent)) !== null) {
        ids.push(match[1])
    }
    return ids
}

// Map industry slug to valid product IDs
function buildIndustryProductMap(): Record<string, string[]> {
    const map: Record<string, string[]> = {}

    const files = fs.readdirSync(industriesDir).filter(f => f.endsWith('.products.ts'))

    for (const file of files) {
        // Derive industry slug from filename (e.g., semiconductors.products.ts -> semiconductors)
        const slug = file.replace('.products.ts', '')
        const content = fs.readFileSync(path.join(industriesDir, file), 'utf-8')
        const productIds = extractProductIds(content)
        map[slug] = productIds
    }

    return map
}

// Analyze dump file
function analyzeDump(dumpPath: string, industryProductMap: Record<string, string[]>): any {
    const data = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'))

    const report: Record<string, { valid: string[], invalid: string[], companies: any[] }> = {}

    for (const [industry, companies] of Object.entries(data)) {
        const validIds = industryProductMap[industry] || []
        const invalidTags = new Set<string>()
        const validTags = new Set<string>()

        for (const company of (companies as any[])) {
            const tags = company.tags || []
            for (const tag of tags) {
                if (validIds.includes(tag)) {
                    validTags.add(tag)
                } else {
                    invalidTags.add(tag)
                }
            }
        }

        report[industry] = {
            valid: Array.from(validTags),
            invalid: Array.from(invalidTags),
            companies: (companies as any[]).map(c => ({ ticker: c.ticker, name: c.name, tags: c.tags }))
        }
    }

    return report
}

async function main() {
    console.log('Building industry -> product ID map from .products.ts files...')
    const industryProductMap = buildIndustryProductMap()

    // Save the map for reference
    const mapPath = path.resolve(__dirname, 'valid_product_ids_by_industry.json')
    fs.writeFileSync(mapPath, JSON.stringify(industryProductMap, null, 2))
    console.log(`Saved valid product ID map to ${mapPath}`)

    console.log('Analyzing JP dump...')
    const jpReport = analyzeDump(dumpJp, industryProductMap)
    const jpReportPath = path.resolve(__dirname, 'tag_mismatch_report_jp.json')
    fs.writeFileSync(jpReportPath, JSON.stringify(jpReport, null, 2))
    console.log(`Saved JP mismatch report to ${jpReportPath}`)

    console.log('Analyzing US dump...')
    const usReport = analyzeDump(dumpUs, industryProductMap)
    const usReportPath = path.resolve(__dirname, 'tag_mismatch_report_us.json')
    fs.writeFileSync(usReportPath, JSON.stringify(usReport, null, 2))
    console.log(`Saved US mismatch report to ${usReportPath}`)

    // Summary
    console.log('\n=== SUMMARY ===')
    for (const [industry, ids] of Object.entries(industryProductMap)) {
        console.log(`${industry}: ${ids.length} valid product IDs`)
    }
}

main()
