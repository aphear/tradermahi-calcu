"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Target,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", symbol: "₣", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", flag: "🇮🇱" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", flag: "🇨🇱" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼", flag: "🇶🇦" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", flag: "🇧🇭" },
  { code: "OMR", name: "Omani Rial", symbol: "﷼", flag: "🇴🇲" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا", flag: "🇯🇴" },
  { code: "LBP", name: "Lebanese Pound", symbol: "£", flag: "🇱🇧" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", flag: "🇪🇬" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", flag: "🇲🇦" },
  { code: "TND", name: "Tunisian Dinar", symbol: "د.ت", flag: "🇹🇳" },
  { code: "DZD", name: "Algerian Dinar", symbol: "د.ج", flag: "🇩🇿" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", flag: "🇺🇬" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", flag: "🇹🇿" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", flag: "🇪🇹" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "₨", flag: "🇲🇺" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "₨", flag: "🇱🇰" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨", flag: "🇳🇵" },
  { code: "BTN", name: "Bhutanese Ngultrum", symbol: "Nu.", flag: "🇧🇹" },
  { code: "MVR", name: "Maldivian Rufiyaa", symbol: "Rf", flag: "🇲🇻" },
  { code: "USDT", name: "Tether USD", symbol: "$", flag: "💰" },
]

interface FxData {
  currency: string
  initialCapital: number
  targetProfit: number
  riskPercentage: number
  winRate: number
  riskRewardRatio: number
  tradingDays: number
  startDate?: string
  endDate?: string
  interestType?: string
  interestRate?: number
  tradesPerDay?: number
  riskAmount?: number
  rewardAmount?: number
  enableStopLoss?: boolean
  stopLossType?: string | null
  stopLossValue?: number | null
}

interface TradeResult {
  day: number
  date: string
  trades: number
  wins: number
  losses: number
  dailyProfit: number
  cumulativeProfit: number
  balance: number
  drawdown: number
  winRate: number
}

interface Results {
  trades: TradeResult[]
  summary: {
    totalTrades: number
    totalWins: number
    totalLosses: number
    totalProfit: number
    finalBalance: number
    maxDrawdown: number
    averageWinRate: number
    profitFactor: number
    sharpeRatio: number
    maxConsecutiveWins: number
    maxConsecutiveLosses: number
    averageDailyProfit: number
    bestDay: number
    worstDay: number
    profitableDays: number
    losingDays: number
    breakEvenDays: number
    averageTradesPerDay: number
    totalTradingDays: number
    roi: number
    annualizedReturn: number
    volatility: number
    calmarRatio: number
    sortinoRatio: number
    recoveryFactor: number
    payoffRatio: number
    profitPerTrade: number
    lossPerTrade: number
    largestWin: number
    largestLoss: number
    averageWin: number
    averageLoss: number
    winLossRatio: number
    expectancy: number
    kelly: number
    var95: number
    cvar95: number
    ulcerIndex: number
    sterlingRatio: number
    burkeRatio: number
    treynorRatio: number
    informationRatio: number
    trackingError: number
    battingAverage: number
    upCaptureRatio: number
    downCaptureRatio: number
    captureRatio: number
    selectivity: number
    netSelectivity: number
    diversificationRatio: number
    concentrationRatio: number
    herfindahlIndex: number
    effectiveNumberOfBets: number
    activePremium: number
    activeReturn: number
    activeRisk: number
    totalReturn: number
    benchmarkReturn: number
    alpha: number
    beta: number
    correlation: number
    rSquared: number
    standardError: number
    tStat: number
    pValue: number
  }
}

export default function ResultsPage() {
  const router = useRouter()
  const [fxData, setFxData] = useState<FxData | null>(null)
  const [results, setResults] = useState<Results | null>(null)
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily")
  const [sortColumn, setSortColumn] = useState<string>("day")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [expandedSections, setExpandedSections] = useState({
    performance: true,
    risk: false,
    trading: false,
    advanced: false,
  })
  const [animatedValues, setAnimatedValues] = useState({
    finalBalance: 0,
    totalProfit: 0,
    roi: 0,
    winRate: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    totalTrades: 0,
    profitFactor: 0,
    averageDailyProfit: 0,
    percentageProfit: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem("fxManager")
        if (data) {
          const parsedData = JSON.parse(data)
          console.log("[v0] Retrieved data from localStorage:", parsedData)

          if (parsedData && typeof parsedData === "object") {
            // Set default values for missing fields
            const validatedData = {
              currency: parsedData.currency || "USD",
              initialCapital: Number(parsedData.initialCapital) || 1000,
              targetProfit: Number(parsedData.targetProfit) || 100,
              riskPercentage: Number(parsedData.riskPercentage) || 2,
              winRate: Number(parsedData.winRate) || 60,
              riskRewardRatio: Number(parsedData.riskRewardRatio) || 2,
              tradingDays: Number(parsedData.totalDays) || Number(parsedData.tradingDays) || 30,
              startDate: parsedData.startDate,
              endDate: parsedData.endDate,
              interestType: parsedData.interestType || "low",
              interestRate: Number(parsedData.interestRate) || 10,
              tradesPerDay: Number(parsedData.tradesPerDay) || 3,
              riskAmount: Number(parsedData.riskAmount) || 10,
              rewardAmount: Number(parsedData.rewardAmount) || 15,
              enableStopLoss: parsedData.enableStopLoss || false,
              stopLossType: parsedData.stopLossType || null,
              stopLossValue: parsedData.stopLossValue ? Number(parsedData.stopLossValue) : null,
            }

            console.log("[v0] Validated data:", validatedData)
            setFxData(validatedData)
          } else {
            console.log("[v0] Invalid data structure, redirecting...")
            router.push("/fx-money-manager")
          }
        } else {
          console.log("[v0] No data found, redirecting...")
          router.push("/fx-money-manager")
        }
      }
    } catch (error) {
      console.error("[v0] Error parsing localStorage data:", error)
      setError("Error loading data")
      // Don't redirect immediately, show error message
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const getCurrencySymbol = (currencyCode: string): string => {
    try {
      if (!currencyCode) {
        console.log("[v0] No currency code provided, using default $")
        return "$"
      }

      console.log("[v0] Looking for currency symbol for:", currencyCode)
      const currency = currencies.find((c) => c.code === currencyCode.toUpperCase())
      const symbol = currency?.symbol || "$"
      console.log("[v0] Found currency symbol:", symbol)
      return symbol
    } catch (error) {
      console.error("[v0] Error getting currency symbol:", error)
      return "$"
    }
  }

  useEffect(() => {
    if (results && fxData) {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setAnimatedValues({
          finalBalance: Math.floor(results.summary.finalBalance * progress),
          totalProfit: Math.floor(results.summary.totalProfit * progress),
          roi: Math.floor(results.summary.roi * progress * 100) / 100,
          winRate: Math.floor(results.summary.averageWinRate * progress * 100) / 100,
          maxDrawdown: Math.floor(results.summary.maxDrawdown * progress * 100) / 100,
          sharpeRatio: Math.floor(results.summary.sharpeRatio * progress * 100) / 100,
          totalTrades: Math.floor(results.summary.totalTrades * progress),
          profitFactor: Math.floor(results.summary.profitFactor * progress * 100) / 100,
          averageDailyProfit: Math.floor(results.summary.averageDailyProfit * progress * 100) / 100,
          percentageProfit: Math.floor((results.summary.totalProfit / fxData.initialCapital) * progress * 10000) / 100,
        })

        if (currentStep >= steps) {
          clearInterval(interval)
        }
      }, stepDuration)

      return () => clearInterval(interval)
    }
  }, [results, fxData])

  useEffect(() => {
    if (fxData) {
      try {
        const calculatedResults = calculateTradingResults(fxData)
        setResults(calculatedResults)
      } catch (error) {
        console.error("Error calculating results:", error)
        setError("Error calculating trading results")
      }
    }
  }, [fxData])

  const calculateTradingResults = (data: FxData): Results => {
    const {
      initialCapital,
      targetProfit,
      riskPercentage,
      winRate,
      riskRewardRatio,
      tradingDays,
      interestType,
      interestRate,
      tradesPerDay,
      riskAmount,
      rewardAmount,
      // Destructure stop loss fields
      enableStopLoss,
      stopLossType,
      stopLossValue,
    } = data

    if (interestType === "custom" && interestRate) {
      console.log("[v0] Using compound interest calculation with rate:", interestRate)

      const trades: TradeResult[] = []
      let currentBalance = initialCapital
      let cumulativeProfit = 0
      let maxBalance = initialCapital
      let maxDrawdown = 0

      for (let day = 1; day <= tradingDays; day++) {
        const dailyProfit = (currentBalance * interestRate) / 100

        currentBalance += dailyProfit
        cumulativeProfit += dailyProfit

        if (currentBalance > maxBalance) {
          maxBalance = currentBalance
        }

        const currentDrawdown = ((maxBalance - currentBalance) / maxBalance) * 100
        if (currentDrawdown > maxDrawdown) {
          maxDrawdown = currentDrawdown
        }

        const date = new Date()
        date.setDate(date.getDate() + day - 1)

        trades.push({
          day,
          date: date.toISOString().split("T")[0],
          trades: 1,
          wins: 1,
          losses: 0,
          dailyProfit,
          cumulativeProfit,
          balance: currentBalance,
          drawdown: currentDrawdown,
          winRate: 100,
        })
      }

      const totalTrades = tradingDays
      const totalWins = tradingDays
      const totalLosses = 0
      const totalProfit = cumulativeProfit
      const finalBalance = currentBalance

      const roi = (totalProfit / initialCapital) * 100
      const annualizedReturn = Math.pow(finalBalance / initialCapital, 365 / tradingDays) - 1

      return {
        trades,
        summary: {
          totalTrades,
          totalWins,
          totalLosses,
          totalProfit,
          finalBalance,
          maxDrawdown,
          averageWinRate: 100,
          profitFactor: totalProfit > 0 ? 999 : 0,
          sharpeRatio: annualizedReturn > 0 ? annualizedReturn * 100 : 0,
          maxConsecutiveWins: tradingDays,
          maxConsecutiveLosses: 0,
          averageDailyProfit: totalProfit / tradingDays,
          bestDay: Math.max(...trades.map((t) => t.dailyProfit)),
          worstDay: Math.min(...trades.map((t) => t.dailyProfit)),
          profitableDays: tradingDays,
          losingDays: 0,
          breakEvenDays: 0,
          averageTradesPerDay: 1,
          totalTradingDays: tradingDays,
          roi,
          annualizedReturn: annualizedReturn * 100,
          volatility: 0,
          calmarRatio: annualizedReturn > 0 && maxDrawdown > 0 ? (annualizedReturn * 100) / maxDrawdown : 0,
          sortinoRatio: 0,
          recoveryFactor: 0,
          payoffRatio: 0,
          profitPerTrade: totalProfit / tradingDays,
          lossPerTrade: 0,
          largestWin: Math.max(...trades.map((t) => t.dailyProfit)),
          largestLoss: 0,
          averageWin: totalProfit / tradingDays,
          averageLoss: 0,
          winLossRatio: 999,
          expectancy: totalProfit / tradingDays,
          kelly: 0,
          var95: 0,
          cvar95: 0,
          ulcerIndex: 0,
          sterlingRatio: 0,
          burkeRatio: 0,
          treynorRatio: 0,
          informationRatio: 0,
          trackingError: 0,
          battingAverage: 0,
          upCaptureRatio: 0,
          downCaptureRatio: 0,
          captureRatio: 0,
          selectivity: 0,
          netSelectivity: 0,
          diversificationRatio: 0,
          concentrationRatio: 0,
          herfindahlIndex: 0,
          effectiveNumberOfBets: 0,
          activePremium: 0,
          activeReturn: 0,
          activeRisk: 0,
          totalReturn: roi,
          benchmarkReturn: 0,
          alpha: 0,
          beta: 0,
          correlation: 0,
          rSquared: 0,
          standardError: 0,
          tStat: 0,
          pValue: 0,
        },
      }
    }

    const calculatedRiskAmount = (initialCapital * riskPercentage) / 100
    const calculatedRewardAmount = calculatedRiskAmount * riskRewardRatio

    // Calculate stop loss amount if enabled
    let stopLossAmount = 0
    if (enableStopLoss && stopLossValue !== null && stopLossValue !== undefined) {
      if (stopLossType === "percentage") {
        stopLossAmount = (initialCapital * stopLossValue) / 100
      } else if (stopLossType === "fixed") {
        stopLossAmount = stopLossValue
      }
    }

    // Adjust trades per day calculation considering stop loss
    const effectiveRewardPerTrade = calculatedRewardAmount // Assume for now rewardAmount is the target gain per trade
    const effectiveRiskPerTrade = calculatedRiskAmount // Assume for now riskAmount is the target loss per trade

    // If stop loss is enabled and has a value, it might affect the calculation of trades needed to reach target profit.
    // This is a simplified adjustment. A more accurate model would consider the stop loss impact on the overall strategy.
    const profitTargetPerDay = targetProfit // Assuming targetProfit is daily

    const tradesPerDayAdjusted =
      profitTargetPerDay > 0 && effectiveRewardPerTrade > 0
        ? Math.ceil(profitTargetPerDay / (effectiveRewardPerTrade * (winRate / 100)))
        : tradesPerDay || 3 // Fallback to default or provided tradesPerDay

    const finalTradesPerDay = Math.max(1, tradesPerDayAdjusted) // Ensure at least 1 trade

    const trades: TradeResult[] = []
    let currentBalance = initialCapital
    let cumulativeProfit = 0
    let maxBalance = initialCapital
    let maxDrawdown = 0

    for (let day = 1; day <= tradingDays; day++) {
      const dailyTrades = finalTradesPerDay
      let dailyProfit = 0
      let wins = 0
      let losses = 0

      for (let trade = 0; trade < dailyTrades; trade++) {
        const isWin = Math.random() < winRate / 100
        if (isWin) {
          dailyProfit += calculatedRewardAmount
          wins++
        } else {
          // Apply stop loss if enabled and loss occurs
          const actualLoss =
            stopLossAmount > 0 && calculatedRiskAmount > stopLossAmount ? stopLossAmount : calculatedRiskAmount
          dailyProfit -= actualLoss
          losses++
        }
      }

      currentBalance += dailyProfit
      cumulativeProfit += dailyProfit

      if (currentBalance > maxBalance) {
        maxBalance = currentBalance
      }

      const currentDrawdown = ((maxBalance - currentBalance) / maxBalance) * 100
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown
      }

      const date = new Date()
      date.setDate(date.getDate() + day - 1)

      trades.push({
        day,
        date: date.toISOString().split("T")[0],
        trades: dailyTrades,
        wins,
        losses,
        dailyProfit,
        cumulativeProfit,
        balance: currentBalance,
        drawdown: currentDrawdown,
        winRate: (wins / dailyTrades) * 100,
      })
    }

    const totalTrades = tradingDays * finalTradesPerDay
    const totalWins = trades.reduce((sum, trade) => sum + trade.wins, 0)
    const totalLosses = trades.reduce((sum, trade) => sum + trade.losses, 0)
    const totalProfit = cumulativeProfit
    const finalBalance = currentBalance

    const profitableDays = trades.filter((t) => t.dailyProfit > 0).length
    const losingDays = trades.filter((t) => t.dailyProfit < 0).length
    const breakEvenDays = trades.filter((t) => t.dailyProfit === 0).length

    const dailyReturns = trades.map((t) => t.dailyProfit / initialCapital)
    const averageReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length
    const variance = dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / dailyReturns.length
    const volatility = Math.sqrt(variance) * Math.sqrt(252) * 100

    const roi = (totalProfit / initialCapital) * 100
    const annualizedReturn = Math.pow(finalBalance / initialCapital, 365 / tradingDays) - 1
    const sharpeRatio = volatility > 0 ? (annualizedReturn * 100) / volatility : 0

    // Recalculate profit factor using total wins/losses and risk/reward amounts
    const totalProfitFromWins = totalWins * calculatedRewardAmount
    const totalLossFromLosses = totalLosses * calculatedRiskAmount
    const profitFactor =
      totalLossFromLosses > 0
        ? totalProfitFromWins / totalLossFromLosses
        : totalProfitFromWins > 0
          ? Number.POSITIVE_INFINITY
          : 0

    return {
      trades,
      summary: {
        totalTrades,
        totalWins,
        totalLosses,
        totalProfit,
        finalBalance,
        maxDrawdown,
        averageWinRate: (totalWins / totalTrades) * 100,
        profitFactor,
        sharpeRatio,
        maxConsecutiveWins: 0,
        maxConsecutiveLosses: 0,
        averageDailyProfit: totalProfit / tradingDays,
        bestDay: Math.max(...trades.map((t) => t.dailyProfit)),
        worstDay: Math.min(...trades.map((t) => t.dailyProfit)),
        profitableDays,
        losingDays,
        breakEvenDays,
        averageTradesPerDay: finalTradesPerDay,
        totalTradingDays: tradingDays,
        roi,
        annualizedReturn: annualizedReturn * 100,
        volatility,
        calmarRatio: annualizedReturn > 0 && maxDrawdown > 0 ? (annualizedReturn * 100) / maxDrawdown : 0,
        sortinoRatio: 0,
        recoveryFactor: 0,
        payoffRatio: 0,
        profitPerTrade: calculatedRewardAmount,
        lossPerTrade: calculatedRiskAmount,
        largestWin: calculatedRewardAmount,
        largestLoss: calculatedRiskAmount,
        winLossRatio: calculatedRewardAmount / calculatedRiskAmount,
        expectancy: (winRate / 100) * calculatedRewardAmount - ((100 - winRate) / 100) * calculatedRiskAmount,
        kelly: 0,
        var95: 0,
        cvar95: 0,
        ulcerIndex: 0,
        sterlingRatio: 0,
        burkeRatio: 0,
        treynorRatio: 0,
        informationRatio: 0,
        trackingError: 0,
        battingAverage: 0,
        upCaptureRatio: 0,
        downCaptureRatio: 0,
        captureRatio: 0,
        selectivity: 0,
        netSelectivity: 0,
        diversificationRatio: 0,
        concentrationRatio: 0,
        herfindahlIndex: 0,
        effectiveNumberOfBets: 0,
        activePremium: 0,
        activeReturn: 0,
        activeRisk: 0,
        totalReturn: roi,
        benchmarkReturn: 0,
        alpha: 0,
        beta: 0,
        correlation: 0,
        rSquared: 0,
        standardError: 0,
        tStat: 0,
        pValue: 0,
      },
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const exportToCSV = () => {
    if (!results) return

    const csvContent = [
      [
        "Day",
        "Date",
        "Trades",
        "Wins",
        "Losses",
        "Daily Profit",
        "Cumulative Profit",
        "Balance",
        "Drawdown %",
        "Win Rate %",
      ],
      ...results.trades.map((trade) => [
        trade.day,
        trade.date,
        trade.trades,
        trade.wins,
        trade.losses,
        trade.dailyProfit.toFixed(2),
        trade.cumulativeProfit.toFixed(2),
        trade.balance.toFixed(2),
        trade.drawdown.toFixed(2),
        trade.winRate.toFixed(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "fx-trading-results.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const getAggregatedData = () => {
    if (!results) return []

    switch (viewMode) {
      case "weekly":
        const weeks: { [key: string]: TradeResult[] } = {}
        results.trades.forEach((trade) => {
          const date = new Date(trade.date)
          const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
          const weekKey = weekStart.toISOString().split("T")[0]
          if (!weeks[weekKey]) weeks[weekKey] = []
          weeks[weekKey].push(trade)
        })

        return Object.entries(weeks).map(([weekStart, trades], index) => ({
          period: `Week ${index + 1}`,
          date: weekStart,
          trades: trades.reduce((sum, t) => sum + t.trades, 0),
          wins: trades.reduce((sum, t) => sum + t.wins, 0),
          losses: trades.reduce((sum, t) => sum + t.losses, 0),
          dailyProfit: trades.reduce((sum, t) => sum + t.dailyProfit, 0),
          cumulativeProfit: trades[trades.length - 1]?.cumulativeProfit || 0,
          balance: trades[trades.length - 1]?.balance || 0,
          drawdown: Math.max(...trades.map((t) => t.drawdown)),
          winRate: (trades.reduce((sum, t) => sum + t.wins, 0) / trades.reduce((sum, t) => sum + t.trades, 0)) * 100,
        }))

      case "monthly":
        const months: { [key: string]: TradeResult[] } = {}
        results.trades.forEach((trade) => {
          const date = new Date(trade.date)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
          if (!months[monthKey]) months[monthKey] = []
          months[monthKey].push(trade)
        })

        return Object.entries(months).map(([monthKey, trades], index) => ({
          period: `Month ${index + 1}`,
          date: monthKey + "-01",
          trades: trades.reduce((sum, t) => sum + t.trades, 0),
          wins: trades.reduce((sum, t) => sum + t.wins, 0),
          losses: trades.reduce((sum, t) => sum + t.losses, 0),
          dailyProfit: trades.reduce((sum, t) => sum + t.dailyProfit, 0),
          cumulativeProfit: trades[trades.length - 1]?.cumulativeProfit || 0,
          balance: trades[trades.length - 1]?.balance || 0,
          drawdown: Math.max(...trades.map((t) => t.drawdown)),
          winRate: (trades.reduce((sum, t) => sum + t.wins, 0) / trades.reduce((sum, t) => sum + t.trades, 0)) * 100,
        }))

      default:
        return results.trades.map((trade) => ({
          period: `Day ${trade.day}`,
          ...trade,
        }))
    }
  }

  const sortedData = getAggregatedData().sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof a]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
  })

  const handleCreateSheet = () => {
    if (!results || !fxData) return

    const currencySymbol = getCurrencySymbol(fxData.currency)

    // Create P/L entries from FX results
    const plEntries = results.trades.map((trade, index) => ({
      date: trade.date,
      profit: trade.dailyProfit >= 0 ? trade.dailyProfit : 0,
      loss: trade.dailyProfit < 0 ? Math.abs(trade.dailyProfit) : 0,
      total: trade.balance - fxData.initialCapital, // Running total from initial capital
      isWeekend: false,
    }))

    // Create sheet data for P/L Sheet component
    const sheetData = {
      currency: fxData.currency,
      currencySymbol,
      entries: plEntries,
      totalDays: results.trades.length,
      isFromResults: true,
      type: "forex" as const, // Mark as forex type
    }

    localStorage.setItem(
      "forexPLSheetData",
      JSON.stringify({
        selectedCurrency: fxData.currency,
        plEntries,
        showSheet: true,
        prePopulatedData: sheetData,
      }),
    )

    alert("You're Fx Result Sheet Creat On P/L Forex Sheet , Check Now")

    // Navigate to home page instead of trading dashboard to avoid 404
    window.location.href = "/"
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
          <Button
            onClick={() => router.push("/fx-money-manager")}
            className="mt-4 bg-[#2a7fff] hover:bg-[#2a7fff]/80 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!fxData || !results) {
    return (
      <div className="min-h-screen bg-[#0d1520] text-[#e6eef9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8fa3bf]">No data available</p>
          <Button
            onClick={() => router.push("/fx-money-manager")}
            className="mt-4 bg-[#2a7fff] hover:bg-[#2a7fff]/80 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const currencySymbol = getCurrencySymbol(fxData.currency)

  return (
    <div className="min-h-screen bg-[#0d1520] text-[#e6eef9]">
      <header className="border-b border-[#2a7fff]/20 bg-[#131d2d]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/fx-money-manager")}
              className="border-[#2a7fff]/30 hover:border-[#2a7fff]/50 bg-[#131d2d] text-[#e6eef9]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="w-10 h-10 rounded-lg bg-[#2a7fff]/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-[#2a7fff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Fx Result</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#8fa3bf] font-['Inter']">Final Balance</p>
                    <p className="text-2xl font-bold text-[#e6eef9] font-['JetBrains_Mono']">
                      {currencySymbol}
                      {animatedValues.finalBalance.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-[#2a7fff]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#8fa3bf] font-['Inter']">Total Profit</p>
                    <p className="text-2xl font-bold text-[#e6eef9] font-['JetBrains_Mono']">
                      {currencySymbol}
                      {animatedValues.totalProfit.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-[#2a7fff]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#8fa3bf] font-['Inter']">ROI</p>
                    <p className="text-2xl font-bold text-[#e6eef9] font-['JetBrains_Mono']">
                      {animatedValues.roi.toFixed(2)}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-[#2a7fff]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#8fa3bf] font-['Inter']">Win Rate</p>
                    <p className="text-2xl font-bold text-[#e6eef9] font-['JetBrains_Mono']">
                      {animatedValues.winRate.toFixed(1)}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-[#2a7fff]" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#e6eef9] font-['Rajdhani']">
                <Calendar className="h-5 w-5 text-[#2a7fff]" />
                Configuration Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-[#8fa3bf] font-['Inter']">Initial Capital</p>
                  <p className="text-lg font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                    {currencySymbol}
                    {fxData.initialCapital.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#8fa3bf] font-['Inter']">Target Profit</p>
                  <p className="text-lg font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                    {currencySymbol}
                    {fxData.targetProfit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#8fa3bf] font-['Inter']">Risk Percentage</p>
                  <p className="text-lg font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                    {fxData.riskPercentage}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#8fa3bf] font-['Inter']">Trading Days</p>
                  <p className="text-lg font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                    {fxData.tradingDays} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#8fa3bf] font-['Inter']">Interest Type</p>
                  <p className="text-lg font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                    {fxData.interestType || "low"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#8fa3bf] font-['Inter']">Interest Rate</p>
                  <p className="text-lg font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                    {fxData.interestRate}% {fxData.interestType === "custom" ? "(Custom)" : ""}
                  </p>
                </div>
                {/* Display stop loss configuration */}
                <div>
                  <p className="text-sm text-[#8fa3bf] font-['Inter']">Enable Stop Loss</p>
                  <p className="text-lg font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                    {fxData.enableStopLoss ? "Yes" : "No"}
                  </p>
                </div>
                {fxData.enableStopLoss && (
                  <>
                    <div>
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Stop Loss Type</p>
                      <p className="text-lg font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {fxData.stopLossType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Stop Loss Value</p>
                      <p className="text-lg font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {fxData.stopLossType === "percentage"
                          ? `${fxData.stopLossValue}%`
                          : `${currencySymbol}${fxData.stopLossValue?.toLocaleString()}`}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Collapsible open={expandedSections.performance} onOpenChange={() => toggleSection("performance")}>
            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-[#0d1520]/50 transition-colors">
                  <CardTitle className="flex items-center gap-2 text-[#e6eef9] font-['Rajdhani']">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#2a7fff]" />
                      Performance Metrics
                    </span>
                    {expandedSections.performance ? (
                      <ChevronUp className="h-5 w-5 text-[#8fa3bf]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[#8fa3bf]" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Total Trades</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {animatedValues.totalTrades.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Profit Factor</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {animatedValues.profitFactor.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Sharpe Ratio</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {animatedValues.sharpeRatio.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Max Drawdown</p>
                      <p className="text-xl font-semibold text-red-400 font-['JetBrains_Mono']">
                        {animatedValues.maxDrawdown.toFixed(2)}%
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Average Daily Profit</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {currencySymbol}
                        {animatedValues.averageDailyProfit.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Percentage Profit</p>
                      <p className="text-xl font-semibold text-green-400 font-['JetBrains_Mono']">
                        {animatedValues.percentageProfit.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Daily Trade List Section */}
          <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#e6eef9] font-['Rajdhani']">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#2a7fff]" />
                  Daily Trade List
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#2a7fff]/20">
                        <th className="text-left p-3 text-[#e6eef9] font-['Rajdhani'] font-semibold">Day</th>
                        <th className="text-left p-3 text-[#e6eef9] font-['Rajdhani'] font-semibold">Target Profit</th>
                        <th className="text-left p-3 text-[#e6eef9] font-['Rajdhani'] font-semibold">
                          Trades Required
                        </th>
                        <th className="text-left p-3 text-[#e6eef9] font-['Rajdhani'] font-semibold">Lot Size</th>
                        <th className="text-left p-3 text-[#e6eef9] font-['Rajdhani'] font-semibold">Pips Per Trade</th>
                        <th className="text-left p-3 text-[#e6eef9] font-['Rajdhani'] font-semibold">Total Pips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results?.trades.map((trade, index) => {
                        const targetProfit = trade.dailyProfit

                        // For small profits (< $50): 2-3 trades, smaller lots, more pips
                        // For medium profits ($50-$200): 3-4 trades, medium lots, medium pips
                        // For large profits (> $200): 4-5 trades, larger lots, fewer pips

                        let tradesRequired: number
                        let lotSize: number
                        let pipsPerTrade: number

                        if (targetProfit < 50) {
                          // Small profit: fewer trades, smaller lots, more pips needed
                          tradesRequired = Math.max(2, Math.ceil(targetProfit / 20))
                          lotSize = Math.max(0.01, targetProfit / 100)
                          pipsPerTrade = Math.ceil(targetProfit / (tradesRequired * lotSize * 10))
                        } else if (targetProfit < 200) {
                          // Medium profit: moderate trades and lots
                          tradesRequired = Math.max(3, Math.ceil(targetProfit / 50))
                          lotSize = Math.max(0.1, targetProfit / 500)
                          pipsPerTrade = Math.ceil(targetProfit / (tradesRequired * lotSize * 10))
                        } else {
                          // Large profit: more trades, larger lots, fewer pips needed
                          tradesRequired = Math.max(4, Math.ceil(targetProfit / 80))
                          lotSize = Math.max(0.5, targetProfit / 800)
                          pipsPerTrade = Math.ceil(targetProfit / (tradesRequired * lotSize * 10))
                        }

                        // Ensure reasonable limits
                        tradesRequired = Math.min(tradesRequired, 8) // Max 8 trades per day
                        lotSize = Math.min(lotSize, 10) // Max 10 lot size
                        pipsPerTrade = Math.max(pipsPerTrade, 5) // Min 5 pips per trade
                        pipsPerTrade = Math.min(pipsPerTrade, 100) // Max 100 pips per trade

                        const totalPips = pipsPerTrade * tradesRequired

                        return (
                          <tr key={index} className="border-b border-[#2a7fff]/10 hover:bg-[#0d1520]/30">
                            <td className="p-3 text-[#e6eef9] font-['Inter']">Day {trade.day}</td>
                            <td className="p-3 text-green-400 font-['JetBrains_Mono']">
                              {currencySymbol}
                              {targetProfit.toFixed(2)}
                            </td>
                            <td className="p-3 text-[#2a7fff] font-['JetBrains_Mono']">{tradesRequired}</td>
                            <td className="p-3 text-[#e6eef9] font-['JetBrains_Mono']">{lotSize.toFixed(2)}</td>
                            <td className="p-3 text-[#e6eef9] font-['JetBrains_Mono']">{pipsPerTrade} pips</td>
                            <td className="p-3 text-[#2a7fff] font-['JetBrains_Mono']">{totalPips} pips</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-[#0d1520] rounded-xl border border-[#2a7fff]/20">
                  <h4 className="text-[#e6eef9] font-['Rajdhani'] font-semibold mb-2">Trading Strategy Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[#8fa3bf] font-['Inter']">• Adjust trades per day based on profit target</p>
                      <p className="text-[#8fa3bf] font-['Inter']">• Scale lot sizes with profit amounts</p>
                    </div>
                    <div>
                      <p className="text-[#8fa3bf] font-['Inter']">• Optimize pips per trade for efficiency</p>
                      <p className="text-[#8fa3bf] font-['Inter']">• Balance risk with profit targets</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Collapsible open={expandedSections.risk} onOpenChange={() => toggleSection("risk")}>
            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-[#0d1520]/50 transition-colors">
                  <CardTitle className="flex items-center gap-2 text-[#e6eef9] font-['Rajdhani']">
                    <span className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-[#2a7fff]" />
                      Risk Metrics
                    </span>
                    {expandedSections.risk ? (
                      <ChevronUp className="h-5 w-5 text-[#8fa3bf]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[#8fa3bf]" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Max Drawdown</p>
                      <p className="text-xl font-semibold text-red-400 font-['JetBrains_Mono']">
                        {animatedValues.maxDrawdown.toFixed(2)}%
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Volatility</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {results.summary.volatility.toFixed(2)}%
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Sortino Ratio</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {results.summary.sortinoRatio.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Calmar Ratio</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {results.summary.calmarRatio.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Ulcer Index</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {results.summary.ulcerIndex.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Sterling Ratio</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {results.summary.sterlingRatio.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={expandedSections.trading} onOpenChange={() => toggleSection("trading")}>
            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-[#0d1520]/50 transition-colors">
                  <CardTitle className="flex items-center gap-2 text-[#e6eef9] font-['Rajdhani']">
                    <span className="flex items-center gap-2">
                      <ArrowUpRight className="h-5 w-5 text-[#2a7fff]" />
                      Trading Metrics
                    </span>
                    {expandedSections.trading ? (
                      <ChevronUp className="h-5 w-5 text-[#8fa3bf]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[#8fa3bf]" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Total Trades</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {animatedValues.totalTrades.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Profitable Days</p>
                      <p className="text-xl font-semibold text-green-400 font-['JetBrains_Mono']">
                        {results.summary.profitableDays.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Losing Days</p>
                      <p className="text-xl font-semibold text-red-400 font-['JetBrains_Mono']">
                        {results.summary.losingDays.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Break Even Days</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {results.summary.breakEvenDays.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Average Trades Per Day</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {results.summary.averageTradesPerDay.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Win Rate</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {animatedValues.winRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={expandedSections.advanced} onOpenChange={() => toggleSection("advanced")}>
            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-[#0d1520]/50 transition-colors">
                  <CardTitle className="flex items-center gap-2 text-[#e6eef9] font-['Rajdhani']">
                    <span className="flex items-center gap-2">
                      <ArrowDownRight className="h-5 w-5 text-[#2a7fff]" />
                      Advanced Metrics
                    </span>
                    {expandedSections.advanced ? (
                      <ChevronUp className="h-5 w-5 text-[#8fa3bf]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[#8fa3bf]" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Kelly Criterion</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {results.summary.kelly.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Expectancy</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {results.summary.expectancy.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Win Loss Ratio</p>
                      <p className="text-xl font-semibold text-[#e6eef9] font-['JetBrains_Mono']">
                        {results.summary.winLossRatio.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Profit Per Trade</p>
                      <p className="text-xl font-semibold text-green-400 font-['JetBrains_Mono']">
                        {currencySymbol}
                        {results.summary.profitPerTrade.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Loss Per Trade</p>
                      <p className="text-xl font-semibold text-red-400 font-['JetBrains_Mono']">
                        {currencySymbol}
                        {results.summary.lossPerTrade.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Largest Win</p>
                      <p className="text-xl font-semibold text-green-400 font-['JetBrains_Mono']">
                        {currencySymbol}
                        {results.summary.largestWin.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Largest Loss</p>
                      <p className="text-xl font-semibold text-red-400 font-['JetBrains_Mono']">
                        {currencySymbol}
                        {results.summary.largestLoss.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Average Win</p>
                      <p className="text-xl font-semibold text-green-400 font-['JetBrains_Mono']">
                        {currencySymbol}
                        {results.summary.averageWin.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#8fa3bf] font-['Inter']">Average Loss</p>
                      <p className="text-xl font-semibold text-red-400 font-['JetBrains_Mono']">
                        {currencySymbol}
                        {results.summary.averageLoss.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[#e6eef9] font-['Rajdhani']">Comprehensive Trading Breakdown</CardTitle>
              <div className="bg-[#0d1520] p-2 rounded-lg w-fit border border-[#2a7fff]/20">
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as typeof viewMode)}>
                  <TabsList className="grid w-full grid-cols-3 bg-[#131d2d] rounded-md p-1 gap-1 border border-[#2a7fff]/20">
                    <TabsTrigger
                      value="daily"
                      className="text-xs sm:text-sm px-2 sm:px-4 py-2 rounded data-[state=active]:bg-[#2a7fff] data-[state=active]:text-white text-[#8fa3bf] hover:text-[#e6eef9] transition-all font-['Inter']"
                    >
                      Daily View
                    </TabsTrigger>
                    <TabsTrigger
                      value="weekly"
                      className="text-xs sm:text-sm px-2 sm:px-4 py-2 rounded data-[state=active]:bg-[#2a7fff] data-[state=active]:text-white text-[#8fa3bf] hover:text-[#e6eef9] transition-all font-['Inter']"
                    >
                      Weekly Summary
                    </TabsTrigger>
                    <TabsTrigger
                      value="monthly"
                      className="text-xs sm:text-sm px-2 sm:px-4 py-2 rounded data-[state=active]:bg-[#2a7fff] data-[state=active]:text-white text-[#8fa3bf] hover:text-[#e6eef9] transition-all font-['Inter']"
                    >
                      Monthly Summary
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#2a7fff]/20">
                      <th
                        className="text-left p-2 cursor-pointer hover:bg-[#0d1520]/50 text-[#e6eef9] font-['Rajdhani']"
                        onClick={() => handleSort("period")}
                      >
                        Period {sortColumn === "period" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left p-2 cursor-pointer hover:bg-[#0d1520]/50 text-[#e6eef9] font-['Rajdhani']"
                        onClick={() => handleSort("dailyProfit")}
                      >
                        Profit {sortColumn === "dailyProfit" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left p-2 cursor-pointer hover:bg-[#0d1520]/50 text-[#e6eef9] font-['Rajdhani']"
                        onClick={() => handleSort("balance")}
                      >
                        Balance {sortColumn === "balance" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((row, index) => (
                      <tr key={index} className="border-b border-[#2a7fff]/10 hover:bg-[#0d1520]/30">
                        <td className="p-2 text-[#e6eef9] font-['Inter']">{row.period}</td>
                        <td className="p-2">
                          <span
                            className={`font-['JetBrains_Mono'] ${row.dailyProfit >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {row.dailyProfit >= 0 ? (
                              <ArrowUpRight className="inline h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="inline h-4 w-4" />
                            )}
                            {currencySymbol}
                            {Math.abs(row.dailyProfit).toFixed(2)}
                          </span>
                        </td>
                        <td className="p-2 text-[#e6eef9] font-['JetBrains_Mono']">
                          {currencySymbol}
                          {row.balance.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={handleCreateSheet}
                  className="bg-[#00d395] hover:bg-[#00d395]/80 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 font-['Rajdhani']"
                >
                  Create Sheet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
