// Test FMP API for Chinese exchanges: Hong Kong (HKEX) and Shanghai (SSE)
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY

async function testTicker(ticker: string, description: string) {
    console.log(`\n${'='.repeat(50)}`)
    console.log(`Testing: ${ticker} - ${description}`)
    console.log('='.repeat(50))

    // Test profile
    try {
        const url = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(ticker)}?apikey=${FMP_API_KEY}`
        console.log(`Profile URL: ${url.replace(FMP_API_KEY!, '***')}`)
        const res = await fetch(url)
        const text = await res.text()

        if (text.startsWith('[')) {
            const data = JSON.parse(text)
            if (data.length > 0) {
                console.log(`✅ Profile found:`)
                console.log(`   Company: ${data[0].companyName}`)
                console.log(`   Exchange: ${data[0].exchangeShortName}`)
                console.log(`   Country: ${data[0].country}`)
                console.log(`   Market Cap: ${data[0].mktCap}`)
                console.log(`   Currency: ${data[0].currency}`)
            } else {
                console.log(`❌ Profile: empty array`)
            }
        } else {
            console.log(`❌ Profile response: ${text.substring(0, 100)}`)
        }
    } catch (e: any) {
        console.log(`❌ Profile error: ${e.message}`)
    }

    // Test income statement
    try {
        const url = `https://financialmodelingprep.com/api/v3/income-statement/${encodeURIComponent(ticker)}?limit=1&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()

        if (Array.isArray(data) && data.length > 0) {
            console.log(`✅ Income Statement found:`)
            console.log(`   Date: ${data[0].date}`)
            console.log(`   Revenue: ${data[0].revenue}`)
            console.log(`   Currency: ${data[0].reportedCurrency || 'N/A'}`)
        } else {
            console.log(`❌ Income Statement: no data`)
        }
    } catch (e: any) {
        console.log(`❌ Income Statement error: ${e.message}`)
    }
}

async function main() {
    console.log('🔍 Testing FMP API for Chinese exchanges\n')

    // Hong Kong Exchange (HKEX) - format: XXXX.HK
    await testTicker('0700.HK', 'Tencent (HKEX)')
    await testTicker('9988.HK', 'Alibaba (HKEX)')
    await testTicker('1810.HK', 'Xiaomi (HKEX)')

    // Shanghai Stock Exchange (SSE) - format: XXXXXX.SS
    await testTicker('600519.SS', 'Kweichow Moutai (SSE)')
    await testTicker('601318.SS', 'Ping An Insurance (SSE)')
    await testTicker('600036.SS', 'China Merchants Bank (SSE)')

    // Shenzhen Stock Exchange (SZSE) - format: XXXXXX.SZ
    await testTicker('000858.SZ', 'Wuliangye (SZSE)')
    await testTicker('002594.SZ', 'BYD (SZSE)')

    // Also try FMP search for Chinese companies
    console.log(`\n${'='.repeat(50)}`)
    console.log('Searching for "tencent" on FMP...')
    console.log('='.repeat(50))
    try {
        const url = `https://financialmodelingprep.com/api/v3/search?query=tencent&limit=5&apikey=${FMP_API_KEY}`
        const res = await fetch(url)
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
            console.log(`✅ Found ${data.length} results:`)
            for (const item of data) {
                console.log(`   ${item.symbol} - ${item.name} (${item.exchangeShortName})`)
            }
        }
    } catch (e: any) {
        console.log(`❌ Search error: ${e.message}`)
    }
}

main().then(() => process.exit(0))
