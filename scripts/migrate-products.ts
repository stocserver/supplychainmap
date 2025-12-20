
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// Import all product stages
import { aerospaceProductStages } from '@/lib/industries/aerospace-defense.products'
import { agtechProductStages } from '@/lib/industries/agtech.products'
import { artificialIntelligenceProductStages } from '@/lib/industries/artificial-intelligence.products'
import { assetManagementProductStages } from '@/lib/industries/asset-management.products'
import { automotiveProductStages } from '@/lib/industries/automotive.products'
import { bankingProductStages } from '@/lib/industries/banking.products'
import { biotechnologyProductStages } from '@/lib/industries/biotechnology.products'
import { chemicalsProductStages } from '@/lib/industries/chemicals.products'
import { cloudProductStages } from '@/lib/industries/cloud-computing.products'
import { constructionEngineeringProductStages } from '@/lib/industries/construction-engineering.products'
import { consumerProductsProductStages } from '@/lib/industries/consumer-products.products'
import { cyberProductStages } from '@/lib/industries/cybersecurity.products'
import { dataCenterProductStages } from '@/lib/industries/data-centers.products'
import { digitalHealthProductStages } from '@/lib/industries/digital-health.products'
import { ecommerceProductStages } from '@/lib/industries/ecommerce.products'
import { evProductStages } from '@/lib/industries/electric-vehicles.products'
import { energyStorageProductStages } from '@/lib/industries/energy-storage.products'
import { fintechProductStages } from '@/lib/industries/fintech.products'
import { foodBeverageProductStages } from '@/lib/industries/food-beverage.products'
import { hospitalityProductStages } from '@/lib/industries/hospitality.products'
import { insuranceProductStages } from '@/lib/industries/insurance.products'
import { mediaEntertainmentProductStages } from '@/lib/industries/media-entertainment.products'
import { medicalDevicesProductStages } from '@/lib/industries/medical-devices.products'
import { miningMaterialsProductStages } from '@/lib/industries/mining-materials.products'
import { oilGasProductStages } from '@/lib/industries/oil-gas.products'
import { pharmaceuticalProductStages } from '@/lib/industries/pharmaceuticals.products'
import { realEstateProductStages } from '@/lib/industries/real-estate.products'
import { retailProductStages } from '@/lib/industries/retail.products'
import { roboticsAutomationProductStages } from '@/lib/industries/robotics-automation.products'
import { semiconductorProductStages } from '@/lib/industries/semiconductors.products'
import { softwareSaaSProductStages } from '@/lib/industries/software-saas.products'
import { solarProductStages } from '@/lib/industries/solar-energy.products'
import { spaceTechnologyProductStages } from '@/lib/industries/space-technology.products'
import { telecommunicationsProductStages } from '@/lib/industries/telecommunications.products'
import { transportationLogisticsProductStages } from '@/lib/industries/transportation-logistics.products'
import { utilitiesProductStages } from '@/lib/industries/utilities.products'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const ALL_STAGES = {
    'aerospace-defense': aerospaceProductStages,
    'agtech': agtechProductStages,
    'artificial-intelligence': artificialIntelligenceProductStages,
    'asset-management': assetManagementProductStages,
    'automotive': automotiveProductStages,
    'banking': bankingProductStages,
    'biotechnology': biotechnologyProductStages,
    'chemicals': chemicalsProductStages,
    'cloud-computing': cloudProductStages,
    'construction-engineering': constructionEngineeringProductStages,
    'consumer-products': consumerProductsProductStages,
    'cybersecurity': cyberProductStages,
    'data-centers': dataCenterProductStages,
    'digital-health': digitalHealthProductStages, // 14
    'ecommerce': ecommerceProductStages,
    'electric-vehicles': evProductStages,
    'energy-storage': energyStorageProductStages,
    'fintech': fintechProductStages,
    'food-beverage': foodBeverageProductStages,
    'hospitality': hospitalityProductStages, // 20
    'insurance': insuranceProductStages,
    'media-entertainment': mediaEntertainmentProductStages,
    'medical-devices': medicalDevicesProductStages,
    'mining-materials': miningMaterialsProductStages,
    'oil-gas': oilGasProductStages,
    'pharmaceuticals': pharmaceuticalProductStages,
    'real-estate': realEstateProductStages,
    'retail': retailProductStages,
    'robotics-automation': roboticsAutomationProductStages,
    'semiconductors': semiconductorProductStages, // 30
    'software-saas': softwareSaaSProductStages,
    'solar-energy': solarProductStages,
    'space-technology': spaceTechnologyProductStages,
    'telecommunications': telecommunicationsProductStages,
    'transportation-logistics': transportationLogisticsProductStages,
    'utilities': utilitiesProductStages,
}

interface CompanyData {
    ticker: string
    name: string
    country: string
    tags: Set<string>
    industry: string // Primary industry guess
    listing: string
}

const companies = new Map<string, CompanyData>()

function processStages(stages: any[], industrySlug: string) {
    stages.forEach(stage => {
        if (stage.products) {
            processProducts(stage.products, industrySlug)
        }
    })
}

function processProducts(products: any[], industrySlug: string) {
    products.forEach(product => {
        const tag = product.id

        if (product.companiesDetailed) {
            product.companiesDetailed.forEach((c: any) => {
                const ticker = c.ticker
                if (!ticker) return

                if (!companies.has(ticker)) {
                    let countryCode = 'US'
                    if (c.listing === 'Foreign') countryCode = 'OT'

                    // Safety check for DB constraint
                    if (countryCode.length > 2) countryCode = 'OT'

                    companies.set(ticker, {
                        ticker,
                        name: c.name,
                        country: countryCode,
                        tags: new Set(),
                        industry: industrySlug, // First encountered industry becomes primary
                        listing: c.listing
                    })
                }

                const co = companies.get(ticker)!
                co.tags.add(tag)

                // If we encounter exact industry slug in map, update primary? 
                // (optional optimization, current logic is simple first-win)
            })
        }

        if (product.subProducts) {
            processProducts(product.subProducts, industrySlug)
        }
    })
}

async function migrate() {
    console.log('🔄 parsing product files...')

    for (const [slug, stages] of Object.entries(ALL_STAGES)) {
        processStages(stages, slug)
    }

    console.log(`📊 Found ${companies.size} unique companies from static files.`)
    console.log('🚀 Pushing to Supabase...')

    const batchSize = 50
    const companyArray = Array.from(companies.values())

    for (let i = 0; i < companyArray.length; i += batchSize) {
        const batch = companyArray.slice(i, i + batchSize).map(c => ({
            ticker: c.ticker,
            name: c.name,
            country: c.country,
            industry: c.industry,
            value_chain_tags: Array.from(c.tags),
            is_featured: true, // All static file companies are featured by default
            updated_at: new Date().toISOString()
        }))

        // We assume conflicting IDs should MERGE tags in a real scenario, 
        // but here we are establishing the baseline.
        // However, existing DB entries from `seed-companies.ts` might have different tags.
        // We will OVERWRITE tags with this "Truth" from static files, 
        // effectively executing the "Sync" the user requested.

        const { error } = await supabase
            .from('companies')
            .upsert(batch, { onConflict: 'ticker' })

        if (error) {
            console.error('❌ Batch Error:', error.message)
        } else {
            console.log(`✅ Processed ${i + batch.length}/${companyArray.length}`)
        }
    }

    console.log('✨ Migration complete.')
}

migrate()
