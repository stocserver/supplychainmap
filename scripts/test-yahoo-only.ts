// Test Yahoo Finance API only (no Supabase needed)
import 'dotenv/config'
import { getQuote, getCompanyProfile } from '../lib/yahoo-finance/direct-client'

async function testYahooFinance() {
  console.log('🚀 Testing Yahoo Finance Direct API...\n')

  const testTickers = ['AAPL', 'MSFT', 'GOOGL']

  for (const ticker of testTickers) {
    try {
      console.log(`📊 Fetching ${ticker}...`)
      
      // Test quote
      const quote = await getQuote(ticker)
      if (quote) {
        console.log(`✅ Quote Success:`)
        console.log(`   Name: ${quote.name}`)
        console.log(`   Price: $${quote.price.toFixed(2)}`)
        console.log(`   Change: ${quote.change >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%`)
        console.log(`   Market Cap: $${(quote.marketCap / 1e9).toFixed(2)}B`)
        console.log(`   Volume: ${quote.volume.toLocaleString()}`)
        console.log(`   Exchange: ${quote.exchange}`)
      } else {
        console.log(`❌ Failed to fetch quote`)
      }
      
      // Test profile
      const profile = await getCompanyProfile(ticker)
      if (profile) {
        console.log(`✅ Profile Success:`)
        console.log(`   Sector: ${profile.sector}`)
        console.log(`   Industry: ${profile.industry}`)
        console.log(`   Employees: ${profile.employees.toLocaleString()}`)
        console.log(`   Country: ${profile.country}`)
        console.log(`   Website: ${profile.website}`)
        console.log(`   Description: ${profile.description.substring(0, 100)}...`)
      } else {
        console.log(`❌ Failed to fetch profile`)
      }
      
      console.log('') // Empty line
      
      // Small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`)
      console.log('')
    }
  }

  console.log('✨ Yahoo Finance API test completed!')
}

testYahooFinance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

