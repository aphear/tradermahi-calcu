"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useTranslationContext } from "@/lib/translation-context"

interface ResultsVisualizationProps {
  results: any
  onExport: (type: "csv" | "print" | "pdf") => void
  currentLanguage: string
  onCreateSheet?: (sheetData: any) => void
}

export default function ResultsVisualization({
  results,
  onExport,
  currentLanguage,
  onCreateSheet,
}: ResultsVisualizationProps) {
  const { t } = useTranslationContext()
  const [activeView, setActiveView] = useState("daily")
  const [animatedValues, setAnimatedValues] = useState({
    netProfit: 0,
    returnPercentage: 0,
    totalTrades: 0,
  })

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    const calculateDates = () => {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(startDate.getDate() + results.tradingPeriod.days)

      return {
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
      }
    }

    const { startDate, endDate } = calculateDates()
    setStartDate(startDate)
    setEndDate(endDate)
  }, [results])

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedValues({
        netProfit: Math.floor(safeNumber(results.netProfit) * progress),
        returnPercentage: Number((safeNumber(results.returnPercentage) * progress).toFixed(2)),
        totalTrades: Math.floor(safeNumber(results.totalTrades) * progress),
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedValues({
          netProfit: safeNumber(results.netProfit),
          returnPercentage: safeNumber(results.returnPercentage),
          totalTrades: safeNumber(results.totalTrades),
        })
      }
    }, [results])

    return () => clearInterval(interval)
  }, [results])

  const generateChartData = (view: string) => {
    const { tradingPeriod, initialCapital, netProfit, totalTrades, interestRate, dailyBreakdown, interestRateType } =
      results
    const safeInitialCapital = safeNumber(initialCapital)
    const safeNetProfit = safeNumber(netProfit)
    const safeTotalTrades = safeNumber(totalTrades)
    const safeInterestRate = safeNumber(interestRate)

    if (view === "daily" && dailyBreakdown && dailyBreakdown.length > 0 && interestRateType === "custom") {
      return dailyBreakdown.map((day, index) => ({
        period: `Day ${day.day}`,
        date: day.date || new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString(),
        earnings: safeNumber(day.earning),
        totalEarnings: safeNumber(day.totalEarnings),
        balance: safeNumber(day.balance),
        trades: Math.floor((safeTotalTrades / safeNumber(tradingPeriod?.tradingDays)) * day.day),
        capital: safeNumber(day.balance),
        profit: safeNumber(day.totalEarnings),
      }))
    }

    if (view === "daily" && dailyBreakdown && dailyBreakdown.length > 0 && interestRateType === "low") {
      return dailyBreakdown.map((day, index) => ({
        period: `Day ${day.day}`,
        date: day.date || new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString(),
        earnings: safeNumber(day.earning),
        totalEarnings: safeNumber(day.balance) - safeInitialCapital, // Total earnings = current balance - initial
        balance: safeNumber(day.balance),
        trades: Math.floor((safeTotalTrades / safeNumber(tradingPeriod?.tradingDays)) * day.day),
        capital: safeNumber(day.balance),
        profit: safeNumber(day.balance) - safeInitialCapital,
      }))
    }

    const profitPerTrade = safeTotalTrades > 0 ? safeNetProfit / safeTotalTrades : 0
    const dailyInterestRate = safeInterestRate / 365 / 100

    switch (view) {
      case "daily": {
        const dailyData = []
        const tradesPerDay = safeTotalTrades / safeNumber(tradingPeriod?.tradingDays)
        let cumulativeProfit = 0
        let currentBalance = safeInitialCapital
        const currentDate = new Date()

        for (let day = 1; day <= Math.min(safeNumber(tradingPeriod?.tradingDays), 30); day++) {
          const dailyTradingProfit = profitPerTrade * tradesPerDay
          const dailyInterest = currentBalance * dailyInterestRate
          const totalDailyEarnings = dailyTradingProfit + dailyInterest

          cumulativeProfit += totalDailyEarnings
          currentBalance = safeInitialCapital + cumulativeProfit

          const displayDate = new Date(currentDate)
          displayDate.setDate(currentDate.getDate() + day - 1)

          dailyData.push({
            period: `Day ${day}`,
            date: displayDate.toLocaleDateString(),
            earnings: totalDailyEarnings,
            totalEarnings: cumulativeProfit,
            balance: currentBalance,
            trades: Math.floor(tradesPerDay * day),
            capital: currentBalance,
            profit: cumulativeProfit,
          })
        }
        return dailyData
      }

      case "weekly": {
        const weeklyData = []
        const tradesPerWeek = safeTotalTrades / safeNumber(tradingPeriod?.weeks)
        let cumulativeProfit = 0
        let currentBalance = safeInitialCapital
        const currentDate = new Date()

        for (let week = 1; week <= Math.min(safeNumber(tradingPeriod?.weeks), 52); week++) {
          const weeklyTradingProfit = profitPerTrade * tradesPerWeek
          const weeklyInterest = currentBalance * dailyInterestRate * 7
          const totalWeeklyEarnings = weeklyTradingProfit + weeklyInterest

          cumulativeProfit += totalWeeklyEarnings
          currentBalance = safeInitialCapital + cumulativeProfit

          const displayDate = new Date(currentDate)
          displayDate.setDate(currentDate.getDate() + (week - 1) * 7)

          weeklyData.push({
            period: `Week ${week}`,
            date: displayDate.toLocaleDateString(),
            earnings: totalWeeklyEarnings,
            totalEarnings: cumulativeProfit,
            balance: currentBalance,
            trades: Math.floor(tradesPerWeek * week),
            capital: currentBalance,
            profit: cumulativeProfit,
          })
        }
        return weeklyData
      }

      case "monthly": {
        const monthlyData = []
        const monthsInPeriod = Math.ceil(safeNumber(tradingPeriod?.weeks) / 4.33)
        const tradesPerMonth = safeTotalTrades / monthsInPeriod
        let cumulativeProfit = 0
        let currentBalance = safeInitialCapital
        const currentDate = new Date()

        for (let month = 1; month <= Math.min(monthsInPeriod, 12); month++) {
          const monthlyTradingProfit = profitPerTrade * tradesPerMonth
          const monthlyInterest = currentBalance * dailyInterestRate * 30
          const totalMonthlyEarnings = monthlyTradingProfit + monthlyInterest

          cumulativeProfit += totalMonthlyEarnings
          currentBalance = safeInitialCapital + cumulativeProfit

          const displayDate = new Date(currentDate)
          displayDate.setMonth(currentDate.getMonth() + month - 1)

          monthlyData.push({
            period: `Month ${month}`,
            date: displayDate.toLocaleDateString(),
            earnings: totalMonthlyEarnings,
            totalEarnings: cumulativeProfit,
            balance: currentBalance,
            trades: Math.floor(tradesPerMonth * month),
            capital: currentBalance,
            profit: cumulativeProfit,
          })
        }
        return monthlyData
      }

      case "yearly": {
        const yearlyData = []
        const yearsInPeriod = Math.ceil(safeNumber(tradingPeriod?.weeks) / 52)
        const tradesPerYear = safeTotalTrades / yearsInPeriod
        let cumulativeProfit = 0
        let currentBalance = safeInitialCapital
        const currentDate = new Date()

        for (let year = 1; year <= Math.min(yearsInPeriod, 5); year++) {
          const yearlyTradingProfit = profitPerTrade * tradesPerYear
          const yearlyInterest = currentBalance * dailyInterestRate * 365
          const totalYearlyEarnings = yearlyTradingProfit + yearlyInterest

          cumulativeProfit += totalYearlyEarnings
          currentBalance = safeInitialCapital + cumulativeProfit

          const displayDate = new Date(currentDate)
          displayDate.setFullYear(currentDate.getFullYear() + year - 1)

          yearlyData.push({
            period: `Year ${year}`,
            date: displayDate.toLocaleDateString(),
            earnings: totalYearlyEarnings,
            totalEarnings: cumulativeProfit,
            balance: currentBalance,
            trades: Math.floor(tradesPerYear * year),
            capital: currentBalance,
            profit: cumulativeProfit,
          })
        }
        return yearlyData
      }

      default:
        return []
    }
  }

  const chartData = generateChartData(activeView)

  const generateTableData = () => {
    const safeNumber = (value: any, fallback = 0) => {
      const num = Number(value)
      return isNaN(num) || value === null || value === undefined ? fallback : num
    }

    const baseData = [
      {
        metric: t.initialCapital + " with Start Date",
        value: `${results.currency || "$"} ${safeNumber(results.initialCapital).toLocaleString()} (${startDate})`,
        type: "neutral",
      },
      {
        metric: t.finalCapital + " (Final Balance)",
        value: `${results.currency || "$"} ${safeNumber(results.finalCapital).toLocaleString()}`,
        type: "positive",
      },
      {
        metric: t.netProfit + " (Net Profit)",
        value: `${results.currency || "$"} ${safeNumber(results.netProfit).toLocaleString()}`,
        type: safeNumber(results.netProfit) >= 0 ? "positive" : "negative",
      },
      {
        metric: t.returnPercentage,
        value: `${safeNumber(results.returnPercentage).toFixed(2)}%`,
        type: safeNumber(results.returnPercentage) >= 0 ? "positive" : "negative",
      },
      {
        metric: "Interest Rate (%)",
        value: `${safeNumber(results.interestRate)}%`,
        type: "neutral",
      },
      {
        metric: t.endDate,
        value: endDate,
        type: "neutral",
      },
      {
        metric: t.totalTrades + " / Business Days",
        value: `${safeNumber(results.tradingPeriod?.days)} / ${safeNumber(results.tradingPeriod?.tradingDays)}`,
        type: "neutral",
      },
      { metric: t.totalTrades, value: safeNumber(results.totalTrades).toLocaleString(), type: "neutral" },
      { metric: t.winningTrades, value: safeNumber(results.winningTrades).toLocaleString(), type: "positive" },
      { metric: t.losingTrades, value: safeNumber(results.losingTrades).toLocaleString(), type: "negative" },
      {
        metric: t.winRate,
        value: `${safeNumber(results.totalTrades) > 0 ? ((safeNumber(results.winningTrades) / safeNumber(results.totalTrades)) * 100).toFixed(2) : 0}%`,
        type: "neutral",
      },
    ]

    if (results.hasStopLoss) {
      baseData.push({
        metric: "Per-Day Stop Loss (if active)",
        value: `${results.currency || "$"} ${safeNumber(results.stopLossAmount).toLocaleString()}`,
        type: "negative",
      })
    }

    if (results.hasDailyTrades) {
      const tradesPerDay =
        safeNumber(results.tradingPeriod?.tradingDays) > 0
          ? (safeNumber(results.totalTrades) / safeNumber(results.tradingPeriod?.tradingDays)).toFixed(1)
          : "0"
      baseData.push({
        metric: "Trades Per Day (if active)",
        value: tradesPerDay,
        type: "neutral",
      })
    }

    const optionalData = []

    if (results.hasRiskPerTrade) {
      optionalData.push({
        metric: t.riskPerTrade,
        value: `${safeNumber(results.riskPerTradeValue)}%`,
        type: "neutral",
      })
    }

    if (results.hasWinRate) {
      optionalData.push({
        metric: "Expected " + t.winRate,
        value: `${safeNumber(results.winRateValue)}%`,
        type: "neutral",
      })
    }

    if (results.hasRiskRewardRatio) {
      optionalData.push({
        metric: t.riskRewardRatio,
        value: safeNumber(results.riskRewardRatioValue),
        type: "neutral",
      })
    }

    return [...baseData, ...optionalData]
  }

  const tableData = generateTableData()

  const handleCreateSheet = () => {
    if (!onCreateSheet) return

    const chartData = generateChartData("daily")
    const currencySymbol = getCurrencySymbol(results)

    // Prepare sheet data with pre-populated profits from daily breakdown
    const sheetData = {
      currency: results.currency || "USD",
      currencySymbol: currencySymbol,
      entries: chartData.map((day, index) => ({
        date: day.date,
        profit: safeNumber(day.earnings), // Pre-populate with daily earnings
        loss: 0, // User can edit losses
        total: 0, // Will be calculated
        isWeekend: false,
        day: index + 1,
      })),
      totalDays: chartData.length,
      isFromResults: true, // Flag to show popup
      type: "binary" as const, // Mark as binary type
    }

    onCreateSheet(sheetData)
  }

  const getCurrencySymbol = (results: any) => {
    if (results.currency) {
      const currency = currencies.find((c) => c.code === results.currency)
      return currency?.symbol || "$"
    }
    return "$"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-accent/30 bg-accent/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-accent mb-2">
                {results.currency || "$"} {safeNumber(results.finalCapital).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Investment Value</p>
              <p className="text-xs text-muted-foreground">(Final Balance)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-primary mb-2">
                {results.currency || "$"} {safeNumber(animatedValues.netProfit).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-xs text-muted-foreground">(Net Profit)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-green-500/30 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-green-500 mb-2">
                {safeNumber(animatedValues.returnPercentage).toFixed(2)}%
              </div>
              <p className="text-sm text-muted-foreground">Percentage Profit</p>
              <p className="text-xs text-muted-foreground">({safeNumber(results.interestRate)}% Interest)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border bg-muted/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-foreground mb-2">
                {safeNumber(results.tradingPeriod?.days)}
              </div>
              <p className="text-sm text-muted-foreground">Total Days</p>
              <p className="text-xs text-muted-foreground">
                ({safeNumber(results.tradingPeriod?.tradingDays)} Business Days)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {(results.hasRiskPerTrade || results.hasWinRate || results.hasRiskRewardRatio) && (
        <Card className="glass-card border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg font-heading">
              <i className="fas fa-info-circle mr-2 text-primary"></i>
              Parameters Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.hasRiskPerTrade && (
                <div className="text-center">
                  <div className="text-xl font-mono font-bold text-primary mb-1">
                    {safeNumber(results.riskPerTradeValue)}%
                  </div>
                  <p className="text-sm text-muted-foreground">{t.riskPerTrade}</p>
                </div>
              )}
              {results.hasWinRate && (
                <div className="text-center">
                  <div className="text-xl font-mono font-bold text-primary mb-1">
                    {safeNumber(results.winRateValue)}%
                  </div>
                  <p className="text-sm text-muted-foreground">{t.winRate}</p>
                </div>
              )}
              {results.hasRiskRewardRatio && (
                <div className="text-center">
                  <div className="text-xl font-mono font-bold text-primary mb-1">
                    {safeNumber(results.riskRewardRatioValue)}
                  </div>
                  <p className="text-sm text-muted-foreground">{t.riskRewardRatio}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Buttons */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-heading">
                <i className="fas fa-chart-line mr-2 text-primary"></i>
                Detailed Breakdown & Projection for {safeNumber(results.tradingPeriod?.tradingDays)} Trading Days
              </CardTitle>
              <CardDescription>
                From {startDate} to {endDate} • Interest Rate: {safeNumber(results.interestRate)}%
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("csv")}
                className="border-accent/30 text-accent hover:bg-accent/10 bg-transparent"
              >
                <i className="fas fa-file-csv mr-2"></i>
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("print")}
                className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
              >
                <i className="fas fa-print mr-2"></i>
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("pdf")}
                className="border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
              >
                <i className="fas fa-file-pdf mr-2"></i>
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
              <TabsTrigger
                value="daily"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <i className="fas fa-calendar-day mr-2"></i>
                Daily
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <i className="fas fa-calendar-week mr-2"></i>
                Weekly
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <i className="fas fa-calendar-alt mr-2"></i>
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <i className="fas fa-calendar mr-2"></i>
                Yearly
              </TabsTrigger>
            </TabsList>

            {["daily", "weekly", "monthly", "yearly"].map((view) => (
              <TabsContent key={view} value={view} className="space-y-6 mt-6">
                {/* Profit Growth Chart */}

                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Breakdown Table - {view.charAt(0).toUpperCase() + view.slice(1)} View
                    </CardTitle>
                    {results.interestRateType && (
                      <CardDescription>
                        Interest Type:{" "}
                        {results.interestRateType === "custom" ? "Custom Interest (Compound)" : "Low Interest (7-10%)"}
                        {results.interestRateType === "custom" &&
                          ` - ${safeNumber(results.interestRate)}% daily compound interest`}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date / {view.charAt(0).toUpperCase() + view.slice(1)}</TableHead>
                            <TableHead>Earnings</TableHead>
                            <TableHead>Total Earnings</TableHead>
                            <TableHead>Balance</TableHead>
                            {results.hasDailyTrades && <TableHead>Trades Taken</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {generateChartData(view).map((row, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                <div>{row.period}</div>
                                <div className="text-xs text-muted-foreground">{row.date}</div>
                              </TableCell>
                              <TableCell className="font-mono">
                                {results.currency || "$"} {safeNumber(row.earnings).toFixed(2)}
                              </TableCell>
                              <TableCell className="font-mono">
                                {results.currency || "$"} {safeNumber(row.totalEarnings).toFixed(2)}
                              </TableCell>
                              <TableCell className="font-mono font-bold">
                                {results.currency || "$"} {safeNumber(row.balance).toFixed(2)}
                              </TableCell>
                              {results.hasDailyTrades && <TableCell className="font-mono">{row.trades}</TableCell>}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {view === "daily" && onCreateSheet && (
                      <div className="mt-4 flex justify-center">
                        <Button
                          onClick={handleCreateSheet}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <i className="fas fa-file-plus mr-2"></i>
                          {t.createSheet}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Detailed Breakdown Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-heading">
            <i className="fas fa-table mr-2 text-accent"></i>
            Detailed Breakdown
          </CardTitle>
          <CardDescription>Complete analysis of your trading performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-heading">{t.metric}</TableHead>
                  <TableHead className="font-heading">{t.value}</TableHead>
                  <TableHead className="font-heading">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generateTableData().map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.metric}</TableCell>
                    <TableCell className="font-mono">{row.value}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          row.type === "positive" ? "default" : row.type === "negative" ? "destructive" : "secondary"
                        }
                        className="text-xs"
                      >
                        {row.type === "positive" ? "Positive" : row.type === "negative" ? "Negative" : "Neutral"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="glass-card border-accent/30">
        <CardHeader>
          <CardTitle className="font-heading text-accent">
            <i className="fas fa-lightbulb mr-2"></i>
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Risk Assessment</h4>
              <p className="text-sm text-muted-foreground">
                {safeNumber(results.returnPercentage) > 20
                  ? "High return potential with elevated risk profile"
                  : safeNumber(results.returnPercentage) > 10
                    ? "Moderate return with balanced risk management"
                    : "Conservative approach with lower risk exposure"}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Trading Frequency</h4>
              <p className="text-sm text-muted-foreground">
                {safeNumber(results.totalTrades) > 1000
                  ? "High-frequency trading strategy detected"
                  : safeNumber(results.totalTrades) > 500
                    ? "Moderate trading frequency with good activity"
                    : "Conservative trading approach with selective entries"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const safeNumber = (value: any, fallback = 0) => {
  const num = Number(value)
  return isNaN(num) || value === null || value === undefined ? fallback : num
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "₣", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  // Add more currencies as needed
]
