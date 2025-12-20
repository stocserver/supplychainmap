// Import European companies from major exchanges
// Includes UK (LSE), Germany (XETRA), France (Euronext), etc.
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
const EUR_TO_USD = 1.05  // ~1.05 USD = 1 EUR
const GBP_TO_USD = 1.27  // ~1.27 USD = 1 GBP
const CHF_TO_USD = 1.13  // ~1.13 USD = 1 CHF

// Helper to convert to USD
const convertToUSD = (value: number | null | undefined, rate: number): number => {
    if (value === null || value === undefined) return 0
    return Math.round(value * rate)
}

// Major European companies - mix of local exchange and US ADRs
const EUROPE_COMPANIES = [
    // UK - London Stock Exchange (GBP) - most use ADRs
    { ticker: 'SHEL', name: 'Shell plc', currency: 'USD', country: 'GB' },
    { ticker: 'BP', name: 'BP plc', currency: 'USD', country: 'GB' },
    { ticker: 'HSBC', name: 'HSBC Holdings', currency: 'USD', country: 'GB' },
    { ticker: 'AZN', name: 'AstraZeneca', currency: 'USD', country: 'GB' },
    { ticker: 'GSK', name: 'GSK plc', currency: 'USD', country: 'GB' },
    { ticker: 'RIO', name: 'Rio Tinto', currency: 'USD', country: 'GB' },
    { ticker: 'BTI', name: 'British American Tobacco', currency: 'USD', country: 'GB' },
    { ticker: 'UL', name: 'Unilever', currency: 'USD', country: 'GB' },
    { ticker: 'DEO', name: 'Diageo', currency: 'USD', country: 'GB' },
    { ticker: 'LYG', name: 'Lloyds Banking', currency: 'USD', country: 'GB' },

    // Germany (mostly ADRs)
    { ticker: 'SAP', name: 'SAP SE', currency: 'USD', country: 'DE' },
    { ticker: 'SIEGY', name: 'Siemens AG', currency: 'USD', country: 'DE' },
    { ticker: 'VWAGY', name: 'Volkswagen AG', currency: 'USD', country: 'DE' },
    { ticker: 'BMWYY', name: 'BMW', currency: 'USD', country: 'DE' },
    { ticker: 'MBG.DE', name: 'Mercedes-Benz', currency: 'EUR', country: 'DE' },
    { ticker: 'ADDYY', name: 'Adidas AG', currency: 'USD', country: 'DE' },
    { ticker: 'BASFY', name: 'BASF SE', currency: 'USD', country: 'DE' },
    { ticker: 'DB', name: 'Deutsche Bank', currency: 'USD', country: 'DE' },

    // France (mostly ADRs)
    { ticker: 'LVMUY', name: 'LVMH', currency: 'USD', country: 'FR' },
    { ticker: 'OR.PA', name: "L'Oreal", currency: 'EUR', country: 'FR' },
    { ticker: 'TTE', name: 'TotalEnergies', currency: 'USD', country: 'FR' },
    { ticker: 'SNY', name: 'Sanofi', currency: 'USD', country: 'FR' },
    { ticker: 'BNPQY', name: 'BNP Paribas', currency: 'USD', country: 'FR' },
    { ticker: 'AIQUY', name: 'Air Liquide', currency: 'USD', country: 'FR' },

    // Switzerland
    { ticker: 'NSRGY', name: 'Nestle', currency: 'USD', country: 'CH' },
    { ticker: 'NVS', name: 'Novartis', currency: 'USD', country: 'CH' },
    { ticker: 'RHHBY', name: 'Roche', currency: 'USD', country: 'CH' },
    { ticker: 'UBS', name: 'UBS Group', currency: 'USD', country: 'CH' },

    // Netherlands
    { ticker: 'ASML', name: 'ASML Holding', currency: 'USD', country: 'NL' },
    { ticker: 'ING', name: 'ING Group', currency: 'USD', country: 'NL' },

    // Spain
    { ticker: 'SAN', name: 'Banco Santander', currency: 'USD', country: 'ES' },
    { ticker: 'TEF', name: 'Telefonica', currency: 'USD', country: 'ES' },

    // Others
    { ticker: 'NVO', name: 'Novo Nordisk', currency: 'USD', country: 'DK' },
    { ticker: 'SPOT', name: 'Spotify', currency: 'USD', country: 'SE' },
]

// Get exchange rate based on currency
const getExchangeRate = (currency: string): number => {
    switch (currency) {
        case 'GBP': return GBP_TO_USD
        case 'EUR': return EUR_TO_USD
        case 'CHF': return CHF_TO_USD
        case 'USD': return 1
        default: return 1
    }
}

async function fetchAndImport(ticker: string, displayName: string, currency: string, country: string) {
    console.log(`\n🚀 Fetching ${ticker} (${displayName}) [${country}/${currency}]...\n`)

    const exchangeRate = getExchangeRate(currency)

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
                console.log(`   Market Cap: $${(profile.mktCap / 1e9).toFixed(2)}B`)
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
        country: country,
        exchange: profile?.exchangeShortName || 'NYSE',
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
    console.log('🇪🇺 Importing European Companies\n')
    console.log('='.repeat(50))

    let success = 0
    let failed = 0

    for (const company of EUROPE_COMPANIES) {
        const result = await fetchAndImport(company.ticker, company.name, company.currency, company.country)
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
