
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenAI } from '@google/genai'

// Init Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Init Gemini (old SDK for chat and embeddings)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

// Init Gemini (new SDK for Google Search grounding)
const genAINew = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// Embedding models - V1 (768 dims) and V2 (3072 dims)
const embeddingModelV1 = genAI.getGenerativeModel({ model: "text-embedding-004" })
const embeddingModelV2 = genAI.getGenerativeModel({ model: "gemini-embedding-001" })

// Helper to clean JSON
function cleanJson(text: string): string {
    return text.replace(/```json\n?|\n?```/g, '').trim()
}

// Helper to retry Gemini calls on 503 errors
const executeGeminiCall = async (fn: () => Promise<any>, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn()
        } catch (error: any) {
            if (error.message?.includes('503') || error.message?.includes('Service Unavailable') || error.message?.includes('overloaded')) {
                if (i === retries - 1) throw error
                console.log(`⚠️ API 503 Overloaded. Retrying in ${(i + 1) * 2}s...`)
                await new Promise(resolve => setTimeout(resolve, (i + 1) * 2000))
                continue
            }
            throw error
        }
    }
}

// Core Analysis Logic
async function processAnalysis(query: string, embeddingVersion: string, log: (msg: string) => Promise<void>) {
    const isV2 = embeddingVersion === 'v2'
    await log(`⚙️ Initializing analysis protocol: ${query}`)

    // ==========================================
    // STEP 1: LIVE WEB SEARCH
    // ==========================================
    let liveSearchContext = ''
    let liveCompanyNames: string[] = []
    let structuredExtraction: any = null

    try {
        await log('📡 Establishing secure data uplink...')

        const liveSearchPrompt = `
Based on this scenario, search the web to find BOTH winners and losers:

SCENARIO: "${query}"

Search for and identify:
1. **BENEFICIARIES (WINNERS)**: Which public companies will GAIN from this scenario?
   - Competitors who gain market share
   - Alternative suppliers who become more valuable
   - Companies that benefit from substitution or increased demand

2. **NEGATIVELY AFFECTED (LOSERS)**: Which public companies will be HARMED?
   - Companies directly impacted by supply disruption
   - Companies with revenue exposure to affected regions
   - Companies dependent on affected resources

3. **INVESTORS/STAKEHOLDERS**: Who has ownership stakes or partnerships?

Return a balanced summary that includes SPECIFIC company names for BOTH sides (winners AND losers).
Focus on PUBLICLY TRADED companies only.
`
        let searchResult: any
        try {
            // Add timeout to prevent indefinite hanging (30s max for Gemini call)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Gemini API timeout after 30s')), 30000)
            )
            searchResult = await Promise.race([
                executeGeminiCall(() => genAINew.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: [{ text: liveSearchPrompt }],
                    tools: [{ googleSearch: {} }]
                } as any)),
                timeoutPromise
            ])
            liveSearchContext = (searchResult as any).text || ''
            await log(`📶 Incoming data stream active...`)
        } catch (geminiError: any) {
            await log(`❌ Live search failed: ${geminiError.message || 'Unknown error'}`)
            // Continue without live search context if it fails
            liveSearchContext = ''
        }

        // ==========================================
        // STRUCTURED EXTRACTION
        // ==========================================
        await log('💾 Parsing external signals & entities...')

        const structuredExtractionPrompt = `
Analyze this scenario and extract STRUCTURED relationships with publicly traded companies.

SCENARIO: "${query}"

LIVE WEB INTELLIGENCE:
${liveSearchContext}

STEP 1: Classify the scenario type:
- IPO: Company going public
- TARIFF: Trade barriers, import taxes
- SANCTIONS: Government restrictions on trade/business
- WAR: Military conflict affecting regions/supply chains
- COMMODITY_PRICE: Price surge or drop in commodities (oil, uranium, lithium, etc.)
- SUPPLY_SHORTAGE: Factory shutdowns, disasters, capacity constraints
- DEMAND_CHANGE: Consumer demand shift up or down
- REGULATORY: New regulations, policy changes
- CORPORATE: Earnings, mergers, acquisitions, bankruptcies

STEP 2: Extract ALL company relationships mentioned with their IMPACT:
- POSITIVE: Company will BENEFIT (higher revenue, market share, stock price)
- NEGATIVE: Company will be HARMED (higher costs, lost revenue, disruption)

Return JSON:
{
    "scenario_type": "IPO | TARIFF | SANCTIONS | WAR | COMMODITY_PRICE | SUPPLY_SHORTAGE | DEMAND_CHANGE | REGULATORY | CORPORATE",
    "affected_subject": "What is affected (e.g., 'SpaceX', 'Chinese semiconductors', 'uranium')",
    "affected_region": "Geographic area if relevant (e.g., 'China', 'Taiwan', 'Middle East')",
    
    "companies": [
        {
            "name": "Alphabet",
            "ticker_if_known": "GOOGL",
            "relationship": "investor",
            "impact": "positive",
            "reason": "Owns 7.5% stake, IPO increases NAV"
        },
        {
            "name": "Rocket Lab",
            "ticker_if_known": "RKLB",
            "relationship": "competitor",
            "impact": "negative",
            "reason": "Competes for launch contracts, SpaceX IPO draws investor attention away"
        }
    ]
}

RELATIONSHIPS can be: investor, shareholder, competitor, supplier, customer, manufacturer, operator, alternative_supplier, dependent, partner

**CRITICAL BALANCE REQUIREMENT**:
- You MUST include BOTH positive AND negative impacts.
- **SUBSTITUTION LOGIC**: If a major supplier is disrupted (earthquake, war, strikes), their COMPETITORS in unaffected regions are **WINNERS**.
  - Example: "Tokyo earthquake" -> Tokyo suppliers = NEGATIVE, Korean/Taiwanese competitors = POSITIVE
  - Example: "China tariffs" -> China manufacturers = NEGATIVE, Vietnam/India/US alternatives = POSITIVE
- For price surges: Producers BENEFIT, Consumers HARMED.
- For price drops: Consumers BENEFIT, Producers HARMED.

Return RAW JSON ONLY.`

        const structuredResult = await executeGeminiCall(() => chatModel.generateContent(structuredExtractionPrompt))
        const structuredText = cleanJson(structuredResult.response.text())

        try {
            structuredExtraction = JSON.parse(structuredText)
            // await log(`📊 Scenario Type: ${structuredExtraction.scenario_type}`)
            await log(`📊 Identified ${structuredExtraction.companies?.length || 0} entities of interest`)

            if (structuredExtraction.companies) {
                const positive = structuredExtraction.companies.filter((c: any) => c.impact === 'positive').length
                const negative = structuredExtraction.companies.filter((c: any) => c.impact === 'negative').length
                await log(`⚖️ Computing market sentiment...`)
                // await log(`📊 Impact breakdown: 🟢 ${positive} positive, 🔴 ${negative} negative`)

                // Extract company names for later matching
                liveCompanyNames = structuredExtraction.companies.map((c: any) => c.name)
            }
        } catch (e) {
            await log('⚠️ Resynchronizing data stream...')
            // Fallback: simple company name extraction
            const fallbackResult = await executeGeminiCall(() => chatModel.generateContent(`Extract company names from: "${liveSearchContext}". Return JSON array: ["Company1", "Company2"]`))
            try {
                liveCompanyNames = JSON.parse(cleanJson(fallbackResult.response.text()))
            } catch (e2) {
                console.log('⚠️ Fallback extraction also failed')
            }
        }

    } catch (e: any) {
        await log(`⚠️ Connection interruption: ${e.message}`)
    }

    // ==========================================
    // STEP 2: Embed the Query
    // ==========================================
    const embeddingModel = isV2 ? embeddingModelV2 : embeddingModelV1
    const embeddingResult = await executeGeminiCall(() => embeddingModel.embedContent(query))
    const queryEmbedding = embeddingResult.embedding.values

    // ==========================================
    // STEP 2: Vector Search - Find Similar Companies
    // ==========================================
    await log('🔍 Querying internal node database...')
    const rpcFunction = isV2 ? 'match_companies_by_embedding_v2' : 'match_companies_by_embedding'
    const { data: ragCompanies, error: searchError } = await supabase.rpc(
        rpcFunction,
        {
            query_embedding: queryEmbedding,
            match_count: 15 // Reduced to make room for tag-matched
        }
    )

    if (searchError) throw searchError
    // await log(`📊 RAG found ${ragCompanies?.length || 0} companies`)

    // ==========================================
    // STEP 2.5: REASONING AGENT - Multi-Hop Discovery
    // ==========================================
    await log('⚡ Running heuristic algorithms...')

    // Extract industries, hidden relationships, and equity search terms
    const extractionPrompt = `
You are a Reasoning Agent specializing in discovering HIDDEN EQUITY RELATIONSHIPS.

Scenario: "${query}"

Your task is to think step by step and identify:

1. **DIRECT INDUSTRIES**: What industries are directly mentioned or implied?
- upstream_industries: Who PRODUCES the commodity/service?
- downstream_industries: Who CONSUMES it?

2. **HIDDEN EQUITY RELATIONSHIPS**: Think about:
- Who has OWNERSHIP STAKES in companies related to this scenario?
- Who are the major INVESTORS or SHAREHOLDERS?
- Are there JOINT VENTURES or SUBSIDIARIES involved?
- Which CONGLOMERATES or HOLDING COMPANIES might benefit indirectly?

3. **EQUITY SEARCH TERMS**: Generate 3-5 search queries that would help find:
- Companies with ownership stakes in the primary subject
- Major shareholders or venture capital investors
- Parent companies or conglomerates

EXAMPLES:
- "SpaceX IPO" → equity_search_terms: ["SpaceX major shareholders", "Google Alphabet SpaceX investment", "venture capital space technology investors"]
- "TSMC chip shortage" → equity_search_terms: ["Apple TSMC supplier relationship", "Nvidia chip manufacturing partner", "Berkshire Hathaway semiconductor holdings"]
- "Tesla Model Y sales surge" → equity_search_terms: ["Tesla institutional investors", "Elon Musk other companies", "electric vehicle supply chain investors"]

Return JSON:
{
    "scenario_type": "IPO | PRICE_SURGE | SUPPLY_SHORTAGE | DEMAND_SHOCK | TRADE_BARRIER",
    "primary_subject": "SpaceX",
    "commodity": "space technology",
    "upstream_industries": ["aerospace"],
    "downstream_industries": ["telecommunications"],
    "equity_search_terms": [
        "SpaceX major shareholders",
        "Google Alphabet SpaceX stake",
        "SpaceX venture capital investors"
    ],
    "reasoning": "Brief explanation of why these relationships matter..."
}

Industry slugs: semiconductors, mining-materials, utilities, oil-gas, chemicals, automotive, airlines, telecommunications, pharmaceuticals, electric-vehicles, aerospace, fintech, asset-management
Return RAW JSON only.`

    let tagMatchedCompanies: any[] = []
    let equityMatchedCompanies: any[] = []
    let extractionResult: any = null

    try {
        const extractResult = await executeGeminiCall(() => chatModel.generateContent(extractionPrompt))
        const extractText = cleanJson(extractResult.response.text())
        extractionResult = JSON.parse(extractText)

        // ==========================================
        // STAGE 2A: Industry-Based Tag Matching
        // ==========================================
        const allIndustries = [
            ...(extractionResult.upstream_industries || []),
            ...(extractionResult.downstream_industries || [])
        ]

        if (allIndustries.length > 0) {
            await log(`📂 Indexing sector relationships: ${allIndustries.join(', ')}`)
            const { data: industryCompanies } = await supabase
                .from('companies')
                .select('ticker, name, industry, country, description, value_chain_tags, market_cap, deep_research')
                .in('industry', allIndustries)
                .order('market_cap', { ascending: false })
                .limit(10)

            if (industryCompanies) {
                tagMatchedCompanies = industryCompanies.map(c => ({
                    ...c,
                    similarity: 0.5,
                    source: 'industry_tag'
                }))
            }
        }

        // ==========================================
        // STAGE 2B: EQUITY VECTOR SEARCH (Multi-Hop)
        // ==========================================
        if (extractionResult.equity_search_terms && extractionResult.equity_search_terms.length > 0) {
            await log('🔗 Analyzing ownership structures...')

            for (const searchTerm of extractionResult.equity_search_terms.slice(0, 3)) { // Max 3 searches
                try {
                    const equityEmbedding = await executeGeminiCall(() => embeddingModel.embedContent(searchTerm))
                    const { data: equityCompanies } = await supabase.rpc(
                        rpcFunction,
                        {
                            query_embedding: equityEmbedding.embedding.values,
                            match_count: 5
                        }
                    )

                    if (equityCompanies && equityCompanies.length > 0) {
                        const markedCompanies = equityCompanies.map((c: any) => ({
                            ...c,
                            source: 'equity_search',
                            equity_context: searchTerm
                        }))
                        equityMatchedCompanies.push(...markedCompanies)
                        // await log(`   🔗 Matches for "${searchTerm}": ${equityCompanies.length}`)
                    }
                } catch (e) {
                    // ignore
                }
            }
        }

    } catch (e) {
        // await log('⚠️ Reasoning Agent failed, proceeding with RAG only')
    }

    // ==========================================
    // STEP 2.7: LIVE SEARCH COMPANY MATCHING
    // ==========================================
    await log('🔄 Correlating disparate data sources...')
    let liveMatchedCompanies: any[] = []
    let targetCompanyNames: string[] = []

    if (structuredExtraction?.companies && Array.isArray(structuredExtraction.companies)) {
        const winners = structuredExtraction.companies.filter((c: any) => c.impact === 'positive').map((c: any) => c.name)
        const losers = structuredExtraction.companies.filter((c: any) => c.impact === 'negative').map((c: any) => c.name)

        const maxLength = Math.max(winners.length, losers.length)
        for (let i = 0; i < maxLength; i++) {
            if (winners[i]) targetCompanyNames.push(winners[i])
            if (losers[i]) targetCompanyNames.push(losers[i])
        }
    }

    if (targetCompanyNames.length === 0 && liveCompanyNames.length > 0) {
        targetCompanyNames = liveCompanyNames
    }

    // Ensure uniqueness and limit total checks
    targetCompanyNames = [...new Set(targetCompanyNames)].slice(0, 25)

    if (targetCompanyNames.length > 0) {
        try {
            const normalizeCompanyName = (name: string): string[] => {
                let variants: string[] = []
                variants.push(name)
                const withoutParens = name.replace(/\s*\([^)]*\)/g, '').trim()
                if (withoutParens !== name) variants.push(withoutParens)
                const suffixes = [' Inc.', ' Inc', ' Corp.', ' Corp', ' Corporation', ' Ltd.', ' Ltd', ' Limited', ' PLC', ' plc', ' Group', ' NV', ' S.A.', ' SA', ' AG', ' SE']
                suffixes.forEach(suffix => {
                    if (name.endsWith(suffix)) variants.push(name.slice(0, -suffix.length))
                })
                return [...new Set(variants)]
            }

            const getStructuredData = (companyName: string) => {
                if (!structuredExtraction?.companies) return null
                return structuredExtraction.companies.find((c: any) =>
                    c.name.toLowerCase().includes(companyName.toLowerCase()) ||
                    companyName.toLowerCase().includes(c.name.toLowerCase())
                )
            }

            for (const companyName of targetCompanyNames) {
                try {
                    const searchVariants = normalizeCompanyName(companyName)
                    let found = false
                    for (const variant of searchVariants) {
                        if (found) break

                        // Try exact/prefix match first
                        let { data: matchedCompanies } = await supabase
                            .from('companies')
                            .select('ticker, name, description, country, industry, logo_url, market_cap, value_chain_tags')
                            .ilike('name', variant)
                            .limit(1)

                        // If no exact match, try broad match (contains)
                        if (!matchedCompanies || matchedCompanies.length === 0) {
                            const { data: broadMatch } = await supabase
                                .from('companies')
                                .select('ticker, name, description, country, industry, logo_url, market_cap, value_chain_tags')
                                .ilike('name', `%${variant}%`)
                                .limit(1)
                            matchedCompanies = broadMatch
                        }

                        if (matchedCompanies && matchedCompanies.length > 0) {
                            const exists = ragCompanies.some((c: any) => c.ticker === matchedCompanies[0].ticker) ||
                                tagMatchedCompanies.some((c: any) => c.ticker === matchedCompanies[0].ticker) ||
                                equityMatchedCompanies.some((c: any) => c.ticker === matchedCompanies[0].ticker) ||
                                liveMatchedCompanies.some((c: any) => c.ticker === matchedCompanies[0].ticker)

                            if (!exists) {
                                const structuredData = getStructuredData(companyName)
                                liveMatchedCompanies.push({
                                    ...matchedCompanies[0],
                                    source: 'live_search',
                                    live_context: liveSearchContext.slice(0, 500) + '...',
                                    extracted_relationship: structuredData?.relationship || null,
                                    extracted_impact: structuredData?.impact || null,
                                    extracted_reason: structuredData?.reason || null
                                })
                                found = true
                            }
                        }
                    }
                } catch (err: any) {
                    // ignore
                }
            }
            // await log(`🌐 Matched ${liveMatchedCompanies.length} companies from live search`)
        } catch (e: any) {
            // await log('⚠️ Live company matching failed')
        }
    }

    // ==========================================
    // STEP 3: Merge & Deduplicate
    // ==========================================
    const ragWithSource = (ragCompanies || []).map((c: any) => ({ ...c, source: 'rag' }))
    const allCompanies = [...ragWithSource]
    const existingTickers = new Set(allCompanies.map((c: any) => c.ticker))

    for (const tc of tagMatchedCompanies) {
        if (!existingTickers.has(tc.ticker)) {
            allCompanies.push(tc); existingTickers.add(tc.ticker)
        }
    }
    for (const ec of equityMatchedCompanies) {
        if (!existingTickers.has(ec.ticker)) {
            allCompanies.push(ec); existingTickers.add(ec.ticker)
        }
    }
    for (const lc of liveMatchedCompanies) {
        if (!existingTickers.has(lc.ticker)) {
            allCompanies.push(lc); existingTickers.add(lc.ticker)
        } else {
            const existing = allCompanies.find(c => c.ticker === lc.ticker)
            if (existing) {
                existing.live_context = lc.live_context
                existing.source = existing.source + '+live'
            }
        }
    }

    await log(`📐 Optimizing final dataset...`)

    if (allCompanies.length === 0) {
        return {
            analysis: {
                summary: 'No relevant companies found in the database for this scenario.',
                impacts: { products: [], industries: [], countries: [] }
            },
            companies: []
        }
    }

    // ==========================================
    // STEP 4: Ask LLM to Analyze Companies
    // ==========================================
    const companyContext = allCompanies.map((c: any, i: number) => {
        let ownershipSnippet = ''
        if (c.deep_research) {
            const ownershipKeywords = ['stake', 'owns', 'investor', 'shareholder', 'subsidiary', 'joint venture', 'invested', 'acquisition', 'holding']
            for (const keyword of ownershipKeywords) {
                const idx = c.deep_research.toLowerCase().indexOf(keyword)
                if (idx !== -1) {
                    const start = Math.max(0, idx - 50)
                    const end = Math.min(c.deep_research.length, idx + 150)
                    ownershipSnippet = `\n   🔗 Ownership / Investment: "...${c.deep_research.slice(start, end)}..."`
                    break
                }
            }
        }
        const equityNote = c.source === 'equity_search' && c.equity_context ? `\n   📍 Found via: "${c.equity_context}"` : ''
        const liveNote = c.live_context ? `\n   🌐 LIVE WEB CONTEXT: "${c.live_context.slice(0, 300)}..."` : ''

        return `
${i + 1}. ${c.name} (${c.ticker})
    Industry: ${c.industry || 'Unknown'}
    Country: ${c.country || 'Unknown'}
    Products: ${c.value_chain_tags?.join(', ') || 'N/A'}
    Description: ${c.description?.slice(0, 200) || 'No description'}${ownershipSnippet}${equityNote}${liveNote}
    Similarity: ${(c.similarity * 100).toFixed(1)}% `
    }).join('\n')

    let preClassifiedSection = ''
    if (structuredExtraction?.companies && structuredExtraction.companies.length > 0) {
        preClassifiedSection = `
        ===== PRE - CLASSIFIED RELATIONSHIPS(FROM LIVE WEB SEARCH) =====
            The following companies have been identified via REAL - TIME web search with their relationships and expected impact:
${structuredExtraction.companies.map((c: any) =>
            `• ${c.name}${c.ticker_if_known ? ` (${c.ticker_if_known})` : ''}: ${c.relationship} → ${c.impact.toUpperCase()}
Reason: ${c.reason}`
        ).join('\n')
            }

** IMPORTANT **: These pre-classified relationships should be PRIORITIZED in your analysis. 
If a company appears in this list AND in the candidates below, USE THE PRE-CLASSIFIED IMPACT.
`
    }

    const analysisPrompt = `
You are a Supply Chain & Equity Impact Analyst.Your job is to classify companies and assess impacts using STRICT LOGIC.

        SCENARIO:
            "${query}"

${preClassifiedSection}

CANDIDATE COMPANIES(from database search):
${companyContext}

===== STEP 1: IDENTIFY THE SHOCK TYPE =====
        ${structuredExtraction?.scenario_type ? `ALREADY IDENTIFIED: ${structuredExtraction.scenario_type}` : 'First, classify the scenario into ONE of these categories:'}
    - IPO: A company is going public(benefits investors / shareholders)
        - PRICE_SURGE: A commodity or input price is increasing
            - PRICE_DROP: A commodity price is falling
                - SUPPLY_SHORTAGE: A region or resource is unavailable
                    - DEMAND_SHOCK_UP: Consumer demand is increasing
                        - DEMAND_SHOCK_DN: Consumer demand is decreasing
                            - TRADE_BARRIER: Tariffs, sanctions, or restrictions

                                ===== STEP 2: CLASSIFY EACH COMPANY =====
                                    For each company, determine their ROLE relative to the shock's subject:
                                        - PRODUCER: They SELL / PRODUCE the commodity or resource in question
                                            - CONSUMER: They BUY / USE the commodity as an input
                                                - COMPETITOR: They are a rival or substitute provider
                                                    - INVESTOR: They have OWNERSHIP STAKES, are SHAREHOLDERS, or have JOINT VENTURES with the primary subject
                                                        - UNRELATED: No direct connection to the shock

                                                            ** IMPORTANT **: Look carefully at the descriptions for mentions of:
                                                                - "Ownership stakes" or "invested in"
                                                                    - "Subsidiary" or "parent company"
                                                                        - "Joint venture" or "partnership"
                                                                            - "Major shareholder" or "institutional investor"

                                                                                ===== STEP 3: APPLY MECHANICAL RULES =====
                                                                                    Based on shock type and role, apply these rules WITHOUT EXCEPTION:

| Shock Type | PRODUCER | CONSUMER | COMPETITOR | INVESTOR |
| -----------------| ---------------| ---------------| ---------------| ---------------|
| IPO | ✅ POSITIVE | ⚪ NEUTRAL | ❌ NEGATIVE | ✅ POSITIVE(NAV increase) |
| PRICE_SURGE | ✅ POSITIVE | ❌ NEGATIVE | ⚪ NEUTRAL | ✅ POSITIVE(if invested in producer) |
| PRICE_DROP | ❌ NEGATIVE | ✅ POSITIVE | ⚪ NEUTRAL | ❌ NEGATIVE(if invested in producer) |
| SUPPLY_SHORTAGE | ⚪ NEUTRAL | ❌ NEGATIVE | ✅ POSITIVE | ❌ NEGATIVE(if invested in affected) |
| DEMAND_SHOCK_UP | ✅ POSITIVE | ⚪ NEUTRAL | ❌ NEGATIVE | ✅ POSITIVE(NAV increase) |
| DEMAND_SHOCK_DN | ❌ NEGATIVE | ⚪ NEUTRAL | ✅ POSITIVE | ❌ NEGATIVE(NAV decrease) |
| TRADE_BARRIER | ❌/✅ depends | ❌/✅ depends | ✅ POSITIVE | ❌/✅ depends |

        ===== CRITICAL RULES =====
            1. ** CONSISTENCY **: All companies with the SAME ROLE must receive the SAME SENTIMENT.

2. ** NO GUESSING **: Do not assume "pricing power" or "pass-through ability" unless EXPLICITLY stated.

3. ** INVESTOR LOGIC **: If a company is an INVESTOR in the primary subject:
    - For IPO / DEMAND_UP scenarios → POSITIVE(their stake increases in value)
        - For SUPPLY_SHORTAGE / DEMAND_DOWN → NEGATIVE(their investment loses value)

    4. ** IF UNSURE, MARK NEUTRAL **: Only assign positive / negative if the role is clear.

===== OUTPUT FORMAT =====
        Return JSON:
    {
        "shock_type": "IPO",
            "shock_subject": "SpaceX",
                "summary": "4-5 sentence analysis of mechanism, affected tiers, and duration...",
                    "companies": [
                        {
                            "ticker": "GOOGL",
                            "role": "INVESTOR",
                            "sentiment": "positive",
                            "reason": "Alphabet owns a significant stake in SpaceX. An IPO would increase the net asset value (NAV) of their investment portfolio."
                        }
                    ]
    }

Return RAW JSON ONLY.No markdown.
`
    await log('🖥️ Computing impact probabilities...')
    const analysisResult = await executeGeminiCall(() => chatModel.generateContent(analysisPrompt))
    const analysisText = cleanJson(analysisResult.response.text())

    let analysis
    try {
        analysis = JSON.parse(analysisText)
        // await log(`🤖 LLM returned ${analysis.companies?.length || 0} classified companies`)
    } catch (e) {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            analysis = JSON.parse(jsonMatch[0])
            // await log(`🤖 LLM returned ${analysis.companies?.length || 0} classified companies (via regex fix)`)
        } else {
            throw new Error('Failed to parse LLM response')
        }
    }

    // ==========================================
    // STEP 5: Merge LLM Analysis with Company Data
    // ==========================================

    // Debug: Log a few available companies to see what we are matching against
    // await log(`🔍 Debug: DB has ${allCompanies.length} companies. Sample: ${allCompanies.slice(0, 3).map((c: any) => `${c.name} (${c.ticker})`).join(', ')}`)

    const enrichedCompanies = [];

    // Helper to clean LLM output
    const cleanLlmString = (str: string) => {
        if (!str || str === 'undefined' || str === 'null') return '';
        return str.trim();
    }

    const extractTickerFromName = (name: string) => {
        const match = name.match(/\(([^)]+)\)/);
        return match ? match[1].trim() : null;
    }

    for (const c of (analysis.companies || [])) {
        if (c.sentiment === 'neutral' || c.sentiment === 'NEUTRAL') continue;

        let llmName = cleanLlmString(c.name);
        let llmTicker = cleanLlmString(c.ticker);

        // If ticker is missing, try to extract from name
        if (!llmTicker) {
            const extracted = extractTickerFromName(llmName);
            if (extracted) llmTicker = extracted;
        }

        // Clean name by removing ticker in parens if present
        llmName = llmName.replace(/\([^)]+\)/g, '').trim();

        // Relaxed matching logic
        const companyData = allCompanies.find((cd: any) => {
            const dbTicker = (cd.ticker || '').toLowerCase();
            const dbName = (cd.name || '').toLowerCase();
            const targetTicker = llmTicker.toLowerCase();
            const targetName = llmName.toLowerCase();

            // 1. Exact Ticker Match
            if (targetTicker && dbTicker === targetTicker) return true;

            // 2. Name Match (Exact)
            if (targetName && dbName === targetName) return true;

            // 3. Fuzzy Name Match (DB name is substring of LLM name or vice versa)
            // Only do this if names are long enough to avoid false positives (e.g. "Ford" vs "Oxford")
            if (targetName.length > 3 && dbName.length > 3) {
                if (targetName.includes(dbName)) return true;
                if (dbName.includes(targetName)) return true;
            }

            return false;
        });

        if (!companyData) {
            // Log failure for debugging
            // if (enrichedCompanies.length < 5) {
            //    await log(`⚠️ Match Failed: LLM Name="${llmName}" Ticker="${llmTicker}"`)
            // }
            continue
        }

        let finalSentiment = c.sentiment.toLowerCase(); // Normalize case
        let sentimentSource = 'llm_analysis'

        if (companyData.extracted_impact) {
            finalSentiment = companyData.extracted_impact.toLowerCase();
            sentimentSource = 'structured_extraction'
        }

        enrichedCompanies.push({
            ticker: companyData.ticker,
            name: companyData.name,
            country: companyData.country,
            market_cap: companyData.market_cap,
            logo_url: companyData.logo_url,
            industry: companyData.industry,
            value_chain_tags: companyData.value_chain_tags || [],
            overall_sentiment: finalSentiment,
            specific_reason: companyData.extracted_reason || c.reason,
            matched_impacts: [{ tag: companyData.industry, sentiment: finalSentiment }],
            _source: sentimentSource
        })
    }

    const finalCompanies = enrichedCompanies.slice(0, 10) // Max 10 companies

    await log(`✅ Process completed.`)

    // Count winners and losers
    const positiveCount = finalCompanies.filter((c: any) => c.overall_sentiment === 'positive').length
    const negativeCount = finalCompanies.filter((c: any) => c.overall_sentiment === 'negative').length
    // await log(`📊 Final Output: 🟢 ${positiveCount} positive, 🔴 ${negativeCount} negative`)

    return {
        analysis: {
            summary: analysis.summary,
            impacts: { products: [], industries: [], countries: [] },
            scenario_type: structuredExtraction?.scenario_type || analysis.shock_type,
            affected_subject: structuredExtraction?.affected_subject || analysis.shock_subject
        },
        companies: finalCompanies,
        _meta: {
            method: 'rag',
            vectorMatches: allCompanies.length,
            liveSearchCompanies: liveMatchedCompanies.length,
            structuredExtractionWorked: !!structuredExtraction
        }
    }
}

export async function POST(req: NextRequest) {
    // Check if client wants stream
    // For now, we assume ALL calls to this V2 endpoint are streamed if they come from the new UI
    // But to maintain backward compatibility, we can check headers or just force stream (standard fetch handles streams fine)

    // We will use a TransformStream pipeline approach if needed, or just a simple ReadableStream push
    const encoder = new TextEncoder()
    const { query, embeddingVersion = 'v1' } = await req.json()

    if (!query) {
        return NextResponse.json({ error: 'Query required' }, { status: 400 })
    }

    const stream = new ReadableStream({
        async start(controller) {
            const sendLog = async (msg: string) => {
                const chunk = JSON.stringify({ type: 'log', message: msg }) + '\n'
                controller.enqueue(encoder.encode(chunk))
                // Also log to console for debug
                console.log(msg)
            }

            const sendResult = async (data: any) => {
                const chunk = JSON.stringify({ type: 'result', data }) + '\n'
                controller.enqueue(encoder.encode(chunk))
            }

            const sendError = async (msg: string) => {
                const chunk = JSON.stringify({ type: 'error', message: msg }) + '\n'
                controller.enqueue(encoder.encode(chunk))
            }

            try {
                const result = await processAnalysis(query, embeddingVersion, sendLog)
                await sendResult(result)
            } catch (error: any) {
                console.error('Stream Error:', error)
                await sendError(error.message || 'Unknown error')
            } finally {
                controller.close()
            }
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'application/x-ndjson',
            'Transfer-Encoding': 'chunked',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache, no-transform'
        }
    })
}
