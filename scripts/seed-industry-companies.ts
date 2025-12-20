/**
 * Seed Industry Companies Script
 * Reads a .products.ts file and inserts missing companies into the database
 * 
 * Usage: npx tsx scripts/seed-industry-companies.ts --industry=agtech
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

// Get industry from command line args
const args = process.argv.slice(2)
const industryArg = args.find(a => a.startsWith('--industry='))
const industry = industryArg?.split('=')[1]

if (!industry) {
    console.error('Usage: npx tsx scripts/seed-industry-companies.ts --industry=<industry-slug>')
    process.exit(1)
}

async function loadProductStages(industrySlug: string): Promise<any[]> {
    const exportNameMap: Record<string, string> = {
        'semiconductors': 'semiconductorProductStages',
        'cloud-computing': 'cloudProductStages',
        'data-centers': 'dataCenterProductStages',
        'cybersecurity': 'cyberProductStages',
        'software-saas': 'softwareSaaSProductStages',
        'electric-vehicles': 'evProductStages',
        'solar-energy': 'solarProductStages',
        'energy-storage': 'energyStorageProductStages',
        'pharmaceuticals': 'pharmaceuticalProductStages',
        'banking': 'bankingProductStages',
        'oil-gas': 'oilGasProductStages',
        'automotive': 'automotiveProductStages',
        'retail': 'retailProductStages',
        'telecommunications': 'telecommunicationsProductStages',
        'aerospace-defense': 'aerospaceProductStages',
        'biotechnology': 'biotechnologyProductStages',
        'insurance': 'insuranceProductStages',
        'media-entertainment': 'mediaEntertainmentProductStages',
        'utilities': 'utilitiesProductStages',
        'fintech': 'fintechProductStages',
        'medical-devices': 'medicalDevicesProductStages',
        'ecommerce': 'ecommerceProductStages',
        'real-estate': 'realEstateProductStages',
        'asset-management': 'assetManagementProductStages',
        'chemicals': 'chemicalsProductStages',
        'food-beverage': 'foodBeverageProductStages',
        'artificial-intelligence': 'artificialIntelligenceProductStages',
        'robotics-automation': 'roboticsAutomationProductStages',
        'transportation-logistics': 'transportationLogisticsProductStages',
        'space-technology': 'spaceTechnologyProductStages',
        'digital-health': 'digitalHealthProductStages',
        'mining-materials': 'miningMaterialsProductStages',
        'consumer-products': 'consumerProductsProductStages',
        'hospitality': 'hospitalityProductStages',
        'construction-engineering': 'constructionEngineeringProductStages',
        'agtech': 'agtechProductStages',
        'consumer-electronics': 'consumerElectronicsProducts',
        'heavy-industry': 'heavyIndustryProducts',
        'wholesale-trading': 'wholesaleTradingProducts',
    }

    let exportName = exportNameMap[industrySlug]

    // Fallback: try to guess export name if not mapped
    if (!exportName) {
        // rough guess: industrySlug + 'ProductStages' or 'Products'
        // For now, rely on map being updated or fail
        console.warn(`Warning: No export map for ${industrySlug}. Trying default naming conventions...`)
    }

    const filePath = path.resolve(__dirname, `../lib/industries/${industrySlug}.products.ts`)
    if (!fs.existsSync(filePath)) {
        throw new Error(`Products file not found: ${filePath}`)
    }

    const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`
    const module = await import(fileUrl)

    // Try to find the exported array
    const exportKeys = Object.keys(module)
    const targetExport = exportName ? module[exportName] : module[exportKeys[0]] // strict fallback

    if (!targetExport) {
        throw new Error(`Could not find export for ${industrySlug}`)
    }
    return targetExport
}

async function main() {
    console.log(`\n🌱 Seeding companies for ${industry}...\n`)

    try {
        const stages = await loadProductStages(industry)

        // Collect all companies from the structure
        const companiesToSeed = new Map<string, any>()

        const traverse = (items: any[]) => {
            for (const item of items) {
                if (item.companiesDetailed) {
                    for (const co of item.companiesDetailed) {
                        if (co.ticker && !companiesToSeed.has(co.ticker)) {
                            companiesToSeed.set(co.ticker, co)
                        }
                    }
                }
                if (item.subProducts) traverse(item.subProducts)
                if (item.products) traverse(item.products)
            }
        }

        traverse(stages)

        console.log(`Found ${companiesToSeed.size} unique companies in file.`)

        // Check which ones exist
        const tickers = Array.from(companiesToSeed.keys())

        let upserted = 0
        for (const ticker of tickers) {
            const co = companiesToSeed.get(ticker)

            // Determine safe country code (2 chars)
            let countryCode = 'US'
            if (co.country && co.country.length === 2) {
                countryCode = co.country
            } else if (co.listing === 'ADR') {
                // Heuristic for ADRs if country unknown
                countryCode = 'US' // Technically wrong but safe for DB constraint
            }

            const { error } = await supabase
                .from('companies')
                .upsert({
                    ticker: co.ticker,
                    name: co.name,
                    industry: industry, // Force update industry
                    country: countryCode,
                    description: co.description || `${co.name} (${industry})`
                }, { onConflict: 'ticker' })

            if (error) {
                console.error(`Error upserting ${ticker}:`, error.message)
            } else {
                process.stdout.write('.')
                upserted++
            }
        }

        console.log(`\n🎉 Processed ${upserted} companies (Upserted).`)

    } catch (e: any) {
        console.error('Error:', e.message)
    }
}

main()
