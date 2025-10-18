import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY

async function run() {
	const ticker = process.argv[2] || 'ABBV'
	if (!FMP_API_KEY) {
		console.error('Missing FMP_API_KEY')
		process.exit(1)
	}

	const endpoints = [
		{
			label: 'Income (quarter)',
			url: `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=quarter&limit=12&apikey=${FMP_API_KEY}`
		},
		{
			label: 'Balance (quarter)',
			url: `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${ticker}&period=quarter&limit=12&apikey=${FMP_API_KEY}`
		},
		{
			label: 'Cash Flow (quarter)',
			url: `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&period=quarter&limit=12&apikey=${FMP_API_KEY}`
		},
	]

	for (const ep of endpoints) {
		console.log('\n' + '='.repeat(80))
		console.log(ep.label)
		console.log(ep.url.replace(FMP_API_KEY!, 'API_KEY'))
		const res = await fetch(ep.url)
		console.log(`Status: ${res.status} ${res.statusText}`)
		if (!res.ok) {
			console.log('Body:', await res.text())
			continue
		}
		const json = await res.json()
		console.log(`Length: ${Array.isArray(json) ? json.length : 0}`)
		if (Array.isArray(json) && json.length > 0) {
			console.log('First item keys:', Object.keys(json[0]).slice(0, 10))
		}
	}
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })




