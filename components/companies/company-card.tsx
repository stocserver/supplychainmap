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

export function CompanyCard({ ticker }: { ticker: string, industry?: Industry, labelTextOverride?: string }) {
  const [data, setData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
  }, [ticker])

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

  return (
    <Link href={`/companies/${ticker}`}>
      <Card className="transition-all hover:shadow-lg hover:scale-[1.02]">
        <CardContent className="p-4">
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


