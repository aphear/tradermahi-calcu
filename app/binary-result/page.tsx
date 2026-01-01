"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, DollarSign, TrendingUp, Download, Target, BarChart3, FileSpreadsheet } from "lucide-react"
import ResultsVisualization from "@/components/results-visualization"

// Currency symbols mapping
const currencySymbols: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  CHF: "Fr",
  CNY: "¥",
  INR: "₹",
  BDT: "৳",
  default: "$",
}

const getCurrencySymbol = (currency: string): string => {
  return currencySymbols[currency] || currencySymbols.default
}

export default function BinaryResultPage() {
  const router = useRouter()
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem("tradingCalculatorResults")
        if (data) {
          const parsedData = JSON.parse(data)
          console.log("[v0] Binary results loaded:", parsedData)
          setResults(parsedData)
        } else {
          setError("No binary results found. Please run a calculation first.")
        }
        setIsLoading(false)
      }
    } catch (err) {
      console.error("[v0] Error loading binary results:", err)
      setError("Error loading results")
      setIsLoading(false)
    }
  }, [])

  const handleExport = (type: "csv" | "print" | "pdf") => {
    if (!results) return

    if (type === "csv") {
      exportToCSV()
    } else if (type === "print") {
      window.print()
    }
  }

  const exportToCSV = () => {
    if (!results) return

    const csvData = [
      ["Metric", "Value"],
      ["Initial Capital", `${results.currency || "USD"} ${results.initialCapital}`],
      ["Final Capital", `${results.currency || "USD"} ${results.finalCapital}`],
      ["Net Profit", `${results.currency || "USD"} ${results.netProfit}`],
      ["Return Percentage", `${results.returnPercentage?.toFixed(2)}%`],
      ["Total Trades", results.totalTrades],
      ["Winning Trades", results.winningTrades],
      ["Losing Trades", results.losingTrades],
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "binary-results.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleCreateSheet = () => {
    if (!results) return

    // Store binary sheet data in localStorage
    const existingSheets = localStorage.getItem("binaryPLSheets")
    const sheets = existingSheets ? JSON.parse(existingSheets) : []

    const newSheet = {
      id: Date.now(),
      date: new Date().toISOString(),
      initialCapital: results.initialCapital,
      finalCapital: results.finalCapital,
      netProfit: results.netProfit,
      returnPercentage: results.returnPercentage,
      totalTrades: results.totalTrades,
      winningTrades: results.winningTrades,
      losingTrades: results.losingTrades,
      currency: results.currency || "USD",
      interestRate: results.interestRate,
      interestRateType: results.interestRateType,
      startDate: results.startDate,
      endDate: results.endDate,
      tradingPeriod: results.tradingPeriod,
    }

    sheets.push(newSheet)
    localStorage.setItem("binaryPLSheets", JSON.stringify(sheets))

    // Also update plEntries for Binary sheets
    const plEntriesData = localStorage.getItem("plEntries")
    const plEntries = plEntriesData ? JSON.parse(plEntriesData) : { binary: [], forex: [] }

    plEntries.binary.push(newSheet)
    localStorage.setItem("plEntries", JSON.stringify(plEntries))

    alert("You're Binary Result Sheet Created On P/L Binary Sheet, Check Now")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1520] text-[#e6eef9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2a7fff] mx-auto"></div>
          <p className="mt-4 text-[#8fa3bf]">Loading results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1520] text-[#e6eef9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <Button onClick={() => router.push("/")} className="mt-4 bg-[#2a7fff] hover:bg-[#2a7fff]/80 text-white">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-[#0d1520] text-[#e6eef9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8fa3bf]">No data available</p>
          <Button onClick={() => router.push("/")} className="mt-4 bg-[#2a7fff] hover:bg-[#2a7fff]/80 text-white">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const currencySymbol = getCurrencySymbol(results.currency || "USD")

  // Transform results for ResultsVisualization component
  const visualizationResults = {
    currency: results.currency || "USD",
    initialCapital: results.initialCapital,
    targetProfit: results.netProfit,
    riskPercentage: results.riskPerTradeValue ? Number.parseFloat(results.riskPerTradeValue) : 2,
    winRate: results.winRateValue ? Number.parseFloat(results.winRateValue) : 60,
    riskRewardRatio: results.riskRewardRatioValue
      ? Number.parseFloat(results.riskRewardRatioValue.split(":")[1]) /
        Number.parseFloat(results.riskRewardRatioValue.split(":")[0])
      : 2,
    tradingDays: results.tradingPeriod?.tradingDays || results.tradingPeriod?.days || 30,
    finalCapital: results.finalCapital,
    totalProfit: results.netProfit,
    totalTrades: results.totalTrades,
    winningTrades: results.winningTrades,
    losingTrades: results.losingTrades,
    maxDrawdown: results.totalLosses || 0,
    profitFactor: results.totalLosses > 0 ? results.totalWinnings / results.totalLosses : results.totalWinnings,
    averageDailyProfit: results.netProfit / (results.tradingPeriod?.tradingDays || results.tradingPeriod?.days || 30),
    percentageProfit: results.returnPercentage,
    interestRateType: results.interestRateType,
    interestRate:
      typeof results.interestRate === "string" ? Number.parseFloat(results.interestRate) : results.interestRate,
    startDate: results.startDate,
    endDate: results.endDate,
    hasStopLoss: false,
    hasDailyTrades: true,
    tradesPerDay: results.totalTrades / (results.tradingPeriod?.tradingDays || results.tradingPeriod?.days || 30),
  }

  return (
    <div className="min-h-screen bg-[#0d1520] text-[#e6eef9]">
      <header className="border-b border-[#2a7fff]/20 bg-[#131d2d]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/")}
              className="border-[#2a7fff]/30 hover:border-[#2a7fff]/50 bg-[#131d2d] text-[#e6eef9]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="w-10 h-10 rounded-lg bg-[#2a7fff]/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-[#2a7fff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Binary Result</h1>
              <p className="text-sm text-[#8fa3bf]">Trading Analysis Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="border-[#2a7fff]/30 hover:border-[#2a7fff]/50 bg-[#131d2d] text-[#e6eef9]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8fa3bf] text-sm">Initial Capital</p>
                    <p className="text-2xl font-bold text-[#e6eef9]">
                      {currencySymbol}
                      {results.initialCapital?.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#2a7fff]/20 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-[#2a7fff]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8fa3bf] text-sm">Final Capital</p>
                    <p className="text-2xl font-bold text-green-400">
                      {currencySymbol}
                      {results.finalCapital?.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8fa3bf] text-sm">Net Profit</p>
                    <p className="text-2xl font-bold text-green-400">
                      {currencySymbol}
                      {results.netProfit?.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8fa3bf] text-sm">Return</p>
                    <p className="text-2xl font-bold text-[#2a7fff]">{results.returnPercentage?.toFixed(2)}%</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#2a7fff]/20 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-[#2a7fff]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Visualization */}
          <ResultsVisualization
            results={visualizationResults}
            onExport={handleExport}
            currentLanguage="en"
            onCreateSheet={handleCreateSheet}
          />

          {/* Create Sheet Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleCreateSheet}
              className="bg-gradient-to-r from-[#2a7fff] to-[#0066ff] hover:from-[#2a7fff]/90 hover:to-[#0066ff]/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
            >
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              Create Sheet
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
