"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslationContext } from "@/lib/translation-context"
import { sessionUtils } from "@/lib/session"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Menu, Calculator, TrendingUp, BarChart3, Table, Send, Clock, Brain, DollarSign, Languages } from "lucide-react"
import TradingCalculatorForm from "@/components/trading-calculator-form"
import ResultsVisualization from "@/components/results-visualization"
import PLSheetSelector from "@/components/pl-sheet-selector"
import { useRouter } from "next/navigation"

interface TradingDashboardProps {
  onLogout: () => void
  currentLanguage: string
  onLanguageChange: (language: string) => void
}

export default function TradingDashboard({ onLogout, currentLanguage, onLanguageChange }: TradingDashboardProps) {
  const [activeTab, setActiveTab] = useState("calculator")
  const [calculatorResults, setCalculatorResults] = useState(null)
  const [fxMoneyResults, setFxMoneyResults] = useState(null)
  const [plSheetData, setPLSheetData] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const { t } = useTranslationContext()
  const session = sessionUtils.getSession()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const savedResults = localStorage.getItem("tradingCalculatorResults")
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults)
        setCalculatorResults(parsedResults)
      } catch (error) {
        console.error("Error loading saved results:", error)
        localStorage.removeItem("tradingCalculatorResults")
      }
    }

    const savedFxResults = localStorage.getItem("fxMoneyManagerResults")
    if (savedFxResults) {
      try {
        const parsedFxResults = JSON.parse(savedFxResults)
        setFxMoneyResults(parsedFxResults)
      } catch (error) {
        console.error("Error loading saved FX results:", error)
      }
    }
  }, [])

  const handleLogout = () => {
    sessionUtils.clearSession()
    onLogout()
  }

  const handleCalculate = (data: any) => {
    const results = calculateTradingResults(data)
    setCalculatorResults(results)
    localStorage.setItem("tradingCalculatorResults", JSON.stringify(results))
    setActiveTab("results")
  }

  const handleReset = () => {
    setCalculatorResults(null)
    localStorage.removeItem("tradingCalculatorResults")
  }

  const handleExport = (type: "csv" | "print" | "pdf") => {
    if (!calculatorResults) return

    switch (type) {
      case "csv":
        exportToCSV()
        break
      case "print":
        exportToPrint()
        break
      case "pdf":
        exportToPDF()
        break
    }
  }

  const handleCreateSheet = (sheetData: any) => {
    setPLSheetData(sheetData)
    setActiveTab("plsheet")

    toast({
      title: "Sheet Created",
      description: "P/L Sheet has been created with your calculation results",
    })
  }

  const handleTabChange = (tabId: string) => {
    if (tabId !== "plsheet") {
      setPLSheetData(null)
    }
    setActiveTab(tabId)
  }

  const exportToCSV = () => {
    const csvData = [
      ["Metric", "Value"],
      ["Initial Capital", `${calculatorResults.currency} ${calculatorResults.initialCapital}`],
      ["Final Capital", `${calculatorResults.currency} ${calculatorResults.finalCapital}`],
      ["Net Profit", `${calculatorResults.currency} ${calculatorResults.netProfit}`],
      ["Return Percentage", `${calculatorResults.returnPercentage.toFixed(2)}%`],
      ["Total Trades", calculatorResults.totalTrades],
      ["Winning Trades", calculatorResults.winningTrades],
      ["Losing Trades", calculatorResults.losingTrades],
      ["Total Winnings", `${calculatorResults.currency} ${calculatorResults.totalWinnings}`],
      ["Total Losses", `${calculatorResults.currency} ${calculatorResults.totalLosses}`],
      ["Average Win", `${calculatorResults.currency} ${calculatorResults.avgWinAmount}`],
      ["Average Loss", `${calculatorResults.currency} ${calculatorResults.avgLossAmount}`],
      ["Interest Rate", `${calculatorResults.interestRate}%`],
      ["Capital with Interest", `${calculatorResults.currency} ${calculatorResults.capitalWithInterest}`],
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "trading-results.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: "Trading results exported to CSV file",
    })
  }

  const exportToPrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Trading Results Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
            .card { border: 1px solid #ccc; padding: 15px; border-radius: 8px; }
            .table { width: 100%; border-collapse: collapse; }
            .table th, .table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            .table th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Trading Results Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="summary">
            <div class="card">
              <h3>Net Profit</h3>
              <p>${calculatorResults.currency} ${calculatorResults.netProfit.toLocaleString()}</p>
            </div>
            <div class="card">
              <h3>Total Return</h3>
              <p>${calculatorResults.returnPercentage.toFixed(2)}%</p>
            </div>
            <div class="card">
              <h3>Total Trades</h3>
              <p>${calculatorResults.totalTrades.toLocaleString()}</p>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr><th>Metric</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>Initial Capital</td><td>${calculatorResults.currency} ${calculatorResults.initialCapital.toLocaleString()}</td></tr>
              <tr><td>Final Capital</td><td>${calculatorResults.currency} ${calculatorResults.finalCapital.toLocaleString()}</td></tr>
              <tr><td>Net Profit</td><td>${calculatorResults.currency} ${calculatorResults.netProfit.toLocaleString()}</td></tr>
              <tr><td>Return Percentage</td><td>${calculatorResults.returnPercentage.toFixed(2)}%</td></tr>
              <tr><td>Total Trades</td><td>${calculatorResults.totalTrades.toLocaleString()}</td></tr>
              <tr><td>Winning Trades</td><td>${calculatorResults.winningTrades.toLocaleString()}</td></tr>
              <tr><td>Losing Trades</td><td>${calculatorResults.losingTrades.toLocaleString()}</td></tr>
              <tr><td>Interest Rate</td><td>${calculatorResults.interestRate}%</td></tr>
              <tr><td>Capital with Interest</td><td>${calculatorResults.currency} ${calculatorResults.capitalWithInterest.toLocaleString()}</td></tr>
            </tbody>
          </table>
        </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    printWindow?.document.write(printContent)
    printWindow?.document.close()
    printWindow?.print()

    toast({
      title: "Print Ready",
      description: "Trading results prepared for printing",
    })
  }

  const exportToPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented with jsPDF library",
    })
  }

  const calculateTradingResults = (data: any) => {
    console.log("[v0] Calculation data received:", data)

    const {
      initialCapital,
      interestRateType,
      interestRate,
      riskPerTrade,
      winRate,
      riskRewardRatio,
      dateInputType,
      manualYear,
      manualMonth,
      manualDay,
      startDate,
      endDate,
      useDailyTrades,
      dailyTradesCount,
      includesAllDays,
      selectedWeekdays,
    } = data

    const capital = Number.parseFloat(initialCapital)

    let interest = 0
    if (interestRateType === "custom" && interestRate) {
      interest = Number.parseFloat(interestRate) / 100
    }

    console.log("[v0] Parsed capital:", capital, "interest type:", interestRateType, "interest:", interest)

    const risk = riskPerTrade ? Number.parseFloat(riskPerTrade) / 100 : 0.02
    const winRateDecimal = winRate ? Number.parseFloat(winRate) / 100 : 0.6

    let rewardRatio = 2
    if (riskRewardRatio) {
      const [riskPart, rewardPart] = riskRewardRatio.split(":").map(Number)
      rewardRatio = rewardPart / riskPart
    }

    let totalDays = 0
    let calculatedStartDate: Date
    let calculatedEndDate: Date

    if (dateInputType === "manual") {
      const currentDate = new Date()

      if (manualDay && !manualMonth && !manualYear) {
        // Only day provided - calculate for that many days from today
        totalDays = Number.parseInt(manualDay)
        calculatedStartDate = new Date()
        calculatedEndDate = new Date()
        calculatedEndDate.setDate(calculatedStartDate.getDate() + totalDays - 1)
      } else if (manualMonth && !manualDay && !manualYear) {
        // Only month provided - calculate for that many months
        const monthsToAdd = Number.parseInt(manualMonth)
        calculatedStartDate = new Date()
        calculatedEndDate = new Date()
        calculatedEndDate.setMonth(calculatedStartDate.getMonth() + monthsToAdd)
        totalDays = Math.ceil((calculatedEndDate.getTime() - calculatedStartDate.getTime()) / (1000 * 60 * 60 * 24))
      } else if (manualYear && !manualMonth && !manualDay) {
        // Only year provided - calculate for that many years
        const yearsToAdd = Number.parseInt(manualYear)
        calculatedStartDate = new Date()
        calculatedEndDate = new Date()
        calculatedEndDate.setFullYear(calculatedStartDate.getFullYear() + yearsToAdd)
        totalDays = Math.ceil((calculatedEndDate.getTime() - calculatedStartDate.getTime()) / (1000 * 60 * 60 * 24))
      } else if (manualYear && manualMonth && !manualDay) {
        // Year and month provided - calculate for specific month in specific year
        const year = Number.parseInt(manualYear)
        const month = Number.parseInt(manualMonth)
        calculatedStartDate = new Date(year, month - 1, 1)
        calculatedEndDate = new Date(year, month, 0) // Last day of the month
        totalDays = Math.ceil((calculatedEndDate.getTime() - calculatedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      } else if (manualYear && manualDay && !manualMonth) {
        // Year and day provided - calculate for specific days in that year
        const year = Number.parseInt(manualYear)
        const days = Number.parseInt(manualDay)
        calculatedStartDate = new Date(year, 0, 1)
        calculatedEndDate = new Date(year, 0, days)
        totalDays = days
      } else if (manualMonth && manualDay && !manualYear) {
        // Month and day provided - calculate for specific days in current year's month
        const month = Number.parseInt(manualMonth)
        const days = Number.parseInt(manualDay)
        const year = currentDate.getFullYear()
        calculatedStartDate = new Date(year, month - 1, 1)
        calculatedEndDate = new Date(year, month - 1, days)
        totalDays = days
      } else if (manualYear && manualMonth && manualDay) {
        // All three provided - calculate from specific date for specified days
        const year = Number.parseInt(manualYear)
        const month = Number.parseInt(manualMonth)
        const days = Number.parseInt(manualDay)
        calculatedStartDate = new Date(year, month - 1, 1)
        calculatedEndDate = new Date(year, month - 1, days)
        totalDays = days
      } else {
        // Default case - use current month
        calculatedStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        calculatedEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        totalDays = Math.ceil((calculatedEndDate.getTime() - calculatedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      }

      console.log(
        "[v0] Manual date calculation - Start:",
        calculatedStartDate,
        "End:",
        calculatedEndDate,
        "Total days:",
        totalDays,
      )
    } else {
      calculatedStartDate = new Date(startDate)
      calculatedEndDate = new Date(endDate)
      totalDays = Math.ceil((calculatedEndDate.getTime() - calculatedStartDate.getTime()) / (1000 * 60 * 60 * 24))
      console.log(
        "[v0] Calendar date calculation - Start:",
        calculatedStartDate,
        "End:",
        calculatedEndDate,
        "Total days:",
        totalDays,
      )
    }

    let totalTradingDays = totalDays
    if (!includesAllDays && selectedWeekdays && selectedWeekdays.length > 0) {
      const weekdayMap = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      }

      let tradingDaysCount = 0
      for (let d = new Date(calculatedStartDate); d <= calculatedEndDate; d.setDate(d.getDate() + 1)) {
        const dayName = Object.keys(weekdayMap).find((key) => weekdayMap[key] === d.getDay())
        if (selectedWeekdays.includes(dayName)) {
          tradingDaysCount++
        }
      }
      totalTradingDays = tradingDaysCount
    }

    console.log("[v0] Total days:", totalDays, "Trading days:", totalTradingDays)

    const tradesPerDay = useDailyTrades ? Number.parseInt(dailyTradesCount) : 3
    const totalTrades = totalTradingDays * tradesPerDay

    const winningTrades = Math.floor(totalTrades * winRateDecimal)
    const losingTrades = totalTrades - winningTrades

    const avgWinAmount = capital * risk * rewardRatio
    const avgLossAmount = capital * risk

    const totalWinnings = winningTrades * avgWinAmount
    const totalLosses = losingTrades * avgLossAmount
    const tradingNetProfit = totalWinnings - totalLosses

    let capitalWithInterest = capital
    const dailyBreakdown = []
    let finalCapital = capital
    let netProfit = tradingNetProfit
    let returnPercentage = (tradingNetProfit / capital) * 100

    if (interestRateType === "low") {
      let currentBalance = capital
      for (let day = 1; day <= totalDays; day++) {
        const dailyInterestRate = (Math.random() * 3 + 7) / 100
        const dailyEarning = capital * dailyInterestRate
        currentBalance += dailyEarning
        dailyBreakdown.push({
          day,
          interestRate: dailyInterestRate * 100,
          earning: dailyEarning,
          balance: currentBalance,
        })
      }
      capitalWithInterest = currentBalance
      finalCapital = capitalWithInterest
      netProfit = capitalWithInterest - capital
      returnPercentage = ((capitalWithInterest - capital) / capital) * 100
    } else if (interestRateType === "custom" && interest > 0) {
      let currentBalance = capital
      console.log("[v0] Starting compound interest calculation with balance:", currentBalance, "rate:", interest)

      for (let day = 1; day <= totalDays; day++) {
        const dailyEarning = currentBalance * interest
        currentBalance = currentBalance + dailyEarning

        console.log(
          `[v0] Day ${day}: Balance before: ${(currentBalance - dailyEarning).toFixed(2)}, Earning: ${dailyEarning.toFixed(2)}, Balance after: ${currentBalance.toFixed(2)}`,
        )

        dailyBreakdown.push({
          day,
          date: new Date(calculatedStartDate.getTime() + (day - 1) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          interestRate: interest * 100,
          earning: Math.round(dailyEarning * 100) / 100,
          totalEarnings: Math.round((currentBalance - capital) * 100) / 100,
          balance: Math.round(currentBalance * 100) / 100,
        })
      }
      capitalWithInterest = Math.round(currentBalance * 100) / 100
      console.log("[v0] Final capital with compound interest:", capitalWithInterest)

      finalCapital = capitalWithInterest
      netProfit = Math.round((capitalWithInterest - capital) * 100) / 100
      returnPercentage = Math.round(((capitalWithInterest - capital) / capital) * 100 * 100) / 100
    } else {
      finalCapital = capital + tradingNetProfit
      netProfit = tradingNetProfit
      returnPercentage = (tradingNetProfit / capital) * 100
    }

    console.log("[v0] Final calculations:", {
      netProfit,
      finalCapital,
      returnPercentage,
      totalTrades,
      capitalWithInterest,
    })

    return {
      initialCapital: capital,
      finalCapital,
      netProfit,
      returnPercentage,
      totalTrades,
      winningTrades,
      losingTrades,
      totalWinnings,
      totalLosses,
      avgWinAmount,
      avgLossAmount,
      tradingPeriod: {
        days: totalDays,
        tradingDays: totalTradingDays,
        weeks: Math.ceil(totalDays / 7),
      },
      currency: data.currency,
      interestRate: interestRateType === "custom" ? interestRate : "Variable (7-10%)",
      interestRateType,
      capitalWithInterest,
      dailyBreakdown,
      hasRiskPerTrade: !!riskPerTrade,
      hasWinRate: !!winRate,
      hasRiskRewardRatio: !!riskRewardRatio,
      riskPerTradeValue: riskPerTrade,
      winRateValue: winRate,
      riskRewardRatioValue: riskRewardRatio,
      startDate: calculatedStartDate.toISOString().split("T")[0],
      endDate: calculatedEndDate.toISOString().split("T")[0],
    }
  }

  const handleMenuToggle = () => {
    console.log("[v0] Menu toggle clicked, current state:", isMenuOpen)
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMenuItemClick = (action: string) => {
    console.log("[v0] Menu item clicked:", action)
    setIsMenuOpen(false)

    try {
      if (action === "forex-calculator") {
        router.push("/forex-calculator")
      }
    } catch (error) {
      console.error("[v0] Navigation error:", error)
      toast({
        title: t.navigationError,
        description: t.unableToNavigate,
        variant: "destructive",
      })
    }
  }

  const handleViewFxResults = () => {
    console.log("[v0] FX Results button clicked")
    console.log("[v0] Navigating to /fx-money-manager/results")
    router.push("/fx-money-manager/results")
  }

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "fxMoneyManagerResults" && e.newValue) {
        try {
          const parsedResults = JSON.parse(e.newValue)
          setFxMoneyResults(parsedResults)
        } catch (error) {
          console.error("Error parsing FX results from storage:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-8 h-8 animate-pulse mx-auto mb-2" />
          <p>{t.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">{t.tradingProfitCalculator}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="glass-card border-primary/30 hover:border-primary/50 transition-colors bg-transparent p-2"
                onClick={handleMenuToggle}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-primary/30 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    {/* Language Selector Section */}
                    <div className="px-4 py-3 border-b border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Languages className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{t.language} / ভাষা / भाषा</span>
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            onLanguageChange("en")
                            setIsMenuOpen(false)
                          }}
                          className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-primary/10 transition-colors ${
                            currentLanguage === "en" ? "bg-primary/20 text-primary" : ""
                          }`}
                        >
                          🇺🇸 English
                        </button>
                        <button
                          onClick={() => {
                            onLanguageChange("bn")
                            setIsMenuOpen(false)
                          }}
                          className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-primary/10 transition-colors ${
                            currentLanguage === "bn" ? "bg-primary/20 text-primary" : ""
                          }`}
                        >
                          🇧🇩 বাংলা
                        </button>
                        <button
                          onClick={() => {
                            onLanguageChange("hi")
                            setIsMenuOpen(false)
                          }}
                          className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-primary/10 transition-colors ${
                            currentLanguage === "hi" ? "bg-primary/20 text-primary" : ""
                          }`}
                        >
                          🇮🇳 हिन्दी
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} aria-hidden="true" />}

      {/* Navigation Tabs */}
      <nav className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: "calculator", label: t.binary, icon: TrendingUp },
              { id: "forex", label: t.forex, icon: TrendingUp },
              { id: "plsheet", label: t.plSheet, icon: Table },
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    handleTabChange(tab.id)
                  }}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <IconComponent className="inline-block w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "calculator" && (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <Button
                variant="outline"
                size="sm"
                className="max-w-xs h-8 text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border-primary/50 hover:border-primary shadow-md hover:shadow-lg transition-all duration-300 animate-pulse px-4"
                onClick={() => {
                  if (calculatorResults) {
                    setActiveTab("results")
                  } else {
                    toast({
                      title: t.noResultsAvailable,
                      description: t.pleaseRunCalculationFirst,
                      variant: "destructive",
                    })
                  }
                }}
              >
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
                  {t.clickHereToSeeResult}
                </span>
              </Button>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-heading">
                  <TrendingUp className="inline-block w-5 h-5 mr-2 text-primary" />
                  {t.tradingProfitCalculator}
                </CardTitle>
                <CardDescription>{t.calculateTradingProfits}</CardDescription>
              </CardHeader>
            </Card>
            <TradingCalculatorForm
              onCalculate={handleCalculate}
              onReset={handleReset}
              currentLanguage={currentLanguage}
            />
          </div>
        )}

        {activeTab === "results" && (
          <div>
            {calculatorResults ? (
              <ResultsVisualization
                results={calculatorResults}
                onExport={handleExport}
                currentLanguage={currentLanguage}
                onCreateSheet={handleCreateSheet}
              />
            ) : (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="font-heading">
                    <BarChart3 className="inline-block w-5 h-5 mr-2 text-accent" />
                    {t.tradingResults}
                  </CardTitle>
                  <CardDescription>{t.viewTradingPerformance}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
                    <p className="text-muted-foreground">{t.runCalculationToSeeResults}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "plsheet" && (
          <div>
            <PLSheetSelector onBack={() => setActiveTab("results")} prePopulatedData={plSheetData} />
          </div>
        )}

        {activeTab === "forex" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Card className="glass-card rounded-2xl border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-blue-500/5 to-blue-600/10">
                <CardHeader className="text-center pb-2 sm:pb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-2 sm:mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Calculator className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-blue-500" />
                  </div>
                  <CardTitle className="text-sm sm:text-lg lg:text-xl font-heading text-blue-600 dark:text-blue-400">
                    {t.pipCalculator}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={() => router.push("/pip-calculator-options")}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 sm:py-3 px-2 sm:px-4 lg:px-6 rounded-lg transition-colors text-xs sm:text-sm lg:text-base shadow-lg"
                  >
                    {t.start}
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-green-500/5 to-green-600/10">
                <CardHeader className="text-center pb-4 sm:pb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Clock className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-green-500" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-heading text-green-600 dark:text-green-400">
                    {t.forexMarketHour}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={() => router.push("/forex-market-hours")}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 sm:py-3 px-2 sm:px-4 lg:px-6 rounded-lg transition-colors text-xs sm:text-sm lg:text-base shadow-lg"
                  >
                    {t.start}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card rounded-2xl border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-purple-500/5 to-purple-600/10">
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Brain className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-purple-500" />
                </div>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl font-heading text-purple-600 dark:text-purple-400">
                  {t.smartForexCalculator}
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">{t.advancedTradingCalculations}</p>
              </CardHeader>
              <CardContent className="text-center pb-6 sm:pb-8">
                <Button
                  onClick={() => router.push("/smart-forex-calculator")}
                  className="w-full max-w-md mx-auto bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 lg:px-8 rounded-lg transition-colors text-sm sm:text-base lg:text-lg shadow-lg"
                >
                  {t.start}
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-2xl border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-orange-500/5 to-orange-600/10">
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-orange-500" />
                </div>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl font-heading text-orange-600 dark:text-orange-400">
                  {t.fxMoneyManage}
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">{t.beforeTradeForexManagement}</p>
              </CardHeader>
              <CardContent className="text-center pb-6 sm:pb-8 space-y-3">
                <Button
                  onClick={() => router.push("/fx-money-manager")}
                  className="w-full max-w-md mx-auto bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 lg:px-8 rounded-lg transition-colors text-sm sm:text-base lg:text-lg shadow-lg"
                >
                  {t.start}
                </Button>
                <Button
                  onClick={handleViewFxResults}
                  variant="outline"
                  className="w-full max-w-md mx-auto border-orange-500/50 text-orange-600 hover:bg-orange-500/10 hover:border-orange-500 font-medium py-3 sm:py-4 px-4 sm:px-6 lg:px-8 rounded-lg transition-colors text-sm sm:text-base lg:text-lg bg-transparent"
                >
                  {t.result}{" "}
                  {fxMoneyResults && (
                    <span className="ml-2 text-xs bg-orange-500/20 px-2 py-1 rounded-full">{t.available}</span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Disclaimer Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-primary/30 p-3">
        <div className="text-center text-sm text-muted-foreground">
          <span>{t.tradingCalculatorOwner} </span>
          <a
            href="https://t.me/MTFUTURESIGNAL01"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <Send className="inline-block w-4 h-4 mr-1" />
            Trader Mahi
          </a>
        </div>
      </div>
    </div>
  )
}
