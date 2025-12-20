/**
 * LLM-Powered AgTech Sub-Product Classifier
 * Uses the DB-driven taxonomy to assign granular tags
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Load valid product IDs (just updated with DB-driven AgTech tags)
const validProductIds: Record<string, string[]> = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'valid_product_ids_by_industry.json'), 'utf-8')
)

const agtechTags = validProductIds['agtech']

async function classifyForAgtech(
    name: string,
    description: string,
    primaryIndustry: string,
    currentTags: string[]
): Promise<string[] | null> {
    const prompt = `You are a supply chain analyst. Assign the MOST SPECIFIC AgTech-related tags for this company.

COMPANY: ${name}
DESCRIPTION: ${description || 'No description'}
PRIMARY INDUSTRY: ${primaryIndustry}
CURRENT TAGS: ${JSON.stringify(currentTags)}

VALID AGTECH TAGS (ordered by hierarchy):
UPSTREAM (Seeds & Inputs):
- seeds-biotech: Seed R&D and biotechnology
  - seed-genetics: Specific seed genetics/breeding
  - crop-protection: Crop protection chemicals/pesticides
- fertilizers: Fertilizer production
  - commodity-fertilizers: NPK and bulk fertilizers
  - specialty-nutrients: Specialty/premium nutrients

MIDSTREAM (Equipment & Precision Ag):
- ag-equipment: Farm machinery and equipment
  - tractors-harvesters: Tractors, combines, harvesters
  - planting-equipment: Planters, tillers, seeders
- precision-ag: Precision agriculture technology
  - guidance-systems: GPS, auto-steer, telematics
  - irrigation-systems: Smart irrigation, sprinklers
  - farm-software: Farm management software
- space-ag-equipment: Space/extraterrestrial farming (experimental)
  - space-tractor: Space tractors

DOWNSTREAM (Farming Services & Processing):
- farming-services: Ag cooperatives, crop consulting
- food-processing: Food ingredient processing
  - grain-processing: Grain milling, oilseed crushing
  - protein-processing: Meat/poultry processing
- animal-health: Livestock health
  - animal-pharma: Animal vaccines/drugs
  - livestock-management: Herd management systems

RULES:
1. Assign BOTH the category tag AND the specific sub-product tag when applicable
   - Example: "grain processing company" → ["food-processing", "grain-processing"]
   - Example: "tractor manufacturer" → ["ag-equipment", "tractors-harvesters"]
2. If company touches multiple areas, include all relevant tags
3. Only use tags from the list above
4. Return between 1-4 relevant tags

Return ONLY JSON: {"tags": ["tag1", "tag2"]}
NO OTHER TEXT.`

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text().trim()

        const jsonMatch = text.match(/\{[\s\S]*?\}/)
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            const validTags = parsed.tags?.filter((t: string) => agtechTags.includes(t))
            return validTags?.length > 0 ? validTags : null
        }
        return null
    } catch (error: any) {
        console.error(`Error classifying ${name}:`, error.message)
        return null
    }
}

async function main() {
    console.log('🤖 AgTech Sub-Product Classifier (LLM-Powered)\n')
    console.log(`Valid AgTech tags: ${agtechTags.join(', ')}\n`)

    // Get companies that have AgTech-related tags (includes cross-industry)
    const { data: allCompanies } = await supabase
        .from('companies')
        .select('ticker, name, description, industry, value_chain_tags')
        .limit(500)

    // Filter to companies that have ANY agtech tag
    const agtechCompanies = (allCompanies || []).filter(c => {
        const tags = c.value_chain_tags || []
        return c.industry === 'agtech' || tags.some((t: string) => agtechTags.includes(t))
    })

    console.log(`Found ${agtechCompanies.length} companies with AgTech tags\n`)

    let updated = 0
    let errors = 0

    for (let i = 0; i < agtechCompanies.length; i++) {
        const company = agtechCompanies[i]

        console.log(`[${i + 1}/${agtechCompanies.length}] ${company.ticker}: ${company.name}`)
        console.log(`  Current tags: ${(company.value_chain_tags || []).join(', ')}`)

        // Get new tags from LLM
        const newAgtechTags = await classifyForAgtech(
            company.name,
            company.description,
            company.industry,
            company.value_chain_tags || []
        )

        if (newAgtechTags) {
            // Merge: Keep non-agtech tags, add new agtech tags
            const currentNonAgtech = (company.value_chain_tags || []).filter((t: string) => !agtechTags.includes(t))
            const mergedTags = [...new Set([...currentNonAgtech, ...newAgtechTags])]

            // Check if changed
            const sorted = (arr: string[]) => [...arr].sort().join(',')
            if (sorted(mergedTags) !== sorted(company.value_chain_tags || [])) {
                const { error } = await supabase
                    .from('companies')
                    .update({ value_chain_tags: mergedTags })
                    .eq('ticker', company.ticker)

                if (!error) {
                    console.log(`  ✅ Updated: ${newAgtechTags.join(', ')}`)
                    updated++
                } else {
                    console.log(`  ❌ Error: ${error.message}`)
                    errors++
                }
            } else {
                console.log(`  ⏭️ No change needed`)
            }
        } else {
            console.log(`  ⚠️ LLM returned no valid tags`)
            errors++
        }

        // Rate limit
        await new Promise(r => setTimeout(r, 2000))
    }

    console.log(`\n✅ Done! Updated: ${updated}, Errors: ${errors}`)
}

main()
