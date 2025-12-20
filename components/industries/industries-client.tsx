"use client"

import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CompanyCard } from "@/components/companies/company-card"
import { BarChart3, Layers } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import type { ProductCategory, ValueChainStageProducts } from "@/lib/data/industries"
import { getRegionallyContextualizedStages } from "@/lib/data/industries"
import { semiconductorProductStages } from "@/lib/industries/semiconductors.products"
import { cloudProductStages } from "@/lib/industries/cloud-computing.products"
import { dataCenterProductStages } from "@/lib/industries/data-centers.products"
import { cyberProductStages } from "@/lib/industries/cybersecurity.products"
import { softwareSaaSProductStages } from "@/lib/industries/software-saas.products"
import { evProductStages } from "@/lib/industries/electric-vehicles.products"
import { solarProductStages } from "@/lib/industries/solar-energy.products"
import { energyStorageProductStages } from "@/lib/industries/energy-storage.products"
import { pharmaceuticalProductStages } from "@/lib/industries/pharmaceuticals.products"
import { bankingProductStages } from "@/lib/industries/banking.products"
import { oilGasProductStages } from "@/lib/industries/oil-gas.products"
import { automotiveProductStages } from "@/lib/industries/automotive.products"
import { retailProductStages } from "@/lib/industries/retail.products"
import { telecommunicationsProductStages } from "@/lib/industries/telecommunications.products"
import { aerospaceProductStages } from "@/lib/industries/aerospace-defense.products"
import { biotechnologyProductStages } from "@/lib/industries/biotechnology.products"
import { insuranceProductStages } from "@/lib/industries/insurance.products"
import { mediaEntertainmentProductStages } from "@/lib/industries/media-entertainment.products"
import { utilitiesProductStages } from "@/lib/industries/utilities.products"
import { fintechProductStages } from "@/lib/industries/fintech.products"
import { medicalDevicesProductStages } from "@/lib/industries/medical-devices.products"
import { ecommerceProductStages } from "@/lib/industries/ecommerce.products"
import { realEstateProductStages } from "@/lib/industries/real-estate.products"
import { assetManagementProductStages } from "@/lib/industries/asset-management.products"
import { chemicalsProductStages } from "@/lib/industries/chemicals.products"
import { foodBeverageProductStages } from "@/lib/industries/food-beverage.products"
import { artificialIntelligenceProductStages } from "@/lib/industries/artificial-intelligence.products"
import { roboticsAutomationProductStages } from "@/lib/industries/robotics-automation.products"
import { transportationLogisticsProductStages } from "@/lib/industries/transportation-logistics.products"
import { spaceTechnologyProductStages } from "@/lib/industries/space-technology.products"
import { digitalHealthProductStages } from "@/lib/industries/digital-health.products"
import { miningMaterialsProductStages } from "@/lib/industries/mining-materials.products"
import { consumerProductsProductStages } from "@/lib/industries/consumer-products.products"
import { hospitalityProductStages } from "@/lib/industries/hospitality.products"
import { constructionEngineeringProductStages } from "@/lib/industries/construction-engineering.products"
import { agtechProductStages } from "@/lib/industries/agtech.products"
import { heavyIndustryProducts } from "@/lib/industries/heavy-industry.products"
import { consumerElectronicsProducts } from "@/lib/industries/consumer-electronics.products"
import { wholesaleTradingProducts } from "@/lib/industries/wholesale-trading.products"

export interface DbIndustry {
    name: string
    slug: string
    description: string
    color: string
    icon: string
    category?: string | null
}

interface IndustriesClientProps {
    initialIndustries: DbIndustry[]
    country?: string
    companyCounts?: Record<string, number>
    companies?: any[] // Loaded from server
}

export function IndustriesClient({ initialIndustries, country = 'US', companyCounts, companies = [] }: IndustriesClientProps) {
    console.log(`[IndustriesClient] Received ${companies?.length} companies for country ${country}`)
    // Category filters mapped to the previous groupings
    const categoryOptions = useMemo(() => [
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
    ], [])

    const [category, setCategory] = useState("all")
    const [industriesList] = useState<DbIndustry[]>(initialIndustries)

    type HoverState = {
        id: string
        slug: string
        name: string
        stages: ValueChainStageProducts[]
        left: number
        top?: number
        bottom?: number
        width: number
        maxHeight: number
    } | null
    const [hovered, setHovered] = useState<HoverState>(null)
    const hideTimer = useRef<number | null>(null)

    const aliasBySlug = useMemo(() => ({
        'aerospace-defense': 'aerospace',
        'space-technology': 'space',
        'artificial-intelligence': 'ai-ml',
        'robotics-automation': 'robotics',
    }), [])

    // Calculate rich counts (including cross-industry tags) for all industries
    // This allows the card badge to match the popup "Total Companies" count
    const richCounts = useMemo(() => {
        const counts: Record<string, number> = {}
        if (!companies) return counts

        industriesList.forEach(ind => {
            const stages = getContextualizedStagesForSlug(ind.slug)
            if (stages) {
                // Collect all unique companies across all stages
                const unique = new Set<string>()
                stages.forEach(s => {
                    s.products.forEach(p => {
                        const { all } = collectCompanies(p) as any
                        if (all) {
                            all.forEach((c: any) => {
                                if (c.ticker) unique.add(c.ticker)
                                else if (c.name) unique.add(c.name)
                            })
                        }
                    })
                })
                counts[ind.slug] = unique.size
            }
        })
        return counts
    }, [industriesList, companies, category])

    const filtered = useMemo(() => {
        const selected = categoryOptions.find(c => c.value === category)
        const inSelected = (slug: string, category?: string | null) => {
            if (!selected?.ids) return true
            // Prefer DB category when present
            if (category) return selected.value === 'all' || selected.value === category
            return selected.ids.includes(slug) || (slug in aliasBySlug && selected.ids.includes(aliasBySlug[slug as keyof typeof aliasBySlug]))
        }
        return industriesList
            .filter(i => inSelected(i.slug, i.category) && richCounts[i.slug] > 0)
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [category, industriesList, categoryOptions, aliasBySlug, richCounts])

    function getStagesForSlug(slug: string): ValueChainStageProducts[] | null {
        switch (slug) {
            case 'semiconductors': return semiconductorProductStages
            case 'cloud-computing': return cloudProductStages
            case 'data-centers': return dataCenterProductStages
            case 'cybersecurity': return cyberProductStages
            case 'software-saas': return softwareSaaSProductStages
            case 'electric-vehicles': return evProductStages
            case 'solar-energy': return solarProductStages
            case 'energy-storage': return energyStorageProductStages
            case 'pharmaceuticals': return pharmaceuticalProductStages
            case 'banking': return bankingProductStages
            case 'oil-gas': return oilGasProductStages
            case 'automotive': return automotiveProductStages
            case 'retail': return retailProductStages
            case 'telecommunications': return telecommunicationsProductStages
            case 'aerospace':
            case 'aerospace-defense': return aerospaceProductStages
            case 'biotechnology': return biotechnologyProductStages
            case 'insurance': return insuranceProductStages
            case 'media-entertainment': return mediaEntertainmentProductStages
            case 'utilities': return utilitiesProductStages
            case 'fintech': return fintechProductStages
            case 'medical-devices': return medicalDevicesProductStages
            case 'ecommerce': return ecommerceProductStages
            case 'real-estate': return realEstateProductStages
            case 'asset-management': return assetManagementProductStages
            case 'chemicals': return chemicalsProductStages
            case 'food-beverage': return foodBeverageProductStages
            case 'artificial-intelligence':
            case 'ai-ml': return artificialIntelligenceProductStages
            case 'robotics-automation':
            case 'robotics': return roboticsAutomationProductStages
            case 'transportation-logistics': return transportationLogisticsProductStages
            case 'space-technology':
            case 'space': return spaceTechnologyProductStages
            case 'digital-health': return digitalHealthProductStages
            case 'mining-materials': return miningMaterialsProductStages
            case 'consumer-products': return consumerProductsProductStages
            case 'hospitality': return hospitalityProductStages
            case 'construction-engineering': return constructionEngineeringProductStages
            case 'agtech': return agtechProductStages
            case 'heavy-industry': return heavyIndustryProducts
            case 'consumer-electronics': return consumerElectronicsProducts
            case 'wholesale-trading': return wholesaleTradingProducts
            default: return null
        }
    }

    // Wrapper that applies region contextualization
    function getContextualizedStagesForSlug(slug: string): ValueChainStageProducts[] | null {
        const raw = getStagesForSlug(slug)
        if (!raw) return null

        // Find relevant companies for this industry
        // Handle aliases if needed (e.g. 'semiconductors' in DB might map to 'semiconductors' slug)
        // Ideally DB industry column matches the manual slug taxonomy exactly.
        // Pass ALL companies so that companies from other industries (e.g. "Software") 
        // can appear here if they have matching tags (e.g. "ai-software").
        // The filtering happens inside getRegionallyContextualizedStages via tag matching.
        const dynamicCompanies = companies

        // console.log(`[IndustriesClient] Slug: ${slug}, Matches: ${dynamicCompanies?.length}`)

        // Transform to expected format: { ticker, name, tags, country }
        const formattedCompanies = dynamicCompanies?.map(c => ({
            ticker: c.ticker,
            name: c.name,
            tags: c.value_chain_tags || [],
            country: c.country,
            industry: c.industry, // Pass industry for filtering orphans
            marketCap: c.market_cap,
            logoUrl: c.logo_url
        }))

        const contextualized = getRegionallyContextualizedStages(raw, slug, country, formattedCompanies)

        // Find orphans (companies that didn't get mapped to any product)
        if (formattedCompanies && formattedCompanies.length > 0) {
            const mappedTickers = new Set<string>()

            // Helper to collect mapped tickers
            const collectMapped = (products: ProductCategory[]) => {
                products.forEach(p => {
                    const companies = (p as any).companiesDetailed || []
                    companies.forEach((c: any) => {
                        if (c.ticker) mappedTickers.add(c.ticker)
                    })
                    if (p.subProducts) collectMapped(p.subProducts)
                })
            }

            contextualized.forEach(stage => collectMapped(stage.products))

            // Only consider orphans if they PRIMARILY belong to this industry
            // (Exclude companies from other industries that simply didn't match a tag here)
            const orphans = formattedCompanies.filter(c => !mappedTickers.has(c.ticker) && c.industry === slug)

            if (orphans.length > 0) {
                // Determine where to put them. 
                // Option A: Specific "General" category in the first stage?
                // Option B: A new stage "Uncategorized"?

                // Let's go with Option A: Add to first stage as "General / Uncategorized"
                if (contextualized.length > 0) {
                    const firstStage = contextualized[0]

                    // Check if a General bucket already exists to avoid duplication if run multiple times (though likely fresh copy)
                    const generalId = `${slug}-general`
                    const existing = firstStage.products.find(p => p.id === generalId)

                    if (!existing) {
                        firstStage.products.push({
                            id: generalId,
                            name: "General / Uncategorized",
                            description: "Companies not yet categorized into specific segments",
                            companiesDetailed: orphans.map(c => ({
                                name: c.name,
                                ticker: c.ticker,
                                listing: c.country === 'US' ? 'US' : 'Foreign',
                                country: c.country
                            })),
                            companies: orphans.map(c => c.ticker), // Legacy
                            subProducts: []
                        } as any)
                    }
                }
            }
        }

        return contextualized
    }

    function collectCompanies(product?: ProductCategory): { count: number } {
        if (!product) return { count: 0 }
        const direct = (product as any).companiesDetailed || []
        const child = ((product as any).subProducts || []).flatMap((sp: ProductCategory) => (collectCompanies(sp) as any).all || [])
        const all = [...direct, ...child]
        const seen = new Set<string>()
        for (const c of all) {
            const key = c.ticker ? `t:${c.ticker}` : `n:${c.name}`
            seen.add(key)
        }
        return { count: seen.size, ...({ all } as any) }
    }




    function openPreviewAtTile(e: React.MouseEvent<HTMLDivElement>, slug: string, name: string) {
        cancelHide()
        const stages = getContextualizedStagesForSlug(slug)
        if (!stages) return
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const margin = 8
        const desiredWidth = Math.min(1000, viewportWidth - 2 * margin)
        const center = rect.left + rect.width / 2
        const unclampedLeft = center - desiredWidth / 2
        const left = Math.max(margin, Math.min(unclampedLeft, viewportWidth - desiredWidth - margin))
        const spaceBelow = viewportHeight - rect.bottom - margin
        const spaceAbove = rect.top - margin
        const placeBelow = spaceBelow >= Math.min(380, spaceAbove)
        if (placeBelow) {
            const top = rect.bottom + margin
            const maxHeight = Math.max(200, viewportHeight - top - margin)
            setHovered({ id: slug, slug, name, stages, left, top, width: desiredWidth, maxHeight })
        } else {
            const bottom = viewportHeight - rect.top + margin
            const maxHeight = Math.max(200, viewportHeight - bottom - margin)
            setHovered({ id: slug, slug, name, stages, left, bottom, width: desiredWidth, maxHeight })
        }
    }

    function scheduleHide() {
        if (hideTimer.current) window.clearTimeout(hideTimer.current)
        hideTimer.current = window.setTimeout(() => setHovered(null), 350)
    }

    function cancelHide() {
        if (hideTimer.current) {
            window.clearTimeout(hideTimer.current)
            hideTimer.current = null
        }
    }

    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobilePreview, setMobilePreview] = useState<{ slug: string; name: string; stages: ValueChainStageProducts[] } | null>(null)

    // Product popup state - shows company cards when clicking on a product
    const [productOpen, setProductOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<{
        name: string
        description?: string
        companies: any[]
        industrySlug: string
    } | null>(null)

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

    function openMobilePreview(slug: string, name: string) {
        const stages = getContextualizedStagesForSlug(slug)
        if (!stages) return
        setMobilePreview({ slug, name, stages })
        setMobileOpen(true)
    }

    // Open product popup with company cards
    function openProductPopup(product: ProductCategory, industrySlug: string) {
        const companiesList = (collectCompanies(product) as any).all || []
        setSelectedProduct({
            name: product.name,
            description: (product as any).description,
            companies: companiesList,
            industrySlug
        })
        setProductOpen(true)
        // Close hover popup when product popup opens
        setHovered(null)
    }

    return (
        <div className="container py-6">
            <div className="mb-4">
                <h1 className="mb-2 text-3xl font-bold">Industry Value Chains</h1>
                <p className="text-sm text-muted-foreground">
                    Tracking <span className="font-medium text-foreground">{companies?.length || 0}</span> companies across major sectors. Use category filters to narrow results.
                </p>
            </div>

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

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
                {filtered.map((industry) => (
                    <div
                        key={industry.slug}
                        className="group relative"
                        onMouseEnter={(e) => !isMobile && openPreviewAtTile(e as unknown as React.MouseEvent<HTMLDivElement>, industry.slug, industry.name)}
                        onMouseLeave={() => !isMobile && scheduleHide()}
                        onClick={() => isMobile && openMobilePreview(industry.slug, industry.name)}
                    >
                        <div tabIndex={0} className="flex h-28 flex-col items-center justify-center rounded-md border bg-card transition-all duration-200 ease-out hover:bg-accent group-hover:bg-accent focus:outline-none hover:shadow-md group-hover:shadow-md hover:scale-[1.02] group-hover:scale-[1.02]">
                            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-md ${industry.color} text-lg text-white`}>
                                {industry.icon}
                            </div>
                            <div className="line-clamp-1 px-2 text-center text-xs font-medium">
                                {industry.name}
                            </div>
                            {richCounts && richCounts[industry.slug] ? (
                                <div className="mt-1 text-[10px] text-muted-foreground">
                                    {richCounts[industry.slug]} Companies
                                </div>
                            ) : null}
                        </div>
                        <Link href={`/industries/${industry.slug}${country !== 'US' ? `?country=${country}` : ''}`} aria-label={`Open ${industry.name}`} className="absolute inset-0 hidden md:block" />
                    </div>
                ))}
            </div>

            {hovered && !isMobile && (
                <div
                    className="fixed z-[60] overflow-y-auto rounded-lg border bg-popover p-4 text-popover-foreground shadow-xl"
                    style={{ left: hovered.left, top: hovered.top, bottom: hovered.bottom, width: hovered.width, maxHeight: hovered.maxHeight }}
                    onMouseEnter={cancelHide}
                    onMouseLeave={scheduleHide}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">{hovered.name} Product Value Chain</p>
                            {richCounts && richCounts[hovered.slug] ? (
                                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                                    {richCounts[hovered.slug]} Co.
                                </span>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/industries/${hovered.slug}?view=visual${country !== 'US' ? `&country=${country}` : ''}`}
                                className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                            >
                                <BarChart3 className="h-3 w-3" />
                                Leaderboard
                            </Link>
                            <Link
                                href={`/industries/${hovered.slug}?view=value-chain${country !== 'US' ? `&country=${country}` : ''}`}
                                className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                            >
                                <Layers className="h-3 w-3" />
                                Value Chain
                            </Link>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {hovered.stages.map((stage) => {
                            // Filter products that have companies
                            const visibleProducts = stage.products.filter(p => collectCompanies(p).count > 0)
                            if (visibleProducts.length === 0) return null

                            const color = stage.stage === 'upstream'
                                ? { header: 'text-blue-700', border: 'border-blue-200', bg: 'from-blue-50 to-blue-100' }
                                : stage.stage === 'midstream'
                                    ? { header: 'text-purple-700', border: 'border-purple-200', bg: 'from-purple-50 to-purple-100' }
                                    : { header: 'text-green-700', border: 'border-green-200', bg: 'from-green-50 to-green-100' }
                            return (
                                <div key={stage.stage} className={`flex min-w-[300px] flex-col gap-3 rounded-xl border ${color.border} bg-gradient-to-b ${color.bg} p-3`}>
                                    <h3 className={`text-center text-xs font-semibold ${color.header}`}>{stage.stageLabel}</h3>
                                    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
                                        {visibleProducts.map((p: ProductCategory) => {
                                            // Logic to find "Other" companies (in Parent but NOT in any displayed Child)
                                            // Start unmapped calculation
                                            const direct = (p as any).companiesDetailed || []
                                            const subProducts = (p as any).subProducts || []

                                            let unmappedCount = 0
                                            if (direct.length > 0 && subProducts.length > 0) {
                                                const childTickers = new Set<string>()
                                                subProducts.forEach((sp: ProductCategory) => {
                                                    const spAll = (collectCompanies(sp) as any).all || []
                                                    spAll.forEach((c: any) => {
                                                        if (c.ticker) childTickers.add(c.ticker)
                                                    })
                                                })
                                                // items in direct that are NOT in childTickers
                                                const unmapped = direct.filter((c: any) => !c.ticker || !childTickers.has(c.ticker))
                                                unmappedCount = unmapped.length
                                            }
                                            // End unmapped calculation

                                            return (
                                                <div key={p.id} className="rounded-xl border bg-white p-3 shadow-sm">
                                                    <div
                                                        onClick={() => openProductPopup(p, hovered.slug)}
                                                        className="flex items-start justify-between gap-2 cursor-pointer hover:opacity-80"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium break-words">{p.name}</p>
                                                        </div>
                                                        <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{collectCompanies(p).count}</span>
                                                    </div>

                                                    {((p as any).subProducts && (p as any).subProducts.length > 0) || unmappedCount > 0 ? (
                                                        <div className="mt-2 grid gap-1">
                                                            {(p as any).subProducts?.slice(0, 3).map((sp: ProductCategory) => {
                                                                if (collectCompanies(sp).count === 0) return null
                                                                return (
                                                                    <div key={sp.id} onClick={() => openProductPopup(sp, hovered.slug)} className="flex items-start justify-between gap-2 rounded-lg border bg-white px-2 py-1 text-[12px] cursor-pointer hover:bg-muted/40" title={(sp as any).description}>
                                                                        <span className="break-words min-w-0 flex-1 whitespace-normal">{sp.name}</span>
                                                                        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{collectCompanies(sp).count}</span>
                                                                    </div>
                                                                )
                                                            })}

                                                            {/* Dynamic "Other" button */}
                                                            {unmappedCount > 0 && (
                                                                <div onClick={() => {
                                                                    const unmappedProduct = { id: p.id + '-other', name: `Other ${p.name}`, description: `Uncategorized companies in ${p.name}`, companiesDetailed: direct.filter((c: any) => !c.ticker || !(new Set(subProducts.flatMap((sp: any) => (collectCompanies(sp) as any).all?.map((x: any) => x.ticker) || []))).has(c.ticker)) } as any
                                                                    openProductPopup(unmappedProduct, hovered.slug)
                                                                }} className="flex items-start justify-between gap-2 rounded-lg border bg-white px-2 py-1 text-[12px] cursor-pointer hover:bg-muted/40 italic text-muted-foreground">
                                                                    <span className="break-words min-w-0 flex-1 whitespace-normal">Other {p.name}</span>
                                                                    <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{unmappedCount}</span>
                                                                </div>
                                                            )}

                                                            {(p as any).subProducts?.length > 3 && (
                                                                <div onClick={() => openProductPopup(p, hovered.slug)} className="rounded-lg border bg-background px-2 py-1 text-[12px] text-muted-foreground cursor-pointer hover:bg-accent">+{(p as any).subProducts.length - 3} more</div>
                                                            )}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                    {mobilePreview && (
                        <>
                            <DialogHeader>
                                <div className="flex flex-col gap-4">
                                    <DialogTitle>{mobilePreview.name} Product Value Chain</DialogTitle>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/industries/${mobilePreview.slug}?view=visual${country !== 'US' ? `&country=${country}` : ''}`}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 active:bg-slate-300 transition-colors"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <BarChart3 className="h-4 w-4" />
                                            Leaderboard
                                        </Link>
                                        <Link
                                            href={`/industries/${mobilePreview.slug}?view=value-chain${country !== 'US' ? `&country=${country}` : ''}`}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 active:bg-slate-300 transition-colors"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <Layers className="h-4 w-4" />
                                            Value Chain
                                        </Link>
                                    </div>
                                </div>
                            </DialogHeader>
                            <div className="mt-2 space-y-3">
                                {mobilePreview.stages.map((stage) => {
                                    // Filter products
                                    const visibleProducts = stage.products.filter(p => collectCompanies(p).count > 0)
                                    if (visibleProducts.length === 0) return null

                                    const color = stage.stage === 'upstream'
                                        ? { header: 'text-blue-700', border: 'border-blue-200', bg: 'from-blue-50 to-blue-100' }
                                        : stage.stage === 'midstream'
                                            ? { header: 'text-purple-700', border: 'border-purple-200', bg: 'from-purple-50 to-purple-100' }
                                            : { header: 'text-green-700', border: 'border-green-200', bg: 'from-green-50 to-green-100' }
                                    return (
                                        <div key={stage.stage} className={`flex w-full flex-col gap-3 rounded-xl border ${color.border} bg-gradient-to-b ${color.bg} p-3`}>
                                            <h3 className={`text-center text-sm font-semibold ${color.header}`}>{stage.stageLabel}</h3>
                                            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
                                                {visibleProducts.map((p: ProductCategory) => (
                                                    <div key={p.id} onClick={() => { setMobileOpen(false); openProductPopup(p, mobilePreview.slug); }} className="flex items-start justify-between gap-2 rounded-xl border bg-white p-3 shadow-sm cursor-pointer hover:bg-muted/40">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium break-words">{p.name}</p>
                                                        </div>
                                                        <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{collectCompanies(p).count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Product Popup - Shows company cards */}
            <Dialog open={productOpen} onOpenChange={setProductOpen}>
                <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto">
                    {selectedProduct && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
                                {selectedProduct.description && (
                                    <DialogDescription className="pt-2 text-base leading-relaxed">
                                        {selectedProduct.description}
                                    </DialogDescription>
                                )}
                            </DialogHeader>
                            <div className="mt-4">
                                {selectedProduct.companies.length > 0 ? (
                                    <div>
                                        <h4 className="mb-3 text-lg font-semibold">Companies ({selectedProduct.companies.length})</h4>
                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {selectedProduct.companies.map((c: any, idx: number) => (
                                                c.ticker ? (
                                                    <CompanyCard
                                                        key={`${c.ticker}-${idx}`}
                                                        ticker={c.ticker}
                                                        name={c.name}
                                                        country={c.country}
                                                        marketCap={c.marketCap}
                                                    />
                                                ) : (
                                                    <Link key={`${c.name}-${idx}`} href={`/companies/${encodeURIComponent(c.name).toUpperCase()}`}>
                                                        <div className="rounded-lg border bg-card p-4 transition-all hover:shadow-md">
                                                            <p className="font-medium">{c.name}</p>
                                                            <p className="text-xs text-muted-foreground">{c.listing}</p>
                                                        </div>
                                                    </Link>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed">
                                        <p className="text-muted-foreground">No companies listed yet</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <div className="mt-2 text-xs text-muted-foreground">{filtered.length} industries</div>
        </div>
    )
}
