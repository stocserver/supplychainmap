"use client"

import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useMemo, useRef, useState } from "react"
import type { ProductCategory, ValueChainStageProducts } from "@/lib/data/industries"
import { supabase } from "@/lib/supabase/client"
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
import { aerospaceProductStages } from "@/lib/industries/aerospace.products"
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

type DbIndustry = {
  name: string
  slug: string
  description: string
  color: string
  icon: string
  category?: string | null
}

export default function IndustriesPage() {
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

  const [industriesList, setIndustriesList] = useState<DbIndustry[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const { data, error } = await supabase
          .from('industries')
          .select('name, slug, description, color, icon, category')
        if (!error && data && mounted) {
          setIndustriesList(data as DbIndustry[])
          return
        }
      } catch {}
      // Fallback to local file if needed
      try {
        const { industries } = await import('@/lib/data/industries')
        setIndustriesList(industries.map((i: any) => ({ name: i.name, slug: i.slug, description: i.description, color: i.color, icon: i.icon, category: (i as any).category || null })))
      } catch {}
    }
    load()
    return () => { mounted = false }
  }, [])

  const aliasBySlug = useMemo(() => ({
    'aerospace-defense': 'aerospace',
    'space-technology': 'space',
    'artificial-intelligence': 'ai-ml',
    'robotics-automation': 'robotics',
  }), [])

  const filtered = useMemo(() => {
    const selected = categoryOptions.find(c => c.value === category)
    const inSelected = (slug: string, category?: string | null) => {
      if (!selected?.ids) return true
      // Prefer DB category when present
      if (category) return selected.value === 'all' || selected.value === category
      return selected.ids.includes(slug) || (slug in aliasBySlug && selected.ids.includes(aliasBySlug[slug as keyof typeof aliasBySlug]))
    }
    return industriesList
      .filter(i => inSelected(i.slug, i.category))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [category, industriesList, categoryOptions, aliasBySlug])

  function getStagesForSlug(slug: string): ValueChainStageProducts[] | null {
    switch (slug) {
      case 'semiconductors':
        return semiconductorProductStages
      case 'cloud-computing':
        return cloudProductStages
      case 'data-centers':
        return dataCenterProductStages
      case 'cybersecurity':
        return cyberProductStages
      case 'software-saas':
        return softwareSaaSProductStages
      case 'electric-vehicles':
        return evProductStages
      case 'solar-energy':
        return solarProductStages
      case 'energy-storage':
        return energyStorageProductStages
      case 'pharmaceuticals':
        return pharmaceuticalProductStages
      case 'banking':
        return bankingProductStages
      case 'oil-gas':
        return oilGasProductStages
      case 'automotive':
        return automotiveProductStages
      case 'retail':
        return retailProductStages
      case 'telecommunications':
        return telecommunicationsProductStages
      case 'aerospace':
      case 'aerospace-defense':
        return aerospaceProductStages
      case 'biotechnology':
        return biotechnologyProductStages
      case 'insurance':
        return insuranceProductStages
      case 'media-entertainment':
        return mediaEntertainmentProductStages
      case 'utilities':
        return utilitiesProductStages
      case 'fintech':
        return fintechProductStages
      case 'medical-devices':
        return medicalDevicesProductStages
      case 'ecommerce':
        return ecommerceProductStages
      case 'real-estate':
        return realEstateProductStages
      case 'asset-management':
        return assetManagementProductStages
      case 'chemicals':
        return chemicalsProductStages
      case 'food-beverage':
        return foodBeverageProductStages
      case 'artificial-intelligence':
      case 'ai-ml':
        return artificialIntelligenceProductStages
      case 'robotics-automation':
      case 'robotics':
        return roboticsAutomationProductStages
      case 'transportation-logistics':
        return transportationLogisticsProductStages
      case 'space-technology':
      case 'space':
        return spaceTechnologyProductStages
      case 'digital-health':
        return digitalHealthProductStages
      case 'mining-materials':
        return miningMaterialsProductStages
      case 'consumer-products':
        return consumerProductsProductStages
      case 'hospitality':
        return hospitalityProductStages
      case 'construction-engineering':
        return constructionEngineeringProductStages
      case 'agtech':
        return agtechProductStages
      default:
        return null
    }
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
    return { count: seen.size, ...( { all } as any ) }
  }

  function openPreviewAtTile(e: React.MouseEvent<HTMLDivElement>, slug: string, name: string) {
    // Cancel any pending hide to prevent flicker when moving between tiles
    cancelHide()
    const stages = getStagesForSlug(slug)
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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  function openMobilePreview(slug: string, name: string) {
    const stages = getStagesForSlug(slug)
    if (!stages) return
    setMobilePreview({ slug, name, stages })
    setMobileOpen(true)
  }

  return (
    <div className="container py-6">
      <div className="mb-4">
        <h1 className="mb-2 text-3xl font-bold">Industry Value Chains</h1>
        <p className="text-sm text-muted-foreground">
          Use category filters to narrow results. Compact tiles keep everything visible.
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

      {/* Compact grid with hover preview of full value chain (viewport-clamped) */}
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
            </div>
            <Link href={`/industries/${industry.slug}`} aria-label={`Open ${industry.name}`} className="absolute inset-0 hidden md:block" />
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
            <p className="text-sm font-semibold">{hovered.name} Product Value Chain</p>
            <Link href={`/industries/${hovered.slug}`} className="text-xs font-medium text-primary hover:underline">Open full page</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {hovered.stages.map((stage) => {
              const color = stage.stage === 'upstream'
                ? { header: 'text-blue-700', border: 'border-blue-200', bg: 'from-blue-50 to-blue-100' }
                : stage.stage === 'midstream'
                ? { header: 'text-purple-700', border: 'border-purple-200', bg: 'from-purple-50 to-purple-100' }
                : { header: 'text-green-700', border: 'border-green-200', bg: 'from-green-50 to-green-100' }
              return (
                <div key={stage.stage} className={`flex min-w-[300px] flex-col gap-3 rounded-xl border ${color.border} bg-gradient-to-b ${color.bg} p-3`}>
                  <h3 className={`text-center text-xs font-semibold ${color.header}`}>{stage.stageLabel}</h3>
                  <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
                    {stage.products.map((p: ProductCategory) => (
                      <div key={p.id} className="rounded-xl border bg-white p-3 shadow-sm">
                        <Link href={`/industries/${hovered.slug}?product=${encodeURIComponent(p.id)}`} className="flex items-start justify-between">
                          <p className="text-sm font-medium break-words">{p.name}</p>
                          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{collectCompanies(p).count}</span>
                        </Link>
                        {(p as any).subProducts && (p as any).subProducts.length > 0 && (
                          <div className="mt-2 grid gap-1">
                            {(p as any).subProducts.slice(0, 3).map((sp: ProductCategory) => (
                              <Link key={sp.id} href={`/industries/${hovered.slug}?product=${encodeURIComponent(sp.id)}`} className="flex items-center justify-between rounded-lg border bg-white px-2 py-1 text-[12px] hover:bg-muted/40" title={(sp as any).description}>
                                <span className="truncate pr-2">{sp.name}</span>
                                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{collectCompanies(sp).count}</span>
                              </Link>
                            ))}
                            {(p as any).subProducts.length > 3 && (
                              <Link href={`/industries/${hovered.slug}?product=${encodeURIComponent(p.id)}`} className="rounded-lg border bg-background px-2 py-1 text-[12px] text-muted-foreground hover:bg-accent">+{(p as any).subProducts.length - 3} more</Link>
                            )}
                        </div>
                      )}
          </div>
        ))}
      </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Mobile vertical preview dialog */}
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          {mobilePreview && (
            <>
              <DialogHeader>
                <DialogTitle>{mobilePreview.name} Product Value Chain</DialogTitle>
              </DialogHeader>
              <div className="mt-2 space-y-3">
                {mobilePreview.stages.map((stage) => {
                  const color = stage.stage === 'upstream'
                    ? { header: 'text-blue-700', border: 'border-blue-200', bg: 'from-blue-50 to-blue-100' }
                    : stage.stage === 'midstream'
                    ? { header: 'text-purple-700', border: 'border-purple-200', bg: 'from-purple-50 to-purple-100' }
                    : { header: 'text-green-700', border: 'border-green-200', bg: 'from-green-50 to-green-100' }
                  return (
                    <div key={stage.stage} className={`flex w-full flex-col gap-3 rounded-xl border ${color.border} bg-gradient-to-b ${color.bg} p-3`}>
                      <h3 className={`text-center text-sm font-semibold ${color.header}`}>{stage.stageLabel}</h3>
                      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
                        {stage.products.map((p: ProductCategory) => (
                          <Link key={p.id} href={`/industries/${mobilePreview.slug}?product=${encodeURIComponent(p.id)}`} className="flex items-start justify-between rounded-xl border bg-white p-3 shadow-sm">
                            <p className="text-sm font-medium break-words">{p.name}</p>
                            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{collectCompanies(p).count}</span>
                          </Link>
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

      {/* Helper: show count for reassurance, tiny and unobtrusive */}
      <div className="mt-2 text-xs text-muted-foreground">{filtered.length} industries</div>
    </div>
  )
}
