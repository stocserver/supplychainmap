/**
 * Smart FMP Data Fetcher with Proper Currency Handling
 * 
 * Key insight: FMP returns:
 * - Market cap: ALWAYS in USD
 * - Financial statements: In the company's REPORTING currency (JPY, CNY, EUR, etc.)
 * 
 * This script:
 * 1. Fetches fresh data from FMP for specified companies
 * 2. Keeps market cap as-is (already USD)
 * 3. Converts ONLY financial statement values from reportedCurrency to USD
 * 4. Stores metadata about the conversion
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!FMP_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing environment variables')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Exchange rates to USD (as of Dec 2024)
const EXCHANGE_RATES: Record<string, number> = {
    'USD': 1,
    'JPY': 0.0067,   // ~150 JPY = 1 USD
    'EUR': 1.09,
    'GBP': 1.27,
    'CNY': 0.14,     // ~7.1 CNY = 1 USD
    'HKD': 0.13,     // ~7.8 HKD = 1 USD
    'AUD': 0.67,
    'CAD': 0.74,
    'INR': 0.012,
    'TWD': 0.032,
    'KRW': 0.00076,  // ~1315 KRW = 1 USD
    'CHF': 1.13,
    'SEK': 0.095,
    'SGD': 0.74,
    'MXN': 0.058,
    'BRL': 0.20,
    'THB': 0.029,
    'IDR': 0.000064,
    'PLN': 0.25,
    'DKK': 0.15,
    'NOK': 0.094,
    'NZD': 0.62,
    'ZAR': 0.056,
    'ILS': 0.27,
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// Convert a single value from source currency to USD
function convertToUSD(value: number | null | undefined, currency: string): number | null {
    if (value === null || value === undefined) return null
    if (currency === 'USD') return Math.round(value)

    const rate = EXCHANGE_RATES[currency.toUpperCase()]
    if (!rate) {
        console.warn(`⚠️ Unknown currency: ${currency}, keeping original value`)
        return Math.round(value)
    }
    return Math.round(value * rate)
}

// Financial fields that need currency conversion
const FINANCIAL_FIELDS = [
    'revenue', 'netIncome', 'grossProfit', 'operatingIncome', 'costOfRevenue',
    'ebitda', 'totalAssets', 'totalLiabilities', 'totalStockholdersEquity',
    'totalEquity', 'cashAndCashEquivalents', 'totalDebt', 'netDebt',
    'operatingCashFlow', 'capitalExpenditure', 'freeCashFlow', 'dividendsPaid',
    'totalCurrentAssets', 'totalCurrentLiabilities', 'shortTermInvestments',
    'longTermInvestments', 'shortTermDebt', 'longTermDebt', 'interestExpense',
    'incomeBeforeTax', 'incomeTaxExpense', 'researchAndDevelopmentExpenses',
    'sellingGeneralAndAdministrativeExpenses', 'depreciationAndAmortization'
]

// Convert all financial fields in an object
function convertFinancialObject(obj: any, currency: string): any {
    if (!obj || typeof obj !== 'object') return obj

    const converted: any = { ...obj }
    for (const field of FINANCIAL_FIELDS) {
        if (typeof obj[field] === 'number') {
            converted[field] = convertToUSD(obj[field], currency)
        }
    }
    return converted
}

// Convert array of financial statements
function convertFinancialArray(arr: any[], currency: string): any[] {
    if (!Array.isArray(arr)) return arr
    return arr.map(item => convertFinancialObject(item, currency))
}

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url)
            if (!res.ok) {
                if (res.status === 429) throw new Error('Rate limit')
                throw new Error(`HTTP ${res.status}`)
            }
            return await res.json()
        } catch (e: any) {
            if (i === retries - 1) throw e
            await sleep(1000 * Math.pow(2, i))
        }
    }
}

async function fetchCompanyData(ticker: string) {
    const baseUrl = 'https://financialmodelingprep.com/stable'
    const qs = encodeURIComponent(ticker)

    console.log(`\n🚀 Fetching ${ticker} from FMP...`)

    // Fetch all data in parallel - include quote and key-metrics for market cap
    const [quoteData, profileData, incomeData, balanceData, cashFlowData, metricsData] = await Promise.all([
        fetchWithRetry(`${baseUrl}/quote?symbol=${qs}&apikey=${FMP_API_KEY}`).catch(() => null),
        fetchWithRetry(`${baseUrl}/profile?symbol=${qs}&apikey=${FMP_API_KEY}`).catch(() => null),
        fetchWithRetry(`${baseUrl}/income-statement?symbol=${qs}&period=annual&limit=5&apikey=${FMP_API_KEY}`).catch(() => []),
        fetchWithRetry(`${baseUrl}/balance-sheet-statement?symbol=${qs}&period=annual&limit=5&apikey=${FMP_API_KEY}`).catch(() => []),
        fetchWithRetry(`${baseUrl}/cash-flow-statement?symbol=${qs}&period=annual&limit=5&apikey=${FMP_API_KEY}`).catch(() => []),
        fetchWithRetry(`${baseUrl}/key-metrics-ttm?symbol=${qs}&limit=1&apikey=${FMP_API_KEY}`).catch(() => null),
    ])

    const quote = Array.isArray(quoteData) ? quoteData[0] : quoteData
    const profile = Array.isArray(profileData) ? profileData[0] : profileData
    const incomeStatements = incomeData || []
    const balanceSheets = balanceData || []
    const cashFlowStatements = cashFlowData || []
    const keyMetrics = Array.isArray(metricsData) ? metricsData[0] : metricsData

    // Get market cap from multiple sources (USD from FMP)
    // Priority: quote.marketCap > profile.mktCap > keyMetrics.marketCapTTM
    const marketCap = quote?.marketCap || profile?.mktCap || keyMetrics?.marketCapTTM || 0

    // Get the reported currency from the first income statement
    // This is the GROUND TRUTH for financial statement currency
    const reportedCurrency = incomeStatements[0]?.reportedCurrency || 'USD'

    console.log(`   Profile: ${profile?.companyName || quote?.name || 'N/A'}`)
    console.log(`   Market Cap (USD): $${marketCap ? (marketCap / 1e9).toFixed(2) : 0}B (from ${quote?.marketCap ? 'quote' : profile?.mktCap ? 'profile' : 'metrics'})`)
    console.log(`   Reported Currency: ${reportedCurrency}`)
    console.log(`   Income Statements: ${incomeStatements.length}`)
    console.log(`   Balance Sheets: ${balanceSheets.length}`)
    console.log(`   Cash Flows: ${cashFlowStatements.length}`)

    // Convert financial statements if not in USD
    const needsConversion = reportedCurrency !== 'USD'

    let convertedIncome = incomeStatements
    let convertedBalance = balanceSheets
    let convertedCashFlow = cashFlowStatements

    if (needsConversion) {
        console.log(`   🔄 Converting from ${reportedCurrency} to USD...`)
        convertedIncome = convertFinancialArray(incomeStatements, reportedCurrency)
        convertedBalance = convertFinancialArray(balanceSheets, reportedCurrency)
        convertedCashFlow = convertFinancialArray(cashFlowStatements, reportedCurrency)

        const originalRevenue = incomeStatements[0]?.revenue
        const convertedRevenue = convertedIncome[0]?.revenue
        if (originalRevenue) {
            console.log(`   Revenue: ${reportedCurrency} ${(originalRevenue / 1e9).toFixed(2)}B → USD $${(convertedRevenue / 1e9).toFixed(2)}B`)
        }
    }

    // Get latest statements (already converted if needed)
    const latestIncome = convertedIncome[0]
    const latestBalance = convertedBalance[0]
    const latestCashFlow = convertedCashFlow[0]

    return {
        quote,
        profile,
        keyMetrics,
        marketCap, // Already in USD
        incomeStatements: convertedIncome,
        balanceSheets: convertedBalance,
        cashFlowStatements: convertedCashFlow,
        latestIncome,
        latestBalance,
        latestCashFlow,
        reportedCurrency,
        needsConversion,
        exchangeRateUsed: needsConversion ? (EXCHANGE_RATES[reportedCurrency] || 1) : 1
    }
}

async function updateCompany(ticker: string) {
    try {
        const data = await fetchCompanyData(ticker)

        if (!data.profile && data.incomeStatements.length === 0) {
            console.log(`   ⚠️ No data found for ${ticker}`)
            return false
        }

        // Build the update object
        // IMPORTANT: market_cap comes from profile.mktCap which is ALREADY in USD
        const updateObj: any = {
            updated_at: new Date().toISOString()
        }

        // Only update fields we have data for
        if (data.profile || data.quote) {
            updateObj.name = data.profile?.companyName || data.quote?.name || undefined
            updateObj.sector = data.profile?.sector || undefined
            updateObj.description = data.profile?.description || undefined
            updateObj.website = data.profile?.website || undefined
            updateObj.logo_url = data.profile?.image || undefined
            updateObj.exchange = data.profile?.exchangeShortName || data.quote?.exchange || undefined
            updateObj.employees = parseInt(data.profile?.fullTimeEmployees) || undefined
            // Market cap - combined from quote/profile/metrics (already in USD)
            if (data.marketCap) {
                updateObj.market_cap = data.marketCap
            }
        }

        // Build updated data object with converted financials
        updateObj.data = {
            profile: data.profile ? {
                companyName: data.profile.companyName,
                isin: data.profile.isin,
                ipoDate: data.profile.ipoDate,
                beta: data.profile.beta,
                ceo: data.profile.ceo,
                currency: data.profile.currency, // Profile currency (often USD even for non-US)
            } : null,

            // Latest financial statements (converted to USD)
            incomeStatement: data.latestIncome ? {
                date: data.latestIncome.date,
                revenue: data.latestIncome.revenue,
                netIncome: data.latestIncome.netIncome,
                grossProfit: data.latestIncome.grossProfit,
                operatingIncome: data.latestIncome.operatingIncome,
                ebitda: data.latestIncome.ebitda,
                // Calculate ratios
                grossProfitRatio: data.latestIncome.revenue ? data.latestIncome.grossProfit / data.latestIncome.revenue : null,
                netIncomeRatio: data.latestIncome.revenue ? data.latestIncome.netIncome / data.latestIncome.revenue : null,
            } : null,

            balanceSheet: data.latestBalance ? {
                date: data.latestBalance.date,
                totalAssets: data.latestBalance.totalAssets,
                totalLiabilities: data.latestBalance.totalLiabilities,
                totalEquity: data.latestBalance.totalStockholdersEquity,
                cashAndCashEquivalents: data.latestBalance.cashAndCashEquivalents,
                totalDebt: data.latestBalance.totalDebt,
            } : null,

            cashFlow: data.latestCashFlow ? {
                date: data.latestCashFlow.date,
                operatingCashFlow: data.latestCashFlow.operatingCashFlow,
                capitalExpenditure: data.latestCashFlow.capitalExpenditure,
                freeCashFlow: data.latestCashFlow.freeCashFlow,
            } : null,

            // Historical financials (all converted to USD)
            historicalFinancials: {
                incomeStatements: data.incomeStatements,
                balanceSheets: data.balanceSheets,
                cashFlowStatements: data.cashFlowStatements,
            },

            // Currency metadata
            reportedCurrency: data.reportedCurrency,
            convertedToUSD: data.needsConversion,
            exchangeRateUsed: data.exchangeRateUsed,
            currencyConvertedAt: data.needsConversion ? new Date().toISOString() : null,
            last_updated: new Date().toISOString()
        }

        // Update in Supabase
        const { error } = await supabase
            .from('companies')
            .update(updateObj)
            .eq('ticker', ticker)

        if (error) {
            throw error
        }

        console.log(`   ✅ Updated ${ticker}`)
        return true

    } catch (err: any) {
        console.error(`   ❌ Error: ${err.message}`)
        return false
    }
}

async function main() {
    // Parse command line arguments
    const tickersArg = process.argv.find(a => a.startsWith('--tickers='))
    const limitArg = process.argv.find(a => a.startsWith('--limit='))
    const nonUsdOnly = process.argv.includes('--non-usd-only')

    let tickers: string[] = []

    if (tickersArg) {
        // Specific tickers provided
        tickers = tickersArg.split('=')[1].split(',').map(t => t.trim())
        console.log(`📋 Processing ${tickers.length} specified tickers`)
    } else {
        // Fetch from database in batches to avoid timeout
        const totalLimit = limitArg ? parseInt(limitArg.split('=')[1]) : 50
        const BATCH_SIZE = 100
        let offset = 0
        let allCompanies: any[] = []

        console.log(`📥 Fetching companies from database (limit: ${totalLimit})...`)

        while (offset < totalLimit) {
            const batchLimit = Math.min(BATCH_SIZE, totalLimit - offset)
            const { data: batch, error } = await supabase
                .from('companies')
                .select('ticker, name, country, data')
                .order('market_cap', { ascending: false })
                .range(offset, offset + batchLimit - 1)

            if (error) {
                console.error('Error fetching companies:', error)
                return
            }

            if (!batch || batch.length === 0) {
                break
            }

            allCompanies = [...allCompanies, ...batch]
            console.log(`   Fetched ${allCompanies.length} companies...`)
            offset += batchLimit

            if (batch.length < batchLimit) {
                break
            }
        }

        if (nonUsdOnly) {
            // Filter to only companies that might have non-USD financials
            tickers = allCompanies
                .filter(c => {
                    const reportedCurrency = c.data?.historicalFinancials?.incomeStatements?.[0]?.reportedCurrency
                    return reportedCurrency && reportedCurrency !== 'USD'
                })
                .map(c => c.ticker)
            console.log(`📋 Found ${tickers.length} companies with non-USD financials`)
        } else {
            tickers = allCompanies.map(c => c.ticker)
            console.log(`📋 Processing ${tickers.length} companies by market cap`)
        }
    }

    if (tickers.length === 0) {
        console.log('No companies to process')
        return
    }

    console.log('\n' + '='.repeat(60) + '\n')

    let success = 0
    let failed = 0

    for (const ticker of tickers) {
        const result = await updateCompany(ticker)
        if (result) success++
        else failed++

        // Rate limit: ~300 calls per minute = 200ms between calls
        await sleep(250)
    }

    console.log('\n' + '='.repeat(60))
    console.log('\n📊 Summary:')
    console.log(`   ✅ Success: ${success}`)
    console.log(`   ❌ Failed: ${failed}`)
    console.log(`   📈 Total: ${tickers.length}`)
}

console.log('🔄 Smart FMP Data Fetcher')
console.log('   Market cap: Kept as USD (from FMP)')
console.log('   Financials: Converted from reportedCurrency to USD')
console.log('')

main()
    .then(() => {
        console.log('\n✨ Done!')
        process.exit(0)
    })
    .catch(err => {
        console.error('\n💥 Fatal error:', err)
        process.exit(1)
    })
