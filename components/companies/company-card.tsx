'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Industry } from "@/lib/data/industries"

interface CompanyData {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: number
}

type Props = { ticker: string; name?: string; marketCap?: number; industry?: Industry; labelTextOverride?: string }

export function CompanyCard({ ticker, name, marketCap, industry, labelTextOverride }: Props) {
  const [data, setData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If props include name/marketCap, use them directly (no fetch per card)
    if (name !== undefined || marketCap !== undefined) {
      setData({
        ticker,
        name: name || ticker,
        price: 0,
        change: 0,
        changePercent: 0,
        marketCap: marketCap || 0,
      })
      setLoading(false)
      return
    }
    async function fetchData() {
      try {
        const response = await fetch(`/api/companies/${ticker}`)
        if (response.ok) {
          const companyData = await response.json()
          setData(companyData)
        }
      } catch (error) {
        console.error('Error fetching company data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [ticker, name, marketCap])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="h-20 rounded bg-muted"></div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Link href={`/companies/${ticker}`}>
        <Card className="transition-all hover:shadow-lg hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">{ticker}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Data unavailable</p>
          </CardContent>
        </Card>
      </Link>
    )
  }

  // Determine the label to display and get category color
  const displayLabel = industry?.name || labelTextOverride
  
  // Category color mapping
  const getCategoryColor = (industryId: string) => {
    const categoryColors: Record<string, { bg: string; text: string }> = {
      // Technology & Innovation
      'semiconductors': { bg: '#3b82f620', text: '#1e40af' },
      'ai-ml': { bg: '#8b5cf620', text: '#7c3aed' },
      'cloud-computing': { bg: '#06b6d420', text: '#0891b2' },
      'cybersecurity': { bg: '#ef444420', text: '#dc2626' },
      'software-saas': { bg: '#10b98120', text: '#059669' },
      'data-centers': { bg: '#6366f120', text: '#4f46e5' },
      'telecommunications': { bg: '#f59e0b20', text: '#d97706' },
      'robotics': { bg: '#ec489920', text: '#db2777' },
      
      // Financials
      'banking': { bg: '#05966920', text: '#047857' },
      'insurance': { bg: '#0d948820', text: '#0f766e' },
      'asset-management': { bg: '#0891b220', text: '#0e7490' },
      'fintech': { bg: '#7c3aed20', text: '#6d28d9' },
      
      // Energy & Materials
      'oil-gas': { bg: '#37415120', text: '#111827' },
      'mining-materials': { bg: '#78716c20', text: '#57534e' },
      'chemicals': { bg: '#dc262620', text: '#b91c1c' },
      'solar-energy': { bg: '#fbbf2420', text: '#f59e0b' },
      'energy-storage': { bg: '#84cc1620', text: '#65a30d' },
      'utilities': { bg: '#64748b20', text: '#475569' },
      
      // Transportation & Mobility
      'electric-vehicles': { bg: '#22c55e20', text: '#16a34a' },
      'automotive': { bg: '#ef444420', text: '#dc2626' },
      'transportation-logistics': { bg: '#3b82f620', text: '#2563eb' },
      'aerospace': { bg: '#8b5cf620', text: '#7c3aed' },
      'space': { bg: '#1e40af20', text: '#1e3a8a' },
      
      // Healthcare & Life Sciences
      'pharmaceuticals': { bg: '#10b98120', text: '#059669' },
      'biotechnology': { bg: '#ec489920', text: '#db2777' },
      'medical-devices': { bg: '#06b6d420', text: '#0891b2' },
      'digital-health': { bg: '#8b5cf620', text: '#7c3aed' },
      
      // Consumer & Retail
      'food-beverage': { bg: '#f59e0b20', text: '#d97706' },
      'consumer-products': { bg: '#f9731620', text: '#ea580c' },
      'retail': { bg: '#ef444420', text: '#dc2626' },
      'ecommerce': { bg: '#3b82f620', text: '#2563eb' },
      
      // Real Estate & Construction
      'real-estate': { bg: '#78716c20', text: '#57534e' },
      'construction-engineering': { bg: '#6b728020', text: '#4b5563' },
      
      // Hospitality & Entertainment
      'hospitality': { bg: '#f59e0b20', text: '#d97706' },
      'media-entertainment': { bg: '#ec489920', text: '#db2777' },
      
      // Agriculture & Industrial
      'agtech': { bg: '#22c55e20', text: '#16a34a' },
    }
    
    return categoryColors[industryId] || { bg: '#f3f4f620', text: '#6b7280' }
  }

  const categoryColor = industry?.id ? getCategoryColor(industry.id) : { bg: '#f3f4f620', text: '#6b7280' }

  return (
    <Link href={`/companies/${ticker}`}>
      <Card className="transition-all hover:shadow-lg hover:scale-[1.02] relative">
        <CardContent className="p-4">
          {/* Industry Label - Top Right */}
          {displayLabel && (
            <div className="absolute top-3 right-3">
              <span 
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ 
                  backgroundColor: categoryColor.bg,
                  color: categoryColor.text
                }}
              >
                {displayLabel}
              </span>
            </div>
          )}

          <div className="mb-3">
            <p className="text-2xl font-bold">{ticker}</p>
            <p className="text-base text-muted-foreground line-clamp-1">{data.name}</p>
          </div>

          <div className="text-lg font-semibold">
            Market Cap: <span className="text-primary">{formatCurrency(data.marketCap)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}


