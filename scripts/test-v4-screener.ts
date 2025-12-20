
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const FMP_API_KEY = process.env.FMP_API_KEY

async function testV4Screener(params: string) {
    const url = `https://financialmodelingprep.com/stable/company-screener?${params}&limit=5&apikey=${FMP_API_KEY}`
    console.log(`\nTesting URL: ${url.replace(FMP_API_KEY!, '***')}`)

    try {
        const res = await fetch(url)
        console.log(`Status: ${res.status}`)
        if (res.ok) {
            const data = await res.json()
            if (Array.isArray(data)) {
                console.log(`✅ Success! Found ${data.length} items`)
                if (data.length > 0) {
                    console.log('Sample:', JSON.stringify(data[0], null, 2))
                }
            } else {
                console.log('Result (not array):', JSON.stringify(data).substring(0, 200))
            }
        } else {
            console.log('❌ Error:', await res.text())
        }
    } catch (e: any) {
        console.log(`❌ Exception: ${e.message}`)
    }
}

async function main() {
    // Test 1: Country JP
    await testV4Screener('country=JP')

    // Test 2: Exchange TSE
    await testV4Screener('exchange=TSE')

    // Test 3: Exchange JPX
    await testV4Screener('exchange=JPX')
}

main()
