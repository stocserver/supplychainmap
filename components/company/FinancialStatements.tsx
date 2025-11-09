"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatNumber } from "@/lib/utils"

interface FinancialStatementsProps {
  data: any // Full company data from Supabase
}

export function FinancialStatements({ data }: FinancialStatementsProps) {
  const [period, setPeriod] = useState<'annual' | 'quarterly'>('annual')
  const [activeTab, setActiveTab] = useState<'income' | 'balance' | 'cashflow' | 'metrics' | 'ratios'>('income')

  if (!data?.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Statements</CardTitle>
          <CardDescription>No fundamental data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const historicalFinancials = data.data.historicalFinancials || {}
  
  // Get data based on selected period
  const incomeStatements = period === 'annual' 
    ? (historicalFinancials.incomeStatements || [])
    : (historicalFinancials.incomeStatementsQuarterly || [])
  
  const balanceSheets = period === 'annual'
    ? (historicalFinancials.balanceSheets || [])
    : (historicalFinancials.balanceSheetsQuarterly || [])
  
  const cashFlowStatements = period === 'annual'
    ? (historicalFinancials.cashFlowStatements || [])
    : (historicalFinancials.cashFlowStatementsQuarterly || [])

  const { keyMetrics, ratios } = data.data

  // Helper function to format numbers with commas
  const formatMillion = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A'
    return (value / 1e6).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // Helper function to format percentage
  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A'
    return `${(value * 100).toFixed(1)}%`
  }

  // Format period header (e.g., "2024" or "Q4 2024")
  const formatPeriodHeader = (stmt: any) => {
    const date = new Date(stmt.date)
    const year = date.getFullYear()
    
    if (period === 'quarterly' && stmt.period) {
      return `${stmt.period} ${year}`
    }
    return year.toString()
  }

  return (
    <div className="space-y-4">
      {/* Period Toggle as labels (chips) */}
      <div className="flex justify-end items-center mb-2 sm:mb-3 md:mb-4">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPeriod('annual')}
            className={
              `rounded-full border px-3 py-1.5 text-sm ${
                period === 'annual'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-foreground/70'
              }`
            }
          >
            Annual
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPeriod('quarterly')}
            className={
              `rounded-full border px-3 py-1.5 text-sm ${
                period === 'quarterly'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-foreground/70'
              }`
            }
          >
            Quarterly
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        {/* Chip tabs that wrap into next row on small screens; ensure container grows (no overlap) */}
        <TabsList className="w-full h-auto flex flex-wrap md:flex-nowrap gap-2 px-1 bg-transparent p-0 mb-2 sm:mb-3">
          <TabsTrigger value="income" className="rounded-full border px-2.5 py-1.5 text-xs sm:text-sm md:px-3 md:py-2 md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">Income</TabsTrigger>
          <TabsTrigger value="balance" className="rounded-full border px-2.5 py-1.5 text-xs sm:text-sm md:px-3 md:py-2 md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">Balance</TabsTrigger>
          <TabsTrigger value="cashflow" className="rounded-full border px-2.5 py-1.5 text-xs sm:text-sm md:px-3 md:py-2 md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">Cash Flow</TabsTrigger>
          <TabsTrigger value="metrics" className="rounded-full border px-2.5 py-1.5 text-xs sm:text-sm md:px-3 md:py-2 md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">Metrics</TabsTrigger>
          <TabsTrigger value="ratios" className="rounded-full border px-2.5 py-1.5 text-xs sm:text-sm md:px-3 md:py-2 md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">Ratios</TabsTrigger>
        </TabsList>

        {/* Income Statement - Spreadsheet View */}
        <TabsContent value="income">
          <Card className="md:hidden">
            <CardHeader>
              <CardTitle>Income Statement ({period === 'annual' ? 'Annual' : 'Quarterly'})</CardTitle>
              <CardDescription>Amounts in millions</CardDescription>
            </CardHeader>
            <CardContent>
              {incomeStatements.length > 0 ? (
                <div className="space-y-4">
                  {incomeStatements.map((stmt: any) => {
                    const grossMargin = stmt.grossProfitRatio || (stmt.revenue ? stmt.grossProfit / stmt.revenue : null)
                    const opMargin = stmt.operatingIncomeRatio || (stmt.revenue ? stmt.operatingIncome / stmt.revenue : null)
                    const netMargin = stmt.netIncomeRatio || (stmt.revenue ? stmt.netIncome / stmt.revenue : null)
                    const ebitdaMargin = stmt.ebitdaratio || stmt.ebitdaRatio || (stmt.revenue && stmt.ebitda ? stmt.ebitda / stmt.revenue : null)
                    return (
                      <Card key={stmt.date}>
                        <CardHeader>
                          <CardTitle className="text-lg">{formatPeriodHeader(stmt)}</CardTitle>
                          <CardDescription>{new Date(stmt.date).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div className="text-muted-foreground">Revenue</div>
                            <div className="text-right font-medium">{formatMillion(stmt.revenue)}</div>
                            <div className="text-muted-foreground">Cost of Revenue</div>
                            <div className="text-right">{formatMillion(stmt.costOfRevenue)}</div>
                            <div className="font-semibold">Gross Profit</div>
                            <div className="text-right font-semibold">{formatMillion(stmt.grossProfit)}</div>
                            <div className="text-muted-foreground italic">Gross Margin</div>
                            <div className="text-right text-muted-foreground italic">{formatPercent(grossMargin)}</div>
                            <div className="font-semibold">Operating Income</div>
                            <div className="text-right font-semibold">{formatMillion(stmt.operatingIncome)}</div>
                            <div className="text-muted-foreground italic">Operating Margin</div>
                            <div className="text-right text-muted-foreground italic">{formatPercent(opMargin)}</div>
                            <div className="font-semibold text-green-700">Net Income</div>
                            <div className="text-right font-semibold text-green-700">{formatMillion(stmt.netIncome)}</div>
                            <div className="text-muted-foreground italic">Net Margin</div>
                            <div className="text-right text-muted-foreground italic">{formatPercent(netMargin)}</div>
                            <div>EPS (Basic)</div>
                            <div className="text-right">${stmt.eps?.toFixed(2) || 'N/A'}</div>
                            <div>EPS (Diluted)</div>
                            <div className="text-right">${stmt.epsdiluted?.toFixed(2) || stmt.epsDiluted?.toFixed(2) || 'N/A'}</div>
                            <div>EBITDA</div>
                            <div className="text-right">{formatMillion(stmt.ebitda)}</div>
                            <div className="text-muted-foreground italic">EBITDA Margin</div>
                            <div className="text-right text-muted-foreground italic">{formatPercent(ebitdaMargin)}</div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No {period} income statement data available</p>
              )}
            </CardContent>
          </Card>

          {/* Desktop table */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Income Statement ({period === 'annual' ? 'Annual' : 'Quarterly'})</CardTitle>
              <CardDescription>Financial performance (amounts in millions)</CardDescription>
            </CardHeader>
            <CardContent>
              {incomeStatements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 font-semibold bg-gray-50 sticky left-0 z-10 min-w-[200px]">
                          Item
                        </th>
                        {incomeStatements.map((stmt: any) => (
                          <th key={stmt.date} className="text-right py-3 px-4 font-semibold bg-gray-50 min-w-[110px] whitespace-nowrap">
                            {formatPeriodHeader(stmt)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Revenue Section */}
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-semibold sticky left-0 bg-white z-10">Revenue</td>
                        {incomeStatements.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4 font-semibold">
                            {formatMillion(stmt.revenue)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 pl-8 text-gray-600 sticky left-0 bg-white z-10">Cost of Revenue</td>
                        {incomeStatements.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4 text-gray-600">
                            {formatMillion(stmt.costOfRevenue)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50 bg-blue-50">
                        <td className="py-2 px-4 font-bold sticky left-0 bg-blue-50 z-10">Gross Profit</td>
                        {incomeStatements.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4 font-bold">
                            {formatMillion(stmt.grossProfit)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 pl-8 text-sm text-gray-500 italic sticky left-0 bg-white z-10">Gross Margin</td>
                        {incomeStatements.map((stmt: any) => {
                          const margin = stmt.grossProfitRatio || (stmt.revenue ? stmt.grossProfit / stmt.revenue : null)
                          return (
                            <td key={stmt.date} className="text-right py-2 px-4 text-sm text-gray-500 italic">
                              {formatPercent(margin)}
                            </td>
                          )
                        })}
                      </tr>

                      {/* Operating Income */}
                      <tr className="border-b hover:bg-gray-50 bg-blue-50">
                        <td className="py-2 px-4 font-bold sticky left-0 bg-blue-50 z-10">Operating Income</td>
                        {incomeStatements.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4 font-bold">
                            {formatMillion(stmt.operatingIncome)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 pl-8 text-sm text-gray-500 italic sticky left-0 bg-white z-10">Operating Margin</td>
                        {incomeStatements.map((stmt: any) => {
                          const margin = stmt.operatingIncomeRatio || (stmt.revenue ? stmt.operatingIncome / stmt.revenue : null)
                          return (
                            <td key={stmt.date} className="text-right py-2 px-4 text-sm text-gray-500 italic">
                              {formatPercent(margin)}
                            </td>
                          )
                        })}
                      </tr>

                      {/* Net Income */}
                      <tr className="border-b-2 border-gray-300 hover:bg-gray-50 bg-green-50">
                        <td className="py-2 px-4 font-bold sticky left-0 bg-green-50 z-10">Net Income</td>
                        {incomeStatements.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4 font-bold text-green-700">
                            {formatMillion(stmt.netIncome)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 pl-8 text-sm text-gray-500 italic sticky left-0 bg-white z-10">Net Margin</td>
                        {incomeStatements.map((stmt: any) => {
                          const margin = stmt.netIncomeRatio || (stmt.revenue ? stmt.netIncome / stmt.revenue : null)
                          return (
                            <td key={stmt.date} className="text-right py-2 px-4 text-sm text-gray-500 italic">
                              {formatPercent(margin)}
                            </td>
                          )
                        })}
                      </tr>

                      {/* EPS */}
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium sticky left-0 bg-white z-10">EPS (Basic)</td>
                        {incomeStatements.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4">
                            ${stmt.eps?.toFixed(2) || 'N/A'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium sticky left-0 bg-white z-10">EPS (Diluted)</td>
                        {incomeStatements.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4">
                            ${stmt.epsdiluted?.toFixed(2) || stmt.epsDiluted?.toFixed(2) || 'N/A'}
                          </td>
                        ))}
                      </tr>

                      {/* EBITDA */}
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium sticky left-0 bg-white z-10">EBITDA</td>
                        {incomeStatements.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4">
                            {formatMillion(stmt.ebitda)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 pl-8 text-sm text-gray-500 italic sticky left-0 bg-white z-10">EBITDA Margin</td>
                        {incomeStatements.map((stmt: any) => {
                          const margin = stmt.ebitdaratio || stmt.ebitdaRatio || (stmt.revenue && stmt.ebitda ? stmt.ebitda / stmt.revenue : null)
                          return (
                            <td key={stmt.date} className="text-right py-2 px-4 text-sm text-gray-500 italic">
                              {formatPercent(margin)}
                            </td>
                          )
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No {period} income statement data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Balance Sheet - Spreadsheet View */}
        <TabsContent value="balance">
          <Card className="md:hidden">
            <CardHeader>
              <CardTitle>Balance Sheet ({period === 'annual' ? 'Annual' : 'Quarterly'})</CardTitle>
              <CardDescription>Amounts in millions</CardDescription>
            </CardHeader>
            <CardContent>
              {balanceSheets.length > 0 ? (
                <div className="space-y-4">
                  {balanceSheets.map((stmt: any) => (
                    <Card key={stmt.date}>
                      <CardHeader>
                        <CardTitle className="text-lg">{formatPeriodHeader(stmt)}</CardTitle>
                        <CardDescription>{new Date(stmt.date).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="text-muted-foreground">Cash &amp; Equivalents</div>
                          <div className="text-right">{formatMillion(stmt.cashAndCashEquivalents)}</div>
                          <div className="font-semibold">Total Assets</div>
                          <div className="text-right font-semibold">{formatMillion(stmt.totalAssets)}</div>
                          <div>Total Debt</div>
                          <div className="text-right">{formatMillion(stmt.totalDebt)}</div>
                          <div className="font-semibold">Total Liabilities</div>
                          <div className="text-right font-semibold">{formatMillion(stmt.totalLiabilities)}</div>
                          <div className="font-semibold">Shareholders' Equity</div>
                          <div className="text-right font-semibold">{formatMillion(stmt.shareholdersEquity)}</div>
                          <div>Net Debt</div>
                          <div className="text-right">{formatMillion(stmt.netDebt)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No {period} balance sheet data available</p>
              )}
            </CardContent>
          </Card>

          {/* Desktop table */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Balance Sheet ({period === 'annual' ? 'Annual' : 'Quarterly'})</CardTitle>
              <CardDescription>Financial position (amounts in millions)</CardDescription>
            </CardHeader>
            <CardContent>
              {balanceSheets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 font-semibold bg-gray-50 sticky left-0 z-10 min-w-[200px]">
                          Item
                        </th>
                        {balanceSheets.map((stmt: any) => (
                          <th key={stmt.date} className="text-right py-3 px-4 font-semibold bg-gray-50 min-w-[110px] whitespace-nowrap">
                            {formatPeriodHeader(stmt)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Assets */}
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium sticky left-0 bg-white z-10">Cash & Equivalents</td>
                        {balanceSheets.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4">
                            {formatMillion(stmt.cashAndCashEquivalents)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50 bg-blue-50">
                        <td className="py-2 px-4 font-bold sticky left-0 bg-blue-50 z-10">Total Assets</td>
                        {balanceSheets.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4 font-bold">
                            {formatMillion(stmt.totalAssets)}
                          </td>
                        ))}
                      </tr>

                      {/* Liabilities */}
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium sticky left-0 bg-white z-10">Total Debt</td>
                        {balanceSheets.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4">
                            {formatMillion(stmt.totalDebt)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50 bg-orange-50">
                        <td className="py-2 px-4 font-bold sticky left-0 bg-orange-50 z-10">Total Liabilities</td>
                        {balanceSheets.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4 font-bold">
                            {formatMillion(stmt.totalLiabilities)}
                          </td>
                        ))}
                      </tr>

                      {/* Equity */}
                      <tr className="border-b-2 border-gray-300 hover:bg-gray-50 bg-green-50">
                        <td className="py-2 px-4 font-bold sticky left-0 bg-green-50 z-10">Shareholders&apos; Equity</td>
                        {balanceSheets.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4 font-bold text-green-700">
                            {formatMillion(stmt.totalStockholdersEquity)}
                          </td>
                        ))}
                      </tr>

                      {/* Net Debt */}
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium sticky left-0 bg-white z-10">Net Debt</td>
                        {balanceSheets.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4">
                            {formatMillion(stmt.netDebt)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No {period} balance sheet data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow - Spreadsheet View */}
        <TabsContent value="cashflow">
          <Card className="md:hidden">
            <CardHeader>
              <CardTitle>Cash Flow Statement ({period === 'annual' ? 'Annual' : 'Quarterly'})</CardTitle>
              <CardDescription>Amounts in millions</CardDescription>
            </CardHeader>
            <CardContent>
              {cashFlowStatements.length > 0 ? (
                <div className="space-y-4">
                  {cashFlowStatements.map((stmt: any) => (
                    <Card key={stmt.date}>
                      <CardHeader>
                        <CardTitle className="text-lg">{formatPeriodHeader(stmt)}</CardTitle>
                        <CardDescription>{new Date(stmt.date).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="font-semibold text-green-700">Operating Cash Flow</div>
                          <div className="text-right font-semibold text-green-700">{formatMillion(stmt.operatingCashFlow)}</div>
                          <div>Capital Expenditure</div>
                          <div className="text-right text-red-600">{formatMillion(stmt.capitalExpenditure)}</div>
                          <div className="font-semibold text-blue-700">Free Cash Flow</div>
                          <div className="text-right font-semibold text-blue-700">{formatMillion(stmt.freeCashFlow)}</div>
                          <div>Dividends Paid</div>
                          <div className="text-right">{stmt.dividendsPaid ? formatMillion(Math.abs(stmt.dividendsPaid)) : 'N/A'}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No {period} cash flow data available</p>
              )}
            </CardContent>
          </Card>

          {/* Desktop table */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Cash Flow Statement ({period === 'annual' ? 'Annual' : 'Quarterly'})</CardTitle>
              <CardDescription>Cash movements (amounts in millions)</CardDescription>
            </CardHeader>
            <CardContent>
              {cashFlowStatements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 font-semibold bg-gray-50 sticky left-0 z-10 min-w-[200px]">
                          Item
                        </th>
                        {cashFlowStatements.map((stmt: any) => (
                          <th key={stmt.date} className="text-right py-3 px-4 font-semibold bg-gray-50 min-w-[110px] whitespace-nowrap">
                            {formatPeriodHeader(stmt)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50 bg-green-50">
                        <td className="py-2 px-4 font-bold sticky left-0 bg-green-50 z-10">Operating Cash Flow</td>
                        {cashFlowStatements.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4 font-bold text-green-700">
                            {formatMillion(stmt.operatingCashFlow)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium sticky left-0 bg-white z-10">Capital Expenditure</td>
                        {cashFlowStatements.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4 text-red-600">
                            {formatMillion(stmt.capitalExpenditure)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b-2 border-gray-300 hover:bg-gray-50 bg-blue-50">
                        <td className="py-2 px-4 font-bold sticky left-0 bg-blue-50 z-10">Free Cash Flow</td>
                        {cashFlowStatements.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4 font-bold text-blue-700">
                            {formatMillion(stmt.freeCashFlow)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium sticky left-0 bg-white z-10">Dividends Paid</td>
                        {cashFlowStatements.map((stmt: any) => (
                          <td key={stmt.date} className="text-right py-2 px-4">
                            {stmt.dividendsPaid ? formatMillion(Math.abs(stmt.dividendsPaid)) : 'N/A'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No {period} cash flow data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Key Metrics */}
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics (TTM)</CardTitle>
              <CardDescription>Trailing Twelve Months</CardDescription>
            </CardHeader>
            <CardContent>
              {keyMetrics ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {keyMetrics.peRatioTTM && (
                    <div>
                      <p className="text-sm text-muted-foreground">P/E Ratio</p>
                      <p className="text-lg font-semibold">{keyMetrics.peRatioTTM.toFixed(2)}</p>
                    </div>
                  )}
                  {keyMetrics.priceToSalesRatioTTM && (
                    <div>
                      <p className="text-sm text-muted-foreground">P/S Ratio</p>
                      <p className="text-lg font-semibold">{keyMetrics.priceToSalesRatioTTM.toFixed(2)}</p>
                    </div>
                  )}
                  {keyMetrics.ptbRatioTTM && (
                    <div>
                      <p className="text-sm text-muted-foreground">P/B Ratio</p>
                      <p className="text-lg font-semibold">{keyMetrics.ptbRatioTTM.toFixed(2)}</p>
                    </div>
                  )}
                  {keyMetrics.roeTTM && (
                    <div>
                      <p className="text-sm text-muted-foreground">ROE</p>
                      <p className="text-lg font-semibold">{(keyMetrics.roeTTM * 100).toFixed(2)}%</p>
                    </div>
                  )}
                  {keyMetrics.roaTTM && (
                    <div>
                      <p className="text-sm text-muted-foreground">ROA</p>
                      <p className="text-lg font-semibold">{(keyMetrics.roaTTM * 100).toFixed(2)}%</p>
                    </div>
                  )}
                  {keyMetrics.debtToEquityTTM && (
                    <div>
                      <p className="text-sm text-muted-foreground">Debt/Equity</p>
                      <p className="text-lg font-semibold">{keyMetrics.debtToEquityTTM.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No key metrics available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Ratios */}
        <TabsContent value="ratios">
          <Card>
            <CardHeader>
              <CardTitle>Financial Ratios (TTM)</CardTitle>
              <CardDescription>Trailing Twelve Months</CardDescription>
            </CardHeader>
            <CardContent>
              {ratios ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Liquidity Ratios</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {ratios.currentRatioTTM && (
                        <div>
                          <p className="text-sm text-muted-foreground">Current Ratio</p>
                          <p className="text-lg font-semibold">{ratios.currentRatioTTM.toFixed(2)}</p>
                        </div>
                      )}
                      {ratios.quickRatioTTM && (
                        <div>
                          <p className="text-sm text-muted-foreground">Quick Ratio</p>
                          <p className="text-lg font-semibold">{ratios.quickRatioTTM.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">Profitability Ratios</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {ratios.grossProfitMarginTTM && (
                        <div>
                          <p className="text-sm text-muted-foreground">Gross Profit Margin</p>
                          <p className="text-lg font-semibold">{(ratios.grossProfitMarginTTM * 100).toFixed(2)}%</p>
                        </div>
                      )}
                      {ratios.operatingProfitMarginTTM && (
                        <div>
                          <p className="text-sm text-muted-foreground">Operating Margin</p>
                          <p className="text-lg font-semibold">{(ratios.operatingProfitMarginTTM * 100).toFixed(2)}%</p>
                        </div>
                      )}
                      {ratios.netProfitMarginTTM && (
                        <div>
                          <p className="text-sm text-muted-foreground">Net Profit Margin</p>
                          <p className="text-lg font-semibold">{(ratios.netProfitMarginTTM * 100).toFixed(2)}%</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">Efficiency Ratios</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {ratios.assetTurnoverTTM && (
                        <div>
                          <p className="text-sm text-muted-foreground">Asset Turnover</p>
                          <p className="text-lg font-semibold">{ratios.assetTurnoverTTM.toFixed(2)}</p>
                        </div>
                      )}
                      {ratios.inventoryTurnoverTTM && (
                        <div>
                          <p className="text-sm text-muted-foreground">Inventory Turnover</p>
                          <p className="text-lg font-semibold">{ratios.inventoryTurnoverTTM.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No financial ratios available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
