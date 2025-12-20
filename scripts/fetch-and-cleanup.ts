
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
            const delay = 1000 * Math.pow(2, i)
            console.log(`    ⚠️ Retry ${i + 1}/${retries} after ${delay}ms...`)
            await sleep(delay)
        }
    }
}

async function processCompany(company: any) {
    const { ticker } = company
    console.log(`\n🚀 Processing ${ticker}...`)

    const baseUrl = 'https://financialmodelingprep.com/stable'

    try {
        // 1. Fetch Profile
        let profile: any = null
        try {
            const data = await fetchWithRetry(`${baseUrl}/profile?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}`)
            profile = data?.value?.[0] || (Array.isArray(data) ? data[0] : null)
        } catch (e) { console.log('   ❌ Profile fetch failed') }

        if (!profile) {
            console.log('   ⚠️ No profile found in FMP. Skipping deletion/update to be safe.')
            return
        }

        const mktCap = profile.marketCap || 0
        const currency = profile.currency || 'USD'

        // ==========================================
        // CHECK: Market Cap 0 -> DELETE
        // ==========================================
        if (mktCap === 0) {
            console.log(`   💀 Market Cap is 0. Deleting ${ticker} from DB...`)

            const { error } = await supabase
                .from('companies')
                .delete()
                .eq('ticker', ticker)

            if (error) console.error(`   ❌ Delete failed:`, error.message)
            else console.log(`   🗑️  Deleted ${ticker}.`)

            return
        }

        console.log(`   ✅ Valid Market Cap: $${convertToUSD(mktCap, currency)?.toLocaleString()}`)

        // ==========================================
        // UPDATE: Fetch Full Financials
        // ==========================================
        async function fetchArray(endpoint: string, params = '') {
            try {
                const data = await fetchWithRetry(`${baseUrl}/${endpoint}?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}&${params}`)
                return data?.value || (Array.isArray(data) ? data : [])
            } catch (e) { return [] }
        }

        // 2. Financial Statements
        const [
            incomeAnnual, balanceAnnual, cashFlowAnnual,
            incomeQuarterly, balanceQuarterly, cashFlowQuarterly
        ] = await Promise.all([
            fetchArray('income-statement', 'period=annual&limit=5'),
            fetchArray('balance-sheet-statement', 'period=annual&limit=5'),
            fetchArray('cash-flow-statement', 'period=annual&limit=5'),
            fetchArray('income-statement', 'period=quarter&limit=20'),
            fetchArray('balance-sheet-statement', 'period=quarter&limit=20'),
            fetchArray('cash-flow-statement', 'period=quarter&limit=20')
        ])

        console.log(`   📊 Stmts: ${incomeAnnual.length}A/${incomeQuarterly.length}Q Inc`)

        // 3. Metrics/Ratios
        let keyMetricsTTM: any = null
        try {
            const data = await fetchWithRetry(`${baseUrl}/key-metrics-ttm?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}`)
            keyMetricsTTM = data?.value?.[0] || (Array.isArray(data) ? data[0] : null)
        } catch (e) { }

        let ratiosTTM: any = null
        try {
            const data = await fetchWithRetry(`${baseUrl}/ratios-ttm?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}`)
            ratiosTTM = data?.value?.[0] || (Array.isArray(data) ? data[0] : null)
        } catch (e) { }

        const keyMetricsHist = await fetchArray('key-metrics', 'period=annual&limit=5')
        const ratiosHist = await fetchArray('ratios', 'period=annual&limit=5')

        // 4. Convert & Map
        const mapFinancials = (items: any[]) => items.map(item => ({
            ...item,
            revenue: convertToUSD(item.revenue, currency),
            netIncome: convertToUSD(item.netIncome, currency),
            grossProfit: convertToUSD(item.grossProfit, currency),
            operatingIncome: convertToUSD(item.operatingIncome, currency),
            costOfRevenue: convertToUSD(item.costOfRevenue, currency),
            ebitda: convertToUSD(item.ebitda, currency),
            totalAssets: convertToUSD(item.totalAssets, currency),
            totalLiabilities: convertToUSD(item.totalLiabilities, currency),
            totalStockholdersEquity: convertToUSD(item.totalStockholdersEquity, currency),
            cashAndCashEquivalents: convertToUSD(item.cashAndCashEquivalents, currency),
            totalEquity: convertToUSD(item.totalStockholdersEquity, currency),
            operatingCashFlow: convertToUSD(item.operatingCashFlow, currency),
            capitalExpenditure: convertToUSD(item.capitalExpenditure, currency),
            freeCashFlow: convertToUSD(item.freeCashFlow, currency),
        }))

        const latestInc = incomeAnnual[0]
        const latestBal = balanceAnnual[0]
        const latestCF = cashFlowAnnual[0]

        // 5. Construct Update Object
        const updateData = {
            sector: profile.sector || null,
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

                keyMetrics: keyMetricsTTM || (keyMetricsHist.length ? keyMetricsHist[0] : null),
                ratios: ratiosTTM || (ratiosHist.length ? ratiosHist[0] : null),
                historicalKeyMetrics: keyMetricsHist,
                historicalRatios: ratiosHist,

                originalCurrency: profile.currency || 'USD',
                exchangeRateUsed: EXCHANGE_RATES[currency] || 1,
                last_updated: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
        }

        // 6. Save
        const { error } = await supabase
            .from('companies')
            .update(updateData)
            .eq('ticker', ticker)

        if (error) console.error(`   ❌ DB Update error:`, error.message)
        else console.log(`   💾 Data updated.`)

    } catch (e: any) {
        console.error(`   ❌ Error:`, e.message)
    }
}

async function processBatch(companies: any[], concurrency: number) {
    let index = 0
    const worker = async (id: number) => {
        while (index < companies.length) {
            const currentIndex = index++
            if (currentIndex >= companies.length) break;
            await processCompany(companies[currentIndex])
        }
    }
    await Promise.all(Array(concurrency).fill(null).map((_, i) => worker(i + 1)))
}

async function main() {
    console.log('🔄 STARTING GLOBAL FMP REFRESH & MARKET CAP CLEANUP\n')

    // We update everything. Pagination logic.
    const BATCH_SIZE = 100 // Smaller batch because full fetch is heavy
    let offset = 0
    let totalProcessed = 0
    const start = Date.now()
    const CONCURRENCY = 5 // Conservative concurrency to avoid rate limits with full fetch

    while (true) {
        console.log(`\n📦 Batch ${offset} - ${offset + BATCH_SIZE}...`)

        const { data: companies, error } = await supabase
            .from('companies')
            .select('ticker, name')
            .range(offset, offset + BATCH_SIZE - 1)
            .order('ticker')

        if (error) {
            console.error('DB Error:', error)
            break
        }

        if (!companies || companies.length === 0) {
            console.log('Finished all companies.')
            break
        }

        console.log(`Found ${companies.length} to process.`)
        await processBatch(companies, CONCURRENCY)

        totalProcessed += companies.length
        offset += BATCH_SIZE

        if (companies.length < BATCH_SIZE) break
    }

    const duration = (Date.now() - start) / 1000
    console.log(`\n✅ Done. Processed ${totalProcessed} in ${duration.toFixed(1)}s.`)
}

main()
