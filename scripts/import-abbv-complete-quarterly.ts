// Import complete quarterly data for ABBV (all statements)
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

async function importABBVQuarterly() {
  const ticker = 'ABBV'
  
  console.log('🔧 Importing Complete Quarterly Data for ABBV...\n')
  console.log('='.repeat(80) + '\n')
  
  try {
    // Fetch quarterly income statements
    console.log('📈 Fetching quarterly income statements (4 quarters)...')
    const incomeQuarterlyUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=quarter&limit=4&apikey=${FMP_API_KEY}`
    const incomeQuarterlyResponse = await fetch(incomeQuarterlyUrl)
    
    if (!incomeQuarterlyResponse.ok) {
      throw new Error(`Income API error: ${incomeQuarterlyResponse.status}`)
    }
    
    const incomeStatementsQuarterly = await incomeQuarterlyResponse.json()
    console.log(`✅ Received ${incomeStatementsQuarterly.length} quarterly income statements\n`)
    
    // Fetch quarterly balance sheets
    console.log('📊 Fetching quarterly balance sheets (4 quarters)...')
    const balanceQuarterlyUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${ticker}&period=quarter&limit=4&apikey=${FMP_API_KEY}`
    const balanceQuarterlyResponse = await fetch(balanceQuarterlyUrl)
    
    if (!balanceQuarterlyResponse.ok) {
      throw new Error(`Balance API error: ${balanceQuarterlyResponse.status}`)
    }
    
    const balanceSheetsQuarterly = await balanceQuarterlyResponse.json()
    console.log(`✅ Received ${balanceSheetsQuarterly.length} quarterly balance sheets\n`)
    
    // Fetch quarterly cash flow statements
    console.log('💰 Fetching quarterly cash flow statements (4 quarters)...')
    const cashFlowQuarterlyUrl = `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&period=quarter&limit=4&apikey=${FMP_API_KEY}`
    const cashFlowQuarterlyResponse = await fetch(cashFlowQuarterlyUrl)
    
    if (!cashFlowQuarterlyResponse.ok) {
      throw new Error(`Cash flow API error: ${cashFlowQuarterlyResponse.status}`)
    }
    
    const cashFlowStatementsQuarterly = await cashFlowQuarterlyResponse.json()
    console.log(`✅ Received ${cashFlowStatementsQuarterly.length} quarterly cash flow statements\n`)
    
    // Show preview
    console.log('📊 Data Preview:\n')
    console.log('Latest Quarter (Q2 2025):')
    if (incomeStatementsQuarterly[0]) {
      console.log(`  Income: Revenue $${(incomeStatementsQuarterly[0].revenue / 1e9).toFixed(2)}B, Net Income $${(incomeStatementsQuarterly[0].netIncome / 1e6).toFixed(0)}M`)
    }
    if (balanceSheetsQuarterly[0]) {
      console.log(`  Balance: Total Assets $${(balanceSheetsQuarterly[0].totalAssets / 1e9).toFixed(2)}B`)
    }
    if (cashFlowStatementsQuarterly[0]) {
      console.log(`  Cash Flow: Operating CF $${(cashFlowStatementsQuarterly[0].operatingCashFlow / 1e6).toFixed(0)}M`)
    }
    console.log('')
    
    // Fetch current data from Supabase
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
    
    // Update with ALL quarterly data
    console.log('💾 Updating Supabase with complete quarterly data...')
    
    const updatedData = {
      ...currentData.data,
      historicalFinancials: {
        ...currentData.data.historicalFinancials,
        incomeStatementsQuarterly: incomeStatementsQuarterly,
        balanceSheetsQuarterly: balanceSheetsQuarterly,
        cashFlowStatementsQuarterly: cashFlowStatementsQuarterly,
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
    
    console.log('✅ Successfully updated ABBV with complete quarterly data!\n')
    
    // Verify
    console.log('🔍 Verifying...')
    const { data: verifyData } = await supabase
      .from('companies')
      .select('data')
      .eq('ticker', ticker)
      .single()
    
    const incomeCount = verifyData?.data?.historicalFinancials?.incomeStatementsQuarterly?.length || 0
    const balanceCount = verifyData?.data?.historicalFinancials?.balanceSheetsQuarterly?.length || 0
    const cashFlowCount = verifyData?.data?.historicalFinancials?.cashFlowStatementsQuarterly?.length || 0
    
    console.log(`  ✅ Income Statements: ${incomeCount} quarters`)
    console.log(`  ✅ Balance Sheets: ${balanceCount} quarters`)
    console.log(`  ✅ Cash Flow Statements: ${cashFlowCount} quarters\n`)
    
    console.log('='.repeat(80))
    console.log('\n🎉 SUCCESS! ABBV now has COMPLETE quarterly data for all 3 statements.')
    console.log('\n📝 Next steps:')
    console.log('   1. Start dev server: npm run dev')
    console.log('   2. Go to: http://localhost:3000/companies/ABBV')
    console.log('   3. Click the "Quarterly" toggle button')
    console.log('   4. All 3 tabs (Income, Balance, Cash Flow) should show quarterly data!')
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

importABBVQuarterly()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })


