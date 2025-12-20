
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

const EXCHANGE_RATES: Record<string, number> = {
    'USD': 1,
    'JPY': 0.0067, // ~1/150
    'EUR': 1.09,
    'GBP': 1.27,
    'CNY': 0.14,
    'HKD': 0.13,
    'AUD': 0.67,
    'CAD': 0.74,
    'INR': 0.012,
    'TWD': 0.032,
    'KRW': 0.00075,
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const convertToUSD = (value: number | null | undefined, currency: string): number | null => {
    if (value === null || value === undefined) return null
    const rate = EXCHANGE_RATES[currency] || 1
    // If rate is 1 (USD or unknown), just return value. If unknown, we assume USD which is a safe failure mode for now.
    return Math.round(value * rate)
}

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url)
            if (!res.ok) {
                if (res.status === 429) {
                    throw new Error('Rate limit reached')
                }
                throw new Error(`HTTP ${res.status}`)
            }
            return await res.json()
        } catch (e: any) {
            if (i === retries - 1) throw e
            // Exponential backoff
            const delay = 1000 * Math.pow(2, i)
            console.log(`    ⚠️ Retry ${i + 1}/${retries} after ${delay}ms...`)
            await sleep(delay)
        }
    }
}

async function updateCompanyFinancials(company: any) {
    const { ticker, country } = company
    console.log(`\n🚀 Processing ${ticker} (${company.name})...`)

    const baseUrl = 'https://financialmodelingprep.com/stable'

    try {
        // 1. Profile
        // Note: We don't overwrite the name/industry/country from the seed file, 
        // but we fetch profile to get market cap, description, website, etc.
        let profile: any = null
        try {
            const data = await fetchWithRetry(`${baseUrl}/profile?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}`)
            // Handle { value: [...] } wrapper
            profile = data?.value?.[0] || (Array.isArray(data) ? data[0] : null)
        } catch (e) { console.log('   ❌ Profile fetch failed') }

        if (!profile) {
            console.log('   ⚠️ No profile found, skipping details update')
            return
        }

        const currency = profile.currency || 'USD'
        // Helper to fetch array data
        async function fetchArray(endpoint: string, params = '') {
            try {
                const data = await fetchWithRetry(`${baseUrl}/${endpoint}?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}&${params}`)
                return data?.value || (Array.isArray(data) ? data : [])
            } catch (e) { return [] }
        }

        // 2. Financial Statements (Annual & Quarterly)
        const incomeAnnual = await fetchArray('income-statement', 'period=annual&limit=5')
        const balanceAnnual = await fetchArray('balance-sheet-statement', 'period=annual&limit=5')
        const cashFlowAnnual = await fetchArray('cash-flow-statement', 'period=annual&limit=5')

        const incomeQuarterly = await fetchArray('income-statement', 'period=quarter&limit=20')
        const balanceQuarterly = await fetchArray('balance-sheet-statement', 'period=quarter&limit=20')
        const cashFlowQuarterly = await fetchArray('cash-flow-statement', 'period=quarter&limit=20')

        console.log(`   ✅ Statements: Inc ${incomeAnnual.length}A/${incomeQuarterly.length}Q, Bal ${balanceAnnual.length}A/${balanceQuarterly.length}Q, CF ${cashFlowAnnual.length}A/${cashFlowQuarterly.length}Q [${currency}]`)

        // 3. TTM Metrics & Ratios (Single objects)
        let keyMetricsTTM: any = null
        try {
            const data = await fetchWithRetry(`${baseUrl}/key-metrics-ttm?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}`)
            const item = data?.value?.[0] || (Array.isArray(data) ? data[0] : null)
            if (item) {
                keyMetricsTTM = {
                    peRatioTTM: item.peRatioTTM || null,
                    priceToSalesRatioTTM: item.priceToSalesRatioTTM || null,
                    ptbRatioTTM: item.priceToBookRatioTTM || null,
                    roeTTM: item.returnOnEquityTTM || null,
                    roaTTM: item.returnOnAssetsTTM || null,
                    debtToEquityTTM: item.debtToEquityRatioTTM || null,
                    currentRatioTTM: item.currentRatioTTM || null,
                    evToEbitdaTTM: item.evToEBITDATTM || null,
                    ...item
                }
            }
        } catch (e) { }

        let ratiosTTM: any = null
        try {
            const data = await fetchWithRetry(`${baseUrl}/ratios-ttm?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}`)
            const item = data?.value?.[0] || (Array.isArray(data) ? data[0] : null)
            if (item) {
                ratiosTTM = {
                    peRatioTTM: item.priceToEarningsRatioTTM || null,
                    priceToSalesRatioTTM: item.priceToSalesRatioTTM || null,
                    ptbRatioTTM: item.priceToBookRatioTTM || null,
                    debtToEquityTTM: item.debtToEquityRatioTTM || null,
                    currentRatioTTM: item.currentRatioTTM || null,
                    grossProfitMarginTTM: item.grossProfitMarginTTM || null,
                    netProfitMarginTTM: item.netProfitMarginTTM || null,
                    operatingProfitMarginTTM: item.operatingProfitMarginTTM || null,
                    dividendYieldTTM: item.dividendYieldTTM || null,
                    ...item
                }
            }
        } catch (e) { }

        // 4. Historical Metrics & Ratios (Arrays)
        const keyMetricsHist = await fetchArray('key-metrics', 'period=annual&limit=5')
        const ratiosHist = await fetchArray('ratios', 'period=annual&limit=5')

        console.log(`   ✅ Metrics/Ratios: TTM found, Hist ${keyMetricsHist.length}/${ratiosHist.length}`)

        // 5. Convert relevant fields to USD
        const mapFinancials = (items: any[]) => items.map(item => ({
            ...item,
            // Income
            revenue: convertToUSD(item.revenue, currency),
            netIncome: convertToUSD(item.netIncome, currency),
            grossProfit: convertToUSD(item.grossProfit, currency),
            operatingIncome: convertToUSD(item.operatingIncome, currency),
            costOfRevenue: convertToUSD(item.costOfRevenue, currency),
            ebitda: convertToUSD(item.ebitda, currency),
            // Balance
            totalAssets: convertToUSD(item.totalAssets, currency),
            totalLiabilities: convertToUSD(item.totalLiabilities, currency),
            totalStockholdersEquity: convertToUSD(item.totalStockholdersEquity, currency),
            cashAndCashEquivalents: convertToUSD(item.cashAndCashEquivalents, currency),
            totalEquity: convertToUSD(item.totalStockholdersEquity, currency), // Map for consistency
            // Cash Flow
            operatingCashFlow: convertToUSD(item.operatingCashFlow, currency),
            capitalExpenditure: convertToUSD(item.capitalExpenditure, currency),
            freeCashFlow: convertToUSD(item.freeCashFlow, currency),
        }))

        // Latest values for top-level shortcut fields
        const latestInc = incomeAnnual[0]
        const latestBal = balanceAnnual[0]
        const latestCF = cashFlowAnnual[0]

        // Construct Data Object
        const updateData = {
            sector: profile.sector || null,
            // Don't overwrite industry if we set it manually in seed, 
            // but fetching it form FMP might overwrite our custom taxonomy.
            // Let's keep our custom industry.
            description: profile.description || null,
            website: profile.website || null,
            logo_url: profile.image || null,
            exchange: profile.exchangeShortName || profile.exchange || null,
            market_cap: convertToUSD(profile.marketCap, currency),
            employees: parseInt(profile.fullTimeEmployees) || 0,
            data: {
                profile: {
                    companyName: profile.companyName,
                    isin: profile.isin,
                    ipoDate: profile.ipoDate,
                    beta: profile.beta,
                    ceo: profile.ceo,
                },
                // Top-level shortcuts (latest annual)
                incomeStatement: latestInc ? {
                    date: latestInc.date,
                    revenue: convertToUSD(latestInc.revenue, currency),
                    netIncome: convertToUSD(latestInc.netIncome, currency),
                    grossProfit: convertToUSD(latestInc.grossProfit, currency),
                    operatingIncome: convertToUSD(latestInc.operatingIncome, currency),
                } : null,
                balanceSheet: latestBal ? {
                    date: latestBal.date,
                    totalAssets: convertToUSD(latestBal.totalAssets, currency),
                    totalLiabilities: convertToUSD(latestBal.totalLiabilities, currency),
                    totalEquity: convertToUSD(latestBal.totalStockholdersEquity, currency),
                    cashAndCashEquivalents: convertToUSD(latestBal.cashAndCashEquivalents, currency),
                } : null,
                cashFlow: latestCF ? {
                    date: latestCF.date,
                    operatingCashFlow: convertToUSD(latestCF.operatingCashFlow, currency),
                    capitalExpenditure: convertToUSD(latestCF.capitalExpenditure, currency),
                    freeCashFlow: convertToUSD(latestCF.freeCashFlow, currency),
                } : null,

                historicalFinancials: {
                    incomeStatements: mapFinancials(incomeAnnual),
                    balanceSheets: mapFinancials(balanceAnnual),
                    cashFlowStatements: mapFinancials(cashFlowAnnual),
                    incomeStatementsQuarterly: mapFinancials(incomeQuarterly),
                    balanceSheetsQuarterly: mapFinancials(balanceQuarterly),
                    cashFlowStatementsQuarterly: mapFinancials(cashFlowQuarterly),
                },

                // keyMetrics: Object for TTM, fallback to first item of hist array
                keyMetrics: keyMetricsTTM || (keyMetricsHist.length ? keyMetricsHist[0] : null),
                ratios: ratiosTTM || (ratiosHist.length ? ratiosHist[0] : null),

                historicalKeyMetrics: keyMetricsHist, // Keep raw array
                historicalRatios: ratiosHist, // Keep raw array

                originalCurrency: profile.currency || 'USD',
                exchangeRateUsed: EXCHANGE_RATES[currency] || 1,
                last_updated: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
        }

        // Save to Supabase
        const { error } = await supabase
            .from('companies')
            .update(updateData)
            .eq('ticker', ticker)

        if (error) throw error

        console.log(`   💾 Saved!`)

    } catch (e: any) {
        console.error(`   ❌ Error updating ${ticker}:`, e.message)
    }
}


// Processing queue with concurrency control
async function processBatch(companies: any[], concurrency: number) {
    let index = 0

    // Worker function: keeps picking tasks until queue is empty
    const worker = async (id: number) => {
        while (index < companies.length) {
            // Atomic-ish fetch of next item
            const currentIndex = index++
            if (currentIndex >= companies.length) break;

            const company = companies[currentIndex]
            // console.log(`Worker ${id} starting ${company.ticker} (${currentIndex + 1}/${companies.length})`)
            await updateCompanyFinancials(company)
        }
    }

    const workers = Array(concurrency).fill(null).map((_, i) => worker(i + 1))
    await Promise.all(workers)
}

async function main() {
    console.log('🔄 Starting financial data update...')
    console.log('⚡ High-performance mode: Target ~2500 requests/min')

    const BATCH_SIZE = 500
    let offset = 0
    let totalProcessed = 0
    const start = Date.now()

    const CONCURRENCY = 8
    console.log(`🚀 Processing with ${CONCURRENCY} concurrent workers...`)

    while (true) {
        console.log(`\n📦 Fetching batch ${offset} - ${offset + BATCH_SIZE}...`)

        // Fetch next batch of companies
        const { data: companies, error } = await supabase
            .from('companies')
            .select('ticker, name, country')
            .range(offset, offset + BATCH_SIZE - 1)

        if (error) {
            console.error('Error fetching companies:', error)
            break
        }

        if (!companies || companies.length === 0) {
            console.log('No more companies found. Finished.')
            break
        }

        console.log(`Found ${companies.length} companies to update in this batch.`)

        await processBatch(companies, CONCURRENCY)

        totalProcessed += companies.length
        offset += BATCH_SIZE

        // Safety break if we simply run out (less than batch size means we are done)
        if (companies.length < BATCH_SIZE) {
            console.log('Finished final batch.')
            break
        }
    }

    const duration = (Date.now() - start) / 1000
    console.log(`\n✅ Update complete! Processed ${totalProcessed} companies in ${duration.toFixed(1)}s (${(totalProcessed / duration).toFixed(2)} companies/sec)`)
}

main()

