/**
 * Check sample non-US company data to understand the structure
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

async function checkSamples() {
    console.log('🔍 Checking sample non-US companies...\n')

    // Check companies from various countries
    const countries = ['JP', 'CN', 'HK', 'DE', 'GB', 'FR']

    for (const country of countries) {
        const { data: companies, error } = await supabase
            .from('companies')
            .select('ticker, name, country, market_cap, data')
            .eq('country', country)
            .limit(2)

        if (error) {
            console.error(`Error for ${country}:`, error)
            continue
        }

        console.log(`\n📍 ${country}: ${companies?.length || 0} companies`)

        for (const c of companies || []) {
            console.log(`\n  ${c.ticker}: ${c.name}`)
            console.log(`    Market Cap: $${(c.market_cap / 1e9).toFixed(2)}B`)

            const incomeStmt = c.data?.incomeStatement
            const historicalIncome = c.data?.historicalFinancials?.incomeStatements?.[0]

            console.log(`    originalCurrency: ${c.data?.originalCurrency || 'NOT SET'}`)
            console.log(`    convertedToUSD: ${c.data?.convertedToUSD || 'NOT SET'}`)
            console.log(`    profile.currency: ${c.data?.profile?.currency || 'NOT SET'}`)

            if (incomeStmt) {
                console.log(`    Income Statement:`)
                console.log(`      Revenue: ${incomeStmt.revenue ? `$${(incomeStmt.revenue / 1e9).toFixed(2)}B` : 'N/A'}`)
                console.log(`      Net Income: ${incomeStmt.netIncome ? `$${(incomeStmt.netIncome / 1e9).toFixed(2)}B` : 'N/A'}`)
                console.log(`      reportedCurrency: ${incomeStmt.reportedCurrency || 'NOT SET'}`)
            } else {
                console.log(`    Income Statement: NOT SET`)
            }

            if (historicalIncome) {
                console.log(`    Historical Income [0]:`)
                console.log(`      Revenue: ${historicalIncome.revenue ? `$${(historicalIncome.revenue / 1e9).toFixed(2)}B` : 'N/A'}`)
                console.log(`      reportedCurrency: ${historicalIncome.reportedCurrency || 'NOT SET'}`)
            }
        }
    }
}

checkSamples()
    .then(() => {
        console.log('\n✨ Done!')
        process.exit(0)
    })
    .catch(err => {
        console.error('\n💥 Fatal error:', err)
        process.exit(1)
    })
