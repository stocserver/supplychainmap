import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY

async function testABBV() {
  console.log('Testing ABBV quarterly data API access...\n')
  
  const url = `https://financialmodelingprep.com/stable/income-statement?symbol=ABBV&period=quarter&limit=1&apikey=${FMP_API_KEY}`
  
  const response = await fetch(url)
  console.log(`Status: ${response.status} ${response.statusText}`)
  
  const data = await response.json()
  console.log('Response:', JSON.stringify(data, null, 2))
}

testABBV()


