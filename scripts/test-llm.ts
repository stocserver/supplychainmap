
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from 'dotenv'
import path from 'path'
import { industriesStructure, ValueChainStageProducts, ProductCategory } from '@/lib/data/structure'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
console.log("Key Loaded:", process.env.GEMINI_API_KEY ? "Yes (" + process.env.GEMINI_API_KEY.slice(0, 4) + "...)" : "No")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

// Build valid lists
const validIndustries = industriesStructure.map(i => i.slug)
const validProductIds: Record<string, string[]> = {}

const extractIds = (products: ProductCategory[], list: string[]) => {
    products.forEach(p => {
        if (p.id) list.push(p.id)
        if (p.subProducts) extractIds(p.subProducts, list)
    })
}

for (const ind of industriesStructure) {
    const list: string[] = []
    const stages = require(`../lib/industries/${ind.slug}.products`).default as any // Assuming default or named export
    // The previous script used dynamic require which is tricky in one-off.
    // Let's just hardcode the logic or skip this part for a simple test.
    // Actually, I can just mock the valid tags for food-beverage.
}

// Mock known valid tags for Food & Beverage
const foodTags = [
    'ingredients', 'sweeteners-starches', 'flavors-seasonings', 'nutrition-ingredients',
    'food-processing', 'snacks-confectionery', 'packaged-meals', 'meat-processing',
    'beverages', 'soft-drinks', 'beer', 'energy-drinks',
    'retail-distribution', 'grocery-retail', 'foodservice-distribution',
    'restaurants', 'qsr', 'fast-casual', 'coffee-cafes'
]

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ... existing setup ...

async function testCompany(ticker: string) {
    const { data: company } = await supabase.from('companies').select('*').eq('ticker', ticker).single()
    if (!company) { console.log("Company not found"); return }

    console.log(`\nTesting ${company.name}...`)
    console.log("Description:", company.description ? company.description.slice(0, 150) + "..." : "N/A")
    console.log("Current Tags:", company.value_chain_tags)

    const industrySlug = 'aerospace-defense'
    const validTags = [
        'raw-materials-aero', 'titanium-alloys', 'composites',
        'components-parts', 'engines', 'avionics',
        'aircraft-manufacturing', 'commercial-aircraft', 'business-jets',
        'defense-systems', 'fighter-aircraft', 'missile-systems',
        'airlines', 'legacy-carriers', 'low-cost-carriers',
        'mro', 'engine-mro', 'airframe-mro'
    ]

    const prompt = `You are a financial data auditor. Your goal is to assign the MOST SPECIFIC and ACCURATE classifications for this company based on its PRIMARY business.

COMPANY: ${company.name}
DESCRIPTION: ${company.description || 'No description'}
CURRENT TAGS: ${JSON.stringify(company.value_chain_tags)}
INDUSTRY: ${industrySlug}

VALID TAGS FOR ${industrySlug}:
[${validTags.join(', ')}]

STRICT RULES:
1. **CORE BUSINESS ONLY**: Tag the company based on its main revenue source. Do NOT tag peripheral businesses.
2. **BE SPECIFIC**: Use the most specific child tag available. 
   - Example: If they make Fighter Jets, use 'fighter-aircraft', NOT just 'defense-systems'.
   - Example: If they make 737s, use 'commercial-aircraft', NOT just 'aircraft-manufacturing'.
3. **USE ONLY VALID TAGS**: Pick from the list above. Do not invent tags.
4. **OUTPUT**: Return the Corrected JSON.

TASK:
Return ONLY JSON: {"industry": "${industrySlug}", "tags": ["tag1", "tag2"]}
NO OTHER TEXT.`

    try {
        const result = await model.generateContent(prompt)
        console.log("LLM Output:", result.response.text())
    } catch (e) {
        console.error("LLM Error:", e)
    }
}

testCompany('LMT')
testCompany('BA')


