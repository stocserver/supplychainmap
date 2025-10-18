// Test FMP Income Statement API and data mapping
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY

async function testIncomeStatementAPI() {
  console.log('🧪 Testing FMP Income Statement API...\n')
  
  if (!FMP_API_KEY) {
    console.log('❌ FMP_API_KEY not found in environment variables')
    return
  }
  
  console.log('✅ API Key found:', FMP_API_KEY.substring(0, 10) + '...\n')
  
  const testTickers = ['AAPL', 'MSFT', 'ABBV'] // Test with known good tickers
  
  for (const ticker of testTickers) {
    console.log('='.repeat(80))
    console.log(`\n📊 Testing ${ticker}\n`)
    
    try {
      // Test the exact endpoint used in import script
      const incomeUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
      
      console.log('🔗 Request URL:')
      console.log(`   ${incomeUrl.replace(FMP_API_KEY, 'API_KEY')}\n`)
      
      console.log('⏳ Fetching data...')
      const response = await fetch(incomeUrl)
      
      console.log(`📡 Response Status: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.log(`❌ API Error: ${errorText}`)
        continue
      }
      
      const incomeStatements = await response.json()
      
      console.log(`\n✅ Income Statements Retrieved: ${incomeStatements.length} years\n`)
      
      if (incomeStatements.length === 0) {
        console.log('⚠️  No data returned - this could indicate:')
        console.log('   - Invalid ticker')
        console.log('   - API key has no access to this endpoint')
        console.log('   - Data not available for this company\n')
        continue
      }
      
      // Show the latest (most recent) income statement
      const latest = incomeStatements[0]
      
      console.log('📈 LATEST INCOME STATEMENT DATA:\n')
      console.log(`   Fiscal Year: ${latest.date || 'N/A'}`)
      console.log(`   Calendar Year: ${latest.calendarYear || 'N/A'}`)
      console.log(`   Period: ${latest.period || 'N/A'}`)
      console.log('')
      
      // Test all the fields used by FinancialStatements.tsx component
      console.log('💰 REVENUE & PROFIT:')
      console.log(`   Revenue:            ${formatCurrency(latest.revenue)}`)
      console.log(`   Cost of Revenue:    ${formatCurrency(latest.costOfRevenue)}`)
      console.log(`   Gross Profit:       ${formatCurrency(latest.grossProfit)}`)
      console.log(`   Operating Income:   ${formatCurrency(latest.operatingIncome)}`)
      console.log(`   Net Income:         ${formatCurrency(latest.netIncome)}`)
      console.log('')
      
      console.log('📊 MARGINS (as ratios):')
      console.log(`   Gross Margin:       ${formatPercentage(latest.grossProfitRatio)}`)
      console.log(`   Operating Margin:   ${formatPercentage(latest.operatingIncomeRatio)}`)
      console.log(`   Net Margin:         ${formatPercentage(latest.netIncomeRatio)}`)
      console.log('')
      
      console.log('📈 PER SHARE METRICS:')
      console.log(`   EPS (Basic):        $${latest.eps?.toFixed(2) || 'N/A'}`)
      console.log(`   EPS (Diluted):      $${latest.epsdiluted?.toFixed(2) || 'N/A'}`)
      console.log('')
      
      console.log('💡 OTHER METRICS:')
      console.log(`   EBITDA:             ${formatCurrency(latest.ebitda)}`)
      console.log(`   EBITDA Ratio:       ${formatPercentage(latest.ebitdaratio)}`)
      console.log('')
      
      // Validate required fields for the component
      console.log('✓ FIELD VALIDATION (for FinancialStatements component):\n')
      
      const requiredFields = [
        'revenue',
        'grossProfit',
        'operatingIncome',
        'netIncome',
        'grossProfitRatio',
        'operatingIncomeRatio',
        'netIncomeRatio',
        'eps',
        'epsdiluted'
      ]
      
      let allFieldsPresent = true
      for (const field of requiredFields) {
        const value = latest[field]
        const status = value !== undefined && value !== null ? '✅' : '❌'
        console.log(`   ${status} ${field}: ${value !== undefined && value !== null ? '✓' : 'MISSING'}`)
        if (value === undefined || value === null) {
          allFieldsPresent = false
        }
      }
      
      console.log('')
      if (allFieldsPresent) {
        console.log('✅ All required fields are present!')
      } else {
        console.log('⚠️  Some fields are missing - component may show incomplete data')
      }
      
      // Show data structure as it would be stored in Supabase
      console.log('\n📦 DATA MAPPING (as stored in Supabase):\n')
      const mappedData = {
        date: latest.date,
        revenue: latest.revenue,
        costOfRevenue: latest.costOfRevenue,
        grossProfit: latest.grossProfit,
        grossProfitRatio: latest.grossProfitRatio,
        operatingIncome: latest.operatingIncome,
        operatingIncomeRatio: latest.operatingIncomeRatio,
        netIncome: latest.netIncome,
        netIncomeRatio: latest.netIncomeRatio,
        eps: latest.eps,
        epsdiluted: latest.epsdiluted,
        ebitda: latest.ebitda,
        ebitdaratio: latest.ebitdaratio,
      }
      console.log(JSON.stringify(mappedData, null, 2))
      
      // Show all available years
      console.log(`\n📅 HISTORICAL DATA (${incomeStatements.length} years):\n`)
      incomeStatements.forEach((stmt, idx) => {
        console.log(`   ${idx + 1}. ${stmt.date} (${stmt.calendarYear}) - Revenue: ${formatCurrency(stmt.revenue)}`)
      })
      
      console.log('')
      
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`)
    }
    
    console.log('')
    
    // Wait between requests to avoid rate limiting
    if (testTickers.indexOf(ticker) < testTickers.length - 1) {
      console.log('⏳ Waiting 2 seconds before next request...\n')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  console.log('='.repeat(80))
  console.log('\n✨ Test completed!')
  console.log('\n📝 Summary:')
  console.log('   If all tests passed, the FMP income statement endpoint is working correctly.')
  console.log('   The data structure matches what the FinancialStatements component expects.')
  console.log('   Data is being fetched and can be stored in Supabase.\n')
}

// Helper functions
function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A'
  if (Math.abs(value) >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else {
    return `$${value.toLocaleString()}`
  }
}

function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A'
  return `${(value * 100).toFixed(2)}%`
}

testIncomeStatementAPI()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })


