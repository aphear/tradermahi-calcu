"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, DollarSign, TrendingUp, Percent, FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ResultsVisualization from "@/components/results-visualization"

interface CalculatorResults {
  initialCapital: number
  finalCapital: number
  netProfit: number
  profitPercentage: number
  winRate: number
  totalTrades: number
  totalWins: number
  totalLosses: number
  averageProfit: number
  averageLoss: number
  profitFactor: number
  maxDrawdown: number
  dailyResults: Array<{
    day: number
    startCapital: number
    endCapital: number
    profit: number
    trades: number
    wins: number
    losses: number
  }>
  tradeHistory: Array<{
    tradeNumber: number
    day: number
    result: "win" | "loss"
    amount: number
    runningCapital: number
  }>
  currency: string
  tradingDays: number
  profitPerTrade: number
  lossPerTrade: number
  tradesPerDay: number
}

export default function BinaryMoneyManagementResultPage() {
  const router = useRouter()
  const [results, setResults] = useState<CalculatorResults | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const savedResults = localStorage.getItem("tradingCalculatorResults")
      if (savedResults) {
        const parsed = JSON.parse(savedResults)
        setResults(parsed)
      } else {
        setError("No binary results found. Please run a calculation first.")
      }
    } catch (err) {
      console.error("Error loading results:", err)
      setError("Failed to load results. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleCreateSheet = useCallback(() => {
    if (!results) return

    try {
      const existingSheets = localStorage.getItem("binaryPLSheets")
      const sheets = existingSheets ? JSON.parse(existingSheets) : []

      const newSheet = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: "binary",
        initialCapital: results.initialCapital,
        finalCapital: results.finalCapital,
        netProfit: results.netProfit,
        profitPercentage: results.profitPercentage,
        winRate: results.winRate,
        totalTrades: results.totalTrades,
        totalWins: results.totalWins,
        totalLosses: results.totalLosses,
        currency: results.currency || "USD",
        tradingDays: results.tradingDays,
        dailyResults: results.dailyResults,
      }

      sheets.push(newSheet)
      localStorage.setItem("binaryPLSheets", JSON.stringify(sheets))

      alert("You're Binary Result Sheet Created On P/L Binary Sheet, Check Now")
      router.push("/")
    } catch (err) {
      console.error("Error creating sheet:", err)
      alert("Failed to create sheet. Please try again.")
    }
  }, [results, router])

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      BDT: "৳",
      INR: "₹",
    }
    return symbols[currency] || "$"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "No results available"}</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const currencySymbol = getCurrencySymbol(results.currency || "USD")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold">Binary Money Management Result</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Initial Capital</span>
              </div>
              <p className="text-lg font-bold text-blue-600">
                {currencySymbol}
                {results.initialCapital.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Final Capital</span>
              </div>
              <p className="text-lg font-bold text-green-600">
                {currencySymbol}
                {results.finalCapital.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-muted-foreground">Net Profit</span>
              </div>
              <p className="text-lg font-bold text-emerald-600">
                {currencySymbol}
                {results.netProfit.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-muted-foreground">Return</span>
              </div>
              <p className="text-lg font-bold text-purple-600">{results.profitPercentage.toFixed(2)}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Trading Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trading Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{results.totalTrades}</p>
                <p className="text-xs text-muted-foreground">Total Trades</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{results.totalWins}</p>
                <p className="text-xs text-muted-foreground">Wins</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{results.totalLosses}</p>
                <p className="text-xs text-muted-foreground">Losses</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{results.winRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Visualization */}
        {results.dailyResults && results.dailyResults.length > 0 && (
          <ResultsVisualization
            dailyResults={results.dailyResults}
            initialCapital={results.initialCapital}
            finalCapital={results.finalCapital}
            totalProfit={results.netProfit}
            profitPercentage={results.profitPercentage}
            currency={results.currency || "USD"}
            totalTrades={results.totalTrades}
            winRate={results.winRate}
            profitFactor={results.profitFactor}
            maxDrawdown={results.maxDrawdown}
            tradingDays={results.tradingDays}
            stopLossAmount={0}
          />
        )}

        {/* Create Sheet Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleCreateSheet}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
          >
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Create Sheet
          </Button>
        </div>
      </main>
    </div>
  )
}
