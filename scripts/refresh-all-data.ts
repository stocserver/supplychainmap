
/**
 * Unified Company Data Refresh
 * 
 * Performs a one-pass update for companies:
 * 1. Fetches fresh market cap and financials from FMP (smart-fmp-fetcher logic)
 * 2. Runs LLM classification to verify/fix industry and tags (llm-classify-companies logic)
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!FMP_API_KEY || !SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    console.error('❌ Missing environment variables')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }) // Use 2.0 Flash as it is reliable

// Load valid product IDs for LLM
const validProductIds: Record<string, string[]> = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'valid_product_ids_by_industry.json'), 'utf-8')
)
const validIndustries = Object.keys(validProductIds)

const EXCHANGE_RATES: Record<string, number> = {
    'USD': 1,
    'JPY': 0.0067,
    'EUR': 1.05, // Updated
    'GBP': 1.25,
    'CNY': 0.14,
    'HKD': 0.13,
    'AUD': 0.65,
    'CAD': 0.72,
    'TWD': 0.031,
    'KRW': 0.00075,
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return await res.json()
        } catch (e: any) {
            if (i === retries - 1) throw e
            await sleep(1000 * Math.pow(2, i))
        }
    }
}

function convertToUSD(value: number | null | undefined, currency: string): number | null {
    if (value === null || value === undefined) return null
    if (currency === 'USD') return Math.round(value)
    const rate = EXCHANGE_RATES[currency.toUpperCase()] || 1
    return Math.round(value * rate)
}

async function refreshCompany(ticker: string) {
    console.log(`\n🚀 [${ticker}] Starting update...`)

    try {
        // --- STEP 1: FMP DATA ---
        const baseUrl = 'https://financialmodelingprep.com/stable'
        const qs = encodeURIComponent(ticker)
        const [quoteData, profileData, incomeData] = await Promise.all([
            fetchWithRetry(`${baseUrl}/quote?symbol=${qs}&apikey=${FMP_API_KEY}`).catch(() => null),
            fetchWithRetry(`${baseUrl}/profile?symbol=${qs}&apikey=${FMP_API_KEY}`).catch(() => null),
            fetchWithRetry(`${baseUrl}/income-statement?symbol=${qs}&period=annual&limit=1&apikey=${FMP_API_KEY}`).catch(() => []),
        ])

        const quote = Array.isArray(quoteData) ? quoteData[0] : quoteData
        const profile = Array.isArray(profileData) ? profileData[0] : profileData
        const income = incomeData?.[0]

        if (!profile && !quote) {
            console.log(`   ⚠️ No data found at FMP`)
            return false
        }

        const marketCap = quote?.marketCap || profile?.mktCap || profile?.marketCap || 0
        const reportedCurrency = income?.reportedCurrency || profile?.currency || 'USD'

        const updateObj: any = {
            name: profile?.companyName || quote?.name,
            sector: profile?.sector,
            description: profile?.description,
            logo_url: profile?.image,
            exchange: profile?.exchangeShortName || quote?.exchange,
            market_cap: marketCap,
            updated_at: new Date().toISOString()
        }

        // --- STEP 2: LLM CLASSIFICATION ---
        const descriptionForLlm = profile?.description || ""
        const prompt = `You are a financial data auditor. Assign the PRIMARY industry and most specific tags.
        
        COMPANY: ${updateObj.name}
        DESCRIPTION: ${descriptionForLlm}
        
        VALID INDUSTRIES: ${validIndustries.join(', ')}
        
        VALID TAGS BY INDUSTRY:
        ${Object.entries(validProductIds).map(([ind, tags]) => `${ind}: [${tags.slice(0, 10).join(', ')}...]`).join('\n')}
        
        STRICT RULES:
        1. **PRIMARY REVENUE SOURCE**: Choose the one primary industry (e.g. Tesla = electric-vehicles).
        2. **BE SPECIFIC**: Use granular tags from the valid list.
        3. **FORMAT**: Return ONLY JSON: {"industry": "slug", "tags": ["tag1", "tag2"]}
        `;

        const llmResult = await model.generateContent(prompt)
        const text = llmResult.response.text().trim()
        const jsonMatch = text.match(/\{[\s\S]*?\}/)

        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            if (validIndustries.includes(parsed.industry)) {
                updateObj.industry = parsed.industry
                updateObj.value_chain_tags = parsed.tags.filter((t: string) => (validProductIds[parsed.industry] || []).includes(t))
                console.log(`   ✨ Reclassified to: ${updateObj.industry}`)
            }
        }

        // --- STEP 3: PERSIST ---
        const { error } = await supabase.from('companies').update(updateObj).eq('ticker', ticker)
        if (error) throw error

        console.log(`   ✅ Success`)
        return true

    } catch (err: any) {
        console.error(`   ❌ Error: ${err.message}`)
        return false
    }
}

async function main() {
    const tickersArg = process.argv.find(a => a.startsWith('--tickers='))
    let tickers: string[] = []

    if (tickersArg) {
        tickers = tickersArg.split('=')[1].split(',').map(t => t.trim().toUpperCase())
    } else {
        const { data } = await supabase.from('companies').select('ticker').order('market_cap', { ascending: false }).limit(50)
        tickers = data?.map(c => c.ticker) || []
    }

    for (const ticker of tickers) {
        await refreshCompany(ticker)
        await sleep(500)
    }
}

main().catch(console.error)
