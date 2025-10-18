// Test script to fetch Yahoo Finance data and store in Supabase
import { getQuote, getCompanyProfile } from '../lib/yahoo-finance/direct-client'
import { supabaseServer } from '../lib/supabase/server'

async function testFetchAndStore() {
  console.log('🚀 Starting Yahoo Finance data fetch test...\n')

  // Test tickers
  const testTickers = ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'TSLA']

  for (const ticker of testTickers) {
    try {
      console.log(`📊 Fetching data for ${ticker}...`)
      
      // Fetch quote data
      const quote = await getQuote(ticker)
      if (!quote) {
        console.log(`❌ Failed to fetch quote for ${ticker}\n`)
        continue
      }
      
      console.log(`✅ Quote fetched:`)
      console.log(`   Name: ${quote.name}`)
      console.log(`   Price: $${quote.price}`)
      console.log(`   Change: ${quote.change >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%`)
      console.log(`   Market Cap: $${(quote.marketCap / 1e9).toFixed(2)}B`)
      
      // Fetch profile data
      const profile = await getCompanyProfile(ticker)
      if (!profile) {
        console.log(`❌ Failed to fetch profile for ${ticker}\n`)
        continue
      }
      
      console.log(`   Sector: ${profile.sector}`)
      console.log(`   Industry: ${profile.industry}`)
      console.log(`   Employees: ${profile.employees.toLocaleString()}`)
      
      // Store in Supabase
      console.log(`💾 Storing in Supabase...`)
      
      const { data, error } = await supabaseServer
        .from('companies')
        .upsert({
          ticker: ticker,
          name: profile.name,
          sector: profile.sector,
          industry: profile.industry,
          description: profile.description,
          website: profile.website,
          country: profile.country,
          exchange: quote.exchange,
          market_cap: quote.marketCap,
          employees: profile.employees,
          data: {
            quote: quote,
            profile: profile,
            last_updated: new Date().toISOString()
          }
        }, {
          onConflict: 'ticker'
        })
      
      if (error) {
        console.log(`❌ Supabase error: ${error.message}`)
      } else {
        console.log(`✅ Successfully stored ${ticker} in Supabase`)
      }
      
      console.log('') // Empty line for readability
      
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error(`❌ Error processing ${ticker}:`, error)
      console.log('')
    }
  }

  console.log('✨ Test completed!')
  
  // Verify data was stored
  console.log('\n📋 Verifying stored data...')
  const { data: companies, error } = await supabaseServer
    .from('companies')
    .select('ticker, name, sector, market_cap')
    .in('ticker', testTickers)
  
  if (error) {
    console.log(`❌ Error fetching from Supabase: ${error.message}`)
  } else {
    console.log(`✅ Found ${companies?.length || 0} companies in database:`)
    companies?.forEach(company => {
      console.log(`   ${company.ticker}: ${company.name} - ${company.sector}`)
    })
  }
}

// Run the test
testFetchAndStore()
  .then(() => {
    console.log('\n✅ All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  })


