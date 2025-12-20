
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import * as sem from '../lib/industries/semiconductors.products'
import * as cld from '../lib/industries/cloud-computing.products'
import * as dc from '../lib/industries/data-centers.products'
import * as cyb from '../lib/industries/cybersecurity.products'
import * as sof from '../lib/industries/software-saas.products'
import * as ev from '../lib/industries/electric-vehicles.products'
import * as sol from '../lib/industries/solar-energy.products'
import * as est from '../lib/industries/energy-storage.products'
import * as pha from '../lib/industries/pharmaceuticals.products'
import * as bnk from '../lib/industries/banking.products'
import * as oil from '../lib/industries/oil-gas.products'
import * as aut from '../lib/industries/automotive.products'
import * as ret from '../lib/industries/retail.products'
import * as tel from '../lib/industries/telecommunications.products'
import * as aer from '../lib/industries/aerospace-defense.products'
import * as bio from '../lib/industries/biotechnology.products'
import * as ins from '../lib/industries/insurance.products'
import * as med from '../lib/industries/media-entertainment.products'
import * as uti from '../lib/industries/utilities.products'
import * as fin from '../lib/industries/fintech.products'
import * as dev from '../lib/industries/medical-devices.products'
import * as eco from '../lib/industries/ecommerce.products'
import * as rea from '../lib/industries/real-estate.products'
import * as ass from '../lib/industries/asset-management.products'
import * as che from '../lib/industries/chemicals.products'
import * as foo from '../lib/industries/food-beverage.products'
import * as aim from '../lib/industries/artificial-intelligence.products'
import * as rob from '../lib/industries/robotics-automation.products'
import * as tra from '../lib/industries/transportation-logistics.products'
import * as spa from '../lib/industries/space-technology.products'
import * as dig from '../lib/industries/digital-health.products'
import * as min from '../lib/industries/mining-materials.products'
import * as con from '../lib/industries/consumer-products.products'
import * as hos from '../lib/industries/hospitality.products'
import * as cst from '../lib/industries/construction-engineering.products'
import * as agt from '../lib/industries/agtech.products'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const industryMaps = {
    'semiconductors': sem.semiconductorProductStages,
    'cloud-computing': cld.cloudProductStages,
    'data-centers': dc.dataCenterProductStages,
    'cybersecurity': cyb.cyberProductStages,
    'software-saas': sof.softwareSaaSProductStages,
    'electric-vehicles': ev.evProductStages,
    'solar-energy': sol.solarProductStages,
    'energy-storage': est.energyStorageProductStages,
    'pharmaceuticals': pha.pharmaceuticalProductStages,
    'banking': bnk.bankingProductStages,
    'oil-gas': oil.oilGasProductStages,
    'automotive': aut.automotiveProductStages,
    'retail': ret.retailProductStages,
    'telecommunications': tel.telecommunicationsProductStages,
    'aerospace-defense': aer.aerospaceProductStages,
    'biotechnology': bio.biotechnologyProductStages,
    'insurance': ins.insuranceProductStages,
    'media-entertainment': med.mediaEntertainmentProductStages,
    'utilities': uti.utilitiesProductStages,
    'fintech': fin.fintechProductStages,
    'medical-devices': dev.medicalDevicesProductStages,
    'ecommerce': eco.ecommerceProductStages,
    'real-estate': rea.realEstateProductStages,
    'asset-management': ass.assetManagementProductStages,
    'chemicals': che.chemicalsProductStages,
    'food-beverage': foo.foodBeverageProductStages,
    'artificial-intelligence': aim.artificialIntelligenceProductStages,
    'robotics-automation': rob.roboticsAutomationProductStages,
    'transportation-logistics': tra.transportationLogisticsProductStages,
    'space-technology': spa.spaceTechnologyProductStages,
    'digital-health': dig.digitalHealthProductStages,
    'mining-materials': min.miningMaterialsProductStages,
    'consumer-products': con.consumerProductsProductStages,
    'hospitality': hos.hospitalityProductStages,
    'construction-engineering': cst.constructionEngineeringProductStages,
    'agtech': agt.agtechProductStages,
}

interface GoldenTag {
    ticker: string
    tag: string
    industrySlug: string
}

function collectGoldenTags(): GoldenTag[] {
    const goldenTags: GoldenTag[] = []

    Object.entries(industryMaps).forEach(([slug, stages]) => {
        const visit = (products: any[]) => {
            products.forEach(p => {
                const tag = p.id
                if (tag) {
                    const companies = p.companiesDetailed || []
                    companies.forEach((c: any) => {
                        if (c.ticker) {
                            goldenTags.push({ ticker: c.ticker, tag, industrySlug: slug })
                        }
                    })
                }
                if (p.subProducts) visit(p.subProducts)
            })
        }
        stages.forEach((s: any) => visit(s.products))
    })

    return goldenTags
}

async function main() {
    console.log("Collecting Golden Tags from source files...")
    const allGolden = collectGoldenTags()
    console.log(`Found ${allGolden.length} golden assignments.`)

    // Group by ticker
    const tickerMap = new Map<string, Set<string>>()
    const tickerIndustryMap = new Map<string, string>()

    allGolden.forEach(g => {
        if (!tickerMap.has(g.ticker)) {
            tickerMap.set(g.ticker, new Set())
            tickerIndustryMap.set(g.ticker, g.industrySlug)
        }
        tickerMap.get(g.ticker)!.add(g.tag)
    })

    console.log(`Unique companies to process: ${tickerMap.size}`)

    // Process in batches
    const tickers = Array.from(tickerMap.keys())
    const batchSize = 50
    let updatedCount = 0

    for (let i = 0; i < tickers.length; i += batchSize) {
        const batchTickers = tickers.slice(i, i + batchSize)

        const { data: dbCompanies, error } = await supabase
            .from('companies')
            .select('ticker, name, value_chain_tags, industry')
            .in('ticker', batchTickers)

        if (error) {
            console.error("Fetch error:", error)
            continue
        }

        for (const company of dbCompanies || []) {
            const goldenTags = Array.from(tickerMap.get(company.ticker) || [])
            const currentTags = company.value_chain_tags || []

            // Merge
            const mergedTags = Array.from(new Set([...currentTags, ...goldenTags]))

            // Check if changed
            const isChanged = mergedTags.length > currentTags.length ||
                goldenTags.some(t => !currentTags.includes(t)) ||
                // Also verify industry matches golden (or is compatible)
                (company.industry !== tickerIndustryMap.get(company.ticker))

            if (isChanged) {
                // Update
                const targetIndustry = tickerIndustryMap.get(company.ticker)

                // Logic: If company has "Uncategorized" industry or "General", definitely update industry.
                // If company has ALREADY a different industry, be careful?
                // For now, let's enforce the industries from our golden files as they are the source of truth for "Featured" listings.

                const { error: updateError } = await supabase
                    .from('companies')
                    .update({
                        value_chain_tags: mergedTags,
                        industry: targetIndustry,
                        updated_at: new Date().toISOString()
                    })
                    .eq('ticker', company.ticker)

                if (!updateError) {
                    updatedCount++
                    //  console.log(`✅ ${company.ticker}: Enforced tags [${goldenTags.join(', ')}]`)
                } else {
                    console.error(`Error updating ${company.ticker}:`, updateError)
                }
            }
        }
        process.stdout.write(`\rProcessed ${Math.min(i + batchSize, tickers.length)} / ${tickers.length} companies...`)
    }

    console.log(`\n\nDone! Enforced Gold Tags on ${updatedCount} companies.`)
}

main()
