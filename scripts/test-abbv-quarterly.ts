// Test importing ABBV with quarterly data
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!FMP_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function testABBV() {
  const ticker = 'ABBV'
  
  console.log('🧪 Testing ABBV Quarterly Data Import...\n')
  console.log('='.repeat(80) + '\n')
  
  try {
    // Fetch quarterly income statements (try with smaller limit first)
    console.log('📈 Fetching quarterly income statements...')
    const incomeQuarterlyUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=quarter&limit=4&apikey=${FMP_API_KEY}`
    const incomeQuarterlyResponse = await fetch(incomeQuarterlyUrl)
    
    if (!incomeQuarterlyResponse.ok) {
      throw new Error(`API error: ${incomeQuarterlyResponse.status}`)
    }
    
    const incomeStatementsQuarterly = await incomeQuarterlyResponse.json()
    
    console.log(`✅ Received ${incomeStatementsQuarterly.length} quarterly income statements\n`)
    
    if (incomeStatementsQuarterly.length > 0) {
      console.log('📊 Quarterly Data Preview:\n')
      incomeStatementsQuarterly.slice(0, 4).forEach((stmt: any, i: number) => {
        console.log(`  ${i + 1}. ${stmt.period || 'Q?'} ${stmt.date}`)
        console.log(`     Revenue: $${(stmt.revenue / 1e9).toFixed(2)}B`)
        console.log(`     Net Income: $${(stmt.netIncome / 1e6).toFixed(0)}M`)
        console.log(`     EPS: $${stmt.eps?.toFixed(2) || 'N/A'}`)
        console.log('')
      })
    }
    
    // Fetch current annual data from Supabase
    console.log('📦 Fetching current data from Supabase...')
    const { data: currentData, error: fetchError } = await supabase
      .from('companies')
      .select('data')
      .eq('ticker', ticker)
      .single()
    
    if (fetchError) {
      throw new Error(`Supabase fetch error: ${fetchError.message}`)
    }
    
    console.log('✅ Current data retrieved\n')
    
    // Update with quarterly data
    console.log('💾 Adding quarterly data to Supabase...')
    
    const updatedData = {
      ...currentData.data,
      historicalFinancials: {
        ...currentData.data.historicalFinancials,
        incomeStatementsQuarterly: incomeStatementsQuarterly,
      }
    }
    
    const { error: updateError } = await supabase
      .from('companies')
      .update({
        data: updatedData,
        updated_at: new Date().toISOString()
      })
      .eq('ticker', ticker)
    
    if (updateError) {
      throw new Error(`Supabase update error: ${updateError.message}`)
    }
    
    console.log('✅ Successfully updated ABBV with quarterly data!\n')
    
    // Verify
    console.log('🔍 Verifying...')
    const { data: verifyData } = await supabase
      .from('companies')
      .select('data')
      .eq('ticker', ticker)
      .single()
    
    const quarterlyCount = verifyData?.data?.historicalFinancials?.incomeStatementsQuarterly?.length || 0
    
    if (quarterlyCount > 0) {
      console.log(`✅ Verified: ${quarterlyCount} quarterly income statements stored\n`)
      console.log('='.repeat(80))
      console.log('\n🎉 SUCCESS! ABBV now has quarterly data.')
      console.log('\n📝 Next steps:')
      console.log('   1. Start your dev server: npm run dev')
      console.log('   2. Go to: http://localhost:3000/companies/ABBV')
      console.log('   3. Click the "Quarterly" toggle button')
      console.log('   4. You should see the quarterly income statement!')
    } else {
      console.log('❌ Verification failed - quarterly data not found')
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

testABBV()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

