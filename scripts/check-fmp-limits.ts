// Check FMP API access and limits
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY

async function checkLimits() {
  console.log('🔍 Checking FMP API Access...\n')
  
  const ticker = 'AAPL'
  
  // Test 1: Annual data (should work on free tier)
  console.log('1️⃣  Testing Annual Income Statement (Free Tier)...')
  const annualUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=annual&limit=1&apikey=${FMP_API_KEY}`
  
  try {
    const annualResponse = await fetch(annualUrl)
    console.log(`   Status: ${annualResponse.status} ${annualResponse.statusText}`)
    
    if (annualResponse.ok) {
      const data = await annualResponse.json()
      console.log(`   ✅ Annual data works! Received ${data.length} records\n`)
    } else {
      const errorText = await annualResponse.text()
      console.log(`   ❌ Error: ${errorText}\n`)
    }
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}\n`)
  }
  
  // Test 2: Quarterly data (might require paid plan)
  console.log('2️⃣  Testing Quarterly Income Statement...')
  const quarterlyUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=quarter&limit=1&apikey=${FMP_API_KEY}`
  
  try {
    const quarterlyResponse = await fetch(quarterlyUrl)
    console.log(`   Status: ${quarterlyResponse.status} ${quarterlyResponse.statusText}`)
    
    if (quarterlyResponse.ok) {
      const data = await quarterlyResponse.json()
      console.log(`   ✅ Quarterly data works! Received ${data.length} records\n`)
    } else if (quarterlyResponse.status === 402) {
      console.log(`   ❌ 402 Payment Required`)
      console.log(`   ℹ️  Quarterly data requires a PAID FMP plan\n`)
    } else if (quarterlyResponse.status === 429) {
      console.log(`   ❌ 429 Too Many Requests`)
      console.log(`   ℹ️  Daily API limit (250 calls) reached. Try again tomorrow.\n`)
    } else {
      const errorText = await quarterlyResponse.text()
      console.log(`   ❌ Error: ${errorText}\n`)
    }
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}\n`)
  }
  
  console.log('='.repeat(80))
  console.log('\n📋 SUMMARY:\n')
  console.log('FMP Free Tier Limits:')
  console.log('  ✅ Annual financial statements: Included')
  console.log('  ✅ Quote & Profile data: Included')
  console.log('  ✅ Key metrics & ratios: Included')
  console.log('  ❓ Quarterly statements: Usually REQUIRES PAID PLAN')
  console.log('  📊 API Calls: 250 per day')
  console.log('\n💡 Options:')
  console.log('  1. Upgrade to FMP Starter plan ($14/month) for quarterly data')
  console.log('  2. Use only annual data (5 years) - works great for most use cases')
  console.log('  3. Try tomorrow if daily limit was reached')
}

checkLimits()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })


