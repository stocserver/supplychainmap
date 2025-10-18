// Verify if ratios can be calculated from income statement data
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY

async function verifyRatios() {
  console.log('🔍 Checking if we can calculate missing ratios...\n')
  
  const ticker = 'AAPL'
  const incomeUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=annual&limit=1&apikey=${FMP_API_KEY}`
  
  const response = await fetch(incomeUrl)
  const data = await response.json()
  const income = data[0]
  
  console.log('📊 Raw Data from FMP:')
  console.log(JSON.stringify(income, null, 2))
  
  console.log('\n\n💡 Calculating Ratios:\n')
  
  // Calculate ratios
  const grossProfitRatio = income.revenue ? income.grossProfit / income.revenue : null
  const operatingIncomeRatio = income.revenue ? income.operatingIncome / income.revenue : null
  const netIncomeRatio = income.revenue ? income.netIncome / income.revenue : null
  
  console.log(`Gross Profit Ratio: ${grossProfitRatio ? (grossProfitRatio * 100).toFixed(2) + '%' : 'N/A'}`)
  console.log(`   Formula: grossProfit / revenue = ${income.grossProfit} / ${income.revenue}`)
  console.log('')
  
  console.log(`Operating Income Ratio: ${operatingIncomeRatio ? (operatingIncomeRatio * 100).toFixed(2) + '%' : 'N/A'}`)
  console.log(`   Formula: operatingIncome / revenue = ${income.operatingIncome} / ${income.revenue}`)
  console.log('')
  
  console.log(`Net Income Ratio: ${netIncomeRatio ? (netIncomeRatio * 100).toFixed(2) + '%' : 'N/A'}`)
  console.log(`   Formula: netIncome / revenue = ${income.netIncome} / ${income.revenue}`)
  console.log('')
  
  console.log('\n✅ Solution: We can calculate these ratios from the available data!')
  console.log('   The import script should calculate and add these ratios when storing to Supabase.\n')
}

verifyRatios()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })


