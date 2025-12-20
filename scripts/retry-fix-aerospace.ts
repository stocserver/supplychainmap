
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from 'dotenv'
import path from 'path'
import { aerospaceProductStages } from '../lib/industries/aerospace-defense.products'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

// Extract IDs exactly as defined in the product file
const validTags: string[] = []
const extract = (products: any[]) => {
    products.forEach(p => {
        if (p.id) validTags.push(p.id)
        if (p.subProducts) extract(p.subProducts)
    })
}
aerospaceProductStages.forEach((s: any) => extract(s.products))

console.log("Valid Aerospace TAGS:", validTags)

async function fixCompany(ticker: string, company: any) {
    const prompt = `You are a financial data auditor. 

COMPANY: ${company.name}
DESCRIPTION: ${company.description || ''}
CURRENT TAGS: ${JSON.stringify(company.value_chain_tags)}
INDUSTRY: aerospace-defense

VALID TAGS (HIERARCHY):
- Aircraft Manufacturing
    - commercial-aircraft (Boeing, Airbus, Embraer)
    - business-jets (Gulfstream, Bombardier, Textron)
    - fighter-aircraft (Lockheed Martin, Boeing Defense)
    - missile-systems (Raytheon, Lockheed)
    - defense-systems (General Defense)
- Components
    - avionics
    - engines
    - components-parts
    - titanium-alloys
    - composites
- Operations
    - airlines
    - legacy-carriers
    - low-cost-carriers
    - mro
    - engine-mro (Lufthansa Technik)

STRICT RULES:
1. **BE SPECIFIC**: Do NOT just use "defense-systems" if they make "fighter-aircraft". Use BOTH or just the specific one.
   - If they make Fighter Jets (F-35, F-16, F-15, F/A-18), YOU MUST TAG 'fighter-aircraft'.
   - If they make Commercial Jets (737, A320), YOU MUST TAG 'commercial-aircraft'.
   - If they make Business Jets (Cessna, Gulfstream), YOU MUST TAG 'business-jets'.
   - If they make Titanium, YOU MUST TAG 'titanium-alloys'.
   - If they are Raytheon (RTX), they make 'missile-systems', 'avionics', 'engines'.
2. **CORE BUSINESS ONLY**: Revenue drivers only.

TASK:
Return ONLY JSON: {"tags": ["tag1", "tag2", ...]}
`

    let attempts = 0
    while (attempts < 3) {
        try {
            const result = await model.generateContent(prompt)
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim()
            const parsed = JSON.parse(text)

            // Filter
            let finalTags = parsed.tags.filter((t: string) => validTags.includes(t))

            // Force valid tags check
            if (finalTags.length > 0) {
                const { error } = await supabase
                    .from('companies')
                    .update({
                        value_chain_tags: finalTags,
                        updated_at: new Date().toISOString()
                    })
                    .eq('ticker', ticker)

                if (!error) {
                    console.log(`✅ ${company.name}: ${JSON.stringify(finalTags)}`)
                    return // Success
                }
                else console.error(`❌ DB Error ${ticker}:`, error)
            } else {
                console.log(`⚠️ ${company.name}: No valid tags found. (Proposed: ${parsed.tags})`)
                return
            }
        } catch (e: any) {
            console.error(`Error ${ticker} (Attempt ${attempts + 1}):`, e.message || e)
            attempts++
            await new Promise(r => setTimeout(r, 2000))
        }
    }
}

async function main() {
    const targetTickers = ['LMT', 'BA', 'RTX', 'NOC', 'GD', 'SPR', 'GE', 'EADSY', 'AIR', 'HXL']

    const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .in('ticker', targetTickers)

    console.log(`Retrying ${companies?.length} Aerospace companies...`)

    for (const c of companies || []) {
        await fixCompany(c.ticker, c)
        await new Promise(r => setTimeout(r, 1000))
    }
}

main()
