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
      {/* Period Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Statements</h2>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={period === 'annual' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPeriod('annual')}
            className="px-6"
          >
            Annual
          </Button>
          <Button
            variant={period === 'quarterly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPeriod('quarterly')}
            className="px-6"
          >
            Quarterly
          </Button>
        </div>
      </div>

      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="income">Income Statement</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="ratios">Ratios</TabsTrigger>
        </TabsList>

        {/* Income Statement - Spreadsheet View */}
        <TabsContent value="income">
          <Card>
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
          <Card>
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
                        <td className="py-2 px-4 font-bold sticky left-0 bg-green-50 z-10">Shareholders' Equity</td>
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
          <Card>
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
