import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building2, TrendingUp, Users, Globe } from "lucide-react"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { supabaseServer } from "@/lib/supabase/server"
import { FinancialStatements } from "@/components/company/FinancialStatements"
// Using chip-style TabsList; mobile-specific toggle not needed

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CompanyPage({ params }: { params: { ticker: string } }) {
  const ticker = params.ticker.toUpperCase()

  // Try to fetch from Supabase; if missing, render page with placeholders
  const { data: fetched, error } = await supabaseServer
    .from('companies')
    .select('*')
    .eq('ticker', ticker)
    .maybeSingle()

  const companyData = fetched || null
  

  // Extract data
  const profile = {
    name: companyData?.name || ticker,
    sector: companyData?.sector || 'N/A',
    industry: companyData?.industry || 'N/A',
    exchange: companyData?.exchange || 'N/A',
    marketCap: companyData?.market_cap,
    employees: companyData?.employees,
    country: companyData?.country || 'N/A',
    description: companyData?.description,
    website: companyData?.website,
  }

  const quote = companyData?.data?.quote
  const keyMetrics = companyData?.data?.keyMetrics
  const ratios = companyData?.data?.ratios
  const incomeStatement = companyData?.data?.incomeStatement

  // Calculate P/E ratio if not in quote
  const calculatePE = () => {
    if (quote?.pe) return quote.pe
    if (quote?.price && incomeStatement?.eps && incomeStatement.eps !== 0) {
      return quote.price / incomeStatement.eps
    }
    return null
  }
  const peRatio = calculatePE()

  // Get EPS from quote or income statement
  const eps = quote?.eps || incomeStatement?.eps

  return (
    <div className="container py-8">
      {/* JSON-LD: Company basic schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: profile.name,
            tickerSymbol: ticker,
            url: profile.website || undefined,
            address: undefined,
          }),
        }}
      />
      {/* Back button */}
      <Link href="/companies">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Button>
      </Link>

      {/* Compact Header */}
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl text-white shrink-0">
          <Building2 className="h-8 w-8" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight break-normal">
              {profile.name}
            </h1>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {ticker}
            </span>
          </div>
        </div>
      </div>

      {/* Consolidated Tabs */}
      <Tabs defaultValue="financials" className="w-full">
        {/* Big label tabs (previous web design), responsive sizes */}
        <TabsList className="w-full flex flex-wrap gap-4 sm:gap-6 border-b mb-4 bg-transparent p-0 rounded-none h-auto">
          <TabsTrigger
            value="overview"
            className="rounded-none bg-transparent px-0 py-3 text-base sm:text-xl md:text-2xl font-semibold text-black/70 border-b-2 border-transparent data-[state=active]:text-black data-[state=active]:border-black"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="fundamentals"
            className="rounded-none bg-transparent px-0 py-3 text-base sm:text-xl md:text-2xl font-semibold text-black/70 border-b-2 border-transparent data-[state=active]:text-black data-[state=active]:border-black"
          >
            Fundamentals
          </TabsTrigger>
          <TabsTrigger
            value="financials"
            className="rounded-none bg-transparent px-0 py-3 text-base sm:text-xl md:text-2xl font-semibold text-black/70 border-b-2 border-transparent data-[state=active]:text-black data-[state=active]:border-black"
          >
            Financials
          </TabsTrigger>
          <TabsTrigger
            value="industry"
            className="rounded-none bg-transparent px-0 py-3 text-base sm:text-xl md:text-2xl font-semibold text-black/70 border-b-2 border-transparent data-[state=active]:text-black data-[state=active]:border-black"
          >
            Industry
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>About {profile.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {profile.description || 'No description available.'}
              </p>
              {profile.website && (
                <div className="mt-4">
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Visit Website →
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fundamentals */}
        <TabsContent value="fundamentals">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.marketCap ? formatCurrency(profile.marketCap) : 'N/A'}</div>
                  {quote && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ${quote.price?.toFixed(2)} ({quote.changesPercentage > 0 ? '+' : ''}{quote.changesPercentage?.toFixed(2)}%)
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.employees ? formatNumber(profile.employees) : 'N/A'}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Country</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.country}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Exchange</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.exchange}</div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            {(() => {
              // Check if we have any key metrics data to display
              // Note: FMP key-metrics-ttm uses different field names
              const hasEvToSales = keyMetrics?.evToSalesTTM
              const hasEvToEbitda = keyMetrics?.evToEBITDATTM
              const hasRoe = keyMetrics?.returnOnEquityTTM
              const hasRoa = keyMetrics?.returnOnAssetsTTM
              
              const hasAnyMetrics = peRatio || hasEvToSales || hasEvToEbitda || hasRoe || hasRoa || eps
              
              if (!hasAnyMetrics) return null
              
              return (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics (TTM)</CardTitle>
                    <CardDescription>Trailing Twelve Months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                      {peRatio && (
                        <div>
                          <p className="text-sm text-muted-foreground">P/E Ratio</p>
                          <p className="text-lg font-semibold">{peRatio.toFixed(2)}</p>
                        </div>
                      )}
                      {eps && (
                        <div>
                          <p className="text-sm text-muted-foreground">EPS</p>
                          <p className="text-lg font-semibold">${eps.toFixed(2)}</p>
                        </div>
                      )}
                      {hasEvToSales && (
                        <div>
                          <p className="text-sm text-muted-foreground">EV/Sales</p>
                          <p className="text-lg font-semibold">{keyMetrics.evToSalesTTM.toFixed(2)}</p>
                        </div>
                      )}
                      {hasEvToEbitda && (
                        <div>
                          <p className="text-sm text-muted-foreground">EV/EBITDA</p>
                          <p className="text-lg font-semibold">{keyMetrics.evToEBITDATTM.toFixed(2)}</p>
                        </div>
                      )}
                      {hasRoe && (
                        <div>
                          <p className="text-sm text-muted-foreground">ROE</p>
                          <p className="text-lg font-semibold">{(keyMetrics.returnOnEquityTTM * 100).toFixed(2)}%</p>
                        </div>
                      )}
                      {hasRoa && (
                        <div>
                          <p className="text-sm text-muted-foreground">ROA</p>
                          <p className="text-lg font-semibold">{(keyMetrics.returnOnAssetsTTM * 100).toFixed(2)}%</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })()}

            {/* Financial Ratios */}
            {ratios && (
              <Card>
                <CardHeader>
                  <CardTitle>Financial Ratios (TTM)</CardTitle>
                  <CardDescription>Trailing Twelve Months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(ratios.currentRatioTTM || ratios.quickRatioTTM) && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Liquidity Ratios</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          {ratios.currentRatioTTM && (
                            <div>
                              <p className="text-sm text-muted-foreground">Current Ratio</p>
                              <p className="text-lg font-semibold">{ratios.currentRatioTTM.toFixed(2)}</p>
                            </div>
                          )}
                          {ratios.quickRatioTTM && (
                            <div>
                              <p className="text-sm text-muted-foreground">Quick Ratio</p>
                              <p className="text-lg font-semibold">{ratios.quickRatioTTM.toFixed(2)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {(ratios.grossProfitMarginTTM || ratios.operatingProfitMarginTTM || ratios.netProfitMarginTTM) && (
                      <div className="pt-2 border-t">
                        <h4 className="font-semibold mb-2 text-sm">Profitability Ratios</h4>
                        <div className="grid gap-4 md:grid-cols-3">
                          {ratios.grossProfitMarginTTM && (
                            <div>
                              <p className="text-sm text-muted-foreground">Gross Profit Margin</p>
                              <p className="text-lg font-semibold">{(ratios.grossProfitMarginTTM * 100).toFixed(2)}%</p>
                            </div>
                          )}
                          {ratios.operatingProfitMarginTTM && (
                            <div>
                              <p className="text-sm text-muted-foreground">Operating Margin</p>
                              <p className="text-lg font-semibold">{(ratios.operatingProfitMarginTTM * 100).toFixed(2)}%</p>
                            </div>
                          )}
                          {ratios.netProfitMarginTTM && (
                            <div>
                              <p className="text-sm text-muted-foreground">Net Profit Margin</p>
                              <p className="text-lg font-semibold">{(ratios.netProfitMarginTTM * 100).toFixed(2)}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Financials */}
        <TabsContent value="financials">
          <FinancialStatements data={companyData} />
        </TabsContent>

        {/* Industry */}
        <TabsContent value="industry">
          <Card>
            <CardHeader>
              <CardTitle>Industry Classification</CardTitle>
              <CardDescription>Sector and industry categorization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm font-medium">Sector</p>
                  <p className="text-lg text-muted-foreground">{profile.sector}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium">Industry</p>
                  <p className="text-lg text-muted-foreground">{profile.industry}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { ticker: string } }): Promise<Metadata> {
  const ticker = params.ticker.toUpperCase()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const title = `${ticker} | Company Overview`
  const description = `Key fundamentals, financials, and value chain context for ${ticker}.`
  const url = `${siteUrl}/companies/${ticker}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-default.png`,
          width: 1200,
          height: 630,
          alt: "StockOtters Supply Chain Map",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/og-default.png`],
    },
  }
}
