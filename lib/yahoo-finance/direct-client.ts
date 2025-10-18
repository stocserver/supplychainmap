// Financial data client using Financial Modeling Prep API
// Free tier: 250 API calls per day

export interface CompanyQuote {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: number
  volume: number
  exchange: string
}

export interface CompanyProfile {
  ticker: string
  name: string
  sector: string
  industry: string
  description: string
  website: string
  employees: number
  country: string
  marketCap: number
  exchange: string
}

// Financial Modeling Prep API configuration
const FMP_API_KEY = process.env.FMP_API_KEY
const FMP_BASE_URL = 'https://financialmodelingprep.com/stable'

// Helper to build FMP URLs
function getFMPUrl(endpoint: string, params: Record<string, string> = {}): string {
  const queryParams = new URLSearchParams({ ...params, apikey: FMP_API_KEY || '' })
  return `${FMP_BASE_URL}${endpoint}?${queryParams.toString()}`
}

export async function getQuote(ticker: string): Promise<CompanyQuote | null> {
  try {
    // New stable endpoint format
    const url = getFMPUrl('/quote', { symbol: ticker })
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`FMP API error: ${response.status}`)
    }

    const data = await response.json()
    const quote = data[0] // FMP returns an array

    if (!quote) return null

    return {
      ticker: ticker,
      name: quote.name || ticker,
      price: quote.price || 0,
      change: quote.change || 0,
      changePercent: quote.changesPercentage || 0,
      marketCap: quote.marketCap || 0,
      volume: quote.volume || 0,
      exchange: quote.exchange || 'NASDAQ',
    }
  } catch (error) {
    console.error(`Error fetching quote for ${ticker}:`, error)
    return null
  }
}

export async function getCompanyProfile(ticker: string): Promise<CompanyProfile | null> {
  try {
    // New stable endpoint format
    const url = getFMPUrl('/profile', { symbol: ticker })
    
    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error(`FMP API error: ${response.status}`)
    }

    const data = await response.json()
    const profile = data[0] // FMP returns an array

    if (!profile) return null

    return {
      ticker: ticker,
      name: profile.companyName || ticker,
      sector: profile.sector || 'N/A',
      industry: profile.industry || 'N/A',
      description: profile.description || '',
      website: profile.website || '',
      employees: profile.fullTimeEmployees || 0,
      country: profile.country || 'US',
      marketCap: profile.mktCap || 0,
      exchange: profile.exchangeShortName || 'NASDAQ',
    }
  } catch (error) {
    console.error(`Error fetching profile for ${ticker}:`, error)
    return null
  }
}

export async function searchCompanies(query: string): Promise<any[]> {
  try {
    // New stable endpoint format
    const url = getFMPUrl('/search-name', { query: query })
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`FMP API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error('Error searching companies:', error)
    return []
  }
}

export async function getMultipleQuotes(tickers: string[]): Promise<CompanyQuote[]> {
  try {
    const quotes = await Promise.all(
      tickers.map(ticker => getQuote(ticker))
    )
    return quotes.filter((q): q is CompanyQuote => q !== null)
  } catch (error) {
    console.error('Error fetching multiple quotes:', error)
    return []
  }
}

