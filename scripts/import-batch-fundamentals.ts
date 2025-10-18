// Batch import fundamentals for multiple tickers with concurrency limit
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!FMP_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing environment variables (FMP_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function fetchFundamentals(ticker: string) {
  const qs = (s: string) => encodeURIComponent(s)
  const quoteUrl = `https://financialmodelingprep.com/stable/quote?symbol=${qs(ticker)}&apikey=${FMP_API_KEY}`
  const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${qs(ticker)}&apikey=${FMP_API_KEY}`
  const incomeUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${qs(ticker)}&period=annual&limit=5&apikey=${FMP_API_KEY}`
  const balanceUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${qs(ticker)}&period=annual&limit=5&apikey=${FMP_API_KEY}`
  const cashFlowUrl = `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${qs(ticker)}&period=annual&limit=5&apikey=${FMP_API_KEY}`
  const incomeQuarterUrl = `https://financialmodelingprep.com/stable/income-statement?symbol=${qs(ticker)}&period=quarter&limit=5&apikey=${FMP_API_KEY}`
  const balanceQuarterUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${qs(ticker)}&period=quarter&limit=5&apikey=${FMP_API_KEY}`
  const cashFlowQuarterUrl = `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${qs(ticker)}&period=quarter&limit=5&apikey=${FMP_API_KEY}`

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
  }
}

async function upsertCompany(ticker: string) {
  const data = await fetchFundamentals(ticker)
  if (!data.quote || !data.profile) throw new Error('Missing quote or profile from FMP')

  const latestIncome = (data.incomeStatements as any[])?.[0]
  const latestBalance = (data.balanceSheets as any[])?.[0]
  const latestCashFlow = (data.cashFlowStatements as any[])?.[0]

  const mappedIncome = latestIncome ? {
    date: latestIncome.date,
    revenue: latestIncome.revenue,
    costOfRevenue: latestIncome.costOfRevenue,
    grossProfit: latestIncome.grossProfit,
    grossProfitRatio: latestIncome.grossProfitRatio ?? (latestIncome.revenue ? latestIncome.grossProfit / latestIncome.revenue : null),
    operatingIncome: latestIncome.operatingIncome,
    operatingIncomeRatio: latestIncome.operatingIncomeRatio ?? (latestIncome.revenue ? latestIncome.operatingIncome / latestIncome.revenue : null),
    netIncome: latestIncome.netIncome,
    netIncomeRatio: latestIncome.netIncomeRatio ?? (latestIncome.revenue ? latestIncome.netIncome / latestIncome.revenue : null),
    eps: latestIncome.eps,
    epsdiluted: latestIncome.epsDiluted ?? latestIncome.epsdiluted,
    ebitda: latestIncome.ebitda,
    ebitdaratio: latestIncome.ebitdaRatio ?? latestIncome.ebitdaratio ?? (latestIncome.revenue ? latestIncome.ebitda / latestIncome.revenue : null),
  } : null

  const mappedBalance = latestBalance ? {
    date: latestBalance.date,
    totalAssets: latestBalance.totalAssets,
    totalLiabilities: latestBalance.totalLiabilities,
    totalEquity: latestBalance.totalStockholdersEquity,
    cashAndCashEquivalents: latestBalance.cashAndCashEquivalents,
    totalDebt: latestBalance.totalDebt,
    netDebt: latestBalance.netDebt,
  } : null

  const mappedCash = latestCashFlow ? {
    date: latestCashFlow.date,
    operatingCashFlow: latestCashFlow.operatingCashFlow,
    capitalExpenditure: latestCashFlow.capitalExpenditure,
    freeCashFlow: latestCashFlow.freeCashFlow,
    dividendsPaid: latestCashFlow.dividendsPaid,
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
}

async function main() {
  const limitFlag = process.argv.find(a => a.startsWith('--limit='))
  const limit = limitFlag ? parseInt(limitFlag.split('=')[1], 10) : 10
  const concurrencyFlag = process.argv.find(a => a.startsWith('--concurrency='))
  const concurrency = concurrencyFlag ? parseInt(concurrencyFlag.split('=')[1], 10) : 10

  console.log(`🔎 Loading tickers from Supabase (limit sample: ${limit}, concurrency: ${concurrency})`)
  const { data: companies, error } = await supabase
    .from('companies')
    .select('ticker')
    .order('market_cap', { ascending: false })
    .limit(Math.max(limit, 10))

  if (error) throw new Error(error.message)
  const tickers: string[] = Array.from(new Set((companies || []).map((c: any) => c.ticker))).slice(0, limit)
  console.log(`🧾 Tickers: ${tickers.join(', ')}`)

  let inFlight = 0
  let idx = 0
  let ok = 0
  let fail = 0

  await new Promise<void>((resolve) => {
    const next = () => {
      while (inFlight < concurrency && idx < tickers.length) {
        const t = tickers[idx++]
        inFlight++
        ;(async () => {
          try {
            console.log(`→ Importing ${t}`)
            await upsertCompany(t)
            ok++
            console.log(`✔ Imported ${t}`)
          } catch (e: any) {
            fail++
            console.warn(`✖ Failed ${t}: ${e.message}`)
          } finally {
            inFlight--
            if (ok + fail === tickers.length) resolve()
            else next()
          }
        })()
      }
    }
    next()
  })

  console.log('\n===== Summary =====')
  console.log(`Success: ${ok}`)
  console.log(`Failed:  ${fail}`)
}

main().then(() => process.exit(0)).catch(err => { console.error('Fatal:', err); process.exit(1) })


