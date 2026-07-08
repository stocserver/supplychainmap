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
import { normalizeCompanyClassification } from "@/lib/data/company-format"

// Map country codes to country names used in the database
const COUNTRY_MAP: Record<string, string[]> = {
    'US': ['US', 'USA', 'United States'],
    'CN': ['CN', 'China'],
    'JP': ['JP', 'Japan'],
    'TW': ['TW', 'Taiwan'],
    'KR': ['KR', 'South Korea'],
    'IN': ['IN', 'India'],
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
    industry_slug?: string
    logo_url?: string
    value_chain_tags?: string[]
    product_tags?: string[]
    data?: any
}

interface CompaniesClientProps {
    initialCompanies: Company[]
    initialIndustries: DbIndustry[]
    initialMapping: MappingRow[]
    availableIndustries: string[]
    country?: string
}

export function CompaniesClient({ initialCompanies, initialIndustries, initialMapping, availableIndustries, country = 'US' }: CompaniesClientProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedIndustry, setSelectedIndustry] = useState("all")
    const companiesFromDb = initialCompanies // All data pre-loaded from server
    const [isLoading, setIsLoading] = useState(false)
    const loadingRef = useRef(false)
    const [searchResults, setSearchResults] = useState<Company[] | null>(null)
    const searchTimer = useRef<number | null>(null)

    // Map each ticker to its industry info
    const tickerToIndustry = useMemo(() => {
        const local = new Map<string, Industry>()

        // 1. Create a lookup for all known industry metadata (DB + Local)
        const industryMetadata = new Map<string, Industry>()

        // Add DB industries
        for (const i of initialIndustries) {
            industryMetadata.set(i.slug, { id: i.slug, name: i.name, slug: i.slug, description: i.description, color: i.color, icon: i.icon })
        }
        // Add Local industries (fallback for metadata)
        for (const i of localIndustries as any[]) {
            if (!industryMetadata.has(i.slug)) {
                industryMetadata.set(i.slug, i)
            }
        }

        // 2. Map companies to industries
        // Prioritize: 1. DB Mapping (Featured), 2. Company `industry` column, 3. Local Featured
        const sourceCompanies = searchResults ?? companiesFromDb
        for (const c of sourceCompanies) {
            if (c.industry) {
                const meta = industryMetadata.get(c.industry)
                // If we have metadata, use it. If not, create a shell.
                if (meta) {
                    local.set(c.ticker, meta)
                } else {
                    // Create provisional metadata for industries without a definition in 'industries' table yet
                    local.set(c.ticker, {
                        id: c.industry,
                        slug: c.industry,
                        name: c.industry.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
                        description: '',
                        color: '#cbd5e1',
                        icon: 'PieChart'
                    })
                }
            }
        }

        // Apply manual mappings from DB if not already set (though company.industry should be source of truth now)
        if (initialIndustries.length > 0 && initialMapping.length > 0) {
            const idToInd = new Map<string, Industry>()
            for (const i of initialIndustries) {
                idToInd.set(i.id, { id: i.slug, name: i.name, slug: i.slug, description: i.description, color: i.color, icon: i.icon })
            }
            for (const row of initialMapping) {
                const ind = idToInd.get(row.industry_id)
                if (ind && !local.has(row.ticker)) local.set(row.ticker, ind)
            }
        }

        return local
    }, [initialIndustries, initialMapping, companiesFromDb, searchResults])

    // Client-side pagination - all data is pre-loaded from server
    const BATCH_SIZE = 40
    const [displayCount, setDisplayCount] = useState(BATCH_SIZE)

    useEffect(() => {
        function onScroll() {
            if (loadingRef.current) return
            const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
            if (!nearBottom) return

            loadingRef.current = true
            setIsLoading(true)

            // Simply increase display count - data is already loaded
            setTimeout(() => {
                setDisplayCount(prev => prev + BATCH_SIZE)
                loadingRef.current = false
                setIsLoading(false)
            }, 100) // Small delay for UX
        }

        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

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
                .select('ticker, name, market_cap, industry, industry_slug, country, logo_url, value_chain_tags, product_tags, data')
                .or(`ticker.ilike.${term},name.ilike.${term}`)

            // Apply country filter for non-US regions
            if (country !== 'US') {
                const countryFilter = COUNTRY_MAP[country] || COUNTRY_MAP['US']
                query = query.in('country', countryFilter)
            }

            const { data } = await query
                .order('market_cap', { ascending: false, nullsFirst: false })
                .limit(200)
            setSearchResults((data || []).map((c: any) => normalizeCompanyClassification(c)) as Company[])
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
        const matchesIndustry = (ticker: string) => {
            if (selectedIndustry === 'all') return true
            const ind = tickerToIndustry.get(ticker)
            return ind ? ind.slug === selectedIndustry : false
        }

        const matchesSearch = (ticker: string) => {
            if (!searchTerm || searchResults) return true
            const name = companiesFromDb.find(c => c.ticker === ticker)?.name || ''
            return ticker.toLowerCase().includes(searchTerm.toLowerCase()) || name.toLowerCase().includes(searchTerm.toLowerCase())
        }

        return allCompanies.filter(t => matchesIndustry(t) && matchesSearch(t))
    }, [allCompanies, selectedIndustry, searchTerm, searchResults, tickerToIndustry, companiesFromDb])

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

            {/* Industry Filter Dropdown */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative min-w-[280px]">
                    <select
                        className="w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                    >
                        <option value="all">All Industries ({allCompanies.length})</option>
                        {availableIndustries.map(ind => {
                            const label = ind.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
                            const count = allCompanies.filter(ticker => tickerToIndustry.get(ticker)?.slug === ind).length
                            return (
                                <option key={ind} value={ind}>
                                    {label} ({count})
                                </option>
                            )
                        })}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-50">
                        ▼
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by ticker or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Stats */}
            <div className="mb-6 text-sm text-muted-foreground">
                Showing {Math.min(displayCount, filteredCompanies.length)} of {filteredCompanies.length} companies
            </div>

            {/* View Toggle */}
            <CompaniesViewToggle
                gridView={
                    <>
                        {/* Companies Grid */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredCompanies.slice(0, displayCount).map((ticker) => {
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

                        {displayCount >= filteredCompanies.length && filteredCompanies.length > 0 && null}
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

            {displayCount >= filteredCompanies.length && filteredCompanies.length > 0 && !isLoading && (
                <div className="py-6 text-center text-xs text-muted-foreground">All {filteredCompanies.length} companies loaded</div>
            )}
        </div>
    )
}
