// Import Japanese companies using Tokyo Stock Exchange (TSE) tickers
// This uses FMP profile + financials endpoints (no quote - that requires premium)
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

// JPY to USD exchange rate (as of Dec 2024, approx 150 JPY = 1 USD)
// You can update this periodically or fetch from an API
const JPY_TO_USD = 1 / 150

// Helper to convert JPY values to USD
const convertToUSD = (jpyValue: number | null | undefined): number => {
    if (jpyValue === null || jpyValue === undefined) return 0
    return Math.round(jpyValue * JPY_TO_USD)
}

// Japanese aerospace companies with their TSE tickers
const JAPAN_AEROSPACE_TSE = [
    { tse: '7011.T', name: 'Mitsubishi Heavy Industries' },
    { tse: '7012.T', name: 'Kawasaki Heavy Industries' },
    { tse: '7224.T', name: 'ShinMaywa Industries' },
    { tse: '7408.T', name: 'JAMCO Corporation' },
    { tse: '7409.T', name: 'AeroEdge Co.' },
    { tse: '6946.T', name: 'Nippon Avionics' },
]

async function fetchAndImport(ticker: string, displayName: string) {
    console.log(`\n🚀 Fetching ${ticker} (${displayName}) from FMP...\n`)

    // Fetch profile
    let profile = null
    try {
        const profileUrl = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(ticker)}?apikey=${FMP_API_KEY}`
        console.log(`Fetching profile...`)
        const res = await fetch(profileUrl)
        const text = await res.text()

        if (text.startsWith('[')) {
            const data = JSON.parse(text)
            if (data.length > 0) {
                profile = data[0]
                console.log(`✅ Profile: ${profile.companyName}`)
                console.log(`   Country: ${profile.country}`)
                console.log(`   Market Cap: ${profile.mktCap ? `$${(profile.mktCap / 1e9).toFixed(2)}B` : 'N/A'}`)
            }
        } else {
            // Might be "Premium..." error
            console.log(`⚠️ Profile response: ${text.substring(0, 50)}...`)
        }
    } catch (e: any) {
        console.log(`❌ Profile fetch error: ${e.message}`)
    }

    // Fetch income statements
    let incomeStatements: any[] = []
    try {
        const url = `https://financialmodelingprep.com/api/v3/income-statement/${encodeURIComponent(ticker)}?period=annual&limit=5&apikey=${FMP_API_KEY}`
        console.log(`Fetching income statements...`)
        const res = await fetch(url)
        const data = await res.json()
        if (Array.isArray(data)) {
            incomeStatements = data
            console.log(`✅ Income statements: ${data.length} years`)
        }
    } catch (e: any) {
        console.log(`❌ Income statement error: ${e.message}`)
    }

    // Fetch balance sheets
    let balanceSheets: any[] = []
    try {
        const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${encodeURIComponent(ticker)}?period=annual&limit=5&apikey=${FMP_API_KEY}`
        console.log(`Fetching balance sheets...`)
        const res = await fetch(url)
        const data = await res.json()
        if (Array.isArray(data)) {
            balanceSheets = data
            console.log(`✅ Balance sheets: ${data.length} years`)
        }
    } catch (e: any) {
        console.log(`❌ Balance sheet error: ${e.message}`)
    }

    // Fetch cash flow statements
    let cashFlowStatements: any[] = []
    try {
        const url = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${encodeURIComponent(ticker)}?period=annual&limit=5&apikey=${FMP_API_KEY}`
        console.log(`Fetching cash flow statements...`)
        const res = await fetch(url)
        const data = await res.json()
        if (Array.isArray(data)) {
            cashFlowStatements = data
            console.log(`✅ Cash flow statements: ${data.length} years`)
        }
    } catch (e: any) {
        console.log(`❌ Cash flow error: ${e.message}`)
    }

    if (!profile && incomeStatements.length === 0) {
        console.log(`\n❌ Cannot import ${ticker} - no data available`)
        return false
    }

    // Prepare the upsert - use TSE ticker as the primary key
    const latestIncome = incomeStatements[0]
    const latestBalance = balanceSheets[0]
    const latestCashFlow = cashFlowStatements[0]

    // Convert all financial statement values from JPY to USD
    const convertedIncomeStatements = incomeStatements.map((stmt: any) => ({
        ...stmt,
        revenue: convertToUSD(stmt.revenue),
        netIncome: convertToUSD(stmt.netIncome),
        grossProfit: convertToUSD(stmt.grossProfit),
        operatingIncome: convertToUSD(stmt.operatingIncome),
        costOfRevenue: convertToUSD(stmt.costOfRevenue),
        operatingExpenses: convertToUSD(stmt.operatingExpenses),
        ebitda: convertToUSD(stmt.ebitda),
    }))

    const convertedBalanceSheets = balanceSheets.map((stmt: any) => ({
        ...stmt,
        totalAssets: convertToUSD(stmt.totalAssets),
        totalLiabilities: convertToUSD(stmt.totalLiabilities),
        totalStockholdersEquity: convertToUSD(stmt.totalStockholdersEquity),
        cashAndCashEquivalents: convertToUSD(stmt.cashAndCashEquivalents),
        totalDebt: convertToUSD(stmt.totalDebt),
        totalCurrentAssets: convertToUSD(stmt.totalCurrentAssets),
        totalCurrentLiabilities: convertToUSD(stmt.totalCurrentLiabilities),
    }))

    const convertedCashFlowStatements = cashFlowStatements.map((stmt: any) => ({
        ...stmt,
        operatingCashFlow: convertToUSD(stmt.operatingCashFlow),
        capitalExpenditure: convertToUSD(stmt.capitalExpenditure),
        freeCashFlow: convertToUSD(stmt.freeCashFlow),
        dividendsPaid: convertToUSD(stmt.dividendsPaid),
    }))

    const companyData = {
        ticker: ticker, // Use TSE ticker like 7011.T
        name: profile?.companyName || displayName,
        sector: profile?.sector || null,
        industry: profile?.industry || null,
        description: profile?.description || null,
        website: profile?.website || null,
        logo_url: profile?.image || null,
        country: 'JP', // Force JP for TSE tickers
        exchange: 'TSE',
        market_cap: convertToUSD(profile?.mktCap || latestBalance?.totalAssets || 0),
        employees: profile?.fullTimeEmployees || 0,
        data: {
            profile: profile ? {
                companyName: profile.companyName,
                cik: profile.cik,
                isin: profile.isin,
                cusip: profile.cusip,
                ipoDate: profile.ipoDate,
                beta: profile.beta,
            } : { companyName: displayName },
            incomeStatement: latestIncome ? {
                date: latestIncome.date,
                revenue: convertToUSD(latestIncome.revenue),
                netIncome: convertToUSD(latestIncome.netIncome),
                grossProfit: convertToUSD(latestIncome.grossProfit),
                operatingIncome: convertToUSD(latestIncome.operatingIncome),
            } : null,
            balanceSheet: latestBalance ? {
                date: latestBalance.date,
                totalAssets: convertToUSD(latestBalance.totalAssets),
                totalLiabilities: convertToUSD(latestBalance.totalLiabilities),
                totalEquity: convertToUSD(latestBalance.totalStockholdersEquity),
                cashAndCashEquivalents: convertToUSD(latestBalance.cashAndCashEquivalents),
            } : null,
            cashFlow: latestCashFlow ? {
                date: latestCashFlow.date,
                operatingCashFlow: convertToUSD(latestCashFlow.operatingCashFlow),
                capitalExpenditure: convertToUSD(latestCashFlow.capitalExpenditure),
                freeCashFlow: convertToUSD(latestCashFlow.freeCashFlow),
            } : null,
            // Historical data for FinancialStatements component (all converted to USD)
            historicalFinancials: {
                incomeStatements: convertedIncomeStatements,
                balanceSheets: convertedBalanceSheets,
                cashFlowStatements: convertedCashFlowStatements,
            },
            // Store original currency for reference
            originalCurrency: 'JPY',
            exchangeRateUsed: JPY_TO_USD,
            last_updated: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
    }

    console.log(`\n💾 Upserting ${ticker} to Supabase...`)

    const { error } = await supabase
        .from('companies')
        .upsert(companyData, { onConflict: 'ticker' })

    if (error) {
        console.error(`❌ Supabase error: ${error.message}`)
        return false
    }

    console.log(`✅ Successfully imported ${ticker}!`)
    return true
}

async function main() {
    console.log('🇯🇵 Importing Japanese Aerospace Companies (TSE Tickers)\n')
    console.log('='.repeat(50))

    let success = 0
    let failed = 0

    for (const company of JAPAN_AEROSPACE_TSE) {
        const result = await fetchAndImport(company.tse, company.name)
        if (result) success++
        else failed++

        // Wait between requests
        await new Promise(r => setTimeout(r, 1000))
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✨ Import complete: ${success} succeeded, ${failed} failed`)
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Fatal:', err)
        process.exit(1)
    })
