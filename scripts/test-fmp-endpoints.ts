// Test different FMP API endpoints to find which ones work
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function testEndpoints() {
  console.log('🔍 Testing FMP API Endpoints...\n')
  
  const FMP_API_KEY = process.env.FMP_API_KEY
  const ticker = 'AAPL'
  
  const endpoints = [
    { name: 'Quote (v3)', url: `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${FMP_API_KEY}` },
    { name: 'Quote (v4)', url: `https://financialmodelingprep.com/api/v4/quote/${ticker}?apikey=${FMP_API_KEY}` },
    { name: 'Profile (v3)', url: `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${FMP_API_KEY}` },
    { name: 'Profile (v4)', url: `https://financialmodelingprep.com/api/v4/profile/${ticker}?apikey=${FMP_API_KEY}` },
    { name: 'Stock Price', url: `https://financialmodelingprep.com/api/v3/stock/real-time-price/${ticker}?apikey=${FMP_API_KEY}` },
    { name: 'Company Quote', url: `https://financialmodelingprep.com/api/v3/company/quote/${ticker}?apikey=${FMP_API_KEY}` },
    { name: 'Full Quote', url: `https://financialmodelingprep.com/api/v3/quote-short/${ticker}?apikey=${FMP_API_KEY}` },
    { name: 'Market Data', url: `https://fmpcloud.io/api/v3/quote/${ticker}?apikey=${FMP_API_KEY}` },
  ]
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📊 Testing: ${endpoint.name}`)
      console.log(`   URL: ${endpoint.url.replace(FMP_API_KEY, 'API_KEY')}`)
      
      const response = await fetch(endpoint.url)
      console.log(`   Status: ${response.status} ${response.statusText}`)
      
      const data = await response.json()
      
      if (response.ok) {
        console.log(`   ✅ SUCCESS!`)
        console.log(`   Data:`, JSON.stringify(data, null, 2).substring(0, 200) + '...')
      } else {
        console.log(`   ❌ Error:`, data)
      }
      
    } catch (error: any) {
      console.log(`   ❌ Exception: ${error.message}`)
    }
  }
  
  console.log('\n\n✨ Endpoint testing completed!')
}

testEndpoints()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })


