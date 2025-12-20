// Import Japan TSE companies using NEW FMP stable API endpoints
// Updated to use /stable/ endpoints instead of deprecated /api/v3/
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

// JPY to USD exchange rate
const JPY_TO_USD = 1 / 150

const convertToUSD = (jpyValue: number | null | undefined): number => {
    if (jpyValue === null || jpyValue === undefined) return 0
    return Math.round(jpyValue * JPY_TO_USD)
}

// All Japan TSE companies organized by industry
const JAPAN_COMPANIES = [
    // === SEMICONDUCTORS ===
    { ticker: '4063.T', name: 'Shin-Etsu Chemical', industry: 'semiconductors' },
    { ticker: '3436.T', name: 'SUMCO', industry: 'semiconductors' },
    { ticker: '8035.T', name: 'Tokyo Electron', industry: 'semiconductors' },
    { ticker: '6857.T', name: 'Advantest', industry: 'semiconductors' },
    { ticker: '7735.T', name: 'Screen Holdings', industry: 'semiconductors' },
    { ticker: '6146.T', name: 'Disco Corporation', industry: 'semiconductors' },
    { ticker: '6723.T', name: 'Renesas Electronics', industry: 'semiconductors' },
    { ticker: '6963.T', name: 'ROHM', industry: 'semiconductors' },

    // === AUTOMOTIVE ===
    { ticker: '7203.T', name: 'Toyota Motor', industry: 'automotive' },
    { ticker: '7267.T', name: 'Honda Motor', industry: 'automotive' },
    { ticker: '7201.T', name: 'Nissan Motor', industry: 'automotive' },
    { ticker: '7261.T', name: 'Mazda Motor', industry: 'automotive' },
    { ticker: '7270.T', name: 'Subaru', industry: 'automotive' },
    { ticker: '7269.T', name: 'Suzuki Motor', industry: 'automotive' },
    { ticker: '6902.T', name: 'Denso', industry: 'automotive' },
    { ticker: '7259.T', name: 'Aisin', industry: 'automotive' },
    { ticker: '6201.T', name: 'Toyota Industries', industry: 'automotive' },
    { ticker: '5108.T', name: 'Bridgestone', industry: 'automotive' },

    // === ROBOTICS & AUTOMATION ===
    { ticker: '6954.T', name: 'Fanuc', industry: 'robotics-automation' },
    { ticker: '6506.T', name: 'Yaskawa Electric', industry: 'robotics-automation' },
    { ticker: '6861.T', name: 'Keyence', industry: 'robotics-automation' },
    { ticker: '6645.T', name: 'Omron', industry: 'robotics-automation' },
    { ticker: '6273.T', name: 'SMC Corporation', industry: 'robotics-automation' },
    { ticker: '6594.T', name: 'Nidec', industry: 'robotics-automation' },

    // === GAMING & ENTERTAINMENT ===
    { ticker: '7974.T', name: 'Nintendo', industry: 'media-entertainment' },
    { ticker: '6758.T', name: 'Sony Group', industry: 'media-entertainment' },
    { ticker: '9697.T', name: 'Capcom', industry: 'media-entertainment' },
    { ticker: '9684.T', name: 'Square Enix', industry: 'media-entertainment' },
    { ticker: '7832.T', name: 'Bandai Namco', industry: 'media-entertainment' },

    // === CHEMICALS ===
    { ticker: '4188.T', name: 'Mitsubishi Chemical', industry: 'chemicals' },
    { ticker: '3402.T', name: 'Toray Industries', industry: 'chemicals' },
    { ticker: '4005.T', name: 'Sumitomo Chemical', industry: 'chemicals' },
    { ticker: '3407.T', name: 'Asahi Kasei', industry: 'chemicals' },

    // === BANKING ===
    { ticker: '8306.T', name: 'MUFG', industry: 'banking' },
    { ticker: '8316.T', name: 'Sumitomo Mitsui FG', industry: 'banking' },
    { ticker: '8411.T', name: 'Mizuho Financial', industry: 'banking' },
    { ticker: '8604.T', name: 'Nomura Holdings', industry: 'banking' },

    // === TELECOMMUNICATIONS ===
    { ticker: '9432.T', name: 'NTT', industry: 'telecommunications' },
    { ticker: '9433.T', name: 'KDDI', industry: 'telecommunications' },
    { ticker: '9434.T', name: 'SoftBank Corp', industry: 'telecommunications' },

    // === PHARMACEUTICALS ===
    { ticker: '4502.T', name: 'Takeda Pharmaceutical', industry: 'pharmaceuticals' },
    { ticker: '4503.T', name: 'Astellas Pharma', industry: 'pharmaceuticals' },
    { ticker: '4568.T', name: 'Daiichi Sankyo', industry: 'pharmaceuticals' },
    { ticker: '4578.T', name: 'Otsuka Holdings', industry: 'pharmaceuticals' },
    { ticker: '4523.T', name: 'Eisai', industry: 'pharmaceuticals' },

    // === FOOD & BEVERAGE ===
    { ticker: '2802.T', name: 'Ajinomoto', industry: 'food-beverage' },
    { ticker: '2503.T', name: 'Kirin Holdings', industry: 'food-beverage' },
    { ticker: '2502.T', name: 'Asahi Group', industry: 'food-beverage' },
    { ticker: '2914.T', name: 'Japan Tobacco', industry: 'food-beverage' },

    // === CONSTRUCTION ===
    { ticker: '1925.T', name: 'Daiwa House', industry: 'construction-engineering' },
    { ticker: '1928.T', name: 'Sekisui House', industry: 'construction-engineering' },
    { ticker: '1802.T', name: 'Obayashi', industry: 'construction-engineering' },
    { ticker: '1812.T', name: 'Kajima', industry: 'construction-engineering' },

    // === AEROSPACE ===
    { ticker: '7011.T', name: 'Mitsubishi Heavy Industries', industry: 'aerospace-defense' },
    { ticker: '7012.T', name: 'Kawasaki Heavy Industries', industry: 'aerospace-defense' },
    { ticker: '7224.T', name: 'ShinMaywa Industries', industry: 'aerospace-defense' },
]

async function fetchAndImport(ticker: string, displayName: string, industry: string) {
    console.log(`\n🚀 ${ticker} (${displayName})`)

    // Use NEW stable API endpoints
    const baseUrl = 'https://financialmodelingprep.com/stable'

    let profile = null
    let incomeStatements: any[] = []
    let balanceSheets: any[] = []
    let cashFlowStatements: any[] = []

    // Fetch profile using stable endpoint
    try {
        const url = `${baseUrl}/profile?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const text = await res.text()
        let data
        try {
            data = JSON.parse(text)
        } catch {
            console.log(`   ❌ Invalid JSON:`, text.substring(0, 100))
            return false
        }
        // FMP stable API returns {value: [...], Count: n} format
        const items = data?.value || (Array.isArray(data) ? data : [])
        if (items.length > 0) {
            profile = items[0]
            console.log(`   ✅ Profile: ${profile.companyName}`)
        } else {
            console.log(`   ❌ No profile data - response:`, JSON.stringify(data).substring(0, 100))
            return false
        }
    } catch (e: any) {
        console.log(`   ❌ Profile error: ${e.message}`)
        return false
    }

    // Fetch income statements (annual)
    try {
        const url = `${baseUrl}/income-statement?symbol=${encodeURIComponent(ticker)}&period=annual&limit=5&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        // FMP stable API returns {value: [...], Count: n} format
        const items = data?.value || (Array.isArray(data) ? data : [])
        if (items.length > 0) {
            incomeStatements = items
            console.log(`   ✅ Income: ${items.length} years`)
        }
    } catch (e) { }

    // Fetch balance sheets (annual)
    try {
        const url = `${baseUrl}/balance-sheet-statement?symbol=${encodeURIComponent(ticker)}&period=annual&limit=5&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        const items = data?.value || (Array.isArray(data) ? data : [])
        if (items.length > 0) {
            balanceSheets = items
            console.log(`   ✅ Balance: ${items.length} years`)
        }
    } catch (e) { }

    // Fetch cash flow (annual)
    try {
        const url = `${baseUrl}/cash-flow-statement?symbol=${encodeURIComponent(ticker)}&period=annual&limit=5&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        const items = data?.value || (Array.isArray(data) ? data : [])
        if (items.length > 0) {
            cashFlowStatements = items
            console.log(`   ✅ CashFlow: ${items.length} years`)
        }
    } catch (e) { }

    // Fetch QUARTERLY data
    let incomeStatementsQuarterly: any[] = []
    let balanceSheetsQuarterly: any[] = []
    let cashFlowStatementsQuarterly: any[] = []

    try {
        const url = `${baseUrl}/income-statement?symbol=${encodeURIComponent(ticker)}&period=quarter&limit=20&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        const items = data?.value || (Array.isArray(data) ? data : [])
        if (items.length > 0) {
            incomeStatementsQuarterly = items
            console.log(`   ✅ Income Q: ${items.length} quarters`)
        }
    } catch (e) { }

    try {
        const url = `${baseUrl}/balance-sheet-statement?symbol=${encodeURIComponent(ticker)}&period=quarter&limit=20&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        const items = data?.value || (Array.isArray(data) ? data : [])
        if (items.length > 0) {
            balanceSheetsQuarterly = items
            console.log(`   ✅ Balance Q: ${items.length} quarters`)
        }
    } catch (e) { }

    try {
        const url = `${baseUrl}/cash-flow-statement?symbol=${encodeURIComponent(ticker)}&period=quarter&limit=20&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        const items = data?.value || (Array.isArray(data) ? data : [])
        if (items.length > 0) {
            cashFlowStatementsQuarterly = items
            console.log(`   ✅ CashFlow Q: ${items.length} quarters`)
        }
    } catch (e) { }

    // Fetch KEY METRICS TTM (single object for display)
    let keyMetricsTTM: any = null
    try {
        const url = `${baseUrl}/key-metrics-ttm?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        const item = data?.value?.[0] || (Array.isArray(data) ? data[0] : data)
        if (item && item.symbol) {
            // Map to expected field names
            keyMetricsTTM = {
                peRatioTTM: item.peRatioTTM || null,
                priceToSalesRatioTTM: item.priceToSalesRatioTTM || null,
                ptbRatioTTM: item.priceToBookRatioTTM || null,
                roeTTM: item.returnOnEquityTTM || null,
                roaTTM: item.returnOnAssetsTTM || null,
                debtToEquityTTM: item.debtToEquityRatioTTM || null,
                currentRatioTTM: item.currentRatioTTM || null,
                evToEbitdaTTM: item.evToEBITDATTM || null,
                // Also keep raw data
                ...item
            }
            console.log(`   ✅ KeyMetrics TTM`)
        }
    } catch (e) { }

    // Fetch RATIOS TTM
    let ratiosTTM: any = null
    try {
        const url = `${baseUrl}/ratios-ttm?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        const item = data?.value?.[0] || (Array.isArray(data) ? data[0] : data)
        if (item && item.symbol) {
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
                // Also keep raw data
                ...item
            }
            console.log(`   ✅ Ratios TTM`)
        }
    } catch (e) { }

    // Fetch historical KEY METRICS (array for charts)
    let keyMetrics: any[] = []
    try {
        const url = `${baseUrl}/key-metrics?symbol=${encodeURIComponent(ticker)}&period=annual&limit=5&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        const items = data?.value || (Array.isArray(data) ? data : [])
        if (items.length > 0) {
            keyMetrics = items
        }
    } catch (e) { }

    // Fetch historical RATIOS (array for charts)
    let ratios: any[] = []
    try {
        const url = `${baseUrl}/ratios?symbol=${encodeURIComponent(ticker)}&period=annual&limit=5&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        const items = data?.value || (Array.isArray(data) ? data : [])
        if (items.length > 0) {
            ratios = items
        }
    } catch (e) { }

    const latestIncome = incomeStatements[0]
    const latestBalance = balanceSheets[0]
    const latestCashFlow = cashFlowStatements[0]

    // Convert arrays to USD
    const convertedIncomeStatements = incomeStatements.map((stmt: any) => ({
        ...stmt,
        revenue: convertToUSD(stmt.revenue),
        netIncome: convertToUSD(stmt.netIncome),
        grossProfit: convertToUSD(stmt.grossProfit),
        operatingIncome: convertToUSD(stmt.operatingIncome),
        costOfRevenue: convertToUSD(stmt.costOfRevenue),
        ebitda: convertToUSD(stmt.ebitda),
    }))

    const convertedBalanceSheets = balanceSheets.map((stmt: any) => ({
        ...stmt,
        totalAssets: convertToUSD(stmt.totalAssets),
        totalLiabilities: convertToUSD(stmt.totalLiabilities),
        totalStockholdersEquity: convertToUSD(stmt.totalStockholdersEquity),
        cashAndCashEquivalents: convertToUSD(stmt.cashAndCashEquivalents),
    }))

    const convertedCashFlowStatements = cashFlowStatements.map((stmt: any) => ({
        ...stmt,
        operatingCashFlow: convertToUSD(stmt.operatingCashFlow),
        capitalExpenditure: convertToUSD(stmt.capitalExpenditure),
        freeCashFlow: convertToUSD(stmt.freeCashFlow),
    }))

    // Convert QUARTERLY data to USD
    const convertedIncomeStatementsQuarterly = incomeStatementsQuarterly.map((stmt: any) => ({
        ...stmt,
        revenue: convertToUSD(stmt.revenue),
        netIncome: convertToUSD(stmt.netIncome),
        grossProfit: convertToUSD(stmt.grossProfit),
        operatingIncome: convertToUSD(stmt.operatingIncome),
        costOfRevenue: convertToUSD(stmt.costOfRevenue),
        ebitda: convertToUSD(stmt.ebitda),
    }))

    const convertedBalanceSheetsQuarterly = balanceSheetsQuarterly.map((stmt: any) => ({
        ...stmt,
        totalAssets: convertToUSD(stmt.totalAssets),
        totalLiabilities: convertToUSD(stmt.totalLiabilities),
        totalStockholdersEquity: convertToUSD(stmt.totalStockholdersEquity),
        cashAndCashEquivalents: convertToUSD(stmt.cashAndCashEquivalents),
    }))

    const convertedCashFlowStatementsQuarterly = cashFlowStatementsQuarterly.map((stmt: any) => ({
        ...stmt,
        operatingCashFlow: convertToUSD(stmt.operatingCashFlow),
        capitalExpenditure: convertToUSD(stmt.capitalExpenditure),
        freeCashFlow: convertToUSD(stmt.freeCashFlow),
    }))

    const companyData = {
        ticker,
        name: profile.companyName || displayName,
        sector: profile.sector || null,
        industry: profile.industry || industry,
        description: profile.description || null,
        website: profile.website || null,
        logo_url: profile.image || null,
        country: 'JP',
        exchange: 'TSE',
        market_cap: convertToUSD(profile.marketCap || 0),
        employees: parseInt(profile.fullTimeEmployees) || 0,
        data: {
            profile: {
                companyName: profile.companyName,
                isin: profile.isin,
                ipoDate: profile.ipoDate,
                beta: profile.beta,
                ceo: profile.ceo,
            },
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
            historicalFinancials: {
                incomeStatements: convertedIncomeStatements,
                balanceSheets: convertedBalanceSheets,
                cashFlowStatements: convertedCashFlowStatements,
                // Quarterly data
                incomeStatementsQuarterly: convertedIncomeStatementsQuarterly,
                balanceSheetsQuarterly: convertedBalanceSheetsQuarterly,
                cashFlowStatementsQuarterly: convertedCashFlowStatementsQuarterly,
            },
            // Key metrics and ratios - TTM for display, historical for charts
            keyMetrics: keyMetricsTTM || (keyMetrics.length > 0 ? {
                peRatioTTM: keyMetrics[0].priceToEarningsRatio || null,
                roeTTM: keyMetrics[0].returnOnEquity || null,
                roaTTM: keyMetrics[0].returnOnAssets || null,
                ptbRatioTTM: keyMetrics[0].priceToBookRatio || null,
                debtToEquityTTM: keyMetrics[0].debtToEquity || null,
            } : null),
            ratios: ratiosTTM || (ratios.length > 0 ? {
                peRatioTTM: ratios[0].priceToEarningsRatio || null,
                priceToSalesRatioTTM: ratios[0].priceToSalesRatio || null,
                grossProfitMarginTTM: ratios[0].grossProfitMargin || null,
                netProfitMarginTTM: ratios[0].netProfitMargin || null,
            } : null),
            // Historical data for charts
            historicalKeyMetrics: keyMetrics,
            historicalRatios: ratios,
            originalCurrency: 'JPY',
            exchangeRateUsed: JPY_TO_USD,
            last_updated: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
    }

    const { error } = await supabase
        .from('companies')
        .upsert(companyData, { onConflict: 'ticker' })

    if (error) {
        console.log(`   ❌ Save error: ${error.message}`)
        return false
    }

    console.log(`   💾 Saved! Market Cap: $${(companyData.market_cap / 1e9).toFixed(2)}B`)
    return true
}

async function main() {
    console.log('🇯🇵 Importing Japan TSE Companies (Stable API)\n')
    console.log(`Total: ${JAPAN_COMPANIES.length} companies`)
    console.log('='.repeat(50))

    let success = 0
    let failed = 0

    for (const company of JAPAN_COMPANIES) {
        const result = await fetchAndImport(company.ticker, company.name, company.industry)
        if (result) success++
        else failed++

        // Delay between companies to avoid rate limits
        await new Promise(r => setTimeout(r, 500))
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✨ Complete: ${success} imported, ${failed} failed`)
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Fatal:', err)
        process.exit(1)
    })
