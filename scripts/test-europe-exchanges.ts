// Test FMP API for European exchanges
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
        const res = await fetch(url)
        const text = await res.text()

        if (text.startsWith('[')) {
            const data = JSON.parse(text)
            if (data.length > 0) {
                console.log(`✅ Profile found:`)
                console.log(`   Company: ${data[0].companyName}`)
                console.log(`   Exchange: ${data[0].exchangeShortName}`)
                console.log(`   Country: ${data[0].country}`)
                console.log(`   Currency: ${data[0].currency}`)
                console.log(`   Market Cap: ${data[0].mktCap ? `$${(data[0].mktCap / 1e9).toFixed(2)}B` : 'N/A'}`)
                return true
            } else {
                console.log(`❌ Profile: empty array`)
            }
        } else if (text.includes('Limit Reach')) {
            console.log(`❌ PREMIUM REQUIRED`)
        } else {
            console.log(`❌ Error: ${text.substring(0, 80)}`)
        }
    } catch (e: any) {
        console.log(`❌ Fetch error: ${e.message}`)
    }

    return false
}

async function main() {
    console.log('🔍 Testing FMP API for European exchanges\n')

    const tickers = [
        // UK - London Stock Exchange (LSE) - format: XXX.L
        { ticker: 'SHEL.L', desc: 'Shell (London)' },
        { ticker: 'AZN.L', desc: 'AstraZeneca (London)' },
        { ticker: 'HSBA.L', desc: 'HSBC (London)' },

        // Germany - XETRA - format: XXX.DE
        { ticker: 'SAP.DE', desc: 'SAP (XETRA)' },
        { ticker: 'SIE.DE', desc: 'Siemens (XETRA)' },
        { ticker: 'BMW.DE', desc: 'BMW (XETRA)' },
        { ticker: 'VOW3.DE', desc: 'Volkswagen (XETRA)' },

        // France - Euronext Paris - format: XXX.PA
        { ticker: 'MC.PA', desc: 'LVMH (Paris)' },
        { ticker: 'OR.PA', desc: "L'Oreal (Paris)" },
        { ticker: 'SAN.PA', desc: 'Sanofi (Paris)' },

        // Switzerland - SIX - format: XXX.SW
        { ticker: 'NESN.SW', desc: 'Nestle (Swiss)' },
        { ticker: 'NOVN.SW', desc: 'Novartis (Swiss)' },
        { ticker: 'ROG.SW', desc: 'Roche (Swiss)' },

        // Netherlands - Euronext Amsterdam - format: XXX.AS
        { ticker: 'ASML.AS', desc: 'ASML (Amsterdam)' },

        // Spain - BME - format: XXX.MC
        { ticker: 'SAN.MC', desc: 'Santander (Madrid)' },

        // Italy - Borsa Italiana - format: XXX.MI
        { ticker: 'ENEL.MI', desc: 'Enel (Milan)' },
    ]

    let success = 0
    let failed = 0

    for (const { ticker, desc } of tickers) {
        const result = await testTicker(ticker, desc)
        if (result) success++
        else failed++
        await new Promise(r => setTimeout(r, 500))
    }

    console.log(`\n${'='.repeat(50)}`)
    console.log(`Summary: ${success} worked, ${failed} failed`)
    console.log('='.repeat(50))
}

main().then(() => process.exit(0))
