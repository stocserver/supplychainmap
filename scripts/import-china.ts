// Import Chinese companies - using Hong Kong and ADR tickers
// This uses FMP profile + financials endpoints
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

// Exchange rates (as of Dec 2024)
const CNY_TO_USD = 1 / 7.2  // ~7.2 CNY = 1 USD
const HKD_TO_USD = 1 / 7.8  // ~7.8 HKD = 1 USD

// Helper to convert to USD
const convertToUSD = (value: number | null | undefined, rate: number): number => {
    if (value === null || value === undefined) return 0
    return Math.round(value * rate)
}

// Major Chinese companies - mix of HK listed and US ADRs
const CHINA_COMPANIES = [
    // Hong Kong Listed (HKD) - format: XXXX.HK
    { ticker: '0700.HK', name: 'Tencent Holdings', currency: 'HKD' },
    { ticker: '9988.HK', name: 'Alibaba Group', currency: 'HKD' },
    { ticker: '3690.HK', name: 'Meituan', currency: 'HKD' },
    { ticker: '9999.HK', name: 'NetEase', currency: 'HKD' },
    { ticker: '1810.HK', name: 'Xiaomi Corporation', currency: 'HKD' },
    { ticker: '2020.HK', name: 'ANTA Sports', currency: 'HKD' },
    { ticker: '9618.HK', name: 'JD.com', currency: 'HKD' },
    { ticker: '9888.HK', name: 'Baidu', currency: 'HKD' },
    { ticker: '1211.HK', name: 'BYD Company', currency: 'HKD' },
    { ticker: '2318.HK', name: 'Ping An Insurance', currency: 'HKD' },
    { ticker: '0941.HK', name: 'China Mobile', currency: 'HKD' },
    { ticker: '0939.HK', name: 'China Construction Bank', currency: 'HKD' },
    { ticker: '1398.HK', name: 'ICBC', currency: 'HKD' },
    { ticker: '3988.HK', name: 'Bank of China', currency: 'HKD' },
    { ticker: '2628.HK', name: 'China Life Insurance', currency: 'HKD' },
    // US ADRs (already in USD)
    { ticker: 'BABA', name: 'Alibaba ADR', currency: 'USD' },
    { ticker: 'JD', name: 'JD.com ADR', currency: 'USD' },
    { ticker: 'PDD', name: 'PDD Holdings', currency: 'USD' },
    { ticker: 'BIDU', name: 'Baidu ADR', currency: 'USD' },
    { ticker: 'NIO', name: 'NIO Inc', currency: 'USD' },
    { ticker: 'XPEV', name: 'XPeng', currency: 'USD' },
    { ticker: 'LI', name: 'Li Auto', currency: 'USD' },
    { ticker: 'NTES', name: 'NetEase ADR', currency: 'USD' },
    { ticker: 'TME', name: 'Tencent Music', currency: 'USD' },
    { ticker: 'BILI', name: 'Bilibili', currency: 'USD' },
    { ticker: 'ZTO', name: 'ZTO Express', currency: 'USD' },
    { ticker: 'VNET', name: 'VNET Group', currency: 'USD' },
    { ticker: 'YMM', name: 'Full Truck Alliance', currency: 'USD' },
    { ticker: 'DIDI', name: 'DiDi Global', currency: 'USD' },
    { ticker: 'TAL', name: 'TAL Education', currency: 'USD' },
]

async function fetchAndImport(ticker: string, displayName: string, currency: string) {
    console.log(`\n🚀 Fetching ${ticker} (${displayName}) [${currency}]...\n`)

    const exchangeRate = currency === 'HKD' ? HKD_TO_USD : currency === 'CNY' ? CNY_TO_USD : 1

    // Fetch profile
    let profile = null
    try {
        const profileUrl = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(ticker)}?apikey=${FMP_API_KEY}`
        const res = await fetch(profileUrl)
        const text = await res.text()

        if (text.startsWith('[')) {
            const data = JSON.parse(text)
            if (data.length > 0) {
                profile = data[0]
                console.log(`✅ Profile: ${profile.companyName}`)
                console.log(`   Market Cap: ${currency === 'USD' ? `$${(profile.mktCap / 1e9).toFixed(2)}B` : `${currency} ${(profile.mktCap / 1e9).toFixed(2)}B`}`)
            }
        } else if (text.includes('Premium')) {
            console.log(`⚠️ Premium required for ${ticker}`)
            return false
        }
    } catch (e: any) {
        console.log(`❌ Profile error: ${e.message}`)
        return false
    }

    // Fetch financials
    let incomeStatements: any[] = []
    let balanceSheets: any[] = []
    let cashFlowStatements: any[] = []

    try {
        const url = `https://financialmodelingprep.com/api/v3/income-statement/${encodeURIComponent(ticker)}?period=annual&limit=5&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        if (Array.isArray(data)) {
            incomeStatements = data
            console.log(`✅ Income statements: ${data.length} years`)
        }
    } catch (e) { }

    try {
        const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${encodeURIComponent(ticker)}?period=annual&limit=5&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        if (Array.isArray(data)) {
            balanceSheets = data
            console.log(`✅ Balance sheets: ${data.length} years`)
        }
    } catch (e) { }

    try {
        const url = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${encodeURIComponent(ticker)}?period=annual&limit=5&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        if (Array.isArray(data)) {
            cashFlowStatements = data
            console.log(`✅ Cash flow: ${data.length} years`)
        }
    } catch (e) { }

    if (!profile && incomeStatements.length === 0) {
        console.log(`❌ Cannot import ${ticker} - no data`)
        return false
    }

    const latestIncome = incomeStatements[0]
    const latestBalance = balanceSheets[0]
    const latestCashFlow = cashFlowStatements[0]

    // Convert arrays to USD
    const convert = (val: number) => convertToUSD(val, exchangeRate)

    const convertedIncomeStatements = incomeStatements.map((stmt: any) => ({
        ...stmt,
        revenue: convert(stmt.revenue),
        netIncome: convert(stmt.netIncome),
        grossProfit: convert(stmt.grossProfit),
        operatingIncome: convert(stmt.operatingIncome),
        costOfRevenue: convert(stmt.costOfRevenue),
        ebitda: convert(stmt.ebitda),
    }))

    const convertedBalanceSheets = balanceSheets.map((stmt: any) => ({
        ...stmt,
        totalAssets: convert(stmt.totalAssets),
        totalLiabilities: convert(stmt.totalLiabilities),
        totalStockholdersEquity: convert(stmt.totalStockholdersEquity),
        cashAndCashEquivalents: convert(stmt.cashAndCashEquivalents),
    }))

    const convertedCashFlowStatements = cashFlowStatements.map((stmt: any) => ({
        ...stmt,
        operatingCashFlow: convert(stmt.operatingCashFlow),
        capitalExpenditure: convert(stmt.capitalExpenditure),
        freeCashFlow: convert(stmt.freeCashFlow),
    }))

    const companyData = {
        ticker: ticker,
        name: profile?.companyName || displayName,
        sector: profile?.sector || null,
        industry: profile?.industry || null,
        description: profile?.description || null,
        website: profile?.website || null,
        logo_url: profile?.image || null,
        country: 'CN',
        exchange: profile?.exchangeShortName || (ticker.includes('.HK') ? 'HKEX' : 'NYSE'),
        market_cap: convert(profile?.mktCap || 0),
        employees: profile?.fullTimeEmployees || 0,
        data: {
            profile: profile ? {
                companyName: profile.companyName,
                isin: profile.isin,
                ipoDate: profile.ipoDate,
                beta: profile.beta,
            } : { companyName: displayName },
            incomeStatement: latestIncome ? {
                date: latestIncome.date,
                revenue: convert(latestIncome.revenue),
                netIncome: convert(latestIncome.netIncome),
                grossProfit: convert(latestIncome.grossProfit),
                operatingIncome: convert(latestIncome.operatingIncome),
            } : null,
            balanceSheet: latestBalance ? {
                date: latestBalance.date,
                totalAssets: convert(latestBalance.totalAssets),
                totalLiabilities: convert(latestBalance.totalLiabilities),
                totalEquity: convert(latestBalance.totalStockholdersEquity),
                cashAndCashEquivalents: convert(latestBalance.cashAndCashEquivalents),
            } : null,
            cashFlow: latestCashFlow ? {
                date: latestCashFlow.date,
                operatingCashFlow: convert(latestCashFlow.operatingCashFlow),
                capitalExpenditure: convert(latestCashFlow.capitalExpenditure),
                freeCashFlow: convert(latestCashFlow.freeCashFlow),
            } : null,
            historicalFinancials: {
                incomeStatements: convertedIncomeStatements,
                balanceSheets: convertedBalanceSheets,
                cashFlowStatements: convertedCashFlowStatements,
            },
            originalCurrency: currency,
            exchangeRateUsed: exchangeRate,
            last_updated: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
    }

    console.log(`💾 Saving to Supabase (Market Cap: $${(companyData.market_cap / 1e9).toFixed(2)}B)...`)

    const { error } = await supabase
        .from('companies')
        .upsert(companyData, { onConflict: 'ticker' })

    if (error) {
        console.error(`❌ Supabase error: ${error.message}`)
        return false
    }

    console.log(`✅ Imported ${ticker}!`)
    return true
}

async function main() {
    console.log('🇨🇳 Importing Chinese Companies\n')
    console.log('='.repeat(50))

    let success = 0
    let failed = 0

    for (const company of CHINA_COMPANIES) {
        const result = await fetchAndImport(company.ticker, company.name, company.currency)
        if (result) success++
        else failed++
        await new Promise(r => setTimeout(r, 800))
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✨ Complete: ${success} succeeded, ${failed} failed`)
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Fatal:', err)
        process.exit(1)
    })
