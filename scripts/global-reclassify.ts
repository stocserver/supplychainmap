
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

// 1. Build valid tags map dynamically
const validProductIds: Record<string, string[]> = {}
const extractIds = (products: ProductCategory[], list: string[]) => {
    products.forEach(p => {
        if (p.id) list.push(p.id)
        if (p.subProducts) extractIds(p.subProducts, list)
    })
}

try {
    console.log("Building Valid Tags Map from Source...")
    for (const ind of industriesStructure) {
        const list: string[] = []
        try {
            // dynamically require the product definition file
            // Note: In TSX this works if files are compiled or if ts-node handles it. 
            // Given fix-food-allocation worked, this approach is valid.
            // But we need to know the export name. Food had `foodBeverageProductStages`.
            // Aerospace has `aerospaceProductStages`?
            // This is brittle. 
            // Alternative: Simply traverse the `subProducts` if they are attached to `industriesStructure`?
            // No, structure only has names.

            // Let's assume the naming convention: `[slug]ProductStages` in camelCase?
            // Actually, we can just load the default export or inspect exports.
            const fileKey = ind.slug === 'aerospace-defense' ? 'aerospace-defense' : ind.slug
            const mod = require(`../lib/industries/${fileKey}.products`)

            // Find the export that is an array
            const exportKey = Object.keys(mod).find(k => Array.isArray(mod[k]))
            if (exportKey && mod[exportKey]) {
                const stages = mod[exportKey]
                stages.forEach((s: any) => extractIds(s.products, list))
                validProductIds[ind.slug] = list
                console.log(`Loaded ${list.length} tags for ${ind.slug}`)
            } else {
                console.warn(`No stages array found for ${ind.slug}`)
            }
        } catch (e: any) {
            console.error(`Error loading products for ${ind.slug}: ${e.message}`)
        }
    }
} catch (e) {
    console.error("Critical error building tags:", e)
    process.exit(1)
}

async function classifyAndFix(ticker: string, currentCompany: any) {
    // If we don't know the industry or it's uncategorized, we try to guess from ALL?
    // User wants to re-classify within industry mostly.
    // If industry is null, we can't strict validate easily.
    const industrySlug = currentCompany.industry || 'uncategorized'
    const validTags = validProductIds[industrySlug]

    if (!validTags || validTags.length === 0) {
        // console.warn(`No valid tags map for ${industrySlug} (Company: ${ticker}). Skipping strict check but might classify if industry changes.`)
        // Actually, without valid tags we can't use the strict logic.
        return
    }

    const prompt = `You are a financial data auditor. Your goal is to assign the MOST SPECIFIC and ACCURATE classifications for this company based on its PRIMARY business.

COMPANY: ${currentCompany.name}
DESCRIPTION: ${currentCompany.description || 'No description'}
CURRENT TAGS: ${JSON.stringify(currentCompany.value_chain_tags)}
INDUSTRY: ${industrySlug}

VALID TAGS FOR ${industrySlug}:
[${validTags.slice(0, 100).join(', ')}${validTags.length > 100 ? '...' : ''}]

STRICT RULES:
1. **CORE BUSINESS ONLY**: Tag the company based on its main revenue source. Do NOT tag peripheral businesses.
2. **BE SPECIFIC**: Use the most specific child tag available (e.g. 'qsr' instead of just 'restaurants').
3. **USE ONLY VALID TAGS**: Pick from the list above. Do not invent tags.
4. **OUTPUT**: Return the Corrected JSON.

TASK:
Return ONLY JSON: {"industry": "${industrySlug}", "tags": ["tag1", "tag2"]}
NO OTHER TEXT.`

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim()
        const parsed = JSON.parse(text)

        // Filter proposed tags
        let validatedTags = parsed.tags.filter((t: string) => validTags.includes(t))

        // If LLM returned nothing valid but current tags are somewhat valid, keep current?
        // No, user wants Aggressive Fix. If "Core Business Only" means deleting peripheral tags, we respect the empty list (or fallback to Uncategorized).
        // But preventing empty companies is also good.
        // Let's stick to validated tags.

        if (validatedTags.length > 0) {
            // Check if different from DB
            const oldTags = (currentCompany.value_chain_tags || []).sort().join(',')
            const newTags = validatedTags.sort().join(',')

            if (oldTags !== newTags) {
                const { error } = await supabase
                    .from('companies')
                    .update({
                        value_chain_tags: validatedTags,
                        updated_at: new Date().toISOString()
                    })
                    .eq('ticker', ticker)

                if (error) {
                    process.stdout.write('x')
                } else {
                    process.stdout.write('U') // Update
                }
            } else {
                process.stdout.write('_') // No change
            }
        } else {
            // LLM found no valid tags in this industry context
            process.stdout.write('?')
        }

    } catch (e) {
        process.stdout.write('E')
        // console.error(e)
    }
}

async function main() {
    console.log("Starting Global Re-classification...")

    // Fetch ALL companies
    let allCompanies: any[] = []
    let from = 0
    while (true) {
        const { data, error } = await supabase.from('companies').select('ticker, name, description, industry, value_chain_tags').range(from, from + 999)
        if (error || !data || data.length === 0) break
        allCompanies = [...allCompanies, ...data]
        from += 1000
    }

    console.log(`Processing ${allCompanies.length} companies...`)

    for (const c of allCompanies) {
        await classifyAndFix(c.ticker, c)
        // Rate limit 2s
        await new Promise(r => setTimeout(r, 2000))
    }
    console.log("\nDone!")
}

main()
