
/**
 * Import Top 100 TSE Companies
 * 
 * 1. Fetches top 100 companies by market cap from FMP screener (TSE exchange)
 * 2. Uses the unified refresh logic (fetch + LLM) to process each one
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
    'JPY': 0.0067,
    'EUR': 1.05,
    'GBP': 1.25,
    'CNY': 0.14,
    'HKD': 0.13,
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

async function refreshCompany(ticker: string) {
    console.log(`\n🚀 [${ticker}] Processing...`)

    try {
        // --- STEP 1: FMP DATA ---
        const baseUrl = 'https://financialmodelingprep.com/stable'
        const qs = encodeURIComponent(ticker)
        const [quoteData, profileData, incomeData, balanceData, cashFlowData] = await Promise.all([
            fetchWithRetry(`${baseUrl}/quote?symbol=${qs}&apikey=${FMP_API_KEY}`).catch(() => null),
            fetchWithRetry(`${baseUrl}/profile?symbol=${qs}&apikey=${FMP_API_KEY}`).catch(() => null),
            fetchWithRetry(`${baseUrl}/income-statement?symbol=${qs}&period=annual&limit=5&apikey=${FMP_API_KEY}`).catch(() => []),
            fetchWithRetry(`${baseUrl}/balance-sheet-statement?symbol=${qs}&period=annual&limit=5&apikey=${FMP_API_KEY}`).catch(() => []),
            fetchWithRetry(`${baseUrl}/cash-flow-statement?symbol=${qs}&period=annual&limit=5&apikey=${FMP_API_KEY}`).catch(() => []),
        ])

        const quote = Array.isArray(quoteData) ? quoteData[0] : quoteData
        const profile = Array.isArray(profileData) ? profileData[0] : profileData
        const incomeStatements = Array.isArray(incomeData) ? incomeData : []
        const balanceSheets = Array.isArray(balanceData) ? balanceData : []
        const cashFlowStatements = Array.isArray(cashFlowData) ? cashFlowData : []


        if (!profile && !quote) {
            console.log(`   ⚠️ No data found at FMP`)
            return false
        }

        let marketCap = quote?.marketCap || profile?.mktCap || profile?.marketCap || 0

        // CORRECTION: FMP returns JPY market cap for TSE companies in the marketCap field
        // If Market Cap > 5 Trillion USD (unlikely for any company), treat as JPY
        // Toyota is ~45T JPY. Apple is ~3T USD. So threshold > 4T USD is safe.
        if (marketCap > 4000000000000) {
            console.log(`   ⚠️ Detected JPY Market Cap ($${(marketCap / 1e9).toFixed(0)}B) - Converting...`)
            marketCap = Math.round(marketCap * EXCHANGE_RATES['JPY'])
        }

        // --- STEP 2: PREPARE DB OBJECT ---
        const updateObj: any = {
            ticker: ticker,
            name: profile?.companyName || quote?.name,
            sector: profile?.sector,
            description: profile?.description,
            logo_url: profile?.image,
            exchange: 'TSE', // Force TSE since we're importing from TSE
            country: 'JP',
            market_cap: marketCap,
            updated_at: new Date().toISOString()
        }

        // --- STEP 3: LLM CLASSIFICATION ---
        const descriptionForLlm = profile?.description || ""
        const prompt = `You are a financial data auditor. Assign the PRIMARY industry and most specific tags.
        
        COMPANY: ${updateObj.name}
        DESCRIPTION: ${descriptionForLlm}
        
        VALID INDUSTRIES: ${validIndustries.join(', ')}
        
        VALID TAGS BY INDUSTRY:
        ${Object.entries(validProductIds).map(([ind, tags]) => `${ind}: [${tags.slice(0, 10).join(', ')}...]`).join('\n')}
        
        STRICT RULES:
        1. **PRIMARY REVENUE SOURCE**: Choose the one primary industry.
        2. **BE SPECIFIC**: Use granular tags from the valid list.
        3. **FORMAT**: Return ONLY JSON: {"industry": "slug", "tags": ["tag1", "tag2"]}
        `;

        try {
            const llmResult = await model.generateContent(prompt)
            const text = llmResult.response.text().trim()
            const jsonMatch = text.match(/\{[\s\S]*?\}/)

            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                if (validIndustries.includes(parsed.industry)) {
                    updateObj.industry = parsed.industry
                    updateObj.value_chain_tags = parsed.tags.filter((t: string) => (validProductIds[parsed.industry] || []).includes(t))
                    console.log(`   ✨ Classified: ${updateObj.industry}`)
                }
            }
        } catch (llmErr: any) {
            console.error(`   ⚠️ LLM Error: ${llmErr.message}. Skipping classification.`)
        }

        // --- STEP 4: PERSIST ---
        // Basic data object for now - full financials can be fetched by the other script if needed
        // but let's try to populate minimal data structure so the app works
        // Helper to convert array of financials
        const convertFinancials = (arr: any[], keys: string[]) => {
            return arr.map(item => {
                const newItem = { ...item }
                keys.forEach(k => {
                    if (newItem[k]) newItem[k] = Math.round(newItem[k] * EXCHANGE_RATES['JPY']) // Assuming JPY for TSE
                })
                return newItem
            })
        }

        const incomeKeys = ['revenue', 'costOfRevenue', 'grossProfit', 'operatingExpenses', 'operatingIncome', 'netIncome', 'ebitda']
        const balanceKeys = ['totalAssets', 'totalLiabilities', 'totalStockholdersEquity', 'cashAndCashEquivalents', 'totalDebt', 'netDebt']
        const cashFlowKeys = ['operatingCashFlow', 'capitalExpenditure', 'freeCashFlow', 'dividendsPaid']

        // Convert all fetched financials to USD
        const convertedIncome = convertFinancials(incomeStatements || [], incomeKeys)
        const convertedBalance = convertFinancials(balanceSheets || [], balanceKeys)
        const convertedCashFlow = convertFinancials(cashFlowStatements || [], cashFlowKeys)

        const latestIncome = convertedIncome[0]
        const latestBalance = convertedBalance[0]
        const latestCashFlow = convertedCashFlow[0]

        updateObj.data = {
            profile: {
                companyName: updateObj.name,
                description: updateObj.description,
                image: updateObj.logo_url,
                currency: 'USD', // Normalized
                originalCurrency: profile?.currency
            },
            incomeStatement: latestIncome ? {
                date: latestIncome.date,
                revenue: latestIncome.revenue,
                netIncome: latestIncome.netIncome,
                grossProfit: latestIncome.grossProfit,
                operatingIncome: latestIncome.operatingIncome
            } : null,
            balanceSheet: latestBalance ? {
                date: latestBalance.date,
                totalAssets: latestBalance.totalAssets,
                totalLiabilities: latestBalance.totalLiabilities,
                totalEquity: latestBalance.totalStockholdersEquity,
                cashAndCashEquivalents: latestBalance.cashAndCashEquivalents
            } : null,
            cashFlow: latestCashFlow ? {
                date: latestCashFlow.date,
                operatingCashFlow: latestCashFlow.operatingCashFlow,
                capitalExpenditure: latestCashFlow.capitalExpenditure,
                freeCashFlow: latestCashFlow.freeCashFlow
            } : null,
            historicalFinancials: {
                incomeStatements: convertedIncome,
                balanceSheets: convertedBalance,
                cashFlowStatements: convertedCashFlow
            },
            last_updated: new Date().toISOString()
        }

        const { error } = await supabase.from('companies').upsert(updateObj, { onConflict: 'ticker' })
        if (error) throw error

        console.log(`   ✅ Saved (MCap: $${(marketCap / 1e9).toFixed(2)}B)`)
        return true

    } catch (err: any) {
        console.error(`   ❌ Error: ${err.message}`)
        return false
    }
}

async function main() {
    console.log('🇯🇵 Fetching Top 100 TSE Companies (via v4 Screener)...')

    // Use the User-suggested endpoint: stable/company-screener
    // Filter by country=JP and exchange=TSE (if possible) or just JP and sort by marketCap
    const screenerUrl = `https://financialmodelingprep.com/stable/company-screener?country=JP&marketCapMoreThan=1000000000&limit=100&apikey=${FMP_API_KEY}`

    console.log(`Fetching: ${screenerUrl.replace(FMP_API_KEY!, '***')}`)

    try {
        const screenerResults = await fetchWithRetry(screenerUrl)

        if (!Array.isArray(screenerResults)) {
            console.error('Failed to fetch screener results (not an array):', JSON.stringify(screenerResults).substring(0, 100))
            return
        }

        console.log(`Found ${screenerResults.length} companies. Starting import...`)

        let success = 0
        let failed = 0

        for (const company of screenerResults) {
            // v4 screener returns 'symbol' (lowercase?) or 'symbol' (uppercase)? 
            // Usually FMP returns 'symbol'.
            const ticker = company.symbol || company.ticker
            if (!ticker) continue

            const result = await refreshCompany(ticker)
            if (result) success++
            else failed++

            // Rate limit kindness (10s for Gemini 10 RPM limit)
            await sleep(10000)
        }

        console.log(`\nDONE! Success: ${success}, Failed: ${failed}`)

    } catch (error: any) {
        console.error(`Fatal Error in main: ${error.message}`)
    }
}

main().catch(console.error)
