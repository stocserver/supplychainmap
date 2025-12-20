// Quick test to fetch data for a Japanese company from FMP
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY

if (!FMP_API_KEY) {
    console.error('❌ Missing FMP_API_KEY')
    process.exit(1)
}

async function testJapaneseTicker() {
    // Try multiple ticker formats for Mitsubishi Heavy Industries
    const tickersToTest = [
        '7011.T',      // Tokyo Stock Exchange format
        '7011.JP',     // Alternative Japan format
        '7011',        // Raw numerical code
        'MHVYF',       // US ADR (OTC)
    ]

    for (const ticker of tickersToTest) {
        console.log(`\n${'='.repeat(50)}`)
        console.log(`Testing: ${ticker}`)
        console.log('='.repeat(50))

        // Test quote
        try {
            const quoteUrl = `https://financialmodelingprep.com/stable/quote?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}`
            console.log(`Fetching: ${quoteUrl.replace(FMP_API_KEY, '***')}`)

            const quoteRes = await fetch(quoteUrl)
            const quoteData = await quoteRes.json()

            if (!quoteRes.ok) {
                console.log(`❌ HTTP Error: ${quoteRes.status}`)
                if (quoteData?.Error) console.log(`   Error: ${quoteData.Error}`)
                continue
            }

            if (!quoteData || quoteData.length === 0) {
                console.log(`❌ No quote data returned`)
                continue
            }

            console.log(`✅ Quote data found:`)
            console.log(`   Name: ${quoteData[0].name}`)
            console.log(`   Price: ${quoteData[0].price}`)
            console.log(`   Market Cap: ${quoteData[0].marketCap ? `$${(quoteData[0].marketCap / 1e9).toFixed(2)}B` : 'N/A'}`)
            console.log(`   Exchange: ${quoteData[0].exchange}`)

        } catch (error: any) {
            console.log(`❌ Fetch error: ${error.message}`)
        }

        // Test profile
        try {
            const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${encodeURIComponent(ticker)}&apikey=${FMP_API_KEY}`
            const profileRes = await fetch(profileUrl)
            const profileData = await profileRes.json()

            if (profileRes.ok && profileData && profileData.length > 0) {
                console.log(`✅ Profile data found:`)
                console.log(`   Company: ${profileData[0].companyName}`)
                console.log(`   Country: ${profileData[0].country}`)
                console.log(`   Exchange: ${profileData[0].exchangeShortName}`)
            }
        } catch (error: any) {
            // Silently skip profile errors
        }
    }

    // Also try searching for Japanese aerospace companies
    console.log(`\n${'='.repeat(50)}`)
    console.log(`Searching for "Mitsubishi Heavy" on FMP...`)
    console.log('='.repeat(50))

    try {
        const searchUrl = `https://financialmodelingprep.com/api/v3/search?query=mitsubishi%20heavy&apikey=${FMP_API_KEY}`
        const searchRes = await fetch(searchUrl)
        const searchData = await searchRes.json()

        if (searchRes.ok && searchData && searchData.length > 0) {
            console.log(`✅ Found ${searchData.length} results:`)
            searchData.slice(0, 5).forEach((item: any) => {
                console.log(`   ${item.symbol} - ${item.name} (${item.exchangeShortName || item.exchange})`)
            })
        } else {
            console.log(`❌ No search results`)
        }
    } catch (error: any) {
        console.log(`❌ Search error: ${error.message}`)
    }
}

testJapaneseTicker().then(() => process.exit(0)).catch(err => {
    console.error('Fatal:', err)
    process.exit(1)
})
