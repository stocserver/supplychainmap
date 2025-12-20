/**
 * Automated Industry Migration Script
 * Reads a .products.ts file and inserts its structure into the database
 * 
 * Usage: npx tsx scripts/migrate-industry.ts --industry=semiconductors
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
    console.error('Usage: npx tsx scripts/migrate-industry.ts --industry=<industry-slug>')
    console.error('Example: npx tsx scripts/migrate-industry.ts --industry=semiconductors')
    process.exit(1)
}

interface ProductCategory {
    id: string
    name: string
    description?: string
    subProducts?: ProductCategory[]
    companiesDetailed?: any[]
}

interface ValueChainStage {
    stage: 'upstream' | 'midstream' | 'downstream'
    stageLabel: string
    products: ProductCategory[]
}

async function loadProductStages(industrySlug: string): Promise<ValueChainStage[]> {
    // Map industry slug to the export name
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
        'aerospace-defense': 'aerospaceProductStages',
    }

    const exportName = exportNameMap[industrySlug]
    if (!exportName) {
        throw new Error(`Unknown industry: ${industrySlug}. Add it to the exportNameMap.`)
    }

    // Dynamic import of the products file
    const filePath = path.resolve(__dirname, `../lib/industries/${industrySlug}.products.ts`)
    if (!fs.existsSync(filePath)) {
        throw new Error(`Products file not found: ${filePath}`)
    }

    // Convert Windows path to file:// URL for dynamic import
    const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`
    const module = await import(fileUrl)
    return module[exportName]
}

async function insertStreams(industry: string, stages: ValueChainStage[]): Promise<Map<string, number>> {
    const streamIdMap = new Map<string, number>()

    const streamColors: Record<string, string> = {
        'upstream': 'blue',
        'midstream': 'purple',
        'downstream': 'green'
    }

    for (let i = 0; i < stages.length; i++) {
        const stage = stages[i]
        const { data, error } = await supabase
            .from('value_chain_streams')
            .upsert({
                industry,
                slug: stage.stage,
                display_name: stage.stageLabel,
                sort_order: i + 1,
                color: streamColors[stage.stage] || 'gray'
            }, { onConflict: 'industry,slug' })
            .select()
            .single()

        if (error) {
            console.error(`Error inserting stream ${stage.stage}:`, error)
        } else if (data) {
            streamIdMap.set(stage.stage, data.id)
            console.log(`  ✅ Stream: ${stage.stageLabel}`)
        }
    }

    return streamIdMap
}

async function insertCategoriesAndProducts(
    industry: string,
    stages: ValueChainStage[],
    streamIdMap: Map<string, number>
): Promise<void> {
    for (const stage of stages) {
        const streamId = streamIdMap.get(stage.stage)
        if (!streamId) continue

        for (let i = 0; i < stage.products.length; i++) {
            const product = stage.products[i]

            // Insert category
            const { data: category, error: catError } = await supabase
                .from('value_chain_categories')
                .upsert({
                    stream_id: streamId,
                    slug: product.id,
                    display_name: product.name,
                    description: product.description || null,
                    sort_order: i + 1
                }, { onConflict: 'stream_id,slug' })
                .select()
                .single()

            if (catError) {
                console.error(`Error inserting category ${product.id}:`, catError)
                continue
            }

            console.log(`    ✅ Category: ${product.name}`)

            // Insert sub-products
            if (product.subProducts && category) {
                await insertSubProducts(category.id, product.subProducts)
            }
        }
    }
}

async function insertSubProducts(categoryId: number, subProducts: ProductCategory[], parentSort = 0): Promise<void> {
    for (let i = 0; i < subProducts.length; i++) {
        const subProduct = subProducts[i]

        const { error } = await supabase
            .from('value_chain_products')
            .upsert({
                category_id: categoryId,
                slug: subProduct.id,
                display_name: subProduct.name,
                description: subProduct.description || null,
                sort_order: parentSort + i + 1
            }, { onConflict: 'category_id,slug' })

        if (error) {
            console.error(`Error inserting product ${subProduct.id}:`, error)
        } else {
            console.log(`      ✅ Product: ${subProduct.name}`)
        }

        // Handle nested sub-products (flatten them to same category)
        if (subProduct.subProducts) {
            await insertSubProducts(categoryId, subProduct.subProducts, (parentSort + i + 1) * 10)
        }
    }
}

async function main() {
    console.log(`\n🚀 Migrating ${industry} to database...\n`)

    try {
        // Load the products file
        console.log('📖 Loading products file...')
        const stages = await loadProductStages(industry)
        console.log(`   Found ${stages.length} stages\n`)

        // Insert streams
        console.log('📊 Inserting streams...')
        const streamIdMap = await insertStreams(industry, stages)

        // Insert categories and products
        console.log('\n📦 Inserting categories and products...')
        await insertCategoriesAndProducts(industry, stages, streamIdMap)

        // Update the valid_product_ids JSON
        console.log('\n📝 Updating valid_product_ids...')
        await updateValidProductIds(industry)

        console.log(`\n✅ ${industry} migration complete!`)
        console.log(`\nNext steps:`)
        console.log(`1. Run: npx tsx scripts/llm-classify-industry.ts --industry=${industry}`)
        console.log(`2. Add '${industry}' to DB_DRIVEN_INDUSTRIES in lib/data/value-chain-db.ts`)
        console.log(`3. Verify the page`)

    } catch (error: any) {
        console.error('❌ Migration failed:', error.message)
        process.exit(1)
    }
}

async function updateValidProductIds(industrySlug: string): Promise<void> {
    // Fetch all categories and products for this industry
    const { data: streams } = await supabase
        .from('value_chain_streams')
        .select('id')
        .eq('industry', industrySlug)

    if (!streams?.length) return

    const { data: categories } = await supabase
        .from('value_chain_categories')
        .select('slug')
        .in('stream_id', streams.map(s => s.id))

    const { data: products } = await supabase
        .from('value_chain_products')
        .select('slug')
        .in('category_id', (await supabase
            .from('value_chain_categories')
            .select('id')
            .in('stream_id', streams.map(s => s.id))
        ).data?.map(c => c.id) || [])

    const allSlugs = [
        ...(categories || []).map(c => c.slug),
        ...(products || []).map(p => p.slug)
    ]

    // Update the JSON file
    const jsonPath = path.resolve(__dirname, 'valid_product_ids_by_industry.json')
    let validProductIds: Record<string, string[]> = {}

    if (fs.existsSync(jsonPath)) {
        validProductIds = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    }

    validProductIds[industrySlug] = allSlugs
    fs.writeFileSync(jsonPath, JSON.stringify(validProductIds, null, 2))
    console.log(`   Updated with ${allSlugs.length} tags`)
}

main()
