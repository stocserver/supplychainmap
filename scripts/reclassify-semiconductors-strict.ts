/**
 * LLM-Powered Semiconductor Classifier using strict taxonomy from products file
 * Uses Gemini 3 Pro Preview
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

// STRICT TAXONOMY FROM semiconductors.products.ts
const TAXONOMY = {
    upstream: {
        'ip-design': {
            name: 'IP Design / IC Design Services',
            tags: ['eda', 'ip-core', 'interface-ip']
        },
        'ic-design': {
            name: 'IC Design (Fabless)',
            tags: [
                'gpu', 'cpu', 'mobile-soc', 'ai-accelerators',
                'analog', 'rf', 'mcu', 'fpga', 'memory-controller', 'asic'
            ]
        }
    },
    midstream: {
        'wafer-fab': {
            name: 'Wafer Fabrication',
            tags: [
                'foundries-idms', // for the actual manufacturers
                'equipment', 'litho', 'etch', 'dep', 'inspect', 'metrology', // equipment
                'materials', 'photoresist', 'gases', 'wafers', 'consumables', 'photomasks' // materials
            ]
        }
    },
    downstream: {
        'packaging': { // ID: packaging
            name: 'IC Packaging & Testing',
            tags: [
                'osat', 'bga', 'qfn', 'flip-chip',
                'substrates', 'interposers', 'leadframes',
                'test', 'burn-in', 'ate',
                'pkg-equip', 'wire-bonding', 'dicing'
            ]
        },
        'modules': { // ID: modules
            name: 'IC Modules',
            tags: [
                'memory-mods', 'rf-mods', 'power-mods', 'iot-modules'
            ]
        },
        'distribution': { // ID: distribution
            name: 'Distribution',
            tags: [
                'distributor', 'to-smartphones', 'to-pc', 'to-automotive', 'to-dc'
            ]
        }
    }
}

async function classifyCompany(
    name: string,
    description: string,
    currentTags: string[]
): Promise<{ stream: string, category: string, tags: string[] } | null> {
    const prompt = `You are an expert semiconductor industry analyst. Classify this company into a STRICT taxonomy.
    
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
    - If a company does multiple things (e.g. GPU + CPU), pick the DOMINANT category 'ic-design' and add both tags.
    - **CRITICAL IDM RULE**: Determine if an IDM (Integrated Device Manufacturer) is primarily a "Design Product" company or a "Manufacturing" company.
      - **Design Product IDMs** (Texas Instruments, Analog Devices, NXP, Microchip, Infineon, STMicro):
        - Classify as **UPSTREAM -> ic-design** (Tags: analog, mcu, power-semis, etc.)
        - Do NOT classify as wafer-fab even though they have fabs.
      - **Manufacturing/Memory IDMs** (Intel, Samsung, Micron, SK Hynix):
        - Classify as **MIDSTREAM -> wafer-fab** (Tags: foundries-idms)
        - Exception: Intel can be ic-design if emphasizing CPU products, but traditionally IDM. *For this taxonomy, put Intel in 'ic-design' with tag 'cpu' as per source file.*
      - **Pure Foundries** (TSMC, GlobalFoundries, UMC):
        - Classify as **MIDSTREAM -> wafer-fab** (Tags: foundries-idms)
    
    OUTPUT JSON ONLY:
    {
        "stream": "upstream",
        "category": "ic-design",
        "tags": ["gpu", "ai-accelerators"]
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
    console.log('🚀 Starting STRICT Semiconductor Classification...\n')

    // Fetch semiconductor companies
    const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .eq('industry', 'semiconductors')

    console.log(`Found ${companies?.length} companies.`)

    let updated = 0

    for (const company of companies || []) {
        console.log(`\nAnalyzing ${company.ticker} (${company.name})...`)

        const result = await classifyCompany(company.name, company.description || '', company.value_chain_tags || [])

        if (result) {
            // Validate results against our taxonomy
            // Check if category exists in stream
            // Check if tags are valid

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

        // Rate limit (faster model allows faster rate)
        await new Promise(r => setTimeout(r, 200))
    }

    console.log(`\n🎉 Done! Updated ${updated} companies.`)
}

main()
