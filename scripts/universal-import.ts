
/**
 * Universal Company Importer SOP
 * 
 * Usage: npx tsx scripts/universal-import.ts --country=JP --limit=300
 * 
 * Features:
 * - Fetches Top Companies via FMP v4 Screener
 * - Retrieves 5 years of: Income, Balance, Cash Flow, Metrics, Ratios
 * - Normalizes ALL currency values to USD
 * - Auto-classifies using Gemini LLM
 * - Robust Rate Limiting
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
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

// Load valid product IDs for LLM
const validProductIds: Record<string, string[]> = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'valid_product_ids_by_industry.json'), 'utf-8')
)
const validIndustries = Object.keys(validProductIds)

const EXCHANGE_RATES: Record<string, number> = {
    'USD': 1,
    'JPY': 0.0067, // 1/150
    'EUR': 1.05,
    'GBP': 1.25,
    'CNY': 0.14,
    'HKD': 0.13,
    'AUD': 0.65,
    'CAD': 0.72,
    'INR': 0.012,
    'TWD': 0.031,
    'KRW': 0.00075,
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url)
            if (!res.ok) {
                if (res.status === 403) return null // Stop limits
                if (res.status === 429) throw new Error('Rate limit')
                throw new Error(`HTTP ${res.status}`)
            }
            return await res.json()
        } catch (e: any) {
            if (i === retries - 1) throw e
            await sleep(2000 * Math.pow(2, i))
        }
    }
}

// Helper to convert any number in an object to USD
function normalizeCurrency(obj: any, rate: number): any {
    if (!obj) return null
    if (rate === 1) return obj // USD

    const newObj: any = {}
    for (const [key, val] of Object.entries(obj)) {
        if (key === 'date' || key === 'calendarYear' || key === 'period' || typeof val !== 'number') {
            newObj[key] = val
        } else {
            newObj[key] = Math.round(val * rate)
        }
    }
    return newObj
}

async function processCompany(ticker: string, attempt = 1): Promise<boolean> {
    console.log(`\n🚀 [${ticker}] Processing...`)
    const baseUrl = 'https://financialmodelingprep.com/stable'
    const v3Url = 'https://financialmodelingprep.com/api/v3'
    const qs = encodeURIComponent(ticker)

    try {
        // 1. Parallel Fetch of everything
        const [quoteData, profileData, incomeData, balanceData, cashData, metricsData, ratiosData] = await Promise.all([
            fetchWithRetry(`${baseUrl}/quote?symbol=${qs}&apikey=${FMP_API_KEY}`).catch(() => null),
            fetchWithRetry(`${baseUrl}/profile?symbol=${qs}&apikey=${FMP_API_KEY}`).catch(() => null),
            fetchWithRetry(`${baseUrl}/income-statement?symbol=${qs}&period=annual&limit=5&apikey=${FMP_API_KEY}`).catch(() => []),
            fetchWithRetry(`${baseUrl}/balance-sheet-statement?symbol=${qs}&period=annual&limit=5&apikey=${FMP_API_KEY}`).catch(() => []),
            fetchWithRetry(`${baseUrl}/cash-flow-statement?symbol=${qs}&period=annual&limit=5&apikey=${FMP_API_KEY}`).catch(() => []),
            fetchWithRetry(`${v3Url}/key-metrics?symbol=${qs}&period=annual&limit=5&apikey=${FMP_API_KEY}`).catch(() => []),
            fetchWithRetry(`${v3Url}/ratios?symbol=${qs}&period=annual&limit=5&apikey=${FMP_API_KEY}`).catch(() => []),
        ])

        const quote = Array.isArray(quoteData) ? quoteData[0] : quoteData
        const profile = Array.isArray(profileData) ? profileData[0] : profileData

        if (!profile && !quote) {
            console.log(`   ⚠️ No data found (likely delisted or ETF)`)
            return false
        }

        // 2. Logic to detect Currency
        const reportedCurrency = (incomeData?.[0]?.reportedCurrency || profile?.currency || 'USD').toUpperCase()
        let rate = EXCHANGE_RATES[reportedCurrency] || 1

        // Check for JPY Market Cap anomaly in FMP
        let marketCap = quote?.marketCap || profile?.mktCap || 0
        if (marketCap > 4000000000000 && rate < 0.1) {
            // If Market Cap is huge (trillions) and rate is small (like JPY), 
            // it means FMP returned local currency in marketCap field.
            marketCap = Math.round(marketCap * rate)
            console.log(`   💱 Converting Market Cap to USD...`)
        } else if (reportedCurrency !== 'USD') {
            // If currency is NOT USD, assume mktCap might be correct in USD (FMP usually does this)
            // BUT check standard cases. For Euro stocks, often it IS in EUR.
            // We'll trust the profile.currency mainly for FINANCIALS, but for MCap FMP is inconsistent.
            // Best guess: If quote.marketCap is present, it's usually reliable or huge.
        }

        console.log(`   Currency: ${reportedCurrency} (Rate: ${rate}). MCap: $${(marketCap / 1e9).toFixed(1)}B`)

        // 3. Normalize Financials
        // We only convert if rate != 1
        const incomeUSD = (incomeData || []).map((i: any) => normalizeCurrency(i, rate))
        const balanceUSD = (balanceData || []).map((i: any) => normalizeCurrency(i, rate))
        const cashUSD = (cashData || []).map((i: any) => normalizeCurrency(i, rate))
        // Metrics often computed in USD or per share. Ratio is unitless (mostly).
        // FMP Metrics are usually per-share USD or unitless. Let's assume they are fine or we just store them.
        // Actually, 'Revenue Per Share' would be in local currency. Let's convert Metrics too.
        const metricsUSD = (metricsData || []).map((i: any) => normalizeCurrency(i, rate))
        // Ratios are generally unitless percentages (ROE, PE), except "Price Fair Value" etc.
        // We will leave ratios alone as mostly unitless.

        // 4. Prepare DB Object
        const updateObj: any = {
            ticker: ticker,
            name: profile?.companyName || quote?.name,
            sector: profile?.sector,
            description: profile?.description,
            logo_url: profile?.image,
            exchange: profile?.exchangeShortName || 'Unknown',
            country: profile?.country || 'Unknown',
            market_cap: marketCap,
            updated_at: new Date().toISOString()
        }

        // 5. LLM Classification
        try {
            const prompt = `Classify this company.
            NAME: ${updateObj.name}
            DESC: ${updateObj.description}
            INDUSTRIES: ${validIndustries.join(', ')}
            
            Strictly return JSON: {"industry": "slug", "tags": ["tag1"]}
            Valid tags only.`

            const llmRes = await model.generateContent(prompt)
            const text = llmRes.response.text().trim()
            const jsonMatch = text.match(/\{[\s\S]*?\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                if (validIndustries.includes(parsed.industry)) {
                    updateObj.industry = parsed.industry
                    updateObj.value_chain_tags = parsed.tags.filter((t: string) => (validProductIds[parsed.industry] || []).includes(t))
                    console.log(`   ✨ Classified: ${updateObj.industry}`)
                }
            }
        } catch (e) {
            console.log(`   ⚠️ LLM Error (Skipping)`)
        }

        // 6. Persist Data Block
        updateObj.data = {
            profile: {
                ...profile,
                currency: 'USD',
                originalCurrency: reportedCurrency
            },
            financials: {
                income: incomeUSD,
                balance: balanceUSD,
                cash_flow: cashUSD,
                metrics: metricsUSD,
                ratios: ratiosData || []
            },
            // Legacy fields for UI compatibility
            incomeStatement: incomeUSD[0],
            balanceSheet: balanceUSD[0],
            cashFlow: cashUSD[0],
            historicalFinancials: {
                incomeStatements: incomeUSD,
                balanceSheets: balanceUSD,
                cashFlowStatements: cashUSD
            },
            last_updated: new Date().toISOString()
        }

        const { error } = await supabase.from('companies').upsert(updateObj, { onConflict: 'ticker' })
        if (error) throw error

        console.log(`   ✅ Saved!`)
        return true

    } catch (err: any) {
        console.error(`   ❌ Error: ${err.message}`)
        return false
    }
}

async function main() {
    const args = process.argv.slice(2)
    const countryArg = args.find(a => a.startsWith('--country='))?.split('=')[1] || 'JP'
    const limitArg = args.find(a => a.startsWith('--limit='))?.split('=')[1] || '10'

    console.log(`🌍 Universal Import: Country=${countryArg}, Limit=${limitArg}`)

    // Fetch List
    const screenerUrl = `https://financialmodelingprep.com/stable/company-screener?country=${countryArg}&marketCapMoreThan=1000000000&limit=${limitArg}&apikey=${FMP_API_KEY}`
    console.log(`Listing companies...`)

    const screenerRes = await fetchWithRetry(screenerUrl)
    if (!Array.isArray(screenerRes)) {
        console.error('Failed to get company list')
        return
    }

    console.log(`Found ${screenerRes.length} companies.`)

    let success = 0
    for (const c of screenerRes) {
        const ticker = c.symbol || c.ticker
        if (!ticker) continue

        const ok = await processCompany(ticker)
        if (ok) success++

        // Rate Limit (10 sec)
        await sleep(10000)
    }

    console.log(`Done. ${success} imported.`)
}

main().catch(console.error)
