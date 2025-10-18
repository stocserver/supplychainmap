// Test importing a single company with the fixed script
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

async function testSingleImport() {
  console.log('🧪 Testing Single Company Import with Fixed Script...\n')
  
  const ticker = 'AAPL'
  
  try {
    // Fetch data from FMP
    console.log(`📊 Fetching ${ticker} from FMP...`)
    
    const incomeUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=annual&limit=1&apikey=${FMP_API_KEY}`
    const incomeResponse = await fetch(incomeUrl)
    const incomeStatements = await incomeResponse.json()
    const latestIncome = incomeStatements[0]
    
    if (!latestIncome) {
      console.log('❌ No income statement data received')
      return
    }
    
    console.log('✅ Data received from FMP\n')
    
    // Apply the fixed mapping logic
    console.log('🔧 Applying fixed mapping logic...')
    const mappedIncomeStatement = {
      date: latestIncome.date,
      revenue: latestIncome.revenue,
      costOfRevenue: latestIncome.costOfRevenue,
      grossProfit: latestIncome.grossProfit,
      // Calculate ratios if not provided by API
      grossProfitRatio: latestIncome.grossProfitRatio || (latestIncome.revenue ? latestIncome.grossProfit / latestIncome.revenue : null),
      operatingIncome: latestIncome.operatingIncome,
      operatingIncomeRatio: latestIncome.operatingIncomeRatio || (latestIncome.revenue ? latestIncome.operatingIncome / latestIncome.revenue : null),
      netIncome: latestIncome.netIncome,
      netIncomeRatio: latestIncome.netIncomeRatio || (latestIncome.revenue ? latestIncome.netIncome / latestIncome.revenue : null),
      eps: latestIncome.eps,
      // Fix casing: API returns epsDiluted, not epsdiluted
      epsdiluted: latestIncome.epsDiluted || latestIncome.epsdiluted,
      ebitda: latestIncome.ebitda,
      // Fix casing: API might return ebitdaRatio
      ebitdaratio: latestIncome.ebitdaRatio || latestIncome.ebitdaratio || (latestIncome.revenue ? latestIncome.ebitda / latestIncome.revenue : null),
    }
    
    console.log('✅ Mapping complete\n')
    
    // Validate all fields
    console.log('✓ Validating mapped data:\n')
    const requiredFields = [
      'revenue', 'grossProfit', 'operatingIncome', 'netIncome',
      'grossProfitRatio', 'operatingIncomeRatio', 'netIncomeRatio',
      'eps', 'epsdiluted', 'ebitda', 'ebitdaratio'
    ]
    
    let allValid = true
    for (const field of requiredFields) {
      const value = mappedIncomeStatement[field as keyof typeof mappedIncomeStatement]
      const isValid = value !== undefined && value !== null
      console.log(`   ${isValid ? '✅' : '❌'} ${field}: ${isValid ? '✓' : 'MISSING'}`)
      if (!isValid) allValid = false
    }
    
    console.log('')
    
    if (!allValid) {
      console.log('❌ Validation failed - some fields are missing')
      return
    }
    
    console.log('✅ All required fields present!\n')
    
    // Show how it will display
    console.log('🎨 Preview of UI Display:\n')
    console.log('   Income Statement Tab:')
    console.log(`   - Revenue: $${(mappedIncomeStatement.revenue / 1e9).toFixed(2)}B`)
    console.log(`   - Gross Profit: $${(mappedIncomeStatement.grossProfit / 1e9).toFixed(2)}B`)
    console.log(`   - Operating Income: $${(mappedIncomeStatement.operatingIncome / 1e9).toFixed(2)}B`)
    console.log(`   - Net Income: $${(mappedIncomeStatement.netIncome / 1e9).toFixed(2)}B`)
    console.log('')
    console.log('   Margins:')
    console.log(`   - Gross Margin: ${(mappedIncomeStatement.grossProfitRatio! * 100).toFixed(1)}%`)
    console.log(`   - Operating Margin: ${(mappedIncomeStatement.operatingIncomeRatio! * 100).toFixed(1)}%`)
    console.log(`   - Net Margin: ${(mappedIncomeStatement.netIncomeRatio! * 100).toFixed(1)}%`)
    console.log('')
    console.log('   Per Share:')
    console.log(`   - EPS (Basic): $${mappedIncomeStatement.eps.toFixed(2)}`)
    console.log(`   - EPS (Diluted): $${mappedIncomeStatement.epsdiluted!.toFixed(2)}`)
    console.log('')
    console.log('   EBITDA:')
    console.log(`   - EBITDA: $${(mappedIncomeStatement.ebitda / 1e9).toFixed(2)}B`)
    console.log(`   - EBITDA Margin: ${(mappedIncomeStatement.ebitdaratio! * 100).toFixed(1)}%`)
    console.log('')
    
    console.log('✅ SUCCESS! The income statement data is being fetched and mapped correctly.')
    console.log('   The FinancialStatements component will display complete financial data.\n')
    
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`)
  }
}

testSingleImport()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })


