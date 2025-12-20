
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url)
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`)
            }
            return await res.json()
        } catch (e: any) {
            if (i === retries - 1) throw e
            await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)))
        }
    }
}

async function main() {
    const ticker = 'BMW.DE'
    const qs = encodeURIComponent(ticker)
    const baseUrl = 'https://financialmodelingprep.com/stable'

    console.log(`\n--- Fetching Data for ${ticker} ---\n`)

    const [quote, profile, metrics] = await Promise.all([
        fetchWithRetry(`${baseUrl}/quote?symbol=${qs}&apikey=${FMP_API_KEY}`).catch(() => null),
        fetchWithRetry(`${baseUrl}/profile?symbol=${qs}&apikey=${FMP_API_KEY}`).catch(() => null),
        fetchWithRetry(`${baseUrl}/key-metrics-ttm?symbol=${qs}&limit=1&apikey=${FMP_API_KEY}`).catch(() => null),
    ])

    console.log('QUOTE DATA:')
    console.log(JSON.stringify(quote, null, 2))

    console.log('\nPROFILE DATA:')
    console.log(JSON.stringify(profile, null, 2))

    console.log('\nKEY METRICS TTM:')
    console.log(JSON.stringify(metrics, null, 2))

    if (profile && profile[0]) {
        console.log(`\nProfile Currency: ${profile[0].currency}`)
        console.log(`Profile mktCap: ${profile[0].mktCap}`)
    }

    if (quote && quote[0]) {
        console.log(`Quote marketCap: ${quote[0].marketCap}`)
    }
}

main().catch(console.error)
