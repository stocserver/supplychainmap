import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  try {
    const { ticker } = params

    if (!ticker) {
      return NextResponse.json(
        { error: 'Ticker symbol is required' },
        { status: 400 }
      )
    }

    // Fetch from Supabase (cached data)
    const { data: company, error } = await supabaseServer
      .from('companies')
      .select('ticker, name, market_cap, data')
      .eq('ticker', ticker.toUpperCase())
      .single()

    if (error || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Return quote data in the format expected by CompanyCard
    const quote = company.data?.quote || {}
    
    return NextResponse.json({
      ticker: company.ticker,
      name: company.name,
      price: quote.price || 0,
      change: quote.change || 0,
      changePercent: quote.changesPercentage || 0,
      marketCap: company.market_cap || quote.marketCap || 0,
      volume: quote.volume || 0,
      exchange: quote.exchange || 'N/A',
    })
  } catch (error) {
    console.error('Error fetching company data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

