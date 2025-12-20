// Test FMP API for Taiwan and Korea exchanges
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY

async function testTicker(ticker: string, description: string) {
    console.log(`\n${ticker} - ${description}`)

    try {
        const url = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(ticker)}?apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const text = await res.text()

        if (text.startsWith('[')) {
            const data = JSON.parse(text)
            if (data.length > 0) {
                console.log(`  ✅ Works! ${data[0].companyName} - ${data[0].exchangeShortName}`)
                return true
            }
            console.log(`  ❌ Empty array`)
        } else if (text.includes('Limit Reach')) {
            console.log(`  ❌ PREMIUM REQUIRED`)
        } else {
            console.log(`  ❌ Error: ${text.substring(0, 60)}`)
        }
    } catch (e: any) {
        console.log(`  ❌ Fetch error: ${e.message}`)
    }
    return false
}

async function main() {
    console.log('🔍 Testing Taiwan & Korea exchanges\n')

    // Taiwan - TWSE format: XXXX.TW or XXXX.TWO
    console.log('=== TAIWAN (TWSE) ===')
    await testTicker('2330.TW', 'TSMC (Taiwan)')
    await testTicker('2317.TW', 'Hon Hai/Foxconn (Taiwan)')
    await testTicker('2454.TW', 'MediaTek (Taiwan)')

    // Korea - KRX format: XXXXXX.KS (KOSPI) or XXXXXX.KQ (KOSDAQ)
    console.log('\n=== KOREA (KRX) ===')
    await testTicker('005930.KS', 'Samsung Electronics (Korea)')
    await testTicker('000660.KS', 'SK Hynix (Korea)')
    await testTicker('035420.KS', 'Naver (Korea)')

    // Also test US-listed ADRs from these regions
    console.log('\n=== ADRs (should work) ===')
    await testTicker('TSM', 'TSMC ADR')
    await testTicker('SSNLF', 'Samsung ADR')
}

main().then(() => process.exit(0))
