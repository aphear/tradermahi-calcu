"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  ArrowLeft,
  Calculator,
  TrendingUp,
  DollarSign,
  BarChart3,
  RefreshCw,
  PieChart,
  Wifi,
  WifiOff,
} from "lucide-react"
import { useRouter } from "next/navigation"

const useMarketData = () => {
  const [marketData, setMarketData] = useState({
    // Major Pairs
    "EUR/USD": { price: 1.085, change: 0.0012, changePercent: 0.11 },
    "GBP/USD": { price: 1.265, change: -0.0025, changePercent: -0.2 },
    "USD/JPY": { price: 149.5, change: 0.75, changePercent: 0.5 },
    "USD/CHF": { price: 0.885, change: 0.0008, changePercent: 0.09 },
    "AUD/USD": { price: 0.658, change: -0.0015, changePercent: -0.23 },
    "USD/CAD": { price: 1.36, change: 0.002, changePercent: 0.15 },
    "NZD/USD": { price: 0.612, change: -0.0008, changePercent: -0.13 },

    // Minor Pairs (Cross Currencies)
    "EUR/GBP": { price: 0.858, change: 0.0012, changePercent: 0.14 },
    "EUR/JPY": { price: 162.2, change: 1.25, changePercent: 0.77 },
    "GBP/JPY": { price: 189.15, change: -0.85, changePercent: -0.45 },
    "EUR/CHF": { price: 0.959, change: 0.0008, changePercent: 0.08 },
    "GBP/CHF": { price: 1.119, change: -0.0015, changePercent: -0.13 },
    "AUD/JPY": { price: 98.45, change: 0.65, changePercent: 0.66 },
    "CAD/JPY": { price: 109.85, change: 0.45, changePercent: 0.41 },
    "CHF/JPY": { price: 169.05, change: 0.85, changePercent: 0.5 },
    "EUR/AUD": { price: 1.649, change: 0.0025, changePercent: 0.15 },
    "GBP/AUD": { price: 1.923, change: -0.0018, changePercent: -0.09 },
    "EUR/CAD": { price: 1.476, change: 0.0012, changePercent: 0.08 },
    "GBP/CAD": { price: 1.721, change: -0.0022, changePercent: -0.13 },
    "AUD/CAD": { price: 0.895, change: 0.0008, changePercent: 0.09 },
    "EUR/NZD": { price: 1.773, change: 0.0015, changePercent: 0.08 },
    "GBP/NZD": { price: 2.067, change: -0.0025, changePercent: -0.12 },
    "AUD/NZD": { price: 1.075, change: -0.0005, changePercent: -0.05 },
    "CAD/CHF": { price: 0.651, change: 0.0003, changePercent: 0.05 },
    "NZD/JPY": { price: 91.55, change: 0.35, changePercent: 0.38 },
    "NZD/CHF": { price: 0.542, change: -0.0008, changePercent: -0.15 },
    "NZD/CAD": { price: 0.832, change: -0.0012, changePercent: -0.14 },

    // Exotic Pairs - Emerging Markets
    "USD/TRY": { price: 29.85, change: 0.15, changePercent: 0.5 },
    "USD/ZAR": { price: 18.65, change: 0.08, changePercent: 0.43 },
    "USD/MXN": { price: 17.25, change: 0.05, changePercent: 0.29 },
    "USD/BRL": { price: 5.15, change: 0.02, changePercent: 0.39 },
    "USD/RUB": { price: 92.45, change: 0.85, changePercent: 0.92 },
    "USD/INR": { price: 83.25, change: 0.12, changePercent: 0.14 },
    "USD/CNY": { price: 7.24, change: 0.01, changePercent: 0.14 },
    "USD/KRW": { price: 1325.5, change: 5.25, changePercent: 0.4 },
    "USD/SGD": { price: 1.345, change: 0.002, changePercent: 0.15 },
    "USD/HKD": { price: 7.825, change: 0.005, changePercent: 0.06 },
    "USD/THB": { price: 35.85, change: 0.15, changePercent: 0.42 },
    "USD/MYR": { price: 4.685, change: 0.008, changePercent: 0.17 },
    "USD/IDR": { price: 15750, change: 25, changePercent: 0.16 },
    "USD/PHP": { price: 56.25, change: 0.18, changePercent: 0.32 },
    "USD/VND": { price: 24350, change: 15, changePercent: 0.06 },

    // Nordic Currencies
    "USD/SEK": { price: 10.85, change: 0.05, changePercent: 0.46 },
    "USD/NOK": { price: 10.95, change: 0.08, changePercent: 0.73 },
    "USD/DKK": { price: 6.89, change: 0.02, changePercent: 0.29 },
    "EUR/SEK": { price: 11.78, change: 0.06, changePercent: 0.51 },
    "EUR/NOK": { price: 11.89, change: 0.09, changePercent: 0.76 },
    "EUR/DKK": { price: 7.46, change: 0.01, changePercent: 0.13 },

    // Eastern European
    "USD/PLN": { price: 4.025, change: 0.015, changePercent: 0.37 },
    "USD/CZK": { price: 22.85, change: 0.12, changePercent: 0.53 },
    "USD/HUF": { price: 365.5, change: 1.85, changePercent: 0.51 },
    "EUR/PLN": { price: 4.37, change: 0.018, changePercent: 0.41 },
    "EUR/CZK": { price: 24.78, change: 0.15, changePercent: 0.61 },
    "EUR/HUF": { price: 396.75, change: 2.25, changePercent: 0.57 },

    // Middle East & Africa
    "USD/AED": { price: 3.673, change: 0.001, changePercent: 0.03 },
    "USD/SAR": { price: 3.751, change: 0.002, changePercent: 0.05 },
    "USD/EGP": { price: 30.85, change: 0.15, changePercent: 0.49 },
    "USD/ILS": { price: 3.685, change: 0.012, changePercent: 0.33 },

    // Commodities Currencies
    "USD/CLP": { price: 925.5, change: 4.25, changePercent: 0.46 },
    "USD/COP": { price: 4125.75, change: 18.5, changePercent: 0.45 },
    "USD/PEN": { price: 3.785, change: 0.015, changePercent: 0.4 },

    // Pacific Region
    "AUD/SGD": { price: 0.885, change: -0.003, changePercent: -0.34 },
    "NZD/SGD": { price: 0.823, change: -0.005, changePercent: -0.61 },

    // Cryptocurrency Pairs (if applicable)
    "BTC/USD": { price: 42500, change: 850, changePercent: 2.04 },
    "ETH/USD": { price: 2650, change: 45, changePercent: 1.73 },
  })

  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((pair) => {
          // Simulate price movement (±0.1% random change)
          const randomChange = (Math.random() - 0.5) * 0.002
          const newPrice = updated[pair].price * (1 + randomChange)
          const change = newPrice - updated[pair].price
          const changePercent = (change / updated[pair].price) * 100

          updated[pair] = {
            price: newPrice,
            change: change,
            changePercent: changePercent,
          }
        })
        return updated
      })
      setLastUpdate(new Date())
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const getPrice = (pair) => marketData[pair]?.price || 1
  const getPriceData = (pair) => marketData[pair] || { price: 1, change: 0, changePercent: 0 }

  return { marketData, isConnected, lastUpdate, getPrice, getPriceData }
}

const SmartForexCalculator = () => {
  const [activeCalculator, setActiveCalculator] = useState("pip-value")

  const exchangeRates = useMemo(
    () => ({
      // Major Pairs
      "EUR/USD": 1.085,
      "GBP/USD": 1.265,
      "USD/JPY": 149.5,
      "USD/CHF": 0.895,
      "AUD/USD": 0.675,
      "USD/CAD": 1.345,
      "NZD/USD": 0.615,

      // Minor Pairs
      "EUR/GBP": 0.858,
      "EUR/JPY": 162.2,
      "GBP/JPY": 189.15,
      "EUR/CHF": 0.959,
      "GBP/CHF": 1.119,
      "AUD/JPY": 98.45,
      "CAD/JPY": 109.85,
      "CHF/JPY": 169.05,
      "EUR/AUD": 1.649,
      "GBP/AUD": 1.923,
      "EUR/CAD": 1.476,
      "GBP/CAD": 1.721,
      "AUD/CAD": 0.895,
      "EUR/NZD": 1.773,
      "GBP/NZD": 2.067,
      "AUD/NZD": 1.075,
      "CAD/CHF": 0.651,
      "NZD/JPY": 91.55,
      "NZD/CHF": 0.542,
      "NZD/CAD": 0.832,

      // Exotic Pairs
      "USD/TRY": 29.85,
      "USD/ZAR": 18.65,
      "USD/MXN": 17.25,
      "USD/BRL": 5.15,
      "USD/RUB": 92.45,
      "USD/INR": 83.25,
      "USD/CNY": 7.24,
      "USD/KRW": 1325.5,
      "USD/SGD": 1.345,
      "USD/HKD": 7.825,
      "USD/THB": 35.85,
      "USD/MYR": 4.685,
      "USD/IDR": 15750,
      "USD/PHP": 56.25,
      "USD/VND": 24350,
      "USD/SEK": 10.85,
      "USD/NOK": 10.95,
      "USD/DKK": 6.89,
      "USD/PLN": 4.025,
      "USD/CZK": 22.85,
      "USD/HUF": 365.5,
      "USD/AED": 3.673,
      "USD/SAR": 3.751,
      "USD/EGP": 30.85,
      "USD/ILS": 3.685,
      "USD/CLP": 925.5,
      "USD/COP": 4125.75,
      "USD/PEN": 3.785,

      // Cross pairs with exotics
      "EUR/TRY": 32.39,
      "GBP/TRY": 37.76,
      "EUR/ZAR": 20.24,
      "GBP/ZAR": 23.59,
      "EUR/MXN": 18.71,
      "GBP/MXN": 21.82,
      "EUR/SEK": 11.78,
      "EUR/NOK": 11.89,
      "EUR/DKK": 7.46,
      "EUR/PLN": 4.37,
      "EUR/CZK": 24.78,
      "EUR/HUF": 396.75,
      "AUD/SGD": 0.885,
      "NZD/SGD": 0.823,
    }),
    [],
  )

  const getPrice = useCallback(
    (pair: string) => {
      return exchangeRates[pair] || 1.0
    },
    [exchangeRates],
  )

  // Pip Value Calculator
  const [pipInputs, setPipInputs] = useState({
    currencyPair: "EUR/USD",
    accountCurrency: "USD",
    tradeSize: "1",
    currentPrice: "1.0850",
  })

  const [pipResults, setPipResults] = useState({
    pipValue: 0,
    pipValueQuote: 0,
    contractSize: 0,
  })

  const calculatePipValue = useCallback(() => {
    const tradeSize = Number.parseFloat(pipInputs.tradeSize) || 0
    const price = Number.parseFloat(pipInputs.currentPrice) || 1

    let pipValue = 0
    const contractSize = 100000 // Standard lot size

    // Calculate based on currency pair type
    if (pipInputs.currencyPair.endsWith("/USD") && pipInputs.accountCurrency === "USD") {
      // Direct quote (XXX/USD) - pip value is fixed
      pipValue = 0.0001 * contractSize * tradeSize
    } else if (pipInputs.currencyPair.startsWith("USD/") && pipInputs.accountCurrency === "USD") {
      // Indirect quote (USD/XXX) - pip value varies with price
      pipValue = (0.0001 * contractSize * tradeSize) / price
    } else {
      // Cross currency - simplified calculation
      pipValue = 0.0001 * contractSize * tradeSize
    }

    setPipResults({
      pipValue: pipValue,
      pipValueQuote: pipValue,
      contractSize: contractSize * tradeSize,
    })
  }, [pipInputs.tradeSize, pipInputs.currentPrice, pipInputs.currencyPair, pipInputs.accountCurrency])

  useEffect(() => {
    const livePrice = getPrice(pipInputs.currencyPair)
    setPipInputs((prev) => ({ ...prev, currentPrice: livePrice.toFixed(4) }))
  }, [pipInputs.currencyPair, getPrice])

  useEffect(() => {
    calculatePipValue()
  }, [calculatePipValue])

  // Position Size Calculator
  const [positionInputs, setPositionInputs] = useState({
    accountBalance: "10000",
    riskPercentage: "2",
    stopLossPips: "50",
    currencyPair: "EUR/USD",
    entryPrice: "1.0850",
    accountCurrency: "USD",
  })

  const [positionResults, setPositionResults] = useState({
    positionSize: 0,
    positionSizeUnits: 0,
    riskAmount: 0,
    riskLevel: "Low",
  })

  const calculatePositionSize = useCallback(() => {
    const balance = Number.parseFloat(positionInputs.accountBalance) || 0
    const riskPercent = Number.parseFloat(positionInputs.riskPercentage) || 0
    const stopLoss = Number.parseFloat(positionInputs.stopLossPips) || 0
    const entryPrice = Number.parseFloat(positionInputs.entryPrice) || 1

    const riskAmount = (balance * riskPercent) / 100

    // Calculate pip value for position sizing
    let pipValue = 0.0001 * 100000 // Standard calculation
    if (positionInputs.currencyPair.startsWith("USD/")) {
      pipValue = pipValue / entryPrice
    }

    const positionSize = stopLoss > 0 ? riskAmount / (stopLoss * pipValue) : 0
    const positionSizeUnits = positionSize * 100000

    // Determine risk level
    let riskLevel = "Low"
    if (riskPercent > 5) riskLevel = "High"
    else if (riskPercent > 2) riskLevel = "Medium"

    setPositionResults({
      positionSize: positionSize,
      positionSizeUnits: positionSizeUnits,
      riskAmount: riskAmount,
      riskLevel: riskLevel,
    })
  }, [
    positionInputs.accountBalance,
    positionInputs.riskPercentage,
    positionInputs.stopLossPips,
    positionInputs.currencyPair,
    positionInputs.entryPrice,
  ])

  useEffect(() => {
    calculatePositionSize()
  }, [calculatePositionSize])

  // Margin Calculator
  const [marginInputs, setMarginInputs] = useState({
    currencyPair: "EUR/USD",
    tradeSize: "1",
    leverage: "100",
    accountCurrency: "USD",
  })

  const [marginResults, setMarginResults] = useState({
    requiredMargin: 0,
    marginPercentage: 0,
    contractValue: 0,
    riskLevel: "Low",
  })

  const calculateMargin = useCallback(() => {
    const tradeSize = Number.parseFloat(marginInputs.tradeSize) || 0
    const leverage = Number.parseFloat(marginInputs.leverage) || 1
    const price = getPrice(marginInputs.currencyPair)

    const contractValue = tradeSize * 100000 * price
    const requiredMargin = contractValue / leverage
    const marginPercentage = (1 / leverage) * 100

    // Determine risk level based on leverage
    let riskLevel = "Low"
    if (leverage > 200) riskLevel = "High"
    else if (leverage > 50) riskLevel = "Medium"

    setMarginResults({
      requiredMargin: requiredMargin,
      marginPercentage: marginPercentage,
      contractValue: contractValue,
      riskLevel: riskLevel,
    })
  }, [marginInputs.tradeSize, marginInputs.leverage, marginInputs.currencyPair, getPrice])

  useEffect(() => {
    calculateMargin()
  }, [calculateMargin])

  // Profit Calculator
  const [profitInputs, setProfitInputs] = useState({
    currencyPair: "EUR/USD",
    direction: "buy",
    entryPrice: "1.0850",
    exitPrice: "1.0900",
    tradeSize: "1",
    accountCurrency: "USD",
  })

  const [profitResults, setProfitResults] = useState({
    profitLoss: 0,
    profitLossPips: 0,
    returnPercentage: 0,
    tradeOutcome: "Profit",
  })

  const calculateProfitLoss = useCallback(() => {
    const entryPrice = Number.parseFloat(profitInputs.entryPrice) || 0
    const exitPrice = Number.parseFloat(profitInputs.exitPrice) || 0
    const tradeSize = Number.parseFloat(profitInputs.tradeSize) || 0

    let priceDiff = 0
    if (profitInputs.direction === "buy") {
      priceDiff = exitPrice - entryPrice
    } else {
      priceDiff = entryPrice - exitPrice
    }

    // Calculate pips (handle JPY pairs differently)
    const isJPYPair = profitInputs.currencyPair.includes("JPY")
    const pipMultiplier = isJPYPair ? 100 : 10000
    const profitLossPips = priceDiff * pipMultiplier

    // Calculate profit/loss in account currency
    const contractSize = 100000
    let profitLoss = priceDiff * contractSize * tradeSize

    // Adjust for currency pair type
    if (profitInputs.currencyPair.startsWith("USD/") && profitInputs.accountCurrency === "USD") {
      profitLoss = profitLoss / exitPrice
    }

    const returnPercentage = entryPrice > 0 ? (priceDiff / entryPrice) * 100 : 0
    const tradeOutcome = profitLoss >= 0 ? "Profit" : "Loss"

    setProfitResults({
      profitLoss: profitLoss,
      profitLossPips: profitLossPips,
      returnPercentage: returnPercentage,
      tradeOutcome: tradeOutcome,
    })
  }, [
    profitInputs.entryPrice,
    profitInputs.exitPrice,
    profitInputs.tradeSize,
    profitInputs.direction,
    profitInputs.currencyPair,
    profitInputs.accountCurrency,
  ])

  useEffect(() => {
    calculateProfitLoss()
  }, [calculateProfitLoss])

  // Currency Converter
  const [converterInputs, setConverterInputs] = useState({
    amount: "1000",
    fromCurrency: "USD",
    toCurrency: "EUR",
  })

  const [converterResults, setConverterResults] = useState({
    convertedAmount: 0,
    exchangeRate: 0,
    rateChange: 0,
  })

  const convertCurrency = useCallback(() => {
    const amount = Number.parseFloat(converterInputs.amount) || 0
    const pair = `${converterInputs.fromCurrency}/${converterInputs.toCurrency}`
    const reversePair = `${converterInputs.toCurrency}/${converterInputs.fromCurrency}`

    let rate = exchangeRates[pair]
    if (!rate && exchangeRates[reversePair]) {
      rate = 1 / exchangeRates[reversePair]
    }
    if (!rate) rate = 1.0

    const convertedAmount = amount * rate
    const rateChange = Math.random() * 2 - 1 // Mock rate change

    setConverterResults({
      convertedAmount: convertedAmount,
      exchangeRate: rate,
      rateChange: rateChange,
    })
  }, [converterInputs.amount, converterInputs.fromCurrency, converterInputs.toCurrency, exchangeRates])

  useEffect(() => {
    convertCurrency()
  }, [convertCurrency])

  const router = useRouter()
  const { marketData, isConnected, lastUpdate } = useMarketData()

  const calculators = [
    { id: "pip-value", name: "Pip Value", icon: Calculator, color: "from-blue-600 to-blue-800" },
    { id: "position-size", name: "Position Size", icon: TrendingUp, color: "from-green-600 to-green-800" },
    { id: "margin", name: "Margin", icon: DollarSign, color: "from-purple-600 to-purple-800" },
    { id: "profit", name: "Profit/Loss", icon: BarChart3, color: "from-orange-600 to-orange-800" },
    { id: "currency", name: "Currency Converter", icon: RefreshCw, color: "from-teal-600 to-teal-800" },
    { id: "swap", name: "Swap Calculator", icon: PieChart, color: "from-red-600 to-red-800" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Smart Forex Calculator
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {isConnected ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Wifi className="h-4 w-4" />
                  <span>Live Data</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <WifiOff className="h-4 w-4" />
                  <span>Offline</span>
                </div>
              )}
              <div className="text-slate-400">{lastUpdate.toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Calculator Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {calculators.map((calc) => {
            const Icon = calc.icon
            return (
              <button
                key={calc.id}
                onClick={() => setActiveCalculator(calc.id)}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  activeCalculator === calc.id
                    ? "bg-gradient-to-r " + calc.color + " border-white/20 shadow-lg scale-105"
                    : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50"
                }`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium text-center">{calc.name}</div>
              </button>
            )
          })}
        </div>

        {/* Calculator Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-6">
                {(() => {
                  const calculator = calculators.find((c) => c.id === activeCalculator)
                  if (calculator?.icon) {
                    const IconComponent = calculator.icon
                    return <IconComponent className="h-5 w-5" />
                  }
                  return null
                })()}
                {calculators.find((c) => c.id === activeCalculator)?.name} Calculator
              </div>

              {activeCalculator === "pip-value" && <PipValueCalculator />}

              {activeCalculator === "position-size" && <PositionSizeCalculator />}

              {activeCalculator === "margin" && <MarginCalculator />}

              {activeCalculator === "profit" && <ProfitCalculator />}

              {activeCalculator === "currency" && <CurrencyConverter />}

              {activeCalculator === "swap" && <SwapCalculator />}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-bold mb-4">Results</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-600/20 to-green-800/20 rounded-lg border border-green-500/30">
                  <div className="text-sm text-green-300 mb-1">Calculated Value</div>
                  <div className="text-2xl font-bold text-green-400">$0.00</div>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Additional Info</div>
                  <div className="text-slate-300">Select inputs to calculate</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Live Market Rates</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-400">Live</span>
                </div>
              </div>
              <div className="space-y-4">
                {/* Major Pairs */}
                <div>
                  <h4 className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Major Pairs</h4>
                  <div className="space-y-2">
                    {Object.entries(marketData)
                      .filter(([pair]) =>
                        ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD"].includes(pair),
                      )
                      .map(([pair, data]) => (
                        <div key={pair} className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium text-sm">{pair}</span>
                          <div className="text-right">
                            <div
                              className={`font-bold text-sm ${data.change >= 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              {data.price.toFixed(4)}
                            </div>
                            <div className={`text-xs ${data.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {data.change >= 0 ? "+" : ""}
                              {data.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Minor Pairs */}
                <div>
                  <h4 className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Cross Pairs</h4>
                  <div className="space-y-2">
                    {Object.entries(marketData)
                      .filter(([pair]) =>
                        ["EUR/GBP", "EUR/JPY", "GBP/JPY", "EUR/CHF", "GBP/CHF", "AUD/JPY"].includes(pair),
                      )
                      .map(([pair, data]) => (
                        <div key={pair} className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium text-sm">{pair}</span>
                          <div className="text-right">
                            <div
                              className={`font-bold text-sm ${data.change >= 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              {data.price.toFixed(4)}
                            </div>
                            <div className={`text-xs ${data.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {data.change >= 0 ? "+" : ""}
                              {data.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Exotic Pairs */}
                <div>
                  <h4 className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Emerging Markets</h4>
                  <div className="space-y-2">
                    {Object.entries(marketData)
                      .filter(([pair]) =>
                        ["USD/TRY", "USD/ZAR", "USD/MXN", "USD/BRL", "USD/INR", "USD/CNY"].includes(pair),
                      )
                      .map(([pair, data]) => (
                        <div key={pair} className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium text-sm">{pair}</span>
                          <div className="text-right">
                            <div
                              className={`font-bold text-sm ${data.change >= 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              {data.price.toFixed(2)}
                            </div>
                            <div className={`text-xs ${data.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {data.change >= 0 ? "+" : ""}
                              {data.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/50">
                <div className="text-xs text-slate-500 text-center">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartForexCalculator

function PipValueCalculator() {
  const { getPrice, getPriceData } = useMarketData()
  const [inputs, setInputs] = useState({
    currencyPair: "EUR/USD",
    accountCurrency: "USD",
    tradeSize: "1",
    currentPrice: "1.0850",
  })

  const [results, setResults] = useState({
    pipValue: 0,
    pipValueQuote: 0,
    contractSize: 100000,
  })

  useEffect(() => {
    const livePrice = getPrice(inputs.currencyPair)
    setInputs((prev) => ({ ...prev, currentPrice: livePrice.toFixed(4) }))
  }, [inputs.currencyPair, getPrice])

  // Calculate pip value in real-time
  const calculatePipValueInner = () => {
    const tradeSize = Number.parseFloat(inputs.tradeSize) || 0
    const price = Number.parseFloat(inputs.currentPrice) || 1

    let pipValue = 0
    const contractSize = 100000 // Standard lot size

    // Calculate based on currency pair type
    if (inputs.currencyPair.endsWith("/USD") && inputs.accountCurrency === "USD") {
      // Direct quote (XXX/USD) - pip value is fixed
      pipValue = 0.0001 * contractSize * tradeSize
    } else if (inputs.currencyPair.startsWith("USD/") && inputs.accountCurrency === "USD") {
      // Indirect quote (USD/XXX) - pip value varies with price
      pipValue = (0.0001 * contractSize * tradeSize) / price
    } else {
      // Cross currency - simplified calculation
      pipValue = 0.0001 * contractSize * tradeSize
    }

    setResults({
      pipValue: pipValue,
      pipValueQuote: pipValue,
      contractSize: contractSize * tradeSize,
    })
  }

  // Recalculate when inputs change
  useEffect(() => {
    calculatePipValueInner()
  }, [inputs])

  const majorPairs = [
    // Major Pairs
    { value: "EUR/USD", label: "EUR/USD - Euro/US Dollar" },
    { value: "GBP/USD", label: "GBP/USD - British Pound/US Dollar" },
    { value: "USD/JPY", label: "USD/JPY - US Dollar/Japanese Yen" },
    { value: "USD/CHF", label: "USD/CHF - US Dollar/Swiss Franc" },
    { value: "AUD/USD", label: "AUD/USD - Australian Dollar/US Dollar" },
    { value: "USD/CAD", label: "USD/CAD - US Dollar/Canadian Dollar" },
    { value: "NZD/USD", label: "NZD/USD - New Zealand Dollar/US Dollar" },

    // Minor Pairs (Cross Currencies)
    { value: "EUR/GBP", label: "EUR/GBP - Euro/British Pound" },
    { value: "EUR/JPY", label: "EUR/JPY - Euro/Japanese Yen" },
    { value: "GBP/JPY", label: "GBP/JPY - British Pound/Japanese Yen" },
    { value: "EUR/CHF", label: "EUR/CHF - Euro/Swiss Franc" },
    { value: "GBP/CHF", label: "GBP/CHF - British Pound/Swiss Franc" },
    { value: "AUD/JPY", label: "AUD/JPY - Australian Dollar/Japanese Yen" },
    { value: "CAD/JPY", label: "CAD/JPY - Canadian Dollar/Japanese Yen" },
    { value: "CHF/JPY", label: "CHF/JPY - Swiss Franc/Japanese Yen" },
    { value: "EUR/AUD", label: "EUR/AUD - Euro/Australian Dollar" },
    { value: "GBP/AUD", label: "GBP/AUD - British Pound/Australian Dollar" },
    { value: "EUR/CAD", label: "EUR/CAD - Euro/Canadian Dollar" },
    { value: "GBP/CAD", label: "GBP/CAD - British Pound/Canadian Dollar" },
    { value: "AUD/CAD", label: "AUD/CAD - Australian Dollar/Canadian Dollar" },
    { value: "EUR/NZD", label: "EUR/NZD - Euro/New Zealand Dollar" },
    { value: "GBP/NZD", label: "GBP/NZD - British Pound/New Zealand Dollar" },
    { value: "AUD/NZD", label: "AUD/NZD - Australian Dollar/New Zealand Dollar" },
    { value: "CAD/CHF", label: "CAD/CHF - Canadian Dollar/Swiss Franc" },
    { value: "NZD/JPY", label: "NZD/JPY - New Zealand Dollar/Japanese Yen" },
    { value: "NZD/CHF", label: "NZD/CHF - New Zealand Dollar/Swiss Franc" },
    { value: "NZD/CAD", label: "NZD/CAD - New Zealand Dollar/Canadian Dollar" },

    // Exotic Pairs - Emerging Markets
    { value: "USD/TRY", label: "USD/TRY - US Dollar/Turkish Lira" },
    { value: "USD/ZAR", label: "USD/ZAR - US Dollar/South African Rand" },
    { value: "USD/MXN", label: "USD/MXN - US Dollar/Mexican Peso" },
    { value: "USD/BRL", label: "USD/BRL - US Dollar/Brazilian Real" },
    { value: "USD/RUB", label: "USD/RUB - US Dollar/Russian Ruble" },
    { value: "USD/INR", label: "USD/INR - US Dollar/Indian Rupee" },
    { value: "USD/CNY", label: "USD/CNY - US Dollar/Chinese Yuan" },
    { value: "USD/KRW", label: "USD/KRW - US Dollar/South Korean Won" },
    { value: "USD/SGD", label: "USD/SGD - US Dollar/Singapore Dollar" },
    { value: "USD/HKD", label: "USD/HKD - US Dollar/Hong Kong Dollar" },
    { value: "USD/THB", label: "USD/THB - US Dollar/Thai Baht" },
    { value: "USD/MYR", label: "USD/MYR - US Dollar/Malaysian Ringgit" },
    { value: "USD/IDR", label: "USD/IDR - US Dollar/Indonesian Rupiah" },
    { value: "USD/PHP", label: "USD/PHP - US Dollar/Philippine Peso" },
    { value: "USD/VND", label: "USD/VND - US Dollar/Vietnamese Dong" },

    // Nordic Currencies
    { value: "USD/SEK", label: "USD/SEK - US Dollar/Swedish Krona" },
    { value: "USD/NOK", label: "USD/NOK - US Dollar/Norwegian Krone" },
    { value: "USD/DKK", label: "USD/DKK - US Dollar/Danish Krone" },
    { value: "EUR/SEK", label: "EUR/SEK - Euro/Swedish Krona" },
    { value: "EUR/NOK", label: "EUR/NOK - Euro/Norwegian Krone" },
    { value: "EUR/DKK", label: "EUR/DKK - Euro/Danish Krone" },

    // Eastern European
    { value: "USD/PLN", label: "USD/PLN - US Dollar/Polish Zloty" },
    { value: "USD/CZK", label: "USD/CZK - US Dollar/Czech Koruna" },
    { value: "USD/HUF", label: "USD/HUF - US Dollar/Hungarian Forint" },
    { value: "EUR/PLN", label: "EUR/PLN - Euro/Polish Zloty" },
    { value: "EUR/CZK", label: "EUR/CZK - Euro/Czech Koruna" },
    { value: "EUR/HUF", label: "EUR/HUF - Euro/Hungarian Forint" },

    // Middle East & Africa
    { value: "USD/AED", label: "USD/AED - US Dollar/UAE Dirham" },
    { value: "USD/SAR", label: "USD/SAR - US Dollar/Saudi Riyal" },
    { value: "USD/EGP", label: "USD/EGP - US Dollar/Egyptian Pound" },
    { value: "USD/ILS", label: "USD/ILS - US Dollar/Israeli Shekel" },

    // Latin America
    { value: "USD/CLP", label: "USD/CLP - US Dollar/Chilean Peso" },
    { value: "USD/COP", label: "USD/COP - US Dollar/Colombian Peso" },
    { value: "USD/PEN", label: "USD/PEN - US Dollar/Peruvian Sol" },

    // Cross pairs with exotics
    { value: "EUR/TRY", label: "EUR/TRY - Euro/Turkish Lira" },
    { value: "GBP/TRY", label: "GBP/TRY - British Pound/Turkish Lira" },
    { value: "EUR/ZAR", label: "EUR/ZAR - Euro/South African Rand" },
    { value: "GBP/ZAR", label: "GBP/ZAR - British Pound/South African Rand" },
    { value: "EUR/MXN", label: "EUR/MXN - Euro/Mexican Peso" },
    { value: "GBP/MXN", label: "GBP/MXN - British Pound/Mexican Peso" },

    // Pacific Region
    { value: "AUD/SGD", label: "AUD/SGD - Australian Dollar/Singapore Dollar" },
    { value: "NZD/SGD", label: "NZD/SGD - New Zealand Dollar/Singapore Dollar" },
  ]

  const currencies = [
    // Major Currencies
    { value: "USD", label: "USD - US Dollar 🇺🇸" },
    { value: "EUR", label: "EUR - Euro 🇪🇺" },
    { value: "GBP", label: "GBP - British Pound 🇬🇧" },
    { value: "JPY", label: "JPY - Japanese Yen 🇯🇵" },
    { value: "CHF", label: "CHF - Swiss Franc 🇨🇭" },
    { value: "AUD", label: "AUD - Australian Dollar 🇦🇺" },
    { value: "CAD", label: "CAD - Canadian Dollar 🇨🇦" },
    { value: "NZD", label: "NZD - New Zealand Dollar 🇳🇿" },

    // Asian Currencies
    { value: "CNY", label: "CNY - Chinese Yuan 🇨🇳" },
    { value: "INR", label: "INR - Indian Rupee 🇮🇳" },
    { value: "KRW", label: "KRW - South Korean Won 🇰🇷" },
    { value: "SGD", label: "SGD - Singapore Dollar 🇸🇬" },
    { value: "HKD", label: "HKD - Hong Kong Dollar 🇭🇰" },
    { value: "THB", label: "THB - Thai Baht 🇹🇭" },
    { value: "MYR", label: "MYR - Malaysian Ringgit 🇲🇾" },
    { value: "IDR", label: "IDR - Indonesian Rupiah 🇮🇩" },
    { value: "PHP", label: "PHP - Philippine Peso 🇵🇭" },
    { value: "VND", label: "VND - Vietnamese Dong 🇻🇳" },

    // European Currencies
    { value: "SEK", label: "SEK - Swedish Krona 🇸🇪" },
    { value: "NOK", label: "NOK - Norwegian Krone 🇳🇴" },
    { value: "DKK", label: "DKK - Danish Krone 🇩🇰" },
    { value: "PLN", label: "PLN - Polish Zloty 🇵🇱" },
    { value: "CZK", label: "CZK - Czech Koruna 🇨🇿" },
    { value: "HUF", label: "HUF - Hungarian Forint 🇭🇺" },
    { value: "RUB", label: "RUB - Russian Ruble 🇷🇺" },

    // Middle East & Africa
    { value: "TRY", label: "TRY - Turkish Lira 🇹🇷" },
    { value: "ZAR", label: "ZAR - South African Rand 🇿🇦" },
    { value: "AED", label: "AED - UAE Dirham 🇦🇪" },
    { value: "SAR", label: "SAR - Saudi Riyal 🇸🇦" },
    { value: "EGP", label: "EGP - Egyptian Pound 🇪🇬" },
    { value: "ILS", label: "ILS - Israeli Shekel 🇮🇱" },

    // Latin America
    { value: "MXN", label: "MXN - Mexican Peso 🇲🇽" },
    { value: "BRL", label: "BRL - Brazilian Real 🇧🇷" },
    { value: "CLP", label: "CLP - Chilean Peso 🇨🇱" },
    { value: "COP", label: "COP - Colombian Peso 🇨🇴" },
    { value: "PEN", label: "PEN - Peruvian Sol 🇵🇪" },
    { value: "ARS", label: "ARS - Argentine Peso 🇦🇷" },
  ]

  useEffect(() => {
    const livePrice = getPrice(inputs.currencyPair)
    setInputs((prev) => ({ ...prev, currentPrice: livePrice.toFixed(4) }))
  }, [inputs.currencyPair, getPrice])

  // Calculate pip value in real-time
  const calculatePipValue = () => {
    const tradeSize = Number.parseFloat(inputs.tradeSize) || 0
    const price = Number.parseFloat(inputs.currentPrice) || 1

    let pipValue = 0
    const contractSize = 100000 // Standard lot size

    // Calculate based on currency pair type
    if (inputs.currencyPair.endsWith("/USD") && inputs.accountCurrency === "USD") {
      // Direct quote (XXX/USD) - pip value is fixed
      pipValue = 0.0001 * contractSize * tradeSize
    } else if (inputs.currencyPair.startsWith("USD/") && inputs.accountCurrency === "USD") {
      // Indirect quote (USD/XXX) - pip value varies with price
      pipValue = (0.0001 * contractSize * tradeSize) / price
    } else {
      // Cross currency - simplified calculation
      pipValue = 0.0001 * contractSize * tradeSize
    }

    setResults({
      pipValue: pipValue,
      pipValueQuote: pipValue,
      contractSize: contractSize * tradeSize,
    })
  }

  // Recalculate when inputs change
  useEffect(() => {
    calculatePipValue()
  }, [inputs])

  const updateToLivePrice = () => {
    const livePrice = getPrice(inputs.currencyPair)
    setInputs((prev) => ({ ...prev, currentPrice: livePrice.toFixed(4) }))
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Currency Pair</label>
          <select
            value={inputs.currencyPair}
            onChange={(e) => setInputs({ ...inputs, currencyPair: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
          >
            <optgroup label="Major Pairs">
              {majorPairs
                .filter((pair) =>
                  ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD"].includes(pair.value),
                )
                .map((pair) => (
                  <option key={pair.value} value={pair.value}>
                    {pair.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Minor Pairs (Cross Currencies)">
              {majorPairs
                .filter(
                  (pair) =>
                    (pair.value.includes("/") &&
                      !pair.value.includes("USD") &&
                      ![
                        "EUR/GBP",
                        "EUR/JPY",
                        "GBP/JPY",
                        "EUR/CHF",
                        "GBP/CHF",
                        "AUD/JPY",
                        "CAD/JPY",
                        "CHF/JPY",
                        "EUR/AUD",
                        "GBP/AUD",
                        "EUR/CAD",
                        "GBP/CAD",
                        "AUD/CAD",
                        "EUR/NZD",
                        "GBP/NZD",
                        "AUD/NZD",
                        "CAD/CHF",
                        "NZD/JPY",
                        "NZD/CHF",
                        "NZD/CAD",
                      ].includes(pair.value)) ||
                    [
                      "EUR/GBP",
                      "EUR/JPY",
                      "GBP/JPY",
                      "EUR/CHF",
                      "GBP/CHF",
                      "AUD/JPY",
                      "CAD/JPY",
                      "CHF/JPY",
                      "EUR/AUD",
                      "GBP/AUD",
                      "EUR/CAD",
                      "GBP/CAD",
                      "AUD/CAD",
                      "EUR/NZD",
                      "GBP/NZD",
                      "AUD/NZD",
                      "CAD/CHF",
                      "NZD/JPY",
                      "NZD/CHF",
                      "NZD/CAD",
                    ].includes(pair.value),
                )
                .map((pair) => (
                  <option key={pair.value} value={pair.value}>
                    {pair.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Exotic Pairs">
              {majorPairs
                .filter(
                  (pair) =>
                    pair.value.includes("TRY") ||
                    pair.value.includes("ZAR") ||
                    pair.value.includes("MXN") ||
                    pair.value.includes("BRL") ||
                    pair.value.includes("RUB") ||
                    pair.value.includes("INR") ||
                    pair.value.includes("CNY") ||
                    pair.value.includes("KRW") ||
                    pair.value.includes("SGD") ||
                    pair.value.includes("HKD") ||
                    pair.value.includes("THB") ||
                    pair.value.includes("MYR") ||
                    pair.value.includes("IDR") ||
                    pair.value.includes("PHP") ||
                    pair.value.includes("VND") ||
                    pair.value.includes("SEK") ||
                    pair.value.includes("NOK") ||
                    pair.value.includes("DKK") ||
                    pair.value.includes("PLN") ||
                    pair.value.includes("CZK") ||
                    pair.value.includes("HUF") ||
                    pair.value.includes("AED") ||
                    pair.value.includes("SAR") ||
                    pair.value.includes("EGP") ||
                    pair.value.includes("ILS") ||
                    pair.value.includes("CLP") ||
                    pair.value.includes("COP") ||
                    pair.value.includes("PEN"),
                )
                .map((pair) => (
                  <option key={pair.value} value={pair.value}>
                    {pair.label}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Account Currency</label>
          <select
            value={inputs.accountCurrency}
            onChange={(e) => setInputs({ ...inputs, accountCurrency: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Trade Size (Lots)</label>
          <div className="relative">
            <input
              type="number"
              value={inputs.tradeSize}
              onChange={(e) => setInputs({ ...inputs, tradeSize: e.target.value })}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="1.0"
              step="0.01"
              min="0.01"
            />
            <div className="absolute right-3 top-3 text-slate-400 text-sm">lots</div>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Contract Size: {results.contractSize.toLocaleString()} units
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Current Price</label>
          <div className="relative">
            <input
              type="number"
              value={inputs.currentPrice}
              onChange={(e) => setInputs({ ...inputs, currentPrice: e.target.value })}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="1.0850"
              step="0.0001"
            />
            <button
              onClick={updateToLivePrice}
              className="absolute right-3 top-3 text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Live
            </button>
          </div>
          <div className="mt-1 text-xs">
            <span className="text-slate-400">Live: </span>
            <span
              className={`font-medium ${getPriceData(inputs.currencyPair).change >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {getPrice(inputs.currencyPair).toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Results */}
      <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Calculated Results</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
            <div className="text-xs text-blue-300 mb-1">Pip Value</div>
            <div className="text-lg font-bold text-blue-400">
              {inputs.accountCurrency} {results.pipValue.toFixed(2)}
            </div>
          </div>
          <div className="text-center p-3 bg-slate-600/20 rounded-lg border border-slate-500/30">
            <div className="text-xs text-slate-300 mb-1">Per Pip Movement</div>
            <div className="text-lg font-bold text-slate-300">±{results.pipValue.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <button
        onClick={calculatePipValue}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Recalculate Pip Value
      </button>
    </div>
  )
}

// Position Size Calculator Component
function PositionSizeCalculator() {
  const [inputs, setInputs] = useState({
    accountBalance: "10000",
    riskPercentage: "2",
    stopLossPips: "50",
    currencyPair: "EUR/USD",
    entryPrice: "1.0850",
    accountCurrency: "USD",
  })

  const [results, setResults] = useState({
    positionSizeLots: 0,
    positionSizeUnits: 0,
    riskAmount: 0,
    pipValue: 0,
    riskLevel: "low",
  })

  const calculatePositionSize = () => {
    const balance = Number.parseFloat(inputs.accountBalance) || 0
    const riskPercent = Number.parseFloat(inputs.riskPercentage) || 0
    const stopLoss = Number.parseFloat(inputs.stopLossPips) || 0
    const price = Number.parseFloat(inputs.entryPrice) || 1

    // Calculate risk amount
    const riskAmount = (balance * riskPercent) / 100

    // Calculate pip value (simplified for major pairs)
    let pipValue = 0
    const contractSize = 100000

    if (inputs.currencyPair.endsWith("/USD") && inputs.accountCurrency === "USD") {
      pipValue = 0.0001 * contractSize // $10 per pip for 1 lot
    } else if (inputs.currencyPair.startsWith("USD/") && inputs.accountCurrency === "USD") {
      pipValue = (0.0001 * contractSize) / price
    } else {
      pipValue = 0.0001 * contractSize // Simplified
    }

    // Calculate position size
    const positionSizeLots = stopLoss > 0 ? riskAmount / (stopLoss * pipValue) : 0
    const positionSizeUnits = positionSizeLots * contractSize

    // Determine risk level
    let riskLevel = "low"
    if (riskPercent > 5) riskLevel = "high"
    else if (riskPercent > 2) riskLevel = "medium"

    setResults({
      positionSizeLots,
      positionSizeUnits,
      riskAmount,
      pipValue,
      riskLevel,
    })
  }

  // Recalculate when inputs change
  useEffect(() => {
    calculatePositionSize()
  }, [inputs])

  const majorPairs = [
    { value: "EUR/USD", label: "EUR/USD - Euro/US Dollar" },
    { value: "GBP/USD", label: "GBP/USD - British Pound/US Dollar" },
    { value: "USD/JPY", label: "USD/JPY - US Dollar/Japanese Yen" },
    { value: "USD/CHF", label: "USD/CHF - US Dollar/Swiss Franc" },
    { value: "AUD/USD", label: "AUD/USD - Australian Dollar/US Dollar" },
    { value: "USD/CAD", label: "USD/CAD - US Dollar/Canadian Dollar" },
  ]

  const currencies = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "JPY", label: "Japanese Yen" },
  ]

  const getRiskColor = (level) => {
    switch (level) {
      case "high":
        return "text-red-400 bg-red-600/20 border-red-500/30"
      case "medium":
        return "text-yellow-400 bg-yellow-600/20 border-yellow-500/30"
      default:
        return "text-green-400 bg-green-600/20 border-green-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Account Balance</label>
          <div className="relative">
            <input
              type="number"
              value={inputs.accountBalance}
              onChange={(e) => setInputs({ ...inputs, accountBalance: e.target.value })}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-green-500 focus:outline-none transition-colors"
              placeholder="10000"
            />
            <div className="absolute right-3 top-3 text-slate-400 text-sm">{inputs.accountCurrency}</div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Risk Percentage (%)</label>
          <div className="relative">
            <input
              type="number"
              value={inputs.riskPercentage}
              onChange={(e) => setInputs({ ...inputs, riskPercentage: e.target.value })}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-green-500 focus:outline-none transition-colors"
              placeholder="2"
              step="0.1"
              min="0.1"
              max="10"
            />
            <div className="absolute right-3 top-3 text-slate-400 text-sm">%</div>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Risk Amount: {inputs.accountCurrency} {results.riskAmount.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Stop Loss (Pips)</label>
          <input
            type="number"
            value={inputs.stopLossPips}
            onChange={(e) => setInputs({ ...inputs, stopLossPips: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-green-500 focus:outline-none"
            placeholder="50"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Currency Pair</label>
          <select
            value={inputs.currencyPair}
            onChange={(e) => setInputs({ ...inputs, currencyPair: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-green-500 focus:outline-none transition-colors"
          >
            {majorPairs.map((pair) => (
              <option key={pair.value} value={pair.value}>
                {pair.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Account Currency</label>
          <select
            value={inputs.accountCurrency}
            onChange={(e) => setInputs({ ...inputs, accountCurrency: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-green-500 focus:outline-none transition-colors"
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Entry Price</label>
        <div className="relative">
          <input
            type="number"
            value={inputs.entryPrice}
            onChange={(e) => setInputs({ ...inputs, entryPrice: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-green-500 focus:outline-none transition-colors"
            placeholder="1.0850"
            step="0.0001"
          />
          <button className="absolute right-3 top-3 text-green-400 hover:text-green-300 text-sm">Live</button>
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Calculated Results</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-600/20 rounded-lg border border-green-500/30">
            <div className="text-xs text-green-300 mb-1">Position Size</div>
            <div className="text-lg font-bold text-green-400">{results.positionSizeLots.toFixed(2)} lots</div>
            <div className="text-xs text-green-300 mt-1">{results.positionSizeUnits.toLocaleString()} units</div>
          </div>
          <div className="text-center p-3 bg-slate-600/20 rounded-lg border border-slate-500/30">
            <div className="text-xs text-slate-300 mb-1">Pip Value</div>
            <div className="text-lg font-bold text-slate-300">
              {inputs.accountCurrency} {results.pipValue.toFixed(2)}
            </div>
          </div>
          <div className={`text-center p-3 rounded-lg border ${getRiskColor(results.riskLevel)}`}>
            <div className="text-xs mb-1">Risk Level</div>
            <div className="text-lg font-bold capitalize">{results.riskLevel}</div>
            <div className="text-xs mt-1">
              {results.riskAmount.toFixed(2)} {inputs.accountCurrency}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
        <h5 className="text-sm font-medium text-blue-300 mb-2">Risk Management Tips</h5>
        <ul className="text-xs text-blue-200 space-y-1">
          <li>Never risk more than 1-2% of your account per trade</li>
          <li>Use proper stop losses to limit downside risk</li>
          <li>Consider market volatility when setting position sizes</li>
          <li>Diversify across multiple currency pairs</li>
        </ul>
      </div>

      <button
        onClick={calculatePositionSize}
        className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Recalculate Position Size
      </button>
    </div>
  )
}

function MarginCalculator() {
  const [inputs, setInputs] = useState({
    currencyPair: "EUR/USD",
    tradeSize: "1",
    leverage: "100",
    accountCurrency: "USD",
    currentPrice: "1.0850",
  })

  const [results, setResults] = useState({
    requiredMargin: 0,
    marginPercentage: 0,
    contractValue: 0,
    marginLevel: "safe",
  })

  const calculateMargin = () => {
    const tradeSize = Number.parseFloat(inputs.tradeSize) || 0
    const leverage = Number.parseFloat(inputs.leverage) || 1
    const price = Number.parseFloat(inputs.currentPrice) || 1
    const contractSize = 100000 // Standard lot size

    // Calculate contract value
    const contractValue = tradeSize * contractSize * price

    // Calculate required margin
    const requiredMargin = contractValue / leverage

    // Calculate margin percentage
    const marginPercentage = (1 / leverage) * 100

    // Determine margin level based on leverage
    let marginLevel = "safe"
    if (leverage > 400) marginLevel = "high-risk"
    else if (leverage > 200) marginLevel = "medium-risk"
    else if (leverage > 100) marginLevel = "moderate"

    setResults({
      requiredMargin,
      marginPercentage,
      contractValue,
      marginLevel,
    })
  }

  // Recalculate when inputs change
  useEffect(() => {
    calculateMargin()
  }, [inputs])

  const majorPairs = [
    { value: "EUR/USD", label: "EUR/USD - Euro/US Dollar" },
    { value: "GBP/USD", label: "GBP/USD - British Pound/US Dollar" },
    { value: "USD/JPY", label: "USD/JPY - US Dollar/Japanese Yen" },
    { value: "USD/CHF", label: "USD/CHF - US Dollar/Swiss Franc" },
    { value: "AUD/USD", label: "AUD/USD - Australian Dollar/US Dollar" },
    { value: "USD/CAD", label: "USD/CAD - US Dollar/Canadian Dollar" },
  ]

  const currencies = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "JPY", label: "Japanese Yen" },
  ]

  const leverageOptions = [
    { value: "30", label: "1:30 (Conservative)" },
    { value: "50", label: "1:50 (Low Risk)" },
    { value: "100", label: "1:100 (Standard)" },
    { value: "200", label: "1:200 (Moderate Risk)" },
    { value: "400", label: "1:400 (High Risk)" },
    { value: "500", label: "1:500 (Very High Risk)" },
  ]

  const getMarginLevelColor = (level) => {
    switch (level) {
      case "high-risk":
        return "text-red-400 bg-red-600/20 border-red-500/30"
      case "medium-risk":
        return "text-orange-400 bg-orange-600/20 border-orange-500/30"
      case "moderate":
        return "text-yellow-400 bg-yellow-600/20 border-yellow-500/30"
      default:
        return "text-green-400 bg-green-600/20 border-green-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Currency Pair</label>
          <select
            value={inputs.currencyPair}
            onChange={(e) => setInputs({ ...inputs, currencyPair: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
          >
            {majorPairs.map((pair) => (
              <option key={pair.value} value={pair.value}>
                {pair.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Trade Size (Lots)</label>
          <div className="relative">
            <input
              type="number"
              value={inputs.tradeSize}
              onChange={(e) => setInputs({ ...inputs, tradeSize: e.target.value })}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="1.0"
              step="0.01"
              min="0.01"
            />
            <div className="absolute right-3 top-3 text-slate-400 text-sm">lots</div>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Contract Value: {inputs.accountCurrency} {results.contractValue.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Leverage</label>
          <select
            value={inputs.leverage}
            onChange={(e) => setInputs({ ...inputs, leverage: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
          >
            {leverageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="mt-1 text-xs text-slate-400">Margin Requirement: {results.marginPercentage.toFixed(2)}%</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Account Currency</label>
          <select
            value={inputs.accountCurrency}
            onChange={(e) => setInputs({ ...inputs, accountCurrency: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Current Price</label>
        <div className="relative">
          <input
            type="number"
            value={inputs.currentPrice}
            onChange={(e) => setInputs({ ...inputs, currentPrice: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="1.0850"
            step="0.0001"
          />
          <button className="absolute right-3 top-3 text-purple-400 hover:text-purple-300 text-sm">Live</button>
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Margin Calculation Results</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
            <div className="text-xs text-purple-300 mb-1">Required Margin</div>
            <div className="text-lg font-bold text-purple-400">
              {inputs.accountCurrency} {results.requiredMargin.toFixed(2)}
            </div>
          </div>
          <div className="text-center p-3 bg-slate-600/20 rounded-lg border border-slate-500/30">
            <div className="text-xs text-slate-300 mb-1">Margin %</div>
            <div className="text-lg font-bold text-slate-300">{results.marginPercentage.toFixed(2)}%</div>
          </div>
          <div className={`text-center p-3 rounded-lg border ${getMarginLevelColor(results.marginLevel)}`}>
            <div className="text-xs mb-1">Risk Level</div>
            <div className="text-sm font-bold capitalize">{results.marginLevel.replace("-", " ")}</div>
          </div>
        </div>
      </div>

      <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4">
        <h5 className="text-sm font-medium text-purple-300 mb-2">Margin Trading Guidelines</h5>
        <ul className="text-xs text-purple-200 space-y-1">
          <li>Higher leverage = Lower margin requirement but higher risk</li>
          <li>Always maintain sufficient free margin for market fluctuations</li>
          <li>Monitor margin level to avoid margin calls</li>
          <li>Consider using lower leverage for better risk management</li>
        </ul>
      </div>

      <button
        onClick={calculateMargin}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Recalculate Margin Requirements
      </button>
    </div>
  )
}

function ProfitCalculator() {
  const [inputs, setInputs] = useState({
    currencyPair: "EUR/USD",
    position: "buy",
    entryPrice: "1.0850",
    exitPrice: "1.0900",
    tradeSize: "1",
    accountCurrency: "USD",
  })

  const [results, setResults] = useState({
    profitLoss: 0,
    profitLossPips: 0,
    profitLossPercentage: 0,
    totalValue: 0,
    isProfit: true,
  })

  const calculateProfitLoss = () => {
    const entryPrice = Number.parseFloat(inputs.entryPrice) || 0
    const exitPrice = Number.parseFloat(inputs.exitPrice) || 0
    const tradeSize = Number.parseFloat(inputs.tradeSize) || 0
    const contractSize = 100000 // Standard lot size

    // Calculate pip difference
    let pipDifference = 0
    let pipValue = 0

    if (inputs.currencyPair.includes("JPY")) {
      // For JPY pairs, pip is 0.01
      pipDifference = (exitPrice - entryPrice) * 100
      pipValue = (0.01 * contractSize * tradeSize) / exitPrice
    } else {
      // For other pairs, pip is 0.0001
      pipDifference = (exitPrice - entryPrice) * 10000
      pipValue = 0.0001 * contractSize * tradeSize
    }

    // Adjust for position type
    if (inputs.position === "sell") {
      pipDifference = -pipDifference
    }

    // Calculate profit/loss
    const profitLoss = pipDifference * pipValue
    const totalValue = tradeSize * contractSize * entryPrice
    const profitLossPercentage = totalValue > 0 ? (profitLoss / totalValue) * 100 : 0

    setResults({
      profitLoss: Math.abs(profitLoss),
      profitLossPips: pipDifference,
      profitLossPercentage: Math.abs(profitLossPercentage),
      totalValue,
      isProfit: profitLoss >= 0,
    })
  }

  // Recalculate when inputs change
  useEffect(() => {
    calculateProfitLoss()
  }, [inputs])

  const majorPairs = [
    { value: "EUR/USD", label: "EUR/USD - Euro/US Dollar" },
    { value: "GBP/USD", label: "GBP/USD - British Pound/US Dollar" },
    { value: "USD/JPY", label: "USD/JPY - US Dollar/Japanese Yen" },
    { value: "USD/CHF", label: "USD/CHF - US Dollar/Swiss Franc" },
    { value: "AUD/USD", label: "AUD/USD - Australian Dollar/US Dollar" },
    { value: "USD/CAD", label: "USD/CAD - US Dollar/Canadian Dollar" },
  ]

  const currencies = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "JPY", label: "Japanese Yen" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Currency Pair</label>
          <select
            value={inputs.currencyPair}
            onChange={(e) => setInputs({ ...inputs, currencyPair: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-colors"
          >
            {majorPairs.map((pair) => (
              <option key={pair.value} value={pair.value}>
                {pair.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Position Type</label>
          <select
            value={inputs.position}
            onChange={(e) => setInputs({ ...inputs, position: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-colors"
          >
            <option value="buy">Buy (Long) - Expect price to rise</option>
            <option value="sell">Sell (Short) - Expect price to fall</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Account Currency</label>
          <select
            value={inputs.accountCurrency}
            onChange={(e) => setInputs({ ...inputs, accountCurrency: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-colors"
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Entry Price</label>
          <div className="relative">
            <input
              type="number"
              value={inputs.entryPrice}
              onChange={(e) => setInputs({ ...inputs, entryPrice: e.target.value })}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="1.0850"
              step="0.0001"
            />
            <button className="absolute right-3 top-3 text-orange-400 hover:text-orange-300 text-sm">Live</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Exit Price (Target/Current)</label>
          <div className="relative">
            <input
              type="number"
              value={inputs.exitPrice}
              onChange={(e) => setInputs({ ...inputs, exitPrice: e.target.value })}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="1.0900"
              step="0.0001"
            />
            <button className="absolute right-3 top-3 text-orange-400 hover:text-orange-300 text-sm">Live</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Trade Size (Lots)</label>
          <div className="relative">
            <input
              type="number"
              value={inputs.tradeSize}
              onChange={(e) => setInputs({ ...inputs, tradeSize: e.target.value })}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="1.0"
              step="0.01"
              min="0.01"
            />
            <div className="absolute right-3 top-3 text-slate-400 text-sm">lots</div>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Contract Value: {inputs.accountCurrency} {results.totalValue.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Profit/Loss Calculation Results</h4>
        <div className="grid md:grid-cols-4 gap-4">
          <div
            className={`text-center p-3 rounded-lg border ${
              results.isProfit ? "bg-green-600/20 border-green-500/30" : "bg-red-600/20 border-red-500/30"
            }`}
          >
            <div className={`text-xs mb-1 ${results.isProfit ? "text-green-300" : "text-red-300"}`}>
              {results.isProfit ? "Profit" : "Loss"}
            </div>
            <div className={`text-lg font-bold ${results.isProfit ? "text-green-400" : "text-red-400"}`}>
              {results.isProfit ? "+" : "-"}
              {inputs.accountCurrency} {results.profitLoss.toFixed(2)}
            </div>
          </div>
          <div className="text-center p-3 bg-slate-600/20 rounded-lg border border-slate-500/30">
            <div className="text-xs text-slate-300 mb-1">Pip Movement</div>
            <div className={`text-lg font-bold ${results.profitLossPips >= 0 ? "text-green-400" : "text-red-400"}`}>
              {results.profitLossPips >= 0 ? "+" : ""}
              {results.profitLossPips.toFixed(1)} pips
            </div>
          </div>
          <div className="text-center p-3 bg-slate-600/20 rounded-lg border border-slate-500/30">
            <div className="text-xs text-slate-300 mb-1">Return %</div>
            <div className={`text-lg font-bold ${results.isProfit ? "text-green-400" : "text-red-400"}`}>
              {results.isProfit ? "+" : "-"}
              {results.profitLossPercentage.toFixed(3)}%
            </div>
          </div>
          <div className="text-center p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
            <div className="text-xs text-blue-300 mb-1">Position</div>
            <div className="text-lg font-bold text-blue-400 capitalize">{inputs.position}</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4">
          <h5 className="text-sm font-medium text-orange-300 mb-2">Trade Analysis</h5>
          <div className="space-y-2 text-xs text-orange-200">
            <div className="flex justify-between">
              <span>Price Movement:</span>
              <span>
                {((Number.parseFloat(inputs.exitPrice) - Number.parseFloat(inputs.entryPrice)) * 10000).toFixed(1)} pips
              </span>
            </div>
            <div className="flex justify-between">
              <span>Position Direction:</span>
              <span className="capitalize">
                {inputs.position} ({inputs.position === "buy" ? "Long" : "Short"})
              </span>
            </div>
            <div className="flex justify-between">
              <span>Trade Outcome:</span>
              <span className={results.isProfit ? "text-green-400" : "text-red-400"}>
                {results.isProfit ? "Profitable" : "Loss"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
          <h5 className="text-sm font-medium text-blue-300 mb-2">Trading Tips</h5>
          <ul className="text-xs text-blue-200 space-y-1">
            <li>• Set stop losses to limit potential losses</li>
            <li>• Take profits at predetermined levels</li>
            <li>• Consider risk-reward ratios before trading</li>
            <li>• Monitor market conditions and news events</li>
          </ul>
        </div>
      </div>

      <button
        onClick={calculateProfitLoss}
        className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Recalculate Profit/Loss
      </button>
    </div>
  )
}

function CurrencyConverter() {
  const [inputs, setInputs] = useState({
    amount: "1000",
    fromCurrency: "USD",
    toCurrency: "EUR",
  })

  const [results, setResults] = useState({
    convertedAmount: 0,
    exchangeRate: 0,
    rateChange: 0,
  })

  const exchangeRates = useMemo(
    () => ({
      "EUR/USD": 1.085,
      "GBP/USD": 1.265,
      "USD/JPY": 149.5,
      "USD/CHF": 0.895,
      "AUD/USD": 0.675,
      "USD/CAD": 1.345,
      "NZD/USD": 0.615,
      "EUR/GBP": 0.858,
      "EUR/JPY": 162.2,
      "GBP/JPY": 189.15,
      "EUR/CHF": 0.959,
      "GBP/CHF": 1.119,
      "AUD/JPY": 98.45,
      "CAD/JPY": 109.85,
      "CHF/JPY": 169.05,
      "EUR/AUD": 1.649,
      "GBP/AUD": 1.923,
      "EUR/CAD": 1.476,
      "GBP/CAD": 1.721,
      "AUD/CAD": 0.895,
      "EUR/NZD": 1.773,
      "GBP/NZD": 2.067,
      "AUD/NZD": 1.075,
      "CAD/CHF": 0.651,
      "NZD/JPY": 91.55,
      "NZD/CHF": 0.542,
      "NZD/CAD": 0.832,

      // Exotic Pairs
      "USD/TRY": 29.85,
      "USD/ZAR": 18.65,
      "USD/MXN": 17.25,
      "USD/BRL": 5.15,
      "USD/RUB": 92.45,
      "USD/INR": 83.25,
      "USD/CNY": 7.24,
      "USD/KRW": 1325.5,
      "USD/SGD": 1.345,
      "USD/HKD": 7.825,
      "USD/THB": 35.85,
      "USD/MYR": 4.685,
      "USD/IDR": 15750,
      "USD/PHP": 56.25,
      "USD/VND": 24350,
      "USD/SEK": 10.85,
      "USD/NOK": 10.95,
      "USD/DKK": 6.89,
      "USD/PLN": 4.025,
      "USD/CZK": 22.85,
      "USD/HUF": 365.5,
      "USD/AED": 3.673,
      "USD/SAR": 3.751,
      "USD/EGP": 30.85,
      "USD/ILS": 3.685,
      "USD/CLP": 925.5,
      "USD/COP": 4125.75,
      "USD/PEN": 3.785,

      // Cross pairs with exotics
      "EUR/TRY": 32.39,
      "GBP/TRY": 37.76,
      "EUR/ZAR": 20.24,
      "GBP/ZAR": 23.59,
      "EUR/MXN": 18.71,
      "GBP/MXN": 21.82,
      "EUR/SEK": 11.78,
      "EUR/NOK": 11.89,
      "EUR/DKK": 7.46,
      "EUR/PLN": 4.37,
      "EUR/CZK": 24.78,
      "EUR/HUF": 396.75,
      "AUD/SGD": 0.885,
      "NZD/SGD": 0.823,
    }),
    [],
  )

  const convertCurrency = useCallback(() => {
    const amount = Number.parseFloat(inputs.amount) || 0
    const pair = `${inputs.fromCurrency}/${inputs.toCurrency}`
    const reversePair = `${inputs.toCurrency}/${inputs.fromCurrency}`

    let rate = exchangeRates[pair]
    if (!rate && exchangeRates[reversePair]) {
      rate = 1 / exchangeRates[reversePair]
    }
    if (!rate) rate = 1.0

    const convertedAmount = amount * rate
    const rateChange = Math.random() * 2 - 1 // Mock rate change

    setResults({
      convertedAmount: convertedAmount,
      exchangeRate: rate,
      rateChange: rateChange,
    })
  }, [inputs.amount, inputs.fromCurrency, inputs.toCurrency, exchangeRates])

  useEffect(() => {
    convertCurrency()
  }, [convertCurrency])

  const currencies = [
    { value: "USD", label: "USD - US Dollar", flag: "🇺🇸" },
    { value: "EUR", label: "EUR - Euro", flag: "🇪🇺" },
    { value: "GBP", label: "GBP - British Pound", flag: "🇬🇧" },
    { value: "JPY", label: "JPY - Japanese Yen", flag: "🇯🇵" },
    { value: "CHF", label: "CHF - Swiss Franc", flag: "🇨🇭" },
    { value: "CAD", label: "CAD - Canadian Dollar", flag: "🇨🇦" },
    { value: "AUD", label: "AUD - Australian Dollar", flag: "🇦🇺" },
  ]

  const swapCurrencies = () => {
    setInputs({
      ...inputs,
      fromCurrency: inputs.toCurrency,
      toCurrency: inputs.fromCurrency,
    })
  }

  const formatNumber = (num, decimals = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Amount to Convert</label>
        <div className="relative">
          <input
            type="number"
            value={inputs.amount}
            onChange={(e) => setInputs({ ...inputs, amount: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-teal-500 focus:outline-none transition-colors text-lg font-medium"
            placeholder="1000"
            min="0"
            step="0.01"
          />
          <div className="absolute right-3 top-3 text-slate-400 text-sm font-medium">{inputs.fromCurrency}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">From Currency</label>
          <select
            value={inputs.fromCurrency}
            onChange={(e) => setInputs({ ...inputs, fromCurrency: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-teal-500 focus:outline-none transition-colors"
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-3 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 rounded-lg transition-all duration-300 transform hover:scale-110"
            title="Swap currencies"
          >
            <RefreshCw className="h-5 w-5 text-teal-400" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">To Currency</label>
          <select
            value={inputs.toCurrency}
            onChange={(e) => setInputs({ ...inputs, toCurrency: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-teal-500 focus:outline-none transition-colors"
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conversion Result */}
      <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/30">
        <h4 className="text-sm font-medium text-slate-300 mb-4">Conversion Result</h4>
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-teal-400 mb-2">
            {formatNumber(results.convertedAmount)} {inputs.toCurrency}
          </div>
          <div className="text-sm text-slate-400">
            {formatNumber(Number.parseFloat(inputs.amount))} {inputs.fromCurrency} =
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="text-center p-3 bg-teal-600/20 rounded-lg border border-teal-500/30">
            <div className="text-xs text-teal-300 mb-1">Exchange Rate</div>
            <div className="text-lg font-bold text-teal-400">
              1 {inputs.fromCurrency} = {formatNumber(results.exchangeRate, 4)} {inputs.toCurrency}
            </div>
          </div>
          <div className="text-center p-3 bg-slate-600/20 rounded-lg border border-slate-500/30">
            <div className="text-xs text-slate-300 mb-1">Inverse Rate</div>
            <div className="text-lg font-bold text-slate-300">
              1 {inputs.toCurrency} = {formatNumber(1 / results.exchangeRate, 4)} {inputs.fromCurrency}
            </div>
          </div>
        </div>
      </div>

      {/* Rate Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-4">
          <h5 className="text-sm font-medium text-teal-300 mb-3">Rate Information</h5>
          <div className="space-y-2 text-xs text-teal-200">
            <div className="flex justify-between">
              <span>Current Rate:</span>
              <span>{formatNumber(results.exchangeRate, 4)}</span>
            </div>
            <div className="flex justify-between">
              <span>24h Change:</span>
              <span className={results.rateChange >= 0 ? "text-green-400" : "text-red-400"}>
                {results.rateChange >= 0 ? "+" : ""}
                {(results.rateChange * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
          <h5 className="text-sm font-medium text-blue-300 mb-3">Quick Conversions</h5>
          <div className="space-y-2 text-xs text-blue-200">
            <div className="flex justify-between">
              <span>1 {inputs.fromCurrency}:</span>
              <span>
                {formatNumber(results.exchangeRate, 4)} {inputs.toCurrency}
              </span>
            </div>
            <div className="flex justify-between">
              <span>10 {inputs.fromCurrency}:</span>
              <span>
                {formatNumber(results.exchangeRate * 10, 2)} {inputs.toCurrency}
              </span>
            </div>
            <div className="flex justify-between">
              <span>100 {inputs.fromCurrency}:</span>
              <span>
                {formatNumber(results.exchangeRate * 100, 2)} {inputs.toCurrency}
              </span>
            </div>
            <div className="flex justify-between">
              <span>1000 {inputs.fromCurrency}:</span>
              <span>
                {formatNumber(results.exchangeRate * 1000, 2)} {inputs.toCurrency}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={convertCurrency}
        className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Refresh Exchange Rate
      </button>
    </div>
  )
}

// Swap Calculator Component
function SwapCalculator() {
  const [inputs, setInputs] = useState({
    currencyPair: "EUR/USD",
    position: "buy",
    tradeSize: "1",
    holdingDays: "7",
  })

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Currency Pair</label>
          <select
            value={inputs.currencyPair}
            onChange={(e) => setInputs({ ...inputs, currencyPair: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-red-500 focus:outline-none"
          >
            <option value="EUR/USD">EUR/USD</option>
            <option value="GBP/USD">GBP/USD</option>
            <option value="USD/JPY">USD/JPY</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Position</label>
          <select
            value={inputs.position}
            onChange={(e) => setInputs({ ...inputs, position: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-red-500 focus:outline-none"
          >
            <option value="buy">Buy (Long)</option>
            <option value="sell">Sell (Short)</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Trade Size (Lots)</label>
          <input
            type="number"
            value={inputs.tradeSize}
            onChange={(e) => setInputs({ ...inputs, tradeSize: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-red-500 focus:outline-none"
            placeholder="1.0"
            step="0.01"
            min="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Holding Period (Days)</label>
          <input
            type="number"
            value={inputs.holdingDays}
            onChange={(e) => setInputs({ ...inputs, holdingDays: e.target.value })}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-red-500 focus:outline-none"
            placeholder="7"
          />
        </div>
      </div>

      <button className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
        Calculate Swap
      </button>
    </div>
  )
}
