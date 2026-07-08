
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'
import { normalizeCompanyClassification } from '@/lib/data/company-format'

// Init Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

// Load Unified Context
// Load Unified Context Path
const contextPath = path.resolve(process.cwd(), 'lib/data/analysis_context.json')

const cleanJson = (text: string) => {
    return text.replace(/```json/g, '').replace(/```/g, '').trim()
}

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json()

        if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 })

        // Load Context Freshly
        let contextData;
        try {
            const raw = fs.readFileSync(contextPath, 'utf-8')
            contextData = JSON.parse(raw)
        } catch (e) {
            console.error('Context Load Error', e)
            return NextResponse.json({ error: 'Analysis Context Missing' }, { status: 500 })
        }

        // ==========================================
        // PASS 1: MACRO ANALYSIS (Multi-Dimension)
        // ==========================================
        const macroPrompt = `
        You are a Supply Chain Risk Analyst.
        
        CONTEXT:
        We have a database of companies categorized by:
        1. TAXONOMY (Industry -> Products): ${JSON.stringify(contextData.taxonomy)}
        2. COUNTRIES: ${JSON.stringify(contextData.countries)}
        
        SCENARIO:
        "${query}"
        
        INSTRUCTIONS:
        1. Analyze the scenario's impact.
        2. Identify specific items from the provided lists that would be POSITIVELY or NEGATIVELY impacted.
        3. **CRITICAL:** Only select tags that are DIRECTLY related to the scenario (First-Order Supply Chain Impacts).
           - **INCLUDE:** Industries where the input is a Primary Cost Driver (e.g. Fuel for Airlines) or Direct Revenue Driver.
           - **EXCLUDE:** Tertiary macroeconomic effects like "Consumer Disposable Income" or "General Inflation" unless the query is explicitly about inflation.
           - Example: "OPEC increases volume" -> Airlines, Logistics, Chemicals (Positive). DO NOT include Retail, Luxury, or Pets based on "spending power".
           - **COMMODITY RULE:** If Supply INCREASES -> Price DROPS.
             *   **Producers** (e.g. Oil Drillers) -> **NEGATIVE** (Lower Margins).
             *   **Consumers** (e.g. Airlines) -> **POSITIVE** (Lower Costs).
        4. Return JSON with this structure:
        {
            "summary": "Brief analysis (2-3 sentences).",
            "impacts": {
                "products": [{ "tag": "Foundry", "sentiment": "negative" }],
                "industries": [{ "tag": "Semiconductors", "sentiment": "negative" }],
                "countries": [{ "tag": "TW", "sentiment": "negative" }]
            }
        }
        
        RULES:
        - Only use exact strings from the lists.
        - If no clear impact for a category, return empty array.
        - Return RAW JSON ONLY. No Markdown.
        `

        const macroResult = await model.generateContent(macroPrompt)
        const macroText = cleanJson(macroResult.response.text())
        let macroAnalysis;

        try {
            macroAnalysis = JSON.parse(macroText)
        } catch (e) {
            const jsonMatch = macroText.match(/\{[\s\S]*?\}/)
            if (jsonMatch) macroAnalysis = JSON.parse(jsonMatch[0])
            else throw new Error('Invalid Macro LLM response')
        }

        const productTags = macroAnalysis.impacts.products?.map((i: any) => i.tag) || []
        const industryTags = macroAnalysis.impacts.industries?.map((i: any) => i.tag) || []
        const countryTags = macroAnalysis.impacts.countries?.map((i: any) => i.tag) || []

        if (productTags.length === 0 && industryTags.length === 0 && countryTags.length === 0) {
            return NextResponse.json({ analysis: macroAnalysis, companies: [] })
        }

        // ==========================================
        // DB FETCH: Dynamic Filtering
        // ==========================================
        // We want companies that match ANY of the identified risks.
        // OR logic: (products match) OR (industry match) OR (country match).
        // Supabase/PostgREST uses correct OR syntax: `or=(col.in.val,col.ov.val)`

        // Construct the OR query string dynamically
        const orConditions: string[] = [];
        if (productTags.length > 0) {
            orConditions.push(`value_chain_tags.cs.{${productTags.join(',')}}`);
        }
        if (industryTags.length > 0) {
            orConditions.push(`industry_slug.in.(${industryTags.map((t: string) => `"${t}"`).join(',')})`);
        }
        if (countryTags.length > 0) {
            orConditions.push(`country.in.(${countryTags.join(',')})`);
        }

        const orQuery = orConditions.join(',');

        const { data: companies, error } = await supabase
            .from('companies')
            .select('ticker, name, description, country, market_cap, logo_url, value_chain_tags, product_tags, industry, industry_slug')
            .or(orQuery)
            .order('market_cap', { ascending: false })
            .limit(3000)

        if (error) throw error
        const normalizedCompanies = (companies || []).map((row: any) => normalizeCompanyClassification(row))
        if (normalizedCompanies.length === 0) {
            return NextResponse.json({ analysis: macroAnalysis, companies: [] })
        }

        // ==========================================
        // FILTER & SORT BY RELEVANCE
        // ==========================================
        const scoredCompanies = normalizedCompanies.map(c => {
            let score = 0;
            const matchedTags: string[] = [];

            // 1. Check Product Tags (Highest Weight)
            if (Array.isArray(c.value_chain_tags)) {
                // @ts-ignore
                const intersection = c.value_chain_tags.filter(t => productTags.includes(t))
                if (intersection.length > 0) {
                    score += 2
                    matchedTags.push(...intersection)
                }
            }

            // 2. Check Industry 
            if (industryTags.includes(c.industry)) {
                score += 1
                matchedTags.push(c.industry)
            }

            // 3. Check Country
            if (countryTags.includes(c.country)) {
                score += 1
                matchedTags.push(c.country)
            }

            return { ...c, relevanceScore: score, _matchedTags: matchedTags }
        })

        // Sort descending by score
        scoredCompanies.sort((a, b) => b.relevanceScore - a.relevanceScore)

        // Take Top 6 for Micro Analysis (Increased from 3)
        const topCompanies = scoredCompanies.slice(0, 6)

        // ==========================================
        // PASS 2: MICRO ANALYSIS
        // ==========================================
        const companyContext = topCompanies.map(c => ({
            ticker: c.ticker,
            name: c.name,
            country: c.country,
            industry: c.industry,
            description: (c.description || "").substring(0, 300) + "...",
            matched_criteria: c._matchedTags
        }))

        const microPrompt = `
        You are a Supply Chain Risk Analyst.
        
        SCENARIO:
        "${query}"
        
        MACRO ASSESSMENT:
        ${macroAnalysis.summary}
        
        TASK:
        Review these specific companies. 
        We selected them because they match the following risk criteria: ${JSON.stringify(companyContext.map(c => ({ n: c.name, m: c.matched_criteria })))}.
        
        Determine if each is "positive" (Winner), "negative" (Loser), or "neutral".
        Provide a DIRECT, PUNCHY reason (max 20 words).
        - DO NOT restate the company name.
        - Start immediately with the mechanism (e.g. "Heavy reliance on Taiwan fabs...", "Direct exposure to...").
        
        COMPANIES:
        ${JSON.stringify(companyContext, null, 2)}
        
        RETURN FORMAT (JSON Array):
        [
            {
                "ticker": "AAPL",
                "sentiment": "negative", // MUST BE: "positive", "negative", or "neutral"
                "reason": "..."
            }
        ]
        
        RULES:
        - Return RAW JSON Array ONLY. No Markdown.
        - Must return an entry for every company.
        `

        const microResult = await model.generateContent(microPrompt)
        const microText = cleanJson(microResult.response.text())
        let microAnalysis;

        try {
            microAnalysis = JSON.parse(microText)
        } catch (e) {
            const jsonMatch = microText.match(/\[[\s\S]*?\]/)
            if (jsonMatch) microAnalysis = JSON.parse(jsonMatch[0])
            else throw new Error('Invalid Micro LLM response')
        }

        // ==========================================
        // MERGE RESULTS
        // ==========================================

        const finalCompanies = topCompanies.map(c => {
            const feedback = microAnalysis.find((m: any) => m.ticker === c.ticker)

            // Reconstruct "matched_impacts" for UI using flattened product tags + industry/country if matched
            const matchedImpacts = []

            // Check products
            if (c.value_chain_tags) {
                c.value_chain_tags.forEach((t: string) => {
                    if (productTags.includes(t)) matchedImpacts.push({ tag: t, sentiment: 'neutral', reason: 'Product match' })
                })
            }
            // Check industry
            if (industryTags.includes(c.industry)) {
                matchedImpacts.push({ tag: c.industry, sentiment: 'neutral', reason: 'Industry match' })
            }
            // Check country
            if (countryTags.includes(c.country)) {
                matchedImpacts.push({ tag: c.country, sentiment: 'neutral', reason: 'Country match' })
            }

            return {
                ...c,
                matched_impacts: matchedImpacts,
                overall_sentiment: feedback?.sentiment || 'neutral',
                specific_reason: feedback?.reason || "No specific analysis provided."
            }
        })

        finalCompanies.sort((a, b) => {
            const score = (s: string) => s === 'neutral' ? 0 : 1
            return score(b.overall_sentiment) - score(a.overall_sentiment)
        })

        return NextResponse.json({
            analysis: macroAnalysis,
            companies: finalCompanies
        })

    } catch (error: any) {
        console.error('Analysis API Error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
