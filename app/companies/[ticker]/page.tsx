import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building2, TrendingUp, Users, Globe } from "lucide-react"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { supabaseServer } from "@/lib/supabase/server"
import { FinancialStatements } from "@/components/company/FinancialStatements"

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

  return (
    <div className="container py-8">
      {/* Back button */}
      <Link href="/companies">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Button>
      </Link>

      {/* Compact Header */}
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl text-white">
          <Building2 className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {ticker}
            </span>
          </div>
        </div>
      </div>

      {/* Consolidated Tabs */}
      <Tabs defaultValue="financials" className="w-full">
        <TabsList className="w-full flex gap-6 border-b mb-4 bg-transparent">
          <TabsTrigger
            value="overview"
            className="rounded-none bg-transparent px-0 py-3 text-xl md:text-2xl font-semibold text-black/70 border-b-2 border-transparent data-[state=active]:text-black data-[state=active]:border-black"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="fundamentals"
            className="rounded-none bg-transparent px-0 py-3 text-xl md:text-2xl font-semibold text-black/70 border-b-2 border-transparent data-[state=active]:text-black data-[state=active]:border-black"
          >
            Fundamentals
          </TabsTrigger>
          <TabsTrigger
            value="financials"
            className="rounded-none bg-transparent px-0 py-3 text-xl md:text-2xl font-semibold text-black/70 border-b-2 border-transparent data-[state=active]:text-black data-[state=active]:border-black"
          >
            Financials
          </TabsTrigger>
          <TabsTrigger
            value="industry"
            className="rounded-none bg-transparent px-0 py-3 text-xl md:text-2xl font-semibold text-black/70 border-b-2 border-transparent data-[state=active]:text-black data-[state=active]:border-black"
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

