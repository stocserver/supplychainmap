// Import fundamentals for a single ticker into Supabase
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

async function fetchFundamentals(ticker: string) {
	// Fetch quote, profile, and 5-year historical statements
	const quoteUrl = `https://financialmodelingprep.com/stable/quote?symbol=${ticker}&apikey=${FMP_API_KEY}`
	const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${ticker}&apikey=${FMP_API_KEY}`
	const incomeUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
	const balanceUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
	const cashFlowUrl = `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&period=annual&limit=5&apikey=${FMP_API_KEY}`
	const incomeQuarterUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${ticker}&period=quarter&limit=5&apikey=${FMP_API_KEY}`
	const balanceQuarterUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${ticker}&period=quarter&limit=5&apikey=${FMP_API_KEY}`
	const cashFlowQuarterUrl = `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&period=quarter&limit=5&apikey=${FMP_API_KEY}`

	const [quoteRes, profileRes, incomeRes, balanceRes, cashRes, incomeQRes, balanceQRes, cashQRes] = await Promise.all([
		fetch(quoteUrl),
		fetch(profileUrl),
		fetch(incomeUrl),
		fetch(balanceUrl),
		fetch(cashFlowUrl),
		fetch(incomeQuarterUrl),
		fetch(balanceQuarterUrl),
		fetch(cashFlowQuarterUrl),
	])

	if (!quoteRes.ok) throw new Error(`Quote API error: ${quoteRes.status}`)
	if (!profileRes.ok) throw new Error(`Profile API error: ${profileRes.status}`)

	const [quoteData, profileData] = await Promise.all([
		quoteRes.json(),
		profileRes.json(),
	])

	const [incomeStatements, balanceSheets, cashFlowStatements, incomeStatementsQuarterly, balanceSheetsQuarterly, cashFlowStatementsQuarterly] = await Promise.all([
		incomeRes.ok ? incomeRes.json() : [],
		balanceRes.ok ? balanceRes.json() : [],
		cashRes.ok ? cashRes.json() : [],
		incomeQRes.ok ? incomeQRes.json() : [],
		balanceQRes.ok ? balanceQRes.json() : [],
		cashQRes.ok ? cashQRes.json() : [],
	])

	return {
		quote: quoteData?.[0],
		profile: profileData?.[0],
		incomeStatements: incomeStatements || [],
		balanceSheets: balanceSheets || [],
		cashFlowStatements: cashFlowStatements || [],
		incomeStatementsQuarterly: incomeStatementsQuarterly || [],
		balanceSheetsQuarterly: balanceSheetsQuarterly || [],
		cashFlowStatementsQuarterly: cashFlowStatementsQuarterly || [],
		latestIncome: incomeStatements?.[0] || null,
		latestBalance: balanceSheets?.[0] || null,
		latestCashFlow: cashFlowStatements?.[0] || null,
	}
}

async function run() {
	const ticker = process.argv[2] || 'ABBV'
	console.log(`🚀 Importing fundamentals for ${ticker}...`) 

	try {
		const data = await fetchFundamentals(ticker)

		if (!data.quote || !data.profile) {
			throw new Error('Missing quote or profile from FMP')
		}

		const mappedIncome = data.latestIncome ? {
			date: data.latestIncome.date,
			revenue: data.latestIncome.revenue,
			costOfRevenue: data.latestIncome.costOfRevenue,
			grossProfit: data.latestIncome.grossProfit,
			grossProfitRatio: data.latestIncome.grossProfitRatio || (data.latestIncome.revenue ? data.latestIncome.grossProfit / data.latestIncome.revenue : null),
			operatingIncome: data.latestIncome.operatingIncome,
			operatingIncomeRatio: data.latestIncome.operatingIncomeRatio || (data.latestIncome.revenue ? data.latestIncome.operatingIncome / data.latestIncome.revenue : null),
			netIncome: data.latestIncome.netIncome,
			netIncomeRatio: data.latestIncome.netIncomeRatio || (data.latestIncome.revenue ? data.latestIncome.netIncome / data.latestIncome.revenue : null),
			eps: data.latestIncome.eps,
			epsdiluted: data.latestIncome.epsDiluted || data.latestIncome.epsdiluted,
			ebitda: data.latestIncome.ebitda,
			ebitdaratio: data.latestIncome.ebitdaRatio || data.latestIncome.ebitdaratio || (data.latestIncome.revenue ? data.latestIncome.ebitda / data.latestIncome.revenue : null),
		} : null

		const mappedBalance = data.latestBalance ? {
			date: data.latestBalance.date,
			totalAssets: data.latestBalance.totalAssets,
			totalLiabilities: data.latestBalance.totalLiabilities,
			totalEquity: data.latestBalance.totalStockholdersEquity,
			cashAndCashEquivalents: data.latestBalance.cashAndCashEquivalents,
			totalDebt: data.latestBalance.totalDebt,
			netDebt: data.latestBalance.netDebt,
		} : null

		const mappedCash = data.latestCashFlow ? {
			date: data.latestCashFlow.date,
			operatingCashFlow: data.latestCashFlow.operatingCashFlow,
			capitalExpenditure: data.latestCashFlow.capitalExpenditure,
			freeCashFlow: data.latestCashFlow.freeCashFlow,
			dividendsPaid: data.latestCashFlow.dividendsPaid,
		} : null

		const { error } = await supabase
			.from('companies')
			.upsert({
				ticker,
				name: data.profile.companyName || ticker,
				sector: data.profile.sector || null,
				industry: data.profile.industry || null,
				description: data.profile.description || null,
				website: data.profile.website || null,
				logo_url: data.profile.image || null,
				country: data.profile.country || 'US',
				exchange: data.profile.exchangeShortName || data.quote.exchange || null,
				market_cap: data.quote.marketCap || 0,
				employees: data.profile.fullTimeEmployees || 0,
				data: {
					quote: {
						price: data.quote.price,
						change: data.quote.change,
						changesPercentage: data.quote.changesPercentage,
						volume: data.quote.volume,
						avgVolume: data.quote.avgVolume,
						marketCap: data.quote.marketCap,
						pe: data.quote.pe,
						eps: data.quote.eps,
						dayLow: data.quote.dayLow,
						dayHigh: data.quote.dayHigh,
						yearLow: data.quote.yearLow,
						yearHigh: data.quote.yearHigh,
						sharesOutstanding: data.quote.sharesOutstanding,
					},
					profile: {
						companyName: data.profile.companyName,
						cik: data.profile.cik,
						isin: data.profile.isin,
						cusip: data.profile.cusip,
						ipoDate: data.profile.ipoDate,
						beta: data.profile.beta,
					},
					incomeStatement: mappedIncome,
					balanceSheet: mappedBalance,
					cashFlow: mappedCash,
					historicalFinancials: {
						incomeStatements: data.incomeStatements,
						balanceSheets: data.balanceSheets,
						cashFlowStatements: data.cashFlowStatements,
						incomeStatementsQuarterly: data.incomeStatementsQuarterly,
						balanceSheetsQuarterly: data.balanceSheetsQuarterly,
						cashFlowStatementsQuarterly: data.cashFlowStatementsQuarterly,
					},
					last_updated: new Date().toISOString(),
				},
				updated_at: new Date().toISOString(),
			}, { onConflict: 'ticker' })

		if (error) throw new Error(error.message)

		console.log('💾 Stored in Supabase with latest fundamentals')
	} catch (e: any) {
		console.error('❌ Failed:', e.message)
		process.exit(1)
	}
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
	console.error('Fatal error:', err)
	process.exit(1)
  })


