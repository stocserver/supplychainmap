
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

// Extract valid tags
const validTags: string[] = []
const extract = (products: any[]) => {
    products.forEach(p => {
        if (p.id) validTags.push(p.id)
        if (p.subProducts) extract(p.subProducts)
    })
}
aerospaceProductStages.forEach((s: any) => extract(s.products))

async function fixMRO(ticker: string) {
    const { data: company } = await supabase.from('companies').select('*').eq('ticker', ticker).single()
    if (!company) { console.log(`${ticker} not found`); return }

    const prompt = `You are a financial data auditor. 

COMPANY: ${company.name}
DESCRIPTION: ${company.description || ''}
CURRENT TAGS: ${JSON.stringify(company.value_chain_tags)}
INDUSTRY: aerospace-defense

VALID MRO TAGS:
- mro (Parent)
    - engine-mro (Engines only)
    - airframe-mro (Structures, modifications, landing gear)

STRICT RULES:
1. **SPECIFICITY**: If the company does maintenance on AIRFRAMES (structure, fuselage, landing gear, modifications), you MUST tag 'airframe-mro'.
2. If they do generic MRO or both, tag 'mro' AND the children.
3. AAR Corp and ST Engineering are known for Airframe MRO.

TASK:
Return ONLY JSON: {"tags": ["tag1", "tag2"]}
`

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim()
        const parsed = JSON.parse(text)

        let finalTags = parsed.tags.filter((t: string) => validTags.includes(t))

        // Merge with existing tags (don't lose others)
        const existingInfo = company.value_chain_tags || []
        // But we want to OVERWRITE the MRO parts to be specific
        // Actually, let's just merge them uniquely
        const merged = Array.from(new Set([...existingInfo, ...finalTags]))

        if (finalTags.includes('airframe-mro') || finalTags.includes('engine-mro')) {
            const { error } = await supabase
                .from('companies')
                .update({
                    value_chain_tags: merged,
                    updated_at: new Date().toISOString()
                })
                .eq('ticker', ticker)

            if (!error) console.log(`✅ ${company.name}: Added ${JSON.stringify(finalTags)} -> Total: ${JSON.stringify(merged)}`)
            else console.error(`❌ DB Error ${ticker}:`, error)
        } else {
            console.log(`⚠️ ${company.name}: LLM didn't pick specific MRO tags. (Proposed: ${parsed.tags})`)
        }

    } catch (e) {
        console.error(`Error ${ticker}:`, e)
    }
}

async function main() {
    // Known MRO players
    const targets = ['AIR', 'SGGKY', 'DLAKY', 'SA', 'SPR']

    console.log(`Fixing MRO tags for ${targets.join(', ')}...`)
    for (const t of targets) {
        await fixMRO(t)
        await new Promise(r => setTimeout(r, 1000))
    }
}

main()
