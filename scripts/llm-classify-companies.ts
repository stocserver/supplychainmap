/**
 * LLM-Powered Company Classifier using Gemini 2.0 Flash
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Load valid product IDs
const validProductIds: Record<string, string[]> = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'valid_product_ids_by_industry.json'), 'utf-8')
)

const validIndustries = Object.keys(validProductIds)

interface ClassificationResult {
    industry: string
    tags: string[]
}

async function classifyCompany(
    name: string,
    description: string,
    currentIndustry: string,
    currentTags: string[]
): Promise<ClassificationResult | null> {
    const prompt = `You are a financial data auditor. Your goal is to assign the MOST SPECIFIC and ACCURATE classifications for this company based on its PRIMARY business.

COMPANY: ${name}
DESCRIPTION: ${description || 'No description'}
CURRENT TAGS: ${JSON.stringify(currentTags)}

VALID INDUSTRIES: ${validIndustries.join(', ')}

VALID TAGS BY INDUSTRY (Hierarchy):
${Object.entries(validProductIds).map(([ind, tags]) => `${ind}: [${tags.slice(0, 15).join(', ')}${tags.length > 15 ? '...' : ''}]`).join('\n')}

STRICT RULES:
1. **CORE BUSINESS ONLY**: Tag the company based on its main revenue source. Do NOT tag peripheral businesses.
   - Example: A Restaurant (McDonalds) sells Coke, but is NOT 'beverages'. It is 'restaurants' and 'qsr'.
   - Example: A Car company (Tesla) involves software, but is 'electric-vehicles', NOT 'software-saas'.
2. **BE SPECIFIC**: If a specific child tag exists (e.g. 'qsr'), USE IT. Do not just use the generic parent if a specific one fits.
3. **USE ONLY VALID TAGS**: You must select tags from the VALID TAGS list above. Do not invent tags.
4. **AUDIT LOGIC**: 
   - validation: If CURRENT TAGS are perfect, return them.
   - correction: If CURRENT TAGS are missing key core tags OR contain wrong/peripheral tags, return the CORRECTED list.

TASK:
Return ONLY JSON: {"industry": "slug", "tags": ["tag1", "tag2"]}
NO OTHER TEXT.`

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text().trim()

        const jsonMatch = text.match(/\{[\s\S]*?\}/)
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]) as ClassificationResult

            if (validIndustries.includes(parsed.industry)) {
                const validTags = validProductIds[parsed.industry] || []
                // Filter proposed tags against valid list
                const validProposed = parsed.tags.filter(t => validTags.includes(t))

                if (validProposed.length > 0) {
                    parsed.tags = validProposed
                } else {
                    // If LLM returned invalid tags, fallback to Uncategorized (don't hallucinate)
                    parsed.tags = ['Uncategorized']
                }
                return parsed
            }
        }
        return null
    } catch (error: any) {
        console.error(`Error classifying ${name}:`, error.message || error)
        return null
    }
}

async function main() {
    console.log('🤖 Starting LLM-Powered Company Classifier (Gemini 2.0 Flash)')
    console.log(`Valid industries: ${validIndustries.length}`)

    // Fetch companies
    let allCompanies: any[] = []
    let from = 0
    const step = 999

    while (true) {
        const { data: batch, error } = await supabase
            .from('companies')
            .select('ticker, name, description, industry, country, value_chain_tags')
            .range(from, from + step)

        if (error) {
            console.error("Fetch Error:", error)
            break
        }
        if (!batch || batch.length === 0) {
            console.log("Batch empty, stopping.")
            break
        }

        console.log(`Fetched ${batch.length} companies...`)
        allCompanies = [...allCompanies, ...batch]
        from += step + 1
    }

    // Process ALL companies (JP + US)
    const companiesToProcess = allCompanies.sort((a, b) => a.ticker.localeCompare(b.ticker))
    console.log(`Processing ${companiesToProcess.length} companies (JP + US)...\n`)

    let updated = 0
    let errors = 0
    let skipped = 0

    for (let i = 0; i < companiesToProcess.length; i++) {
        const company = companiesToProcess[i]

        // Progress update every 10
        if (i > 0 && i % 10 === 0) {
            console.log(`\n[${i}/${companiesToProcess.length}] Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors}`)
        }

        // Retry with backoff on failure
        let result = null
        let attempts = 0
        while (attempts < 3 && !result) {
            result = await classifyCompany(
                company.name,
                company.description,
                company.industry,
                company.value_chain_tags || []
            )
            if (!result) {
                attempts++
                const delay = 5000 * Math.pow(2, attempts)
                console.log(`\nRetrying ${company.name} in ${delay / 1000}s...`)
                await new Promise(r => setTimeout(r, delay))
            }
        }

        if (result) {
            // Check if different
            const oldTags = (company.value_chain_tags || []).sort().join(',')
            const newTags = result.tags.sort().join(',')

            if (oldTags === newTags && company.industry === result.industry) {
                skipped++
                process.stdout.write('_') // No change
            } else {
                const { error: updateError } = await supabase
                    .from('companies')
                    .update({ industry: result.industry, value_chain_tags: result.tags })
                    .eq('ticker', company.ticker)

                if (!updateError) {
                    updated++
                    process.stdout.write('U') // Updated
                } else {
                    errors++
                    process.stdout.write('x')
                }
            }
        } else {
            errors++
            process.stdout.write('?')
        }

        // Rate limit: 4 seconds between requests (~15 per minute)
        await new Promise(r => setTimeout(r, 4000))
    }

    console.log(`\n\n✅ Done! Updated: ${updated}, Errors: ${errors}`)
}

main()
