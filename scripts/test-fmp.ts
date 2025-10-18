// Test Financial Modeling Prep API
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function testFMP() {
  console.log('🚀 Testing Financial Modeling Prep API...\n')
  
  const FMP_API_KEY = process.env.FMP_API_KEY
  
  if (!FMP_API_KEY) {
    console.log('❌ FMP_API_KEY not found in environment variables')
    console.log('Please make sure .env.local contains:')
    console.log('FMP_API_KEY=your_api_key_here')
    return
  }
  
  console.log('✅ API Key found:', FMP_API_KEY.substring(0, 10) + '...\n')
  
  const testTickers = ['AAPL', 'MSFT', 'GOOGL']
  
  for (const ticker of testTickers) {
    try {
      console.log(`📊 Fetching ${ticker}...`)
      
      // Test Quote (new stable endpoint)
      const quoteUrl = `https://financialmodelingprep.com/stable/quote?symbol=${ticker}&apikey=${FMP_API_KEY}`
      console.log(`   URL: ${quoteUrl.replace(FMP_API_KEY, 'API_KEY')}`)
      
      const quoteResponse = await fetch(quoteUrl)
      
      if (!quoteResponse.ok) {
        console.log(`❌ Quote API error: ${quoteResponse.status} ${quoteResponse.statusText}`)
        const errorText = await quoteResponse.text()
        console.log(`   Error: ${errorText}`)
        continue
      }
      
      const quoteData = await quoteResponse.json()
      const quote = quoteData[0]
      
      if (quote) {
        console.log(`✅ Quote Success:`)
        console.log(`   Name: ${quote.name}`)
        console.log(`   Price: $${quote.price?.toFixed(2)}`)
        console.log(`   Change: ${quote.change >= 0 ? '+' : ''}${quote.changesPercentage?.toFixed(2)}%`)
        console.log(`   Market Cap: $${(quote.marketCap / 1e9)?.toFixed(2)}B`)
        console.log(`   Exchange: ${quote.exchange}`)
      }
      
      // Test Profile (new stable endpoint)
      const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${ticker}&apikey=${FMP_API_KEY}`
      const profileResponse = await fetch(profileUrl)
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        const profile = profileData[0]
        
        if (profile) {
          console.log(`✅ Profile Success:`)
          console.log(`   Company: ${profile.companyName}`)
          console.log(`   Sector: ${profile.sector}`)
          console.log(`   Industry: ${profile.industry}`)
          console.log(`   Employees: ${profile.fullTimeEmployees?.toLocaleString()}`)
          console.log(`   Website: ${profile.website}`)
        }
      }
      
      console.log('')
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`)
      console.log('')
    }
  }
  
  console.log('✨ FMP API test completed!')
}

testFMP()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

