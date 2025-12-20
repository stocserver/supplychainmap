// Import all Japan TSE companies across multiple industries
// Uses FMP free tier with JPY→USD conversion
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

// JPY to USD exchange rate (Dec 2024: ~150 JPY = 1 USD)
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
]

async function fetchAndImport(ticker: string, displayName: string, industry: string) {
    console.log(`\n🚀 ${ticker} (${displayName}) [${industry}]`)

    let profile = null
    let incomeStatements: any[] = []
    let balanceSheets: any[] = []
    let cashFlowStatements: any[] = []

    // Fetch profile
    try {
        const url = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(ticker)}?apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const text = await res.text()
        if (text.startsWith('[')) {
            const data = JSON.parse(text)
            if (data.length > 0) {
                profile = data[0]
                console.log(`   ✅ Profile: ${profile.companyName}`)
            }
        } else if (text.includes('Limit')) {
            console.log(`   ⚠️ Rate limited`)
            return false
        }
    } catch (e: any) {
        console.log(`   ❌ Profile error: ${e.message}`)
        return false
    }

    // Fetch financials
    try {
        const url = `https://financialmodelingprep.com/api/v3/income-statement/${encodeURIComponent(ticker)}?period=annual&limit=5&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
            incomeStatements = data
            console.log(`   ✅ Income: ${data.length} years`)
        }
    } catch (e) { }

    try {
        const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${encodeURIComponent(ticker)}?period=annual&limit=5&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
            balanceSheets = data
            console.log(`   ✅ Balance: ${data.length} years`)
        }
    } catch (e) { }

    try {
        const url = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${encodeURIComponent(ticker)}?period=annual&limit=5&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
            cashFlowStatements = data
            console.log(`   ✅ CashFlow: ${data.length} years`)
        }
    } catch (e) { }

    if (!profile && incomeStatements.length === 0) {
        console.log(`   ❌ No data available`)
        return false
    }

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

    const companyData = {
        ticker,
        name: profile?.companyName || displayName,
        sector: profile?.sector || null,
        industry: profile?.industry || industry,
        description: profile?.description || null,
        website: profile?.website || null,
        logo_url: profile?.image || null,
        country: 'JP',
        exchange: 'TSE',
        market_cap: convertToUSD(profile?.mktCap || 0),
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
            },
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

    console.log(`   💾 Saved (Mkt Cap: $${(companyData.market_cap / 1e9).toFixed(2)}B)`)
    return true
}

async function main() {
    console.log('🇯🇵 Importing Japan TSE Companies\n')
    console.log(`Total: ${JAPAN_COMPANIES.length} companies`)
    console.log('='.repeat(50))

    let success = 0
    let failed = 0

    for (const company of JAPAN_COMPANIES) {
        const result = await fetchAndImport(company.ticker, company.name, company.industry)
        if (result) success++
        else failed++

        // Rate limiting - wait between requests
        await new Promise(r => setTimeout(r, 600))
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✨ Complete: ${success} imported, ${failed} failed`)

    // Summary by industry
    console.log('\n📊 Companies by Industry:')
    const byIndustry = JAPAN_COMPANIES.reduce((acc, c) => {
        acc[c.industry] = (acc[c.industry] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    for (const [ind, count] of Object.entries(byIndustry)) {
        console.log(`   ${ind}: ${count}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Fatal:', err)
        process.exit(1)
    })
