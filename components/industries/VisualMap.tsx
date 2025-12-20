'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, TrendingUp, Wallet, Check } from 'lucide-react'
import Link from 'next/link'

// --- MOCK DATA ---
const MOCK_DATA = [
    { name: 'Apple Inc.', ticker: 'AAPL', marketCap: 3400000000000, revenue: 383000000000, netIncome: 97000000000, logo_url: 'https://img.logo.dev/ticker/AAPL?token=pk_mcaTzX9MTM6eM9rN-sV5cQ' },
    { name: 'Microsoft Corp.', ticker: 'MSFT', marketCap: 3000000000000, revenue: 227000000000, netIncome: 82000000000, logo_url: 'https://img.logo.dev/ticker/MSFT?token=pk_mcaTzX9MTM6eM9rN-sV5cQ' },
    { name: 'NVIDIA Corp.', ticker: 'NVDA', marketCap: 2800000000000, revenue: 60000000000, netIncome: 29000000000, logo_url: 'https://img.logo.dev/ticker/NVDA?token=pk_mcaTzX9MTM6eM9rN-sV5cQ' },
    { name: 'Alphabet Inc.', ticker: 'GOOGL', marketCap: 2200000000000, revenue: 307000000000, netIncome: 73000000000, logo_url: 'https://img.logo.dev/ticker/GOOGL?token=pk_mcaTzX9MTM6eM9rN-sV5cQ' },
    { name: 'Amazon.com Inc.', ticker: 'AMZN', marketCap: 1900000000000, revenue: 574000000000, netIncome: 30000000000, logo_url: 'https://img.logo.dev/ticker/AMZN?token=pk_mcaTzX9MTM6eM9rN-sV5cQ' },
    { name: 'Meta Platforms', ticker: 'META', marketCap: 1200000000000, revenue: 134000000000, netIncome: 39000000000, logo_url: 'https://img.logo.dev/ticker/META?token=pk_mcaTzX9MTM6eM9rN-sV5cQ' },
    { name: 'Broadcom Inc.', ticker: 'AVGO', marketCap: 600000000000, revenue: 35000000000, netIncome: 14000000000, logo_url: 'https://img.logo.dev/ticker/AVGO?token=pk_mcaTzX9MTM6eM9rN-sV5cQ' },
    { name: 'Tesla Inc.', ticker: 'TSLA', marketCap: 550000000000, revenue: 96000000000, netIncome: 15000000000, logo_url: 'https://img.logo.dev/ticker/TSLA?token=pk_mcaTzX9MTM6eM9rN-sV5cQ' },
    { name: 'Walmart Inc.', ticker: 'WMT', marketCap: 500000000000, revenue: 648000000000, netIncome: 15000000000, logo_url: 'https://img.logo.dev/ticker/WMT?token=pk_mcaTzX9MTM6eM9rN-sV5cQ' },
    { name: 'JPMorgan Chase', ticker: 'JPM', marketCap: 570000000000, revenue: 158000000000, netIncome: 49000000000, logo_url: 'https://img.logo.dev/ticker/JPM?token=pk_mcaTzX9MTM6eM9rN-sV5cQ' },
]

type MetricType = 'marketCap' | 'revenue' | 'netIncome'

const METRIC_CONFIG: Record<MetricType, { label: string, color: string, buttonColor: string, icon: any }> = {
    marketCap: { label: 'Market Cap', color: 'bg-blue-500', buttonColor: 'bg-blue-600 border-blue-600', icon: DollarSign },
    revenue: { label: 'Revenue', color: 'bg-emerald-500', buttonColor: 'bg-emerald-600 border-emerald-600', icon: TrendingUp },
    netIncome: { label: 'Net Profit', color: 'bg-violet-500', buttonColor: 'bg-violet-600 border-violet-600', icon: Wallet },
}

export interface VisualMapProps {
    companies?: any[]
}

export function VisualMap({ companies }: VisualMapProps) {
    // Allow multiple selected metrics. Default to just Market Cap.
    const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(['marketCap'])

    // Helper to toggle metrics
    const toggleMetric = (m: MetricType) => {
        setSelectedMetrics(prev => {
            if (prev.includes(m)) {
                // Don't allow unselecting the last one (avoid empty state)
                if (prev.length === 1) return prev
                return prev.filter(item => item !== m)
            } else {
                return [...prev, m]
            }
        })
    }

    // Use mock data if no companies provided
    const data = useMemo(() => {
        const source = (companies && companies.length > 0) ? companies.map(c => {
            return {
                name: c.name,
                ticker: c.ticker,
                marketCap: Number(c.market_cap || c.marketCap || 0),
                revenue: Number(c.data?.incomeStatement?.revenue || c.revenue || 0),
                netIncome: Number(c.data?.incomeStatement?.netIncome || c.netIncome || 0),
                logo_url: c.logo_url || c.logo || `https://ui-avatars.com/api/?name=${c.name}&background=random`
            }
        }) : MOCK_DATA

        // Sort High to Low based on the FIRST selected metric
        const primaryMetric = selectedMetrics[0] || 'marketCap'

        return [...source]
            .sort((a, b) => (b[primaryMetric] as number) - (a[primaryMetric] as number))
    }, [companies, selectedMetrics])

    // Calculate max value across ALL selected metrics globally (for single metric comparison)
    const globalMax = useMemo(() => {
        let max = 0
        data.forEach(c => {
            selectedMetrics.forEach(m => {
                const val = c[m] as number
                if (val > max) max = val
            })
        })
        return Math.max(max, 1)
    }, [data, selectedMetrics])

    // Determine scaling mode: single metric = global, multiple = per-company
    const usePerCompanyScaling = selectedMetrics.length > 1

    function formatCurrency(val: number) {
        if (val === 0) return '-'
        if (val < 0) return `-$${Math.abs(val / 1e9).toFixed(1)}B` // Handle losses
        if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`
        if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`
        if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`
        return `$${val.toLocaleString()}`
    }

    return (
        <Card className="w-full border-none shadow-lg bg-slate-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4">
                <div className="flex items-center gap-3">
                    <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 hidden sm:block">
                        Leaderboard
                    </CardTitle>
                    <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                    <div className="flex gap-1">
                        {(['marketCap', 'revenue', 'netIncome'] as MetricType[]).map((m) => {
                            const isSelected = selectedMetrics.includes(m)
                            const config = METRIC_CONFIG[m]
                            const Icon = config.icon

                            return (
                                <button
                                    key={m}
                                    onClick={() => toggleMetric(m)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all border shadow-sm",
                                        isSelected
                                            ? `${config.buttonColor} text-white`
                                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-500 shadow-none hover:shadow-sm"
                                    )}
                                >
                                    {isSelected ? <Check className="h-2.5 w-2.5" /> : <Icon className="h-2.5 w-2.5" />}
                                    {config.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-1 p-3">
                <AnimatePresence>
                    {data.map((company, idx) => {
                        const rank = idx + 1
                        return (
                            <motion.div
                                key={company.ticker || company.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-3 py-4 sm:py-1.5 border rounded-xl sm:rounded-lg sm:border-0 sm:border-b border-slate-200 sm:border-slate-100 last:border-0 bg-white sm:bg-transparent sm:even:bg-slate-50/50 shadow-sm sm:shadow-none hover:shadow-md sm:hover:shadow-none px-4 sm:px-2 transition-all sm:hover:bg-slate-100 mb-3 sm:mb-0"
                            >
                                {/* LEFT: Identity (Rank, Logo, Name, Ticker) - Responsive Width */}
                                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-[240px] md:w-[280px] shrink-0 border-b sm:border-0 border-slate-100 pb-3 sm:pb-0">
                                    {/* Rank */}
                                    <span className={cn(
                                        "text-[10px] sm:text-xs font-bold w-4 sm:w-5 text-right shrink-0",
                                        rank <= 3 ? "text-slate-900" : "text-slate-400"
                                    )}>
                                        {rank}
                                    </span>

                                    <Link
                                        href={`/companies/${company.ticker}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity"
                                    >
                                        {/* Logo - Responsive size */}
                                        <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center rounded-lg border bg-white p-1 shadow-sm">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={company.logo_url}
                                                alt={company.name}
                                                className="h-full w-full object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none'
                                                }}
                                            />
                                        </div>

                                        {/* Name & Ticker */}
                                        <div className="flex flex-col min-w-0 pr-2">
                                            <span className="text-sm font-bold text-slate-800 truncate leading-tight border-b border-transparent group-hover:border-slate-300 transition-colors">
                                                {company.name}
                                            </span>
                                            <span className="text-xs font-mono text-slate-400 truncate">{company.ticker}</span>
                                        </div>
                                    </Link>
                                </div>

                                {/* RIGHT: Bars (Flex) */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-3 sm:gap-1.5 w-full">
                                    {/* Sort metrics: Market Cap -> Revenue -> Net Income */}
                                    {(['marketCap', 'revenue', 'netIncome'] as MetricType[])
                                        .filter(m => selectedMetrics.includes(m))
                                        .map((metric) => {
                                            const value = company[metric] as number
                                            const safeValue = Math.max(0, value)

                                            // Scaling logic:
                                            // - 1 metric: compare across all companies (global max)
                                            // - 2+ metrics: compare within the same company (company's own max)
                                            let percentage: number
                                            if (usePerCompanyScaling) {
                                                // Per-company scaling: find max among selected metrics for THIS company
                                                const companyMax = Math.max(
                                                    ...selectedMetrics.map(m => Math.max(0, company[m] as number)),
                                                    1
                                                )
                                                percentage = companyMax > 0 ? (safeValue / companyMax) * 100 : 0
                                            } else {
                                                // Global scaling: compare across all companies
                                                percentage = globalMax > 0 ? (safeValue / globalMax) * 100 : 0
                                            }
                                            const config = METRIC_CONFIG[metric]

                                            return (
                                                <div key={metric} className="flex items-center gap-2 sm:gap-3 h-4 sm:h-5">
                                                    <div className="flex-1 h-2 sm:h-3 bg-slate-100/80 rounded-full overflow-hidden relative flex items-center">
                                                        <motion.div
                                                            className={cn(
                                                                "h-full rounded-full relative overflow-hidden",
                                                                config.color
                                                            )}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.max(1, percentage)}%` }}
                                                            transition={{ duration: 0.8, type: "spring", bounce: 0 }}
                                                        />
                                                    </div>
                                                    <div className="w-32 sm:w-40 text-right shrink-0 leading-none flex items-center justify-between sm:justify-end gap-2">
                                                        <span className="font-mono text-xs sm:text-sm font-bold text-slate-700 w-auto sm:w-16 text-right order-2 sm:order-1">
                                                            {formatCurrency(value)}
                                                        </span>
                                                        <div className="w-auto sm:w-20 text-left order-1 sm:order-2">
                                                            <span className="text-[10px] sm:text-[10px] text-slate-500 font-medium inline-block truncate w-full">
                                                                {config.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {data.length === 0 && (
                    <div className="flex h-20 items-center justify-center text-xs text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                        No data available.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
