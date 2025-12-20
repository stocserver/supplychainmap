// Check if a single ticker exists in Supabase with data
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function checkTicker(ticker: string) {
  console.log(`🔍 Checking ${ticker} in Supabase...\n`)
  
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('ticker', ticker.toUpperCase())
    .single()

  if (error) {
    console.log(`❌ Error: ${error.message}`)
    return
  }

  if (!data) {
    console.log(`❌ ${ticker} not found in database`)
    return
  }

  console.log(`✅ ${ticker} found in database`)
  console.log(`   Name: ${data.name}`)
  console.log(`   Market Cap: ${data.market_cap ? `$${(data.market_cap / 1e9).toFixed(2)}B` : 'N/A'}`)
  
  if (data.data) {
    console.log(`\n📦 Data field exists:`)
    console.log(`   Has quote: ${!!data.data.quote}`)
    console.log(`   Has profile: ${!!data.data.profile}`)
    console.log(`   Has incomeStatement: ${!!data.data.incomeStatement}`)
    console.log(`   Has balanceSheet: ${!!data.data.balanceSheet}`)
    console.log(`   Has cashFlow: ${!!data.data.cashFlow}`)
    console.log(`   Has keyMetrics: ${!!data.data.keyMetrics}`)
    console.log(`   Has ratios: ${!!data.data.ratios}`)
    
    if (data.data.quote) {
      console.log(`\n💰 Quote Data:`)
      console.log(`   Price: $${data.data.quote.price}`)
      console.log(`   Company Name: ${data.data.profile?.companyName || 'N/A'}`)
    }
    
    if (data.data.incomeStatement) {
      console.log(`\n📈 Income Statement:`)
      console.log(`   Revenue: $${(data.data.incomeStatement.revenue / 1e9).toFixed(2)}B`)
      console.log(`   Date: ${data.data.incomeStatement.date}`)
    }
  } else {
    console.log(`\n❌ No data field found!`)
  }
}

const ticker = process.argv[2] || 'TRYIY'
checkTicker(ticker).then(() => process.exit(0)).catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
