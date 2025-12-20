
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const FMP_API_KEY = process.env.FMP_API_KEY

async function testScreener(exchangeCode: string) {
    console.log(`\nTesting exchange='${exchangeCode}'...`)
    const url = `https://financialmodelingprep.com/api/v3/stock-screener?exchange=${exchangeCode}&limit=1&apikey=${FMP_API_KEY}`

    try {
        const res = await fetch(url)
        console.log(`Status: ${res.status}`)
        const text = await res.text()

        if (res.ok) {
            console.log('✅ SUCCESS!')
            console.log('Response:', text.substring(0, 200))
        } else {
            console.log('❌ FAILED')
            console.log('Error:', text.substring(0, 200))
        }
    } catch (e: any) {
        console.log(`❌ EXCEPTION: ${e.message}`)
    }
}

async function main() {
    const codes = ['TSE', 'JPX', 'TYO', 'JP', 'TK', 'TOkyo']

    for (const code of codes) {
        await testScreener(code)
        // small delay
        await new Promise(r => setTimeout(r, 1000))
    }
}

main()
