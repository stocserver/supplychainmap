// Test if the income statement fix works correctly
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY

async function testFix() {
  console.log('🧪 Testing Income Statement Data Mapping Fix...\n')
  
  const ticker = 'AAPL'
  const incomeUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=annual&limit=1&apikey=${FMP_API_KEY}`
  
  const response = await fetch(incomeUrl)
  const incomeStatements = await response.json()
  const latestIncome = incomeStatements[0]
  
  console.log('📊 Raw API Data (relevant fields):')
  console.log({
    revenue: latestIncome.revenue,
    grossProfit: latestIncome.grossProfit,
    operatingIncome: latestIncome.operatingIncome,
    netIncome: latestIncome.netIncome,
    eps: latestIncome.eps,
    epsDiluted: latestIncome.epsDiluted,
    ebitda: latestIncome.ebitda,
  })
  console.log('')
  
  // Simulate the fixed mapping logic
  const mappedData = {
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
  
  console.log('💾 Mapped Data (as stored in Supabase):')
  console.log(JSON.stringify(mappedData, null, 2))
  console.log('')
  
  // Validate all required fields
  console.log('✅ Field Validation:\n')
  
  const requiredFields = [
    { name: 'revenue', value: mappedData.revenue },
    { name: 'grossProfit', value: mappedData.grossProfit },
    { name: 'operatingIncome', value: mappedData.operatingIncome },
    { name: 'netIncome', value: mappedData.netIncome },
    { name: 'grossProfitRatio', value: mappedData.grossProfitRatio },
    { name: 'operatingIncomeRatio', value: mappedData.operatingIncomeRatio },
    { name: 'netIncomeRatio', value: mappedData.netIncomeRatio },
    { name: 'eps', value: mappedData.eps },
    { name: 'epsdiluted', value: mappedData.epsdiluted },
    { name: 'ebitda', value: mappedData.ebitda },
    { name: 'ebitdaratio', value: mappedData.ebitdaratio },
  ]
  
  let allValid = true
  for (const field of requiredFields) {
    const isValid = field.value !== undefined && field.value !== null
    console.log(`   ${isValid ? '✅' : '❌'} ${field.name}: ${isValid ? field.value : 'MISSING'}`)
    if (!isValid) allValid = false
  }
  
  console.log('')
  
  if (allValid) {
    console.log('✅ SUCCESS! All fields are present and properly mapped.')
    console.log('   The FinancialStatements component will display correctly.\n')
    
    // Simulate how the component will display the data
    console.log('🎨 How it will display in the UI:\n')
    console.log(`   Revenue:            $${(mappedData.revenue / 1e9).toFixed(2)}B`)
    console.log(`   Gross Profit:       $${(mappedData.grossProfit / 1e9).toFixed(2)}B`)
    console.log(`   Operating Income:   $${(mappedData.operatingIncome / 1e9).toFixed(2)}B`)
    console.log(`   Net Income:         $${(mappedData.netIncome / 1e9).toFixed(2)}B`)
    console.log('')
    console.log(`   Gross Margin:       ${(mappedData.grossProfitRatio! * 100).toFixed(1)}%`)
    console.log(`   Operating Margin:   ${(mappedData.operatingIncomeRatio! * 100).toFixed(1)}%`)
    console.log(`   Net Margin:         ${(mappedData.netIncomeRatio! * 100).toFixed(1)}%`)
    console.log('')
    console.log(`   EPS (Basic):        $${mappedData.eps.toFixed(2)}`)
    console.log(`   EPS (Diluted):      $${mappedData.epsdiluted!.toFixed(2)}`)
    console.log('')
    console.log(`   EBITDA:             $${(mappedData.ebitda / 1e9).toFixed(2)}B`)
    console.log(`   EBITDA Margin:      ${(mappedData.ebitdaratio! * 100).toFixed(1)}%`)
  } else {
    console.log('❌ FAILED! Some fields are still missing.')
  }
  
  console.log('')
}

testFix()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })


