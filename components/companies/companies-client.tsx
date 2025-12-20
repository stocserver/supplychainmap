"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CompanyCard } from "@/components/companies/company-card"
import { CompaniesViewToggle } from "@/components/companies/CompaniesViewToggle"
import { VisualMap } from "@/components/industries/VisualMap"
import { supabase } from "@/lib/supabase/client"
import { industries as localIndustries, type Industry } from "@/lib/data/industries"

// Map country codes to country names used in the database
const COUNTRY_MAP: Record<string, string[]> = {
    'US': ['US', 'USA', 'United States'],
    'CN': ['CN', 'China'],
    'JP': ['JP', 'Japan'],
    'EU': ['DE', 'FR', 'GB', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PL', 'CZ', 'PT', 'GR', 'HU', 'RO'],
}

interface DbIndustry {
    id: string
    name: string
    slug: string
    description: string
    color: string
    icon: string
}

interface MappingRow {
    industry_id: string
    ticker: string
    position_order: number
}

interface Company {
    ticker: string
    name: string
    market_cap: number
    industry?: string
    logo_url?: string
    data?: any
}

interface CompaniesClientProps {
    initialCompanies: Company[]
    initialIndustries: DbIndustry[]
    initialMapping: MappingRow[]
    country?: string
}

export function CompaniesClient({ initialCompanies, initialIndustries, initialMapping, country = 'US' }: CompaniesClientProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [category, setCategory] = useState("all")
    const [companiesFromDb, setCompaniesFromDb] = useState<Company[]>(initialCompanies)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const loadingRef = useRef(false)
    const [searchResults, setSearchResults] = useState<Company[] | null>(null)
    const searchTimer = useRef<number | null>(null)

    // Map each ticker to its first associated industry
    const tickerToIndustry = useMemo(() => {
        // 1. Try DB mapping first
        if (initialIndustries.length > 0 && initialMapping.length > 0) {
            const idToInd = new Map<string, Industry>()
            for (const i of initialIndustries) {
                idToInd.set(i.id, { id: i.slug, name: i.name, slug: i.slug, description: i.description, color: i.color, icon: i.icon })
            }
            const map = new Map<string, Industry>()
            for (const row of initialMapping) {
                const ind = idToInd.get(row.industry_id)
                if (ind && !map.has(row.ticker)) map.set(row.ticker, ind)
            }
            return map
        }

        // 2. Fallback to local static mapping
        const local = new Map<string, Industry>()
        for (const industry of localIndustries as any[]) {
            for (const t of industry.featured_companies || []) {
                if (!local.has(t)) local.set(t, industry)
            }
        }
        return local
    }, [initialIndustries, initialMapping])

    // High-level category filters - mapped to industry slugs in the database
    const categoryOptions = useMemo(() => [
        { label: "All", value: "all", ids: null as string[] | null },
        { label: "Technology & Innovation", value: "tech", ids: ['semiconductors', 'artificial-intelligence', 'cloud-computing', 'cybersecurity', 'software-saas', 'data-centers', 'telecommunications', 'robotics-automation', 'consumer-electronics'] },
        { label: "Financials", value: "financials", ids: ['banking', 'insurance', 'asset-management', 'fintech'] },
        { label: "Energy & Materials", value: "energy-materials", ids: ['oil-gas', 'mining-materials', 'chemicals', 'solar-energy', 'energy-storage', 'utilities'] },
        { label: "Transportation & Mobility", value: "transport", ids: ['electric-vehicles', 'automotive', 'transportation-logistics', 'aerospace-defense', 'space-technology'] },
        { label: "Healthcare & Life Sciences", value: "healthcare", ids: ['pharmaceuticals', 'biotechnology', 'medical-devices', 'digital-health'] },
        { label: "Consumer & Retail", value: "consumer", ids: ['food-beverage', 'consumer-products', 'retail', 'ecommerce'] },
        { label: "Real Estate & Construction", value: "real-estate", ids: ['real-estate', 'construction-engineering'] },
        { label: "Hospitality & Entertainment", value: "hospitality", ids: ['hospitality', 'media-entertainment'] },
        { label: "Industrial & Manufacturing", value: "industrial", ids: ['agtech', 'heavy-industry', 'wholesale-trading'] },
    ], [])

    // Infinite scroll loader - batch size of 20
    const BATCH_SIZE = 20
    useEffect(() => {
        function onScroll() {
            if (!hasMore || loadingRef.current) return
            const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
            if (!nearBottom) return

            loadingRef.current = true
            setIsLoading(true)
            const from = page * BATCH_SIZE
            const to = from + BATCH_SIZE - 1

                ; (async () => {
                    try {
                        let query = supabase
                            .from('companies')
                            .select('ticker, name, market_cap, industry, country, logo_url, data')
                            .gt('market_cap', 0)

                        // Apply country filter for non-US regions
                        if (country !== 'US') {
                            const countryFilter = COUNTRY_MAP[country] || COUNTRY_MAP['US']
                            query = query.in('country', countryFilter)
                        }

                        const { data, error } = await query
                            .order('market_cap', { ascending: false, nullsFirst: false })
                            .range(from, to)

                        if (!error && data && data.length > 0) {
                            // Filter out duplicates by checking existing tickers
                            setCompaniesFromDb(prev => {
                                const existingTickers = new Set(prev.map(c => c.ticker))
                                const newCompanies = (data as Company[]).filter(c => !existingTickers.has(c.ticker))
                                return [...prev, ...newCompanies]
                            })
                            setPage(prev => prev + 1)
                            setHasMore(data.length === BATCH_SIZE)
                        } else {
                            setHasMore(false)
                        }
                    } finally {
                        loadingRef.current = false
                        setIsLoading(false)
                    }
                })()
        }

        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [page, hasMore, country])

    // Debounced server-side search
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
            let query = supabase
                .from('companies')
                .select('ticker, name, market_cap, industry, country, logo_url, data')
                .or(`ticker.ilike.${term},name.ilike.${term}`)

            // Apply country filter for non-US regions
            if (country !== 'US') {
                const countryFilter = COUNTRY_MAP[country] || COUNTRY_MAP['US']
                query = query.in('country', countryFilter)
            }

            const { data } = await query
                .order('market_cap', { ascending: false, nullsFirst: false })
                .limit(200)
            setSearchResults((data || []) as Company[])
        }, 300)

        return () => { if (searchTimer.current) window.clearTimeout(searchTimer.current) }
    }, [searchTerm, country])

    // All available companies for filtering
    const allCompanies = useMemo(() => {
        const source = searchResults ?? companiesFromDb
        const fromDb = source.map(c => c.ticker)
        if (fromDb.length > 0) return fromDb

        // Only fall back to local static data if we are in US mode
        // Otherwise we show empty state to avoid showing US companies for JP/CN/etc
        if (country === 'US') {
            return Array.from(new Set(Array.from(tickerToIndustry.keys()))).sort()
        }
        return []
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

    // Get companies for VisualMap display
    // VisualMap handles its own data transformation, so we just pass the raw company objects
    const visualMapCompanies = useMemo(() => {
        const source = searchResults ?? companiesFromDb
        return filteredCompanies.map(ticker => {
            const company = source.find(c => c.ticker === ticker)
            return company || null
        }).filter(Boolean)
    }, [filteredCompanies, companiesFromDb, searchResults])

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
                                className={`rounded-full border px-3 py-1.5 transition-colors ${selected
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

            {/* View Toggle */}
            <CompaniesViewToggle
                gridView={
                    <>
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
                                        country={country}
                                    />
                                )
                            })}
                        </div>

                        {filteredCompanies.length === 0 && (
                            <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed">
                                <p className="text-muted-foreground">No companies found matching &quot;{searchTerm}&quot;</p>
                            </div>
                        )}

                        {(!searchResults && !hasMore && companiesFromDb.length > 0) && null}
                    </>
                }
                leaderboardView={
                    <VisualMap
                        companies={visualMapCompanies}
                    />
                }
            />

            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            )}

            {/* End of results message */}
            {(!searchResults && !hasMore && companiesFromDb.length > 0 && !isLoading) && (
                <div className="py-6 text-center text-xs text-muted-foreground">No more results</div>
            )}
        </div>
    )
}
