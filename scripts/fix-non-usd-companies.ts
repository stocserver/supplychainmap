/**
 * Fix Non-USD Company Data
 * 
 * This script:
 * 1. Finds all companies in the database with non-USD currency data
 * 2. Fetches current exchange rates
 * 3. Converts their financial data to USD
 * 4. Updates the database
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing environment variables')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Exchange rates to USD (as of Dec 2024)
// These are approximate rates - for production, fetch live rates
const EXCHANGE_RATES: Record<string, number> = {
    'USD': 1,
    'JPY': 0.0067,   // ~150 JPY = 1 USD
    'EUR': 1.09,
    'GBP': 1.27,
    'CNY': 0.14,     // ~7.1 CNY = 1 USD
    'HKD': 0.13,     // ~7.8 HKD = 1 USD
    'AUD': 0.67,
    'CAD': 0.74,
    'INR': 0.012,
    'TWD': 0.032,
    'KRW': 0.00076,  // ~1315 KRW = 1 USD
    'CHF': 1.13,
    'SEK': 0.095,
    'SGD': 0.74,
    'MXN': 0.058,
    'BRL': 0.20,
    'THB': 0.029,
    'IDR': 0.000064,
    'MYR': 0.22,
    'PHP': 0.018,
    'VND': 0.000041,
    'PLN': 0.25,
    'CZK': 0.044,
    'DKK': 0.15,
    'NOK': 0.094,
    'NZD': 0.62,
    'ZAR': 0.056,
    'RUB': 0.011,
    'TRY': 0.033,
    'ILS': 0.27,
    'SAR': 0.27,
    'AED': 0.27,
    'CLP': 0.0011,
    'COP': 0.00025,
    'PEN': 0.27,
}

const convertToUSD = (value: number | null | undefined, currency: string): number | null => {
    if (value === null || value === undefined) return null
    const rate = EXCHANGE_RATES[currency.toUpperCase()]
    if (!rate) {
        console.warn(`⚠️ Unknown currency: ${currency}, treating as USD`)
        return Math.round(value)
    }
    return Math.round(value * rate)
}

// Convert all financial fields in an object
const convertFinancialObject = (obj: any, currency: string): any => {
    if (!obj || typeof obj !== 'object') return obj

    const financialFields = [
        'revenue', 'netIncome', 'grossProfit', 'operatingIncome', 'costOfRevenue',
        'ebitda', 'totalAssets', 'totalLiabilities', 'totalStockholdersEquity',
        'totalEquity', 'cashAndCashEquivalents', 'totalDebt', 'netDebt',
        'operatingCashFlow', 'capitalExpenditure', 'freeCashFlow', 'dividendsPaid',
        'totalCurrentAssets', 'totalCurrentLiabilities', 'marketCap', 'mktCap'
    ]

    const converted: any = { ...obj }
    for (const field of financialFields) {
        if (typeof obj[field] === 'number') {
            converted[field] = convertToUSD(obj[field], currency)
        }
    }
    return converted
}

// Convert array of financial statements
const convertFinancialArray = (arr: any[], currency: string): any[] => {
    if (!Array.isArray(arr)) return arr
    return arr.map(item => convertFinancialObject(item, currency))
}

async function fixNonUSDCompanies() {
    console.log('🔍 Finding companies with non-USD financial data...\n')

    // Fetch companies in batches to avoid timeout
    const BATCH_SIZE = 100
    let allCompanies: any[] = []
    let offset = 0

    console.log('📥 Fetching companies from database in batches...')

    while (true) {
        const { data: batch, error } = await supabase
            .from('companies')
            .select('ticker, name, country, data, market_cap')
            .order('market_cap', { ascending: false })
            .range(offset, offset + BATCH_SIZE - 1)

        if (error) {
            console.error('❌ Error fetching companies:', error)
            return
        }

        if (!batch || batch.length === 0) {
            break
        }

        allCompanies = [...allCompanies, ...batch]
        console.log(`   Fetched ${allCompanies.length} companies...`)
        offset += BATCH_SIZE

        if (batch.length < BATCH_SIZE) {
            break
        }
    }

    const companies = allCompanies

    if (!companies || companies.length === 0) {
        console.log('No companies found in database')
        return
    }

    console.log(`📊 Total companies in database: ${companies.length}\n`)

    // Find companies with non-USD currency based on historicalFinancials.reportedCurrency
    const nonUSDCompanies = companies.filter(c => {
        // Check the historicalFinancials for reportedCurrency (this is the ground truth)
        const reportedCurrency = c.data?.historicalFinancials?.incomeStatements?.[0]?.reportedCurrency

        if (reportedCurrency && reportedCurrency !== 'USD') {
            return true
        }

        // Also check if already converted
        if (c.data?.convertedToUSD === true) {
            return false // Already processed
        }

        // Check explicit originalCurrency that's been set correctly
        const originalCurrency = c.data?.originalCurrency
        if (originalCurrency && originalCurrency !== 'USD' && !c.data?.convertedToUSD) {
            return true
        }

        return false
    })

    console.log(`🌍 Found ${nonUSDCompanies.length} companies with non-USD reported currency:\n`)

    if (nonUSDCompanies.length === 0) {
        console.log('✅ All companies appear to have USD data or have already been converted!')
        return
    }

    // Group by detected currency
    const byCurrency: Record<string, any[]> = {}
    for (const company of nonUSDCompanies) {
        const currency = detectCurrency(company)
        if (!byCurrency[currency]) byCurrency[currency] = []
        byCurrency[currency].push(company)
    }

    for (const [currency, companies] of Object.entries(byCurrency)) {
        console.log(`\n${currency}: ${companies.length} companies`)
        companies.slice(0, 5).forEach(c => {
            const revenue = c.data?.incomeStatement?.revenue
            console.log(`  - ${c.ticker}: ${c.name} (Revenue: ${revenue ? formatNumber(revenue) : 'N/A'})`)
        })
        if (companies.length > 5) {
            console.log(`  ... and ${companies.length - 5} more`)
        }
    }

    console.log('\n' + '='.repeat(60))
    console.log('\n🔄 Starting conversion...\n')

    let successCount = 0
    let errorCount = 0

    for (const company of nonUSDCompanies) {
        const currency = detectCurrency(company)

        if (currency === 'USD') {
            continue
        }

        const rate = EXCHANGE_RATES[currency]
        if (!rate) {
            console.log(`⚠️ Skipping ${company.ticker}: Unknown currency ${currency}`)
            errorCount++
            continue
        }

        console.log(`🔄 Converting ${company.ticker} (${company.name}) from ${currency} to USD...`)

        try {
            const data = company.data || {}

            // Convert market cap
            const newMarketCap = convertToUSD(company.market_cap, currency)

            // Convert income statement
            const newIncomeStatement = data.incomeStatement
                ? convertFinancialObject(data.incomeStatement, currency)
                : null

            // Convert balance sheet
            const newBalanceSheet = data.balanceSheet
                ? convertFinancialObject(data.balanceSheet, currency)
                : null

            // Convert cash flow
            const newCashFlow = data.cashFlow
                ? convertFinancialObject(data.cashFlow, currency)
                : null

            // Convert historical financials
            const historicalFinancials = data.historicalFinancials || {}
            const newHistoricalFinancials = {
                incomeStatements: convertFinancialArray(historicalFinancials.incomeStatements || [], currency),
                balanceSheets: convertFinancialArray(historicalFinancials.balanceSheets || [], currency),
                cashFlowStatements: convertFinancialArray(historicalFinancials.cashFlowStatements || [], currency),
                incomeStatementsQuarterly: convertFinancialArray(historicalFinancials.incomeStatementsQuarterly || [], currency),
                balanceSheetsQuarterly: convertFinancialArray(historicalFinancials.balanceSheetsQuarterly || [], currency),
                cashFlowStatementsQuarterly: convertFinancialArray(historicalFinancials.cashFlowStatementsQuarterly || [], currency),
            }

            // Build updated data object
            const updatedData = {
                ...data,
                incomeStatement: newIncomeStatement,
                balanceSheet: newBalanceSheet,
                cashFlow: newCashFlow,
                historicalFinancials: newHistoricalFinancials,
                originalCurrency: currency,
                convertedToUSD: true,
                exchangeRateUsed: rate,
                currencyConvertedAt: new Date().toISOString(),
            }

            // Update in database
            const { error: updateError } = await supabase
                .from('companies')
                .update({
                    market_cap: newMarketCap,
                    data: updatedData,
                    updated_at: new Date().toISOString()
                })
                .eq('ticker', company.ticker)

            if (updateError) {
                throw updateError
            }

            const oldRevenue = data.incomeStatement?.revenue
            const newRevenue = newIncomeStatement?.revenue
            console.log(`   ✅ Converted! Revenue: ${formatNumber(oldRevenue)} ${currency} → ${formatNumber(newRevenue)} USD`)
            successCount++

        } catch (err: any) {
            console.error(`   ❌ Error: ${err.message}`)
            errorCount++
        }
    }

    console.log('\n' + '='.repeat(60))
    console.log('\n📊 Conversion Summary:')
    console.log(`   ✅ Successfully converted: ${successCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log(`   📈 Total processed: ${nonUSDCompanies.length}`)
}

function detectCurrency(company: any): string {
    // Check the historicalFinancials first - this is the most reliable source
    const reportedCurrency = company.data?.historicalFinancials?.incomeStatements?.[0]?.reportedCurrency

    if (reportedCurrency) {
        return reportedCurrency.toUpperCase()
    }

    // Check other explicit currency fields
    const explicitCurrency = company.data?.originalCurrency
        || company.data?.profile?.currency
        || company.data?.incomeStatement?.reportedCurrency

    if (explicitCurrency && explicitCurrency !== 'USD') {
        return explicitCurrency.toUpperCase()
    }

    // Infer from country
    const countryToCurrency: Record<string, string> = {
        'JP': 'JPY',
        'CN': 'CNY',
        'HK': 'HKD',
        'KR': 'KRW',
        'TW': 'TWD',
        'IN': 'INR',
        'GB': 'GBP',
        'DE': 'EUR',
        'FR': 'EUR',
        'IT': 'EUR',
        'ES': 'EUR',
        'NL': 'EUR',
        'BE': 'EUR',
        'AT': 'EUR',
        'IE': 'EUR',
        'FI': 'EUR',
        'PT': 'EUR',
        'GR': 'EUR',
        'AU': 'AUD',
        'CA': 'CAD',
        'CH': 'CHF',
        'SE': 'SEK',
        'NO': 'NOK',
        'DK': 'DKK',
        'NZ': 'NZD',
        'SG': 'SGD',
        'BR': 'BRL',
        'MX': 'MXN',
        'ZA': 'ZAR',
        'RU': 'RUB',
        'TR': 'TRY',
        'IL': 'ILS',
        'SA': 'SAR',
        'AE': 'AED',
    }

    const inferredCurrency = countryToCurrency[company.country]
    if (inferredCurrency) {
        return inferredCurrency
    }

    return 'USD' // Default assumption
}

function formatNumber(num: number | null | undefined): string {
    if (num === null || num === undefined) return 'N/A'
    if (Math.abs(num) >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (Math.abs(num) >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (Math.abs(num) >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
}

// Run the script
fixNonUSDCompanies()
    .then(() => {
        console.log('\n✨ Done!')
        process.exit(0)
    })
    .catch(err => {
        console.error('\n💥 Fatal error:', err)
        process.exit(1)
    })
