
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from 'dotenv'
import path from 'path'
import { industriesStructure, ProductCategory } from '@/lib/data/structure'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

// Build valid tags for Food & Beverage
const validProductIds: Record<string, string[]> = {}
const extractIds = (products: ProductCategory[], list: string[]) => {
    products.forEach(p => {
        if (p.id) list.push(p.id)
        if (p.subProducts) extractIds(p.subProducts, list)
    })
}
for (const ind of industriesStructure) {
    const list: string[] = []
    // We only care about food-beverage for this fix
    if (ind.slug === 'food-beverage') {
        const stages = require(`../lib/industries/${ind.slug}.products`).foodBeverageProductStages
        if (stages) {
            stages.forEach((s: any) => extractIds(s.products, list))
            validProductIds[ind.slug] = list
        }
    }
}
const foodTags = validProductIds['food-beverage'] || []
console.log("Valid Food Tags loaded:", foodTags.length)
if (!foodTags.includes('qsr')) console.error("WARNING: 'qsr' tag missing from valid list!")

async function classifyAndFix(ticker: string) {
    const { data: company } = await supabase.from('companies').select('*').eq('ticker', ticker).single()
    if (!company) { console.log(`Skipping ${ticker} (not found)`); return }

    console.log(`\nProcessing ${ticker} (${company.name})...`)
    console.log(`Current: ${JSON.stringify(company.value_chain_tags)}`)

    const prompt = `You are a financial data auditor. Your goal is to assign the MOST SPECIFIC and ACCURATE classifications for this company based on its PRIMARY business.

COMPANY: ${company.name}
DESCRIPTION: ${company.description || 'No description'}
CURRENT TAGS: ${JSON.stringify(company.value_chain_tags)}

VALID INDUSTRIES: food-beverage

VALID TAGS BY INDUSTRY (Hierarchy):
food-beverage: [${foodTags.join(', ')}]

STRICT RULES:
1. **CORE BUSINESS ONLY**: Tag the company based on its main revenue source. Do NOT tag peripheral businesses.
   - Example: A Restaurant (McDonalds) sells Coke, but is NOT 'beverages'. It is 'restaurants' and 'qsr'.
2. **BE SPECIFIC**: If a specific child tag exists (e.g. 'qsr'), USE IT. Do not just use the generic parent if a specific one fits.
3. **USE ONLY VALID TAGS**: You must select tags from the VALID TAGS list above. Do not invent tags.
4. **AUDIT LOGIC**: 
   - correction: If CURRENT TAGS are missing key core tags OR contain wrong/peripheral tags, return the CORRECTED list.

TASK:
Return ONLY JSON: {"industry": "slug", "tags": ["tag1", "tag2"]}
NO OTHER TEXT.`

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim()
        const parsed = JSON.parse(text)

        // Filter proposed tags
        const validProposed = parsed.tags.filter((t: string) => foodTags.includes(t))
        console.log(`Proposed: ${JSON.stringify(parsed.tags)} -> Validated: ${JSON.stringify(validProposed)}`)

        if (validProposed.length > 0) {
            // Update DB
            const { error } = await supabase
                .from('companies')
                .update({
                    value_chain_tags: validProposed,
                    industry: 'food-beverage' // Ensure industry is fixed too
                })
                .eq('ticker', ticker)

            if (error) console.error("DB Update Error:", error)
            else console.log("✅ Updated DB")
        } else {
            console.log("❌ No valid tags proposed. Skipping update.")
        }

    } catch (e) {
        console.error("Error:", e)
    }
}

async function main() {
    // 1. Fetch all companies in food-beverage
    const { data: companies } = await supabase
        .from('companies')
        .select('ticker')
        .eq('industry', 'food-beverage')

    // 2. Add specific tickers that might be misclassified outside
    const specificTickers = ['MCD', 'YUM', 'SBUX', 'DPZ', 'CMG', 'WEN', 'QSR', 'PZZA', 'DRI', 'STZ', 'KO', 'PEP']

    const allTickers = new Set<string>()
    companies?.forEach(c => allTickers.add(c.ticker))
    specificTickers.forEach(t => allTickers.add(t))

    console.log(`Auditing ${allTickers.size} companies...`)

    for (const t of Array.from(allTickers)) {
        await classifyAndFix(t)
        // small delay
        await new Promise(r => setTimeout(r, 1500)) // slightly longer delay for safety
    }
}

main()
