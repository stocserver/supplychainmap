'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Building2 } from 'lucide-react'
import type { ProductCategory, ProductCompanyRef, ValueChainStageProducts } from '@/lib/data/industries'
import { CompanyCard } from '@/components/companies/company-card'
import { useSearchParams } from 'next/navigation'
import type { Industry } from '@/lib/data/industries'

interface IndustryProductValueChainProps {
  stages: ValueChainStageProducts[]
  industryName: string
  industry?: Industry
}

interface ActiveProduct {
  id: string
  name: string
  description?: string
  longDescription?: string
  companiesDetailed?: ProductCompanyRef[]
}

// Aggregate companies from a product and all nested sub-products, deduplicated by ticker/name
function collectCompanies(product?: ProductCategory): ProductCompanyRef[] {
  if (!product) return []
  const direct = product.companiesDetailed || []
  const child = (product.subProducts || []).flatMap((sp) => collectCompanies(sp))
  const all = [...direct, ...child]
  const seen = new Set<string>()
  const unique: ProductCompanyRef[] = []
  for (const c of all) {
    const key = c.ticker ? `t:${c.ticker}` : `n:${c.name}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(c)
    }
  }
  return unique
}

function ProductBox({ product, onClick, stage }: { product: ProductCategory; onClick: (p: ProductCategory, stage: ValueChainStageProducts) => void; stage: ValueChainStageProducts }) {
  const totalCount = collectCompanies(product).length
  return (
    <button
      onClick={() => onClick(product, stage)}
      className="group w-full cursor-pointer rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:scale-[1.01] hover:border-primary/40 hover:shadow-md min-h-[120px]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold">{product.name}</p>
          {product.tags && product.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {product.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {tag}
                </span>
              ))}
              {product.tags.length > 4 && (
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">+{product.tags.length - 4}</span>
              )}
            </div>
          )}
        </div>
        <div className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
          {totalCount} companies
        </div>
      </div>

      {product.subProducts && product.subProducts.length > 0 && (
        <div className="mt-3">
          <div className="grid gap-2 grid-cols-1">
            {product.subProducts.map((sp) => (
              <div
                key={sp.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onClick(sp, stage)
                }}
                className="w-full cursor-pointer rounded-lg border bg-white p-3 text-left shadow-sm transition-all hover:border-primary/30 hover:bg-muted/40"
                title={sp.description}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    onClick(sp, stage)
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium break-words">{sp.name}</p>
                  <div className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    {collectCompanies(sp).length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </button>
  )
}

function ProductStage({ stage, onClick }: { stage: ValueChainStageProducts; onClick: (p: ProductCategory, stage: ValueChainStageProducts) => void }) {
  const color =
    stage.stage === 'upstream'
      ? { header: 'text-blue-700', border: 'border-blue-200', bg: 'from-blue-50 to-blue-100' }
      : stage.stage === 'midstream'
      ? { header: 'text-purple-700', border: 'border-purple-200', bg: 'from-purple-50 to-purple-100' }
      : { header: 'text-green-700', border: 'border-green-200', bg: 'from-green-50 to-green-100' }

  return (
    <div className={`flex w-full md:min-w-[320px] flex-col gap-3 rounded-xl border ${color.border} bg-gradient-to-b ${color.bg} p-4`}> 
      <h3 className={`text-center text-sm font-semibold ${color.header}`}>{stage.stageLabel}</h3>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
        {stage.products.map((p) => (
          <ProductBox key={p.id} product={p} onClick={onClick} stage={stage} />
        ))}
      </div>
    </div>
  )
}

export function IndustryProductValueChain({ stages, industryName, industry }: IndustryProductValueChainProps) {
  const [active, setActive] = useState<ActiveProduct | null>(null)
  const [open, setOpen] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const searchParams = useSearchParams()

  function toList(items: string[]): string {
    if (items.length <= 2) return items.join(' and ')
    return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
  }

  function generateLongDescription(p: ProductCategory, stage: ValueChainStageProducts): string {
    const tags = (p.tags || []).slice(0, 6)
    const subNames = (p.subProducts || []).map((sp) => sp.name)
    const flows = (p.flowsTo || []).slice(0, 6)
    const companies = collectCompanies(p).length
    const parts: string[] = []

    const base = p.description || `${p.name} is a key category in the ${stage.stageLabel.toLowerCase()} stage of the ${industryName.toLowerCase()} value chain.`
    parts.push(base)

    if (tags.length) {
      parts.push(`Common attributes include ${toList(tags)}.`)
    }
    if (subNames.length) {
      const listed = subNames.slice(0, 6)
      parts.push(`Typical sub-products: ${toList(listed)}${subNames.length > 6 ? ' and more' : ''}.`)
    }
    if (flows.length) {
      parts.push(`Outputs often flow to ${toList(flows)}.`)
    }
    if (companies > 0) {
      parts.push(`We currently track ${companies} companies participating in this category and its sub-segments.`)
    }
    return parts.join(' ')
  }

  const handleOpen = (p: ProductCategory, stage: ValueChainStageProducts) => {
    const combined = collectCompanies(p)
    const longText = (p as any).longDescription || generateLongDescription(p, stage)
    const shortText = p.description || `${p.name} within ${industryName} (${stage.stageLabel}).`
    setActive({ id: p.id, name: p.name, description: shortText, longDescription: longText, companiesDetailed: combined })
    setOpen(true)
    setDescExpanded(false)
  }

  const totalProducts = useMemo(() => stages.reduce((acc, s) => acc + s.products.length, 0), [stages])

  function findProductById(targetId: string): { product: ProductCategory; stage: ValueChainStageProducts } | null {
    for (const stage of stages) {
      const stack = [...stage.products]
      while (stack.length) {
        const p = stack.pop() as ProductCategory
        if (p.id === targetId) return { product: p, stage }
        const subs = (p as any).subProducts as ProductCategory[] | undefined
        if (subs && subs.length) stack.push(...subs)
      }
    }
    return null
  }

  useEffect(() => {
    const id = searchParams.get('product')
    if (!id) return
    const found = findProductById(id)
    if (found) {
      handleOpen(found.product, found.stage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, stages])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Value Chain</CardTitle>
        </CardHeader>
        <CardContent className="md:overflow-x-auto">
          <div className="flex flex-col md:flex-row items-stretch md:items-start justify-center gap-4 md:gap-6">
            {stages.map((s) => (
              <ProductStage key={s.stage} stage={s} onClick={handleOpen} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Building2 className="h-6 w-6" />
                  {active.name}
                </DialogTitle>
                <DialogDescription className="pt-2 text-base leading-relaxed">
                  {active.description || 'Description coming soon.'}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-6">
                {(active.companiesDetailed?.length ?? 0) > 0 ? (
                  <div>
                    <h4 className="mb-3 text-lg font-semibold">Companies ({active.companiesDetailed?.length})</h4>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {active.companiesDetailed!.map((c, idx) => (
                        c.ticker ? (
                          <CompanyCard 
                            key={`${c.ticker}-${idx}`} 
                            ticker={c.ticker} 
                            industry={industry}
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

                {(active.description || active.longDescription) && (
                  descExpanded ? (
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <h4 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">About this product</h4>
                      <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                        {active.longDescription || active.description}
                      </p>
                      <div className="mt-2">
                        <button
                          onClick={() => setDescExpanded(false)}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Read less
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setDescExpanded(true)}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Read more
                      </button>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

