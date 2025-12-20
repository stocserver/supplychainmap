// Test importing a Japanese company to Supabase using v3 API
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

async function fetchAndImport(ticker: string) {
    console.log(`\n🚀 Fetching ${ticker} from FMP (using v3 API)...\n`)

    // Use v3 API format which works with curl
    let profile = null
    try {
        const profileUrl = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(ticker)}?apikey=${FMP_API_KEY}`
        console.log(`Fetching profile from: ${profileUrl.replace(FMP_API_KEY!, '***')}`)
        const res = await fetch(profileUrl)
        const text = await res.text()
        console.log(`Response status: ${res.status}, length: ${text.length}`)

        if (text.startsWith('[')) {
            const data = JSON.parse(text)
            if (data.length > 0) {
                profile = data[0]
                console.log(`✅ Profile: ${profile.companyName}`)
                console.log(`   Country: ${profile.country}`)
                console.log(`   Market Cap: $${(profile.mktCap / 1e9).toFixed(2)}B`)
            }
        } else {
            console.log(`Response preview: ${text.substring(0, 100)}`)
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

    if (!profile) {
        console.log(`\n❌ Cannot import ${ticker} without profile data`)
        return
    }

    // Prepare the upsert
    const latestIncome = incomeStatements[0]
    const latestBalance = balanceSheets[0]

    const companyData = {
        ticker: ticker,
        name: profile.companyName || ticker,
        sector: profile.sector || null,
        industry: profile.industry || null,
        description: profile.description || null,
        website: profile.website || null,
        logo_url: profile.image || null,
        country: profile.country || 'JP',
        exchange: profile.exchangeShortName || null,
        market_cap: Math.trunc(Number(profile.mktCap || 0)),
        employees: profile.fullTimeEmployees || 0,
        data: {
            profile: {
                companyName: profile.companyName,
                cik: profile.cik,
                isin: profile.isin,
                cusip: profile.cusip,
                ipoDate: profile.ipoDate,
                beta: profile.beta,
            },
            incomeStatement: latestIncome ? {
                date: latestIncome.date,
                revenue: latestIncome.revenue,
                netIncome: latestIncome.netIncome,
                grossProfit: latestIncome.grossProfit,
                operatingIncome: latestIncome.operatingIncome,
            } : null,
            balanceSheet: latestBalance ? {
                date: latestBalance.date,
                totalAssets: latestBalance.totalAssets,
                totalLiabilities: latestBalance.totalLiabilities,
                totalEquity: latestBalance.totalStockholdersEquity,
                cashAndCashEquivalents: latestBalance.cashAndCashEquivalents,
            } : null,
            incomeStatements,
            balanceSheets,
            last_updated: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
    }

    console.log(`\n💾 Upserting to Supabase...`)

    const { error } = await supabase
        .from('companies')
        .upsert(companyData, { onConflict: 'ticker' })

    if (error) {
        console.error(`❌ Supabase error: ${error.message}`)
        return
    }

    console.log(`✅ Successfully imported ${ticker} to Supabase!`)
    console.log(`   Name: ${companyData.name}`)
    console.log(`   Country: ${companyData.country}`)
    console.log(`   Market Cap: $${(companyData.market_cap / 1e9).toFixed(2)}B`)
}

// Test with Mitsubishi Heavy ADR ticker
const ticker = process.argv[2] || 'MHVYF'
fetchAndImport(ticker)
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Fatal:', err)
        process.exit(1)
    })
