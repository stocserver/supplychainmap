
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
                if (data.length > 0) {
                    console.log('Sample Ticker:', data[0].symbol)
                    console.log('Sample Name:', data[0].companyName)
                    console.log('Sample Exchange:', data[0].exchangeShortName)
                }
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
    // 1. Screener by Exchange = JPX (as found in research)
    await testEndpoint(
        'Screener (Exchange=JPX)',
        `https://financialmodelingprep.com/api/v3/stock-screener?exchange=JPX&marketCapMoreThan=1000000000&limit=5&apikey=${FMP_API_KEY}`
    )

    // 2. Screener by Exchange = JP (common alternative)
    await testEndpoint(
        'Screener (Exchange=JP)',
        `https://financialmodelingprep.com/api/v3/stock-screener?exchange=JP&marketCapMoreThan=1000000000&limit=5&apikey=${FMP_API_KEY}`
    )

    // 3. Screener by Country = JP (if exchange fails)
    await testEndpoint(
        'Screener (Country=JP)',
        `https://financialmodelingprep.com/api/v3/stock-screener?country=JP&marketCapMoreThan=1000000000&limit=5&apikey=${FMP_API_KEY}`
    )
}

main()
