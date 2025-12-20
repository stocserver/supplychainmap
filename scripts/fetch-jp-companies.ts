
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY

if (!FMP_API_KEY) {
    console.error('❌ Missing FMP_API_KEY')
    process.exit(1)
}

// Custom industry mapping
const INDUSTRY_MAPPING: Record<string, string> = {
    'Semiconductors': 'semiconductors',
    'Auto Manufacturers': 'automotive',
    'Auto Parts': 'automotive',
    // ... (rest of mapping same as before)
}

async function probeEndpoints() {
    console.log('🔍 Probing FMP endpoints for Japanese stock list...')

    // Strategy 1: Company Screener (Best for filtering by market cap)
    // Note: Documentation says `company-screener` but sometimes `stock-screener`. 
    // And Country code might be 'JP' or 'Japan'.
    const screenerUrls = [
        `https://financialmodelingprep.com/stable/company-screener?country=JP&limit=300&apikey=${FMP_API_KEY}`,
        `https://financialmodelingprep.com/stable/stock-screener?country=JP&limit=300&apikey=${FMP_API_KEY}`
    ]

    for (const url of screenerUrls) {
        try {
            console.log(`\nTesting: ${url.replace(FMP_API_KEY, 'HIDDEN')}`)
            const res = await fetch(url)
            const data = await res.json()

            if (Array.isArray(data) && data.length > 0) {
                console.log(`   ✅ Success! Found ${data.length} companies.`)
                await saveCompanies(data)
                return
            } else {
                const msg = !Array.isArray(data) ? JSON.stringify(data).substring(0, 100) : `Empty Array (length ${data.length})`
                console.log(`   ❌ Failed. Response: ${msg}`)
            }
        } catch (e: any) {
            console.log(`   ❌ Error: ${e.message}`)
        }
    }

    // Strategy 2: Actively Traded List (Full list, filter in memory)
    // This is "stable/available-traded/list" or "stable/actively-trading-list" ?
    // Search results said "actively-trading-list".
    console.log('\nStrategy 2: Fetching full tradable list...')
    const listUrls = [
        `https://financialmodelingprep.com/stable/actively-trading-list?apikey=${FMP_API_KEY}`,
        `https://financialmodelingprep.com/stable/available-traded/list?apikey=${FMP_API_KEY}`
    ]

    for (const url of listUrls) {
        try {
            console.log(`Testing: ${url.split('?')[0]}...`)
            const res = await fetch(url)
            const allData = await res.json()

            if (Array.isArray(allData) && allData.length > 0) {
                console.log(`   ✅ Received ${allData.length} symbols. Filtering for TSE...`)

                // Filter
                const jpStocks = allData.filter((item: any) =>
                    (item.symbol && item.symbol.endsWith('.T')) ||
                    (item.exchangeShortName === 'TSE') ||
                    (item.exchange === 'Tokyo')
                ).slice(0, 300)

                if (jpStocks.length > 0) {
                    console.log(`   ✅ Success! Filtered to ${jpStocks.length} JP stocks.`)
                    await saveCompanies(jpStocks)
                    return
                } else {
                    console.log(`   ❌ No JP stocks found in list.`)
                }
            } else {
                console.log(`   ❌ Failed. Response: ${Array.isArray(allData) ? 'Empty' : JSON.stringify(allData).substring(0, 100)}`)
            }
        } catch (e: any) {
            console.log(`   ❌ Error: ${e.message}`)
        }
    }

    console.error('\n❌ All strategies failed to fetch companies.')
}

async function saveCompanies(data: any[]) {
    const seedPath = path.resolve(process.cwd(), 'lib/data/companies-seed.json')
    let seedData: any[] = []
    if (fs.existsSync(seedPath)) {
        seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))
    }

    const existingTickers = new Set(seedData.map(c => c.ticker))
    let newCount = 0

    for (const item of data) {
        // Normalized Item structure might vary between endpoints
        const ticker = item.symbol || item.ticker
        const name = item.companyName || item.name
        // Screener has 'industry', list usually doesn't.
        const industry = item.industry ?
            (INDUSTRY_MAPPING[item.industry] || 'unclassified') :
            'unclassified'

        if (ticker && !existingTickers.has(ticker)) {
            seedData.push({
                ticker,
                name,
                industry,
                country: 'JP'
            })
            newCount++
        }
    }

    console.log(`\n➕ Adding ${newCount} new companies to seed file...`)
    fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2))
    console.log('💾 Saved lib/data/companies-seed.json')
}

probeEndpoints()
