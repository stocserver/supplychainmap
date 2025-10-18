// Import all featured companies from FMP to Supabase
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { industries } from '../lib/data/industries'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const FMP_API_KEY = process.env.FMP_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!FMP_API_KEY) {
  console.error('❌ FMP_API_KEY not found in .env.local')
  process.exit(1)
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase credentials not found in .env.local')
  console.log('Please add:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function fetchCompanyData(ticker: string) {
  try {
    // Fetch quote
    const quoteUrl = `https://financialmodelingprep.com/stable/quote?symbol=${ticker}&apikey=${FMP_API_KEY}`
    const quoteResponse = await fetch(quoteUrl)
    
    if (!quoteResponse.ok) {
      throw new Error(`Quote API error: ${quoteResponse.status}`)
    }
    
    const quoteData = await quoteResponse.json()
    const quote = quoteData[0]
    
    if (!quote) {
      throw new Error('No quote data returned')
    }
    
    // Fetch profile
    const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${ticker}&apikey=${FMP_API_KEY}`
    const profileResponse = await fetch(profileUrl)
    
    if (!profileResponse.ok) {
      throw new Error(`Profile API error: ${profileResponse.status}`)
    }
    
    const profileData = await profileResponse.json()
    const profile = profileData[0]
    
    if (!profile) {
      throw new Error('No profile data returned')
    }
    
    return {
      quote,
      profile
    }
  } catch (error: any) {
    throw new Error(`Failed to fetch ${ticker}: ${error.message}`)
  }
}

async function importCompanies() {
  console.log('🚀 Starting company data import to Supabase...\n')
  console.log(`📊 FMP API Key: ${FMP_API_KEY?.substring(0, 10)}...`)
  console.log(`🗄️  Supabase URL: ${SUPABASE_URL}\n`)
  
  // Prefer reading tickers from DB join table; fallback to local industries file
  let allTickers: string[] = []

  try {
    const { data: rows, error } = await supabase
      .from('industry_featured_companies')
      .select('ticker')

    if (error) throw error
    if (rows && rows.length > 0) {
      allTickers = Array.from(new Set(rows.map(r => r.ticker))).sort()
    }
  } catch (e) {
    console.warn('⚠️ Could not load tickers from DB, falling back to local list')
  }

  if (allTickers.length === 0) {
    allTickers = Array.from(
      new Set(
        industries.flatMap(industry => industry.featured_companies || [])
      )
    ).sort()
  }
  
  console.log(`📈 Found ${allTickers.length} unique companies to import\n`)
  console.log('Companies:', allTickers.join(', '))
  console.log('\n' + '='.repeat(80) + '\n')
  
  let successCount = 0
  let errorCount = 0
  const errors: string[] = []
  
  for (let i = 0; i < allTickers.length; i++) {
    const ticker = allTickers[i]
    const progress = `[${i + 1}/${allTickers.length}]`
    
    try {
      console.log(`${progress} Fetching ${ticker}...`)
      
      // Fetch data from FMP
      const { quote, profile } = await fetchCompanyData(ticker)
      
      console.log(`  ✅ Data fetched: ${profile.companyName}`)
      console.log(`     Price: $${quote.price} | Market Cap: $${(quote.marketCap / 1e9).toFixed(2)}B`)
      
      // Store in Supabase
      const { data, error } = await supabase
        .from('companies')
        .upsert({
          ticker: ticker,
          name: profile.companyName || ticker,
          sector: profile.sector || null,
          industry: profile.industry || null,
          description: profile.description || null,
          website: profile.website || null,
          logo_url: profile.image || null,
          country: profile.country || 'US',
          exchange: profile.exchangeShortName || quote.exchange || null,
          market_cap: quote.marketCap || 0,
          employees: profile.fullTimeEmployees || 0,
          data: {
            quote: {
              price: quote.price,
              change: quote.change,
              changesPercentage: quote.changesPercentage,
              volume: quote.volume,
              avgVolume: quote.avgVolume,
              marketCap: quote.marketCap,
              pe: quote.pe,
              eps: quote.eps,
              dayLow: quote.dayLow,
              dayHigh: quote.dayHigh,
              yearLow: quote.yearLow,
              yearHigh: quote.yearHigh,
              sharesOutstanding: quote.sharesOutstanding,
              timestamp: quote.timestamp
            },
            profile: {
              companyName: profile.companyName,
              price: profile.price,
              beta: profile.beta,
              volAvg: profile.volAvg,
              mktCap: profile.mktCap,
              lastDiv: profile.lastDiv,
              range: profile.range,
              changes: profile.changes,
              cik: profile.cik,
              isin: profile.isin,
              cusip: profile.cusip,
              ipoDate: profile.ipoDate,
              defaultImage: profile.defaultImage,
              isEtf: profile.isEtf,
              isActivelyTrading: profile.isActivelyTrading,
              isAdr: profile.isAdr,
              isFund: profile.isFund
            },
            last_updated: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'ticker'
        })
        .select()
      
      if (error) {
        throw new Error(`Supabase error: ${error.message}`)
      }
      
      console.log(`  💾 Stored in Supabase successfully`)
      successCount++
      
      // Rate limiting: wait 1 second between requests to be respectful
      if (i < allTickers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`)
      errorCount++
      errors.push(`${ticker}: ${error.message}`)
    }
    
    console.log('')
  }
  
  // Summary
  console.log('='.repeat(80))
  console.log('\n📊 Import Summary:')
  console.log(`  ✅ Successful: ${successCount}`)
  console.log(`  ❌ Failed: ${errorCount}`)
  console.log(`  📈 Total: ${allTickers.length}`)
  console.log(`  🎯 Success Rate: ${((successCount / allTickers.length) * 100).toFixed(1)}%`)
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:')
    errors.forEach(err => console.log(`  - ${err}`))
  }
  
  // API usage estimate
  const apiCallsUsed = successCount * 2 // 2 calls per company (quote + profile)
  console.log(`\n📡 FMP API Calls Used: ${apiCallsUsed} / 250 daily limit`)
  console.log(`   Remaining today: ${250 - apiCallsUsed}`)
  
  console.log('\n✨ Import completed!')
}

importCompanies()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })


