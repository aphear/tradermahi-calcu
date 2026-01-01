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

const defaultFxData: FxData = {
  currency: "USD",
  initialCapital: 1000,
  targetProfit: 100,
  riskPercentage: 2,
  winRate: 60,
  riskRewardRatio: 2,
  tradingDays: 30,
  interestType: "low",
  interestRate: 10,
  tradesPerDay: 3,
  riskAmount: 10,
  rewardAmount: 15,
  enableStopLoss: false,
  stopLossType: null,
  stopLossValue: null,
}

export default function ResultsPage() {
  const router = useRouter()
  const [fxData, setFxData] = useState<FxData>(defaultFxData)
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
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    const loadData = () => {
      try {
        if (typeof window === "undefined") {
          return
        }

        const data = localStorage.getItem("fxManager")

        if (!data) {
          setError("No data found. Please go back and enter your trading parameters.")
          setIsLoading(false)
          return
        }

        let parsedData
        try {
          parsedData = JSON.parse(data)
        } catch (parseError) {
          setError("Invalid data format. Please go back and re-enter your parameters.")
          setIsLoading(false)
          return
        }

        if (!parsedData || typeof parsedData !== "object") {
          setError("Invalid data structure. Please go back and re-enter your parameters.")
          setIsLoading(false)
          return
        }

        // Set validated values with safe defaults
        const validatedData: FxData = {
          currency: parsedData.currency || "USD",
          initialCapital: Number(parsedData.initialCapital) || 1000,
          targetProfit: Number(parsedData.targetProfit) || 100,
          riskPercentage: Number(parsedData.riskPercentage) || 2,
          winRate: Number(parsedData.winRate) || 60,
          riskRewardRatio: Number(parsedData.riskRewardRatio) || 2,
          tradingDays: Number(parsedData.totalDays) || Number(parsedData.tradingDays) || 30,
          startDate: parsedData.startDate || undefined,
          endDate: parsedData.endDate || undefined,
          interestType: parsedData.interestType || "low",
          interestRate: Number(parsedData.interestRate) || 10,
          tradesPerDay: Number(parsedData.tradesPerDay) || 3,
          riskAmount: Number(parsedData.riskAmount) || 10,
          rewardAmount: Number(parsedData.rewardAmount) || 15,
          enableStopLoss: Boolean(parsedData.enableStopLoss),
          stopLossType: parsedData.stopLossType || null,
          stopLossValue: parsedData.stopLossValue ? Number(parsedData.stopLossValue) : null,
        }

        setFxData(validatedData)
        setDataLoaded(true)
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("An error occurred while loading data. Please try again.")
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const getCurrencySymbol = (currencyCode: string): string => {
    if (!currencyCode) return "$"
    const currency = currencies.find((c) => c.code === currencyCode.toUpperCase())
    return currency?.symbol || "$"
  }

  useEffect(() => {
    if (dataLoaded && fxData) {
      try {
        const calculatedResults = calculateTradingResults(fxData)
        setResults(calculatedResults)
      } catch (err) {
        console.error("Error calculating results:", err)
        setError("Error calculating trading results. Please check your parameters.")
      }
    }
  }, [dataLoaded, fxData])

  // Animation effect
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
      enableStopLoss,
      stopLossType,
      stopLossValue,
    } = data

    // Compound interest calculation
    if (interestType === "custom" && interestRate) {
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

      const totalProfit = cumulativeProfit
      const finalBalance = currentBalance
      const roi = (totalProfit / initialCapital) * 100
      const annualizedReturn = Math.pow(finalBalance / initialCapital, 365 / tradingDays) - 1

      return {
        trades,
        summary: {
          totalTrades: tradingDays,
          totalWins: tradingDays,
          totalLosses: 0,
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

    // Standard trading calculation
    const calculatedRiskAmount = (initialCapital * riskPercentage) / 100
    const calculatedRewardAmount = calculatedRiskAmount * riskRewardRatio

    let stopLossAmount = 0
    if (enableStopLoss && stopLossValue !== null && stopLossValue !== undefined) {
      if (stopLossType === "percentage") {
        stopLossAmount = (initialCapital * stopLossValue) / 100
      } else if (stopLossType === "fixed") {
        stopLossAmount = stopLossValue
      }
    }

    const effectiveRewardPerTrade = calculatedRewardAmount
    const profitTargetPerDay = targetProfit

    const tradesPerDayAdjusted =
      profitTargetPerDay > 0 && effectiveRewardPerTrade > 0
        ? Math.ceil(profitTargetPerDay / (effectiveRewardPerTrade * (winRate / 100)))
        : tradesPerDay || 3

    const finalTradesPerDay = Math.max(1, tradesPerDayAdjusted)

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
        winRate: dailyTrades > 0 ? (wins / dailyTrades) * 100 : 0,
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
    const averageReturn =
      dailyReturns.length > 0 ? dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length : 0
    const variance =
      dailyReturns.length > 0
        ? dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / dailyReturns.length
        : 0
    const volatility = Math.sqrt(variance) * Math.sqrt(252)

    const riskFreeRate = 0.02
    const excessReturn = totalProfit / initialCapital - riskFreeRate
    const sharpeRatio = volatility > 0 ? excessReturn / volatility : 0

    const roi = (totalProfit / initialCapital) * 100
    const annualizedReturn =
      tradingDays > 0 ? (Math.pow(finalBalance / initialCapital, 365 / tradingDays) - 1) * 100 : 0

    const totalGrossWins = totalWins * calculatedRewardAmount
    const totalGrossLosses = totalLosses * calculatedRiskAmount
    const profitFactor = totalGrossLosses > 0 ? totalGrossWins / totalGrossLosses : totalGrossWins > 0 ? 999 : 0

    return {
      trades,
      summary: {
        totalTrades,
        totalWins,
        totalLosses,
        totalProfit,
        finalBalance,
        maxDrawdown,
        averageWinRate: totalTrades > 0 ? (totalWins / totalTrades) * 100 : 0,
        profitFactor,
        sharpeRatio,
        maxConsecutiveWins: 0,
        maxConsecutiveLosses: 0,
        averageDailyProfit: tradingDays > 0 ? totalProfit / tradingDays : 0,
        bestDay: trades.length > 0 ? Math.max(...trades.map((t) => t.dailyProfit)) : 0,
        worstDay: trades.length > 0 ? Math.min(...trades.map((t) => t.dailyProfit)) : 0,
        profitableDays,
        losingDays,
        breakEvenDays,
        averageTradesPerDay: finalTradesPerDay,
        totalTradingDays: tradingDays,
        roi,
        annualizedReturn,
        volatility: volatility * 100,
        calmarRatio: maxDrawdown > 0 ? annualizedReturn / maxDrawdown : 0,
        sortinoRatio: 0,
        recoveryFactor: maxDrawdown > 0 ? totalProfit / ((initialCapital * maxDrawdown) / 100) : 0,
        payoffRatio: calculatedRiskAmount > 0 ? calculatedRewardAmount / calculatedRiskAmount : 0,
        profitPerTrade: totalWins > 0 ? totalGrossWins / totalWins : 0,
        lossPerTrade: totalLosses > 0 ? totalGrossLosses / totalLosses : 0,
        largestWin: calculatedRewardAmount,
        largestLoss: calculatedRiskAmount,
        averageWin: calculatedRewardAmount,
        averageLoss: calculatedRiskAmount,
        winLossRatio: totalLosses > 0 ? totalWins / totalLosses : totalWins,
        expectancy: totalTrades > 0 ? totalProfit / totalTrades : 0,
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

  const handleCreateSheet = () => {
    try {
      if (!results || !fxData) {
        alert("No results to save")
        return
      }

      const existingSheets = localStorage.getItem("forexPLSheets")
      const sheets = existingSheets ? JSON.parse(existingSheets) : []

      const newSheet = {
        id: Date.now().toString(),
        type: "forex",
        createdAt: new Date().toISOString(),
        currency: fxData.currency,
        initialCapital: fxData.initialCapital,
        finalBalance: results.summary.finalBalance,
        totalProfit: results.summary.totalProfit,
        roi: results.summary.roi,
        tradingDays: fxData.tradingDays,
        trades: results.trades,
        summary: results.summary,
        stopLossType: fxData.stopLossType,
        stopLossValue: fxData.stopLossValue,
      }

      sheets.push(newSheet)
      localStorage.setItem("forexPLSheets", JSON.stringify(sheets))

      alert("You're Fx Result Sheet Creat On P/L Forex Sheet , Check Now")
      router.push("/")
    } catch (err) {
      console.error("Error creating sheet:", err)
      alert("Error creating sheet. Please try again.")
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getSortedTrades = () => {
    if (!results) return []
    const sorted = [...results.trades].sort((a, b) => {
      const aValue = a[sortColumn as keyof TradeResult]
      const bValue = b[sortColumn as keyof TradeResult]
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }
      return 0
    })
    return sorted
  }

  const getViewData = () => {
    if (!results) return []
    const trades = getSortedTrades()

    if (viewMode === "daily") {
      return trades
    }

    if (viewMode === "weekly") {
      const weeks: TradeResult[] = []
      for (let i = 0; i < trades.length; i += 7) {
        const weekTrades = trades.slice(i, i + 7)
        const weekData: TradeResult = {
          day: Math.floor(i / 7) + 1,
          date: `Week ${Math.floor(i / 7) + 1}`,
          trades: weekTrades.reduce((sum, t) => sum + t.trades, 0),
          wins: weekTrades.reduce((sum, t) => sum + t.wins, 0),
          losses: weekTrades.reduce((sum, t) => sum + t.losses, 0),
          dailyProfit: weekTrades.reduce((sum, t) => sum + t.dailyProfit, 0),
          cumulativeProfit: weekTrades[weekTrades.length - 1]?.cumulativeProfit || 0,
          balance: weekTrades[weekTrades.length - 1]?.balance || 0,
          drawdown: Math.max(...weekTrades.map((t) => t.drawdown)),
          winRate:
            weekTrades.reduce((sum, t) => sum + t.trades, 0) > 0
              ? (weekTrades.reduce((sum, t) => sum + t.wins, 0) / weekTrades.reduce((sum, t) => sum + t.trades, 0)) *
                100
              : 0,
        }
        weeks.push(weekData)
      }
      return weeks
    }

    if (viewMode === "monthly") {
      const months: TradeResult[] = []
      for (let i = 0; i < trades.length; i += 30) {
        const monthTrades = trades.slice(i, i + 30)
        const monthData: TradeResult = {
          day: Math.floor(i / 30) + 1,
          date: `Month ${Math.floor(i / 30) + 1}`,
          trades: monthTrades.reduce((sum, t) => sum + t.trades, 0),
          wins: monthTrades.reduce((sum, t) => sum + t.wins, 0),
          losses: monthTrades.reduce((sum, t) => sum + t.losses, 0),
          dailyProfit: monthTrades.reduce((sum, t) => sum + t.dailyProfit, 0),
          cumulativeProfit: monthTrades[monthTrades.length - 1]?.cumulativeProfit || 0,
          balance: monthTrades[monthTrades.length - 1]?.balance || 0,
          drawdown: Math.max(...monthTrades.map((t) => t.drawdown)),
          winRate:
            monthTrades.reduce((sum, t) => sum + t.trades, 0) > 0
              ? (monthTrades.reduce((sum, t) => sum + t.wins, 0) / monthTrades.reduce((sum, t) => sum + t.trades, 0)) *
                100
              : 0,
        }
        months.push(monthData)
      }
      return months
    }

    return trades
  }

  const currencySymbol = getCurrencySymbol(fxData.currency)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white">Loading results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-red-500/50 max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">Error</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button
              onClick={() => router.push("/fx-money-manager")}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white">Calculating results...</p>
        </div>
      </div>
    )
  }

  const viewData = getViewData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/fx-money-manager")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Fx Results</h1>
              <p className="text-sm text-gray-400">Trading Analysis & Projection</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Initial Capital</p>
                  <p className="text-xl font-bold text-white">
                    {currencySymbol}
                    {fxData.initialCapital.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-cyan-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Final Balance</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {currencySymbol}
                    {animatedValues.finalBalance.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Net Profit</p>
                  <p className="text-xl font-bold text-purple-400">
                    {currencySymbol}
                    {animatedValues.totalProfit.toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-400">+{animatedValues.percentageProfit.toFixed(2)}%</p>
                </div>
                <Target className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Trading Days</p>
                  <p className="text-xl font-bold text-amber-400">{fxData.tradingDays}</p>
                </div>
                <Calendar className="w-8 h-8 text-amber-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Summary */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Currency</p>
                <p className="text-white font-medium">{fxData.currency}</p>
              </div>
              <div>
                <p className="text-gray-400">Risk %</p>
                <p className="text-white font-medium">{fxData.riskPercentage}%</p>
              </div>
              <div>
                <p className="text-gray-400">Win Rate</p>
                <p className="text-white font-medium">{fxData.winRate}%</p>
              </div>
              <div>
                <p className="text-gray-400">Risk:Reward</p>
                <p className="text-white font-medium">1:{fxData.riskRewardRatio}</p>
              </div>
              {fxData.enableStopLoss && fxData.stopLossValue && (
                <div>
                  <p className="text-gray-400">Stop Loss</p>
                  <p className="text-white font-medium">
                    {fxData.stopLossType === "percentage"
                      ? `${fxData.stopLossValue}%`
                      : `${currencySymbol}${fxData.stopLossValue}`}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Collapsible open={expandedSections.performance} onOpenChange={() => toggleSection("performance")}>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-500" />
                  Performance Metrics
                </CardTitle>
                {expandedSections.performance ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400">ROI</p>
                    <p className="text-lg font-bold text-emerald-400">{animatedValues.roi.toFixed(2)}%</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Win Rate</p>
                    <p className="text-lg font-bold text-cyan-400">{animatedValues.winRate.toFixed(2)}%</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Max Drawdown</p>
                    <p className="text-lg font-bold text-red-400">{animatedValues.maxDrawdown.toFixed(2)}%</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Profit Factor</p>
                    <p className="text-lg font-bold text-purple-400">{animatedValues.profitFactor.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Total Trades</p>
                    <p className="text-lg font-bold text-white">{animatedValues.totalTrades}</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Avg Daily Profit</p>
                    <p className="text-lg font-bold text-emerald-400">
                      {currencySymbol}
                      {animatedValues.averageDailyProfit.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Profitable Days</p>
                    <p className="text-lg font-bold text-emerald-400">{results.summary.profitableDays}</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Losing Days</p>
                    <p className="text-lg font-bold text-red-400">{results.summary.losingDays}</p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Trade Details Table */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">Trade Details</CardTitle>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
                <TabsList className="bg-slate-700/50">
                  <TabsTrigger value="daily" className="text-xs">
                    Daily
                  </TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs">
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs">
                    Monthly
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th
                      className="text-left py-2 px-2 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("day")}
                    >
                      {viewMode === "daily" ? "Day" : viewMode === "weekly" ? "Week" : "Month"}
                    </th>
                    <th
                      className="text-right py-2 px-2 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("trades")}
                    >
                      Trades
                    </th>
                    <th
                      className="text-right py-2 px-2 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("wins")}
                    >
                      Wins
                    </th>
                    <th
                      className="text-right py-2 px-2 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("losses")}
                    >
                      Losses
                    </th>
                    <th
                      className="text-right py-2 px-2 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("dailyProfit")}
                    >
                      P/L
                    </th>
                    <th
                      className="text-right py-2 px-2 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("balance")}
                    >
                      Balance
                    </th>
                    <th
                      className="text-right py-2 px-2 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("winRate")}
                    >
                      Win %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {viewData.map((trade, index) => (
                    <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-2 px-2 text-white">{viewMode === "daily" ? `Day ${trade.day}` : trade.date}</td>
                      <td className="py-2 px-2 text-right text-white">{trade.trades}</td>
                      <td className="py-2 px-2 text-right text-emerald-400">{trade.wins}</td>
                      <td className="py-2 px-2 text-right text-red-400">{trade.losses}</td>
                      <td
                        className={`py-2 px-2 text-right ${trade.dailyProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        <span className="flex items-center justify-end gap-1">
                          {trade.dailyProfit >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {currencySymbol}
                          {Math.abs(trade.dailyProfit).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right text-white">
                        {currencySymbol}
                        {trade.balance.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-right text-cyan-400">{trade.winRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Create Sheet Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleCreateSheet}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-3"
          >
            Create Sheet
          </Button>
        </div>
      </div>
    </div>
  )
}
