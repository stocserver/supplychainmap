// Fix Japanese ADR companies - convert JPY to USD in existing data
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// JPY to USD exchange rate
const JPY_TO_USD = 1 / 150

const convertValue = (val: number | null | undefined): number | null => {
    if (val === null || val === undefined) return null
    return Math.round(val * JPY_TO_USD)
}

async function fixCompany(ticker: string, data: any) {
    console.log(`\n🔧 Fixing ${ticker}...`)

    // Deep copy the data
    const newData = JSON.parse(JSON.stringify(data))

    // Convert income statement
    if (newData.incomeStatement) {
        newData.incomeStatement.revenue = convertValue(newData.incomeStatement.revenue)
        newData.incomeStatement.netIncome = convertValue(newData.incomeStatement.netIncome)
        newData.incomeStatement.grossProfit = convertValue(newData.incomeStatement.grossProfit)
        newData.incomeStatement.operatingIncome = convertValue(newData.incomeStatement.operatingIncome)
    }

    // Convert balance sheet
    if (newData.balanceSheet) {
        newData.balanceSheet.totalAssets = convertValue(newData.balanceSheet.totalAssets)
        newData.balanceSheet.totalLiabilities = convertValue(newData.balanceSheet.totalLiabilities)
        newData.balanceSheet.totalEquity = convertValue(newData.balanceSheet.totalEquity)
        newData.balanceSheet.cashAndCashEquivalents = convertValue(newData.balanceSheet.cashAndCashEquivalents)
    }

    // Convert cash flow
    if (newData.cashFlow) {
        newData.cashFlow.operatingCashFlow = convertValue(newData.cashFlow.operatingCashFlow)
        newData.cashFlow.capitalExpenditure = convertValue(newData.cashFlow.capitalExpenditure)
        newData.cashFlow.freeCashFlow = convertValue(newData.cashFlow.freeCashFlow)
    }

    // Convert historical financials
    if (newData.historicalFinancials) {
        if (newData.historicalFinancials.incomeStatements) {
            newData.historicalFinancials.incomeStatements = newData.historicalFinancials.incomeStatements.map((stmt: any) => ({
                ...stmt,
                revenue: convertValue(stmt.revenue),
                netIncome: convertValue(stmt.netIncome),
                grossProfit: convertValue(stmt.grossProfit),
                operatingIncome: convertValue(stmt.operatingIncome),
                costOfRevenue: convertValue(stmt.costOfRevenue),
                ebitda: convertValue(stmt.ebitda),
            }))
        }

        if (newData.historicalFinancials.balanceSheets) {
            newData.historicalFinancials.balanceSheets = newData.historicalFinancials.balanceSheets.map((stmt: any) => ({
                ...stmt,
                totalAssets: convertValue(stmt.totalAssets),
                totalLiabilities: convertValue(stmt.totalLiabilities),
                totalStockholdersEquity: convertValue(stmt.totalStockholdersEquity),
                cashAndCashEquivalents: convertValue(stmt.cashAndCashEquivalents),
            }))
        }

        if (newData.historicalFinancials.cashFlowStatements) {
            newData.historicalFinancials.cashFlowStatements = newData.historicalFinancials.cashFlowStatements.map((stmt: any) => ({
                ...stmt,
                operatingCashFlow: convertValue(stmt.operatingCashFlow),
                capitalExpenditure: convertValue(stmt.capitalExpenditure),
                freeCashFlow: convertValue(stmt.freeCashFlow),
            }))
        }
    }

    // Mark as converted
    newData.originalCurrency = 'JPY'
    newData.exchangeRateUsed = JPY_TO_USD
    newData.conversionNote = 'Converted from JPY ADR data'
    newData.last_updated = new Date().toISOString()

    // Update in database
    const { error } = await supabase
        .from('companies')
        .update({
            data: newData,
            market_cap: convertValue(data.quote?.marketCap) || null,
            updated_at: new Date().toISOString()
        })
        .eq('ticker', ticker)

    if (error) {
        console.log(`   ❌ Error: ${error.message}`)
        return false
    }

    const oldRev = data.incomeStatement?.revenue
    const newRev = newData.incomeStatement?.revenue
    console.log(`   Revenue: $${(oldRev / 1e9).toFixed(1)}B → $${(newRev / 1e9).toFixed(1)}B`)
    return true
}

async function main() {
    console.log('🔧 Fixing Japanese ADR Currency Data\n')

    // Get all JP companies without conversion
    const { data: companies } = await supabase
        .from('companies')
        .select('ticker, name, data')
        .eq('country', 'JP')

    let fixed = 0
    let skipped = 0

    for (const c of companies || []) {
        // Skip already converted
        if (c.data?.originalCurrency === 'JPY') {
            console.log(`⏭️  ${c.ticker} - already converted`)
            skipped++
            continue
        }

        const result = await fixCompany(c.ticker, c.data)
        if (result) fixed++
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✅ Fixed: ${fixed}`)
    console.log(`⏭️  Skipped (already done): ${skipped}`)
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Fatal:', err)
        process.exit(1)
    })
