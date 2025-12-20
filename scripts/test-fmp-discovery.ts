
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const FMP_API_KEY = process.env.FMP_API_KEY

async function testEndpoint(name: string, url: string) {
    console.log(`\n--- Testing ${name} ---`)
    console.log(`URL: ${url.replace(FMP_API_KEY!, '***')}`)
    try {
        const res = await fetch(url)
        console.log(`Status: ${res.status} ${res.statusText}`)
        if (res.ok) {
            const data = await res.json()
            const isArray = Array.isArray(data)
            console.log(`Type: ${isArray ? 'Array' : typeof data}`)
            if (isArray) {
                console.log(`Count: ${data.length}`)
                if (data.length > 0) console.log('Sample:', JSON.stringify(data[0], null, 0))
            } else {
                console.log('Data:', JSON.stringify(data).substring(0, 100))
            }
        } else {
            const text = await res.text()
            console.log(`Error Body: ${text.substring(0, 100)}`)
        }
    } catch (e: any) {
        console.log(`Exception: ${e.message}`)
    }
}

async function main() {
    // 1. Screener by Country (JP) instead of Exchange
    await testEndpoint(
        'Screener (Country=JP)',
        `https://financialmodelingprep.com/api/v3/stock-screener?country=JP&marketCapMoreThan=1000000000&limit=5&apikey=${FMP_API_KEY}`
    )

    // 2. Search Ticker (Exchange=TSE)
    await testEndpoint(
        'Search (Exchange=TSE)',
        `https://financialmodelingprep.com/api/v3/search-ticker?exchange=TSE&limit=5&apikey=${FMP_API_KEY}`
    )

    // 3. Search (Query=Toyo, Exchange=TSE)
    await testEndpoint(
        'Search (Query=Toyo, Exchange=TSE)',
        `https://financialmodelingprep.com/api/v3/search?query=toyota&exchange=TSE&limit=5&apikey=${FMP_API_KEY}`
    )

    // 4. Symbol List (might be large, just check if it works)
    // There isn't a direct "symbol/TSE" endpoint documented usually, but let's try a filtered list if possible
    // or just the generic filtered list
    await testEndpoint(
        'Screener (Exchange=JP - maybe code is different?)',
        `https://financialmodelingprep.com/api/v3/stock-screener?exchange=JP&limit=5&apikey=${FMP_API_KEY}`
    )
}

main()
