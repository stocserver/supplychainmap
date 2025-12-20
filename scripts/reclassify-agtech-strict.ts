/**
 * LLM-Powered AgTech Classifier using strict taxonomy
 * Uses Gemini 2.5 Flash Lite
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// STRICT TAXONOMY FROM agtech.products.ts
const TAXONOMY = {
    upstream: {
        'seeds-biotech': {
            name: 'Seeds & Biotech',
            tags: ['seed-genetics', 'crop-protection']
        },
        'fertilizers': {
            name: 'Fertilizers',
            tags: ['commodity-fertilizers', 'specialty-nutrients']
        }
    },
    midstream: {
        'ag-equipment': {
            name: 'Ag Equipment',
            tags: ['tractors-harvesters', 'planting-equipment']
        },
        'precision-ag': {
            name: 'Precision Ag',
            tags: ['guidance-systems', 'irrigation-systems', 'farm-software']
        }
    },
    downstream: {
        'farming-services': {
            name: 'Farming Services',
            tags: [] // No sub-products defined in file, but we can allow general tags if needed
        },
        'food-processing': {
            name: 'Food Processing',
            tags: ['grain-processing', 'protein-processing']
        },
        'animal-health': {
            name: 'Animal Health',
            tags: ['animal-pharma', 'livestock-management']
        }
    }
}

async function classifyCompany(
    name: string,
    description: string,
    currentTags: string[]
): Promise<{ stream: string, category: string, tags: string[] } | null> {
    const prompt = `You are an expert AgTech industry analyst. Classify this company into a STRICT taxonomy.
    
    COMPANY: ${name}
    DESCRIPTION: ${description}
    CURRENT TAGS: ${JSON.stringify(currentTags)}

    TAXONOMY RULES:
    1. Select ONE stream: upstream, midstream, or downstream.
    2. Select ONE primary category ID from that stream.
    3. Select relevant tags from the allowed list for that category (if any).

    ALLOWED TAXONOMY:
    ${JSON.stringify(TAXONOMY, null, 2)}

    INSTRUCTIONS:
    - If a company does multiple things, pick the DOMINANT category.
    - Example: Deere -> midstream -> ag-equipment -> tractors-harvesters.
    - Example: Corteva -> upstream -> seeds-biotech -> seed-genetics.
    - Example: Zoetis -> downstream -> animal-health -> animal-pharma.
    
    OUTPUT JSON ONLY:
    {
        "stream": "upstream",
        "category": "seeds-biotech",
        "tags": ["seed-genetics"]
    }
    `

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text().trim()
        const match = text.match(/\{[\s\S]*?\}/)
        if (match) {
            return JSON.parse(match[0])
        }
    } catch (e) {
        console.error(`Error classifying ${name}:`, e)
    }
    return null
}

async function main() {
    console.log('🚀 Starting STRICT AgTech Classification...\n')

    // Fetch AgTech companies
    const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .eq('industry', 'agtech')

    console.log(`Found ${companies?.length} companies.`)

    let updated = 0

    for (const company of companies || []) {
        console.log(`\nAnalyzing ${company.ticker} (${company.name})...`)

        const result = await classifyCompany(company.name, company.description || '', company.value_chain_tags || [])

        if (result) {
            console.log(`  -> Stream: ${result.stream}`)
            console.log(`  -> Category: ${result.category}`)
            console.log(`  -> Tags: ${result.tags.join(', ')}`)

            // Update DB
            const { error } = await supabase
                .from('companies')
                .update({
                    stream_slug: result.stream,
                    category_slug: result.category,
                    value_chain_tags: result.tags
                })
                .eq('ticker', company.ticker)

            if (!error) {
                console.log('  ✅ Updated DB')
                updated++
            } else {
                console.error('  ❌ DB Error:', error.message)
            }
        } else {
            console.log('  ⚠️ Failed to classify')
        }

        // Rate limit
        await new Promise(r => setTimeout(r, 200))
    }

    console.log(`\n🎉 Done! Updated ${updated} companies.`)
}

main()
