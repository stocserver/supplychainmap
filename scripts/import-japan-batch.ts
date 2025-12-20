// Import Japan TSE companies in smaller batches with longer delays
// FMP free tier has rate limits - running in batches of 10 with longer waits
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

const JPY_TO_USD = 1 / 150

const convertToUSD = (jpyValue: number | null | undefined): number => {
    if (jpyValue === null || jpyValue === undefined) return 0
    return Math.round(jpyValue * JPY_TO_USD)
}

// Split into batches - run with argument: npx tsx script.ts [batch_number]
// Batch 1: Semiconductors, Batch 2: Automotive, etc.
const BATCHES: Record<string, { ticker: string; name: string; industry: string }[]> = {
    '1': [ // Semiconductors
        { ticker: '4063.T', name: 'Shin-Etsu Chemical', industry: 'semiconductors' },
        { ticker: '3436.T', name: 'SUMCO', industry: 'semiconductors' },
        { ticker: '8035.T', name: 'Tokyo Electron', industry: 'semiconductors' },
        { ticker: '6857.T', name: 'Advantest', industry: 'semiconductors' },
        { ticker: '7735.T', name: 'Screen Holdings', industry: 'semiconductors' },
        { ticker: '6146.T', name: 'Disco Corporation', industry: 'semiconductors' },
        { ticker: '6723.T', name: 'Renesas Electronics', industry: 'semiconductors' },
        { ticker: '6963.T', name: 'ROHM', industry: 'semiconductors' },
    ],
    '2': [ // Automotive
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
    ],
    '3': [ // Robotics + Gaming
        { ticker: '6954.T', name: 'Fanuc', industry: 'robotics-automation' },
        { ticker: '6506.T', name: 'Yaskawa Electric', industry: 'robotics-automation' },
        { ticker: '6861.T', name: 'Keyence', industry: 'robotics-automation' },
        { ticker: '6645.T', name: 'Omron', industry: 'robotics-automation' },
        { ticker: '6273.T', name: 'SMC Corporation', industry: 'robotics-automation' },
        { ticker: '6594.T', name: 'Nidec', industry: 'robotics-automation' },
        { ticker: '7974.T', name: 'Nintendo', industry: 'media-entertainment' },
        { ticker: '6758.T', name: 'Sony Group', industry: 'media-entertainment' },
        { ticker: '9697.T', name: 'Capcom', industry: 'media-entertainment' },
        { ticker: '9684.T', name: 'Square Enix', industry: 'media-entertainment' },
    ],
    '4': [ // Banking + Telecom + Pharma
        { ticker: '8306.T', name: 'MUFG', industry: 'banking' },
        { ticker: '8316.T', name: 'Sumitomo Mitsui FG', industry: 'banking' },
        { ticker: '8411.T', name: 'Mizuho Financial', industry: 'banking' },
        { ticker: '9432.T', name: 'NTT', industry: 'telecommunications' },
        { ticker: '9433.T', name: 'KDDI', industry: 'telecommunications' },
        { ticker: '4502.T', name: 'Takeda Pharmaceutical', industry: 'pharmaceuticals' },
        { ticker: '4503.T', name: 'Astellas Pharma', industry: 'pharmaceuticals' },
        { ticker: '4568.T', name: 'Daiichi Sankyo', industry: 'pharmaceuticals' },
    ],
    '5': [ // Chemicals + Food + Construction
        { ticker: '4188.T', name: 'Mitsubishi Chemical', industry: 'chemicals' },
        { ticker: '3402.T', name: 'Toray Industries', industry: 'chemicals' },
        { ticker: '3407.T', name: 'Asahi Kasei', industry: 'chemicals' },
        { ticker: '2802.T', name: 'Ajinomoto', industry: 'food-beverage' },
        { ticker: '2503.T', name: 'Kirin Holdings', industry: 'food-beverage' },
        { ticker: '2502.T', name: 'Asahi Group', industry: 'food-beverage' },
        { ticker: '1925.T', name: 'Daiwa House', industry: 'construction-engineering' },
        { ticker: '1928.T', name: 'Sekisui House', industry: 'construction-engineering' },
    ],
}

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url)
            const text = await res.text()

            if (text.includes('Limit Reach')) {
                console.log(`      ⏳ Rate limited, waiting 30s... (attempt ${i + 1}/${retries})`)
                await new Promise(r => setTimeout(r, 30000))
                continue
            }

            if (text.startsWith('[') || text.startsWith('{')) {
                return JSON.parse(text)
            }

            return null
        } catch (e: any) {
            console.log(`      ⚠️ Fetch error, retrying... (${e.message})`)
            await new Promise(r => setTimeout(r, 5000))
        }
    }
    return null
}

async function fetchAndImport(ticker: string, displayName: string, industry: string) {
    console.log(`\n🚀 ${ticker} (${displayName})`)

    // Fetch profile with retry
    const profileUrl = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(ticker)}?apikey=${FMP_API_KEY}`
    const profileData = await fetchWithRetry(profileUrl)
    const profile = Array.isArray(profileData) && profileData.length > 0 ? profileData[0] : null

    if (profile) {
        console.log(`   ✅ Profile: ${profile.companyName}`)
    } else {
        console.log(`   ❌ No profile data`)
        return false
    }

    await new Promise(r => setTimeout(r, 1500)) // Wait between API calls

    // Fetch income statements
    const incomeUrl = `https://financialmodelingprep.com/api/v3/income-statement/${encodeURIComponent(ticker)}?period=annual&limit=5&apikey=${FMP_API_KEY}`
    const incomeStatements = await fetchWithRetry(incomeUrl) || []
    console.log(`   Income: ${incomeStatements.length} years`)

    await new Promise(r => setTimeout(r, 2000))

    // Fetch balance sheets
    const balanceUrl = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${encodeURIComponent(ticker)}?period=annual&limit=5&apikey=${FMP_API_KEY}`
    const balanceSheets = await fetchWithRetry(balanceUrl) || []
    console.log(`   Balance: ${balanceSheets.length} years`)

    await new Promise(r => setTimeout(r, 2000))

    // Fetch cash flow
    const cashFlowUrl = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${encodeURIComponent(ticker)}?period=annual&limit=5&apikey=${FMP_API_KEY}`
    const cashFlowStatements = await fetchWithRetry(cashFlowUrl) || []
    console.log(`   CashFlow: ${cashFlowStatements.length} years`)

    const latestIncome = incomeStatements[0]
    const latestBalance = balanceSheets[0]
    const latestCashFlow = cashFlowStatements[0]

    // Convert to USD
    const convertedIncomeStatements = incomeStatements.map((stmt: any) => ({
        ...stmt,
        revenue: convertToUSD(stmt.revenue),
        netIncome: convertToUSD(stmt.netIncome),
        grossProfit: convertToUSD(stmt.grossProfit),
        operatingIncome: convertToUSD(stmt.operatingIncome),
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
        name: profile.companyName || displayName,
        sector: profile.sector || null,
        industry: profile.industry || industry,
        description: profile.description || null,
        website: profile.website || null,
        logo_url: profile.image || null,
        country: 'JP',
        exchange: 'TSE',
        market_cap: convertToUSD(profile.mktCap || 0),
        employees: profile.fullTimeEmployees || 0,
        data: {
            profile: {
                companyName: profile.companyName,
                isin: profile.isin,
                ipoDate: profile.ipoDate,
                beta: profile.beta,
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

    console.log(`   💾 Saved! Market Cap: $${(companyData.market_cap / 1e9).toFixed(2)}B`)
    return true
}

async function main() {
    const batchNum = process.argv[2] || '1'
    const batch = BATCHES[batchNum]

    if (!batch) {
        console.log('Usage: npx tsx scripts/import-japan-batch.ts [1-5]')
        console.log('Batches: 1=Semiconductors, 2=Automotive, 3=Robotics+Gaming, 4=Banking+Telecom+Pharma, 5=Chemicals+Food+Construction')
        process.exit(1)
    }

    console.log(`🇯🇵 Japan Import - Batch ${batchNum}`)
    console.log(`Companies: ${batch.length}`)
    console.log('='.repeat(50))

    let success = 0
    let failed = 0

    for (const company of batch) {
        const result = await fetchAndImport(company.ticker, company.name, company.industry)
        if (result) success++
        else failed++

        // Long wait between companies to avoid rate limit
        console.log('   ⏳ Waiting 5 seconds...')
        await new Promise(r => setTimeout(r, 5000))
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✨ Batch ${batchNum} complete: ${success} imported, ${failed} failed`)
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Fatal:', err)
        process.exit(1)
    })
