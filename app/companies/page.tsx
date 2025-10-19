'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { industries, type Industry } from "@/lib/data/industries"
import { CompanyCard } from "@/components/companies/company-card"
import { supabase } from "@/lib/supabase/client"

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [companiesFromDb, setCompaniesFromDb] = useState<{ ticker: string, name: string, market_cap: number, industry?: string }[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const loadingRef = useRef(false)
  const [searchResults, setSearchResults] = useState<{ ticker: string, name: string, market_cap: number, industry?: string }[] | null>(null)
  const searchTimer = useRef<number | null>(null)

  // High-level category filters (same groupings as industries page)
  const categoryOptions = [
    { label: "All", value: "all", ids: null as string[] | null },
    { label: "Technology & Innovation", value: "tech", ids: ['semiconductors', 'ai-ml', 'cloud-computing', 'cybersecurity', 'software-saas', 'data-centers', 'telecommunications', 'robotics'] },
    { label: "Financials", value: "financials", ids: ['banking', 'insurance', 'asset-management', 'fintech'] },
    { label: "Energy & Materials", value: "energy-materials", ids: ['oil-gas', 'mining-materials', 'chemicals', 'solar-energy', 'energy-storage', 'utilities'] },
    { label: "Transportation & Mobility", value: "transport", ids: ['electric-vehicles', 'automotive', 'transportation-logistics', 'aerospace', 'space'] },
    { label: "Healthcare & Life Sciences", value: "healthcare", ids: ['pharmaceuticals', 'biotechnology', 'medical-devices', 'digital-health'] },
    { label: "Consumer & Retail", value: "consumer", ids: ['food-beverage', 'consumer-products', 'retail', 'ecommerce'] },
    { label: "Real Estate & Construction", value: "real-estate", ids: ['real-estate', 'construction-engineering'] },
    { label: "Hospitality & Entertainment", value: "hospitality", ids: ['hospitality', 'media-entertainment'] },
    { label: "Agriculture & Industrial", value: "agriculture", ids: ['agtech'] },
  ]

  // Map each ticker to its first associated industry (DB first, fallback to local)
  const [tickerToIndustry, setTickerToIndustry] = useState<Map<string, Industry>>(new Map())
  useEffect(() => {
    let mounted = true
    async function loadInitial() {
      try {
        const { data: companies } = await supabase
          .from('companies')
          .select('ticker, name, market_cap, industry')
          .gt('market_cap', 0)
          .order('market_cap', { ascending: false, nullsFirst: false })
          .range(0, 49)
        if (companies && mounted) {
          setCompaniesFromDb(companies as any[])
          setPage(1)
          setHasMore((companies as any[]).length === 50)
        }

        const { data: inds } = await supabase
          .from('industries')
          .select('id, name, slug, description, color, icon')
        const { data: mapRows } = await supabase
          .from('industry_featured_companies')
          .select('industry_id, ticker, position_order')
        if (inds && mapRows && mounted) {
          const idToInd = new Map<string, Industry>()
          for (const i of inds as any[]) {
            idToInd.set(i.id, { id: i.slug, name: i.name, slug: i.slug, description: i.description, color: i.color, icon: i.icon })
          }
          const map = new Map<string, Industry>()
          for (const row of mapRows as any[]) {
            const ind = idToInd.get(row.industry_id)
            if (ind && !map.has(row.ticker)) map.set(row.ticker, ind)
          }
          setTickerToIndustry(map)
          return
        }
      } catch {}
      // Fallback to local static mapping
      const local = new Map<string, Industry>()
      for (const industry of industries as any[]) {
        for (const t of industry.featured_companies || []) {
          if (!local.has(t)) local.set(t, industry)
        }
      }
      if (mounted) setTickerToIndustry(local)
    }
    loadInitial()
    return () => { mounted = false }
  }, [])

  // Infinite scroll loader
  useEffect(() => {
    function onScroll() {
      if (!hasMore || loadingRef.current) return
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
      if (!nearBottom) return
      loadingRef.current = true
      const from = page * 50
      const to = from + 49
      ;(async () => {
        try {
          const { data, error } = await supabase
            .from('companies')
            .select('ticker, name, market_cap, industry')
            .gt('market_cap', 0)
            .order('market_cap', { ascending: false, nullsFirst: false })
            .range(from, to)
          if (!error && data && data.length > 0) {
            setCompaniesFromDb(prev => [...prev, ...data as any[]])
            setPage(prev => prev + 1)
            setHasMore((data as any[]).length === 50)
          } else {
            setHasMore(false)
          }
        } finally {
          loadingRef.current = false
        }
      })()
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [page, hasMore])

  // Debounced server-side search across entire DB
  useEffect(() => {
    if (searchTimer.current) window.clearTimeout(searchTimer.current)
    if (!searchTerm) {
      setSearchResults(null)
      return
    }
    // Only search when at least 2 chars
    if (searchTerm.trim().length < 2) return
    searchTimer.current = window.setTimeout(async () => {
      const term = `%${searchTerm.trim()}%`
      const { data } = await supabase
        .from('companies')
        .select('ticker, name, market_cap, industry')
        .or(`ticker.ilike.${term},name.ilike.${term}`)
        .order('market_cap', { ascending: false, nullsFirst: false })
        .limit(200)
      setSearchResults((data || []) as any)
    }, 300)
    return () => { if (searchTimer.current) window.clearTimeout(searchTimer.current) }
  }, [searchTerm])

  // All available companies (prefer DB list; fallback to mapping keys)
  const allCompanies = useMemo(() => {
    const source = searchResults ?? companiesFromDb
    const fromDb = source.map(c => c.ticker)
    if (fromDb.length > 0) return fromDb
    return Array.from(new Set(Array.from(tickerToIndustry.keys()))).sort()
  }, [companiesFromDb, searchResults, tickerToIndustry])

  const filteredCompanies = useMemo(() => {
    const selected = categoryOptions.find(c => c.value === category)
    const matchesCategory = (ticker: string) => {
      if (!selected || !selected.ids) return true
      const ind = tickerToIndustry.get(ticker)
      return ind ? selected.ids.includes(ind.id) : false
    }
    const matchesSearch = (ticker: string) => {
      if (!searchTerm || searchResults) return true
      const name = companiesFromDb.find(c => c.ticker === ticker)?.name || ''
      return ticker.toLowerCase().includes(searchTerm.toLowerCase()) || name.toLowerCase().includes(searchTerm.toLowerCase())
    }

    return allCompanies.filter(t => matchesCategory(t) && matchesSearch(t))
  }, [allCompanies, category, searchTerm, searchResults, tickerToIndustry, companiesFromDb, categoryOptions])

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">Companies</h1>
        <p className="text-xl text-muted-foreground">
          Browse and search public companies across all industries
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-4">
        <div className="flex w-full flex-wrap items-center gap-2 text-sm">
          {categoryOptions.map(opt => {
            const selected = category === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(opt.value)}
                className={`rounded-full border px-3 py-1.5 transition-colors ${
                  selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-foreground hover:bg-accent'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ticker symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="mb-6 text-sm text-muted-foreground">
        Showing {filteredCompanies.length} of {allCompanies.length} companies
      </div>

      {/* Companies Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCompanies.map((ticker) => {
          const source = searchResults ?? companiesFromDb
          const company = source.find(c => c.ticker === ticker)
          return (
            <CompanyCard
              key={ticker}
              ticker={ticker}
              name={company?.name}
              marketCap={company?.market_cap}
              industry={tickerToIndustry.get(ticker)}
              labelTextOverride={tickerToIndustry.get(ticker) ? undefined : (company?.industry || undefined)}
            />
          )
        })}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground">No companies found matching &quot;{searchTerm}&quot;</p>
        </div>
      )}
      {(!searchResults && !hasMore && companiesFromDb.length > 0) && (
        <div className="py-6 text-center text-xs text-muted-foreground">No more results</div>
      )}
    </div>
  )
}


