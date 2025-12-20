// Quick test to check if FINMY has FMP data
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY

if (!FMP_API_KEY) {
  console.error('❌ Missing FMP_API_KEY')
  process.exit(1)
}

async function testFINMY() {
  const ticker = 'FINMY'
  
  // Test quote
  console.log(`Testing quote for ${ticker}...`)
  try {
    const quoteUrl = `https://financialmodelingprep.com/stable/quote?symbol=${ticker}&apikey=${FMP_API_KEY}`
    const quoteRes = await fetch(quoteUrl)
    const quoteData = await quoteRes.json()
    
    if (!quoteRes.ok || !quoteData || quoteData.length === 0) {
      console.log(`❌ No quote data for ${ticker} (Status: ${quoteRes.status})`)
      if (quoteData && quoteData.Error) {
        console.log(`Error message: ${quoteData.Error}`)
      }
    } else {
      console.log(`✅ Quote data found:`)
      console.log(`   Price: $${quoteData[0].price}`)
      console.log(`   Name: ${quoteData[0].name}`)
      console.log(`   Market Cap: $${(quoteData[0].marketCap / 1e9).toFixed(2)}B`)
    }
  } catch (error: any) {
    console.log(`❌ Error fetching quote: ${error.message}`)
  }
  
  // Test profile
  console.log(`\nTesting profile for ${ticker}...`)
  try {
    const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${ticker}&apikey=${FMP_API_KEY}`
    const profileRes = await fetch(profileUrl)
    const profileData = await profileRes.json()
    
    if (!profileRes.ok || !profileData || profileData.length === 0) {
      console.log(`❌ No profile data for ${ticker} (Status: ${profileRes.status})`)
    } else {
      console.log(`✅ Profile data found:`)
      console.log(`   Company Name: ${profileData[0].companyName}`)
      console.log(`   Exchange: ${profileData[0].exchangeShortName}`)
      console.log(`   Country: ${profileData[0].country}`)
    }
  } catch (error: any) {
    console.log(`❌ Error fetching profile: ${error.message}`)
  }
}

testFINMY().then(() => process.exit(0)).catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
