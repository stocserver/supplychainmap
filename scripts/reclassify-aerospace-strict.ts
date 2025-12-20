/**
 * LLM-Powered Aerospace Classifier using strict taxonomy
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

// STRICT TAXONOMY FROM aerospace-defense.products.ts
const TAXONOMY = {
    upstream: {
        'raw-materials-aero': {
            name: 'Raw Materials',
            tags: ['titanium-alloys', 'composites']
        },
        'components-parts': {
            name: 'Aerospace Components',
            tags: ['engines', 'avionics']
        }
    },
    midstream: {
        'aircraft-manufacturing': {
            name: 'Aircraft Manufacturing',
            tags: ['commercial-aircraft', 'business-jets']
        },
        'defense-systems': {
            name: 'Defense Systems',
            tags: ['fighter-aircraft', 'missile-systems']
        }
    },
    downstream: {
        'airlines': {
            name: 'Airlines',
            tags: ['legacy-carriers', 'low-cost-carriers']
        },
        'mro': {
            name: 'Maintenance, Repair & Overhaul',
            tags: ['engine-mro', 'airframe-mro']
        }
    }
}

async function classifyCompany(
    name: string,
    description: string,
    currentTags: string[]
): Promise<{ stream: string, category: string, tags: string[] } | null> {
    const prompt = `You are an expert Aerospace & Defense industry analyst. Classify this company into a STRICT taxonomy.
    
    COMPANY: ${name}
    DESCRIPTION: ${description}
    CURRENT TAGS: ${JSON.stringify(currentTags)}

    TAXONOMY RULES:
    1. Select ONE stream: upstream, midstream, or downstream.
    2. Select ONE primary category ID from that stream.
    3. Select relevant tags from the allowed list for that category.

    ALLOWED TAXONOMY:
    ${JSON.stringify(TAXONOMY, null, 2)}

    INSTRUCTIONS:
    - If a company does multiple things, pick the DOMINANT category.
    - Example: Boeing -> midstream -> aircraft-manufacturing -> commercial-aircraft.
    - Example: Lockheed Martin -> midstream -> defense-systems -> fighter-aircraft.
    - Example: Delta -> downstream -> airlines -> legacy-carriers.
    - Example: GE -> upstream -> components-parts -> engines.
    
    OUTPUT JSON ONLY:
    {
        "stream": "midstream",
        "category": "aircraft-manufacturing",
        "tags": ["commercial-aircraft"]
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
    console.log('🚀 Starting STRICT Aerospace Classification...\n')

    // Fetch Aerospace companies
    const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .eq('industry', 'aerospace-defense')

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
