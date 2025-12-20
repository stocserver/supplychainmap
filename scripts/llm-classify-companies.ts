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
1. **PRIMARY REVENUE SOURCE**: You must identify the ONE primary industry that generates the most revenue. 
   - A company may have multiple segments, but you must choose the MOST iconic and primary one.
   - Example: **Tesla** is 'electric-vehicles', NOT 'energy-storage' or 'ai-ml', even though they have those segments.
   - Example: **Amazon** is 'ecommerce', NOT 'cloud-computing', despite AWS being profitable.
2. **CORE BUSINESS ONLY**: Do NOT tag peripheral businesses.
3. **BE SPECIFIC**: Use the most granular tag available in the VALID TAGS list.
4. **USE ONLY VALID TAGS**: Do not invent tags. If no tag fits perfectly, use 'Uncategorized'.

TASK:
Audit the current classification. If the company is in a secondary segment (like Tesla in 'energy-storage'), MOVE IT to its primary segment (e.g. 'electric-vehicles').

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

    const tickersArg = process.argv.find(a => a.startsWith('--tickers='))
    const targetTickers = tickersArg ? tickersArg.split('=')[1].split(',').map(t => t.trim().toUpperCase()) : null

    while (true) {
        const query = supabase
            .from('companies')
            .select('ticker, name, description, industry, country, value_chain_tags')
            .range(from, from + step)

        const { data: batch, error } = await query

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

    // Process companies
    let companiesToProcess = allCompanies.sort((a, b) => a.ticker.localeCompare(b.ticker))

    if (targetTickers) {
        companiesToProcess = companiesToProcess.filter(c => targetTickers.includes(c.ticker))
        console.log(`Filtering to ${companiesToProcess.length} targeted tickers.`)
    }
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
