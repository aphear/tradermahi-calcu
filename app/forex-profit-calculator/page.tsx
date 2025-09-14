"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import LiveMarketRates from "@/components/live-market-rates"

interface CalculationResult {
  profitLossPips: number
  profitLossQuote: number
  profitLossAccount: number
  isProfit: boolean
}

export default function ForexProfitCalculatorPage() {
  const router = useRouter()

  // Form states
  const [currencyPair, setCurrencyPair] = useState("")
  const [position, setPosition] = useState("buy")
  const [openPrice, setOpenPrice] = useState("")
  const [closePrice, setClosePrice] = useState("")
  const [tradeSize, setTradeSize] = useState("")
  const [accountCurrency, setAccountCurrency] = useState("USD")

  // Calculation result
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [liveRates, setLiveRates] = useState<Record<string, any>>({})

  // Currency pairs with their contract sizes and pip sizes
  const currencyPairs = [
    { value: "EURUSD", label: "EUR/USD", contractSize: 100000, pipSize: 0.0001 },
    { value: "GBPUSD", label: "GBP/USD", contractSize: 100000, pipSize: 0.0001 },
    { value: "USDJPY", label: "USD/JPY", contractSize: 100000, pipSize: 0.01 },
    { value: "USDCHF", label: "USD/CHF", contractSize: 100000, pipSize: 0.0001 },
    { value: "AUDUSD", label: "AUD/USD", contractSize: 100000, pipSize: 0.0001 },
    { value: "USDCAD", label: "USD/CAD", contractSize: 100000, pipSize: 0.0001 },
    { value: "NZDUSD", label: "NZD/USD", contractSize: 100000, pipSize: 0.0001 },
    { value: "EURJPY", label: "EUR/JPY", contractSize: 100000, pipSize: 0.01 },
    { value: "GBPJPY", label: "GBP/JPY", contractSize: 100000, pipSize: 0.01 },
    { value: "XAUUSD", label: "Gold/USD", contractSize: 100, pipSize: 0.01 },
    { value: "XAGUSD", label: "Silver/USD", contractSize: 5000, pipSize: 0.001 },
  ]

  const accountCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD"]

  const exchangeRates: { [key: string]: number } = {
    EURUSD: liveRates["EUR/USD"]?.ask || 1.085,
    GBPUSD: liveRates["GBP/USD"]?.ask || 1.265,
    USDJPY: liveRates["USD/JPY"]?.ask || 149.5,
    USDCHF: liveRates["USD/CHF"]?.ask || 0.895,
    AUDUSD: liveRates["AUD/USD"]?.ask || 0.675,
    USDCAD: liveRates["USD/CAD"]?.ask || 1.365,
  }

  const handleRateUpdate = useCallback((rates: Record<string, any>) => {
    setLiveRates(rates)
  }, [])

  const getCurrentMarketPrice = () => {
    const pairLabel = currencyPairs.find((p) => p.value === currencyPair)?.label
    if (pairLabel && liveRates[pairLabel]) {
      return liveRates[pairLabel].ask
    }
    return null
  }

  const fillCurrentPrice = (priceType: "open" | "close") => {
    const currentPrice = getCurrentMarketPrice()
    if (currentPrice) {
      if (priceType === "open") {
        setOpenPrice(currentPrice.toString())
      } else {
        setClosePrice(currentPrice.toString())
      }
    }
  }

  const validateInputs = (): string[] => {
    const newErrors: string[] = []

    if (!currencyPair) newErrors.push("Please select a currency pair")
    if (!openPrice || isNaN(Number(openPrice)) || Number(openPrice) <= 0) {
      newErrors.push("Please enter a valid open price")
    }
    if (!closePrice || isNaN(Number(closePrice)) || Number(closePrice) <= 0) {
      newErrors.push("Please enter a valid close price")
    }
    if (!tradeSize || isNaN(Number(tradeSize)) || Number(tradeSize) <= 0) {
      newErrors.push("Please enter a valid trade size")
    }
    if (openPrice === closePrice) {
      newErrors.push("Open and close prices cannot be the same")
    }

    return newErrors
  }

  const calculateProfit = (): CalculationResult | null => {
    const validationErrors = validateInputs()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return null
    }

    setErrors([])

    const pair = currencyPairs.find((p) => p.value === currencyPair)
    if (!pair) return null

    const open = Number(openPrice)
    const close = Number(closePrice)
    const size = Number(tradeSize)

    // Calculate price difference based on position
    const delta = position === "buy" ? close - open : open - close

    // Calculate profit in quote currency
    const profitQuote = delta * size * pair.contractSize

    // Calculate pips
    const pipDifference = Math.abs(delta / pair.pipSize)
    const profitLossPips =
      position === "buy"
        ? close > open
          ? pipDifference
          : -pipDifference
        : open > close
          ? pipDifference
          : -pipDifference

    // Convert to account currency if needed
    let profitAccount = profitQuote
    const quoteCurrency = currencyPair.slice(-3)

    if (quoteCurrency !== accountCurrency) {
      // Simple conversion using mock rates (in real app, use proper conversion)
      const conversionRate =
        exchangeRates[`${quoteCurrency}${accountCurrency}`] ||
        1 / (exchangeRates[`${accountCurrency}${quoteCurrency}`] || 1)
      profitAccount = profitQuote * conversionRate
    }

    return {
      profitLossPips,
      profitLossQuote: profitQuote,
      profitLossAccount: profitAccount,
      isProfit: profitAccount > 0,
    }
  }

  // Recalculate when inputs change
  useEffect(() => {
    if (currencyPair && openPrice && closePrice && tradeSize) {
      const calculationResult = calculateProfit()
      setResult(calculationResult)
    } else {
      setResult(null)
      setErrors([])
    }
  }, [currencyPair, position, openPrice, closePrice, tradeSize, accountCurrency])

  const resetForm = () => {
    setCurrencyPair("")
    setPosition("buy")
    setOpenPrice("")
    setClosePrice("")
    setTradeSize("")
    setAccountCurrency("USD")
    setResult(null)
    setErrors([])
    setLiveRates({})
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount))
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/pip-calculator-options")}
                className="glass-card border-primary/30 hover:border-primary/50"
              >
                <i className="fas fa-arrow-left"></i>
              </Button>
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <i className="fas fa-chart-line text-primary"></i>
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">Forex Profit Calculator</h1>
                {currencyPair && getCurrentMarketPrice() && (
                  <div className="text-sm text-muted-foreground">
                    Live Rate:{" "}
                    <span className="font-mono text-primary">
                      {currencyPairs.find((p) => p.value === currencyPair)?.label} @ {getCurrentMarketPrice()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetForm}
              className="glass-card border-primary/30 hover:border-primary/50 bg-transparent"
            >
              <i className="fas fa-refresh mr-2"></i>
              Reset
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Input Section */}
            <Card className="glass-card rounded-2xl border-primary/30">
              <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                  <i className="fas fa-cog text-primary"></i>
                  Trading Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Currency Pair */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Currency Pair
                    <Tooltip>
                      <TooltipTrigger>
                        <i className="fas fa-info-circle text-muted-foreground text-xs"></i>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select the currency pair you want to trade</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select value={currencyPair} onValueChange={setCurrencyPair}>
                    <SelectTrigger className="glass-card border-primary/30">
                      <SelectValue placeholder="Select currency pair" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyPairs.map((pair) => (
                        <SelectItem key={pair.value} value={pair.value}>
                          {pair.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Position Type */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Position
                    <Tooltip>
                      <TooltipTrigger>
                        <i className="fas fa-info-circle text-muted-foreground text-xs"></i>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Buy (Long) - profit when price goes up
                          <br />
                          Sell (Short) - profit when price goes down
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger className="glass-card border-primary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy (Long)</SelectItem>
                      <SelectItem value="sell">Sell (Short)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Open and Close Prices */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Open Price</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fillCurrentPrice("open")}
                        className="text-xs text-primary hover:text-primary/80"
                        disabled={!getCurrentMarketPrice()}
                      >
                        <i className="fas fa-download mr-1"></i>
                        Live
                      </Button>
                    </div>
                    <Input
                      type="number"
                      step="0.00001"
                      placeholder="1.08500"
                      value={openPrice}
                      onChange={(e) => setOpenPrice(e.target.value)}
                      className="glass-card border-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Close Price</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fillCurrentPrice("close")}
                        className="text-xs text-primary hover:text-primary/80"
                        disabled={!getCurrentMarketPrice()}
                      >
                        <i className="fas fa-download mr-1"></i>
                        Live
                      </Button>
                    </div>
                    <Input
                      type="number"
                      step="0.00001"
                      placeholder="1.09000"
                      value={closePrice}
                      onChange={(e) => setClosePrice(e.target.value)}
                      className="glass-card border-primary/30"
                    />
                  </div>
                </div>

                {/* Trade Size */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Trade Size (Lots)
                    <Tooltip>
                      <TooltipTrigger>
                        <i className="fas fa-info-circle text-muted-foreground text-xs"></i>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Standard lot = 1.0, Mini lot = 0.1, Micro lot = 0.01</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="1.0"
                    value={tradeSize}
                    onChange={(e) => setTradeSize(e.target.value)}
                    className="glass-card border-primary/30"
                  />
                </div>

                {/* Account Currency */}
                <div className="space-y-2">
                  <Label>Account Currency</Label>
                  <Select value={accountCurrency} onValueChange={setAccountCurrency}>
                    <SelectTrigger className="glass-card border-primary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accountCurrencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span className="font-medium">Please fix the following:</span>
                    </div>
                    <ul className="mt-2 text-sm text-destructive/80 list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="glass-card rounded-2xl border-primary/30">
              <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                  <i className="fas fa-chart-bar text-primary"></i>
                  Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Profit/Loss Indicator */}
                    <div
                      className={`text-center p-4 rounded-lg ${result.isProfit ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}
                    >
                      <div className={`text-2xl font-bold ${result.isProfit ? "text-green-500" : "text-red-500"}`}>
                        {result.isProfit ? "PROFIT" : "LOSS"}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {result.isProfit ? "Your trade is profitable" : "Your trade resulted in a loss"}
                      </div>
                    </div>

                    {/* Results Grid */}
                    <div className="space-y-4">
                      {/* Pips */}
                      <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-arrows-alt-h text-primary"></i>
                          <span className="font-medium">Pips</span>
                        </div>
                        <div className={`font-bold ${result.profitLossPips >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {result.profitLossPips >= 0 ? "+" : ""}
                          {result.profitLossPips.toFixed(1)}
                        </div>
                      </div>

                      {/* Quote Currency */}
                      <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-coins text-primary"></i>
                          <span className="font-medium">Quote Currency</span>
                        </div>
                        <div className={`font-bold ${result.profitLossQuote >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {result.profitLossQuote >= 0 ? "+" : "-"}
                          {formatCurrency(result.profitLossQuote, currencyPair.slice(-3))}
                        </div>
                      </div>

                      {/* Account Currency */}
                      <div className="flex justify-between items-center p-3 bg-primary/10 border border-primary/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-wallet text-primary"></i>
                          <span className="font-medium">Account Currency</span>
                        </div>
                        <div
                          className={`font-bold text-lg ${result.profitLossAccount >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {result.profitLossAccount >= 0 ? "+" : "-"}
                          {formatCurrency(result.profitLossAccount, accountCurrency)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <i className="fas fa-calculator text-4xl mb-4 opacity-50"></i>
                    <p className="text-lg font-medium mb-2">Ready to Calculate</p>
                    <p className="text-sm">Fill in the trading parameters to see your profit/loss calculation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Educational Section */}
          <Card className="glass-card rounded-2xl border-primary/30 mt-8 max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl font-heading flex items-center gap-2">
                <i className="fas fa-graduation-cap text-primary"></i>
                How Profit is Calculated
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Calculation Formula:</h4>
                  <div className="bg-card/50 p-3 rounded-lg font-mono text-sm">
                    <div>Delta = Close Price - Open Price</div>
                    <div>Profit = Delta × Trade Size × Contract Size</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Example:</h4>
                  <div className="bg-card/50 p-3 rounded-lg text-sm">
                    <div>EUR/USD: Open = 1.1000, Close = 1.1100</div>
                    <div>Trade Size = 1 lot (100,000 units)</div>
                    <div>Profit = (1.1100 - 1.1000) × 1 × 100,000 = $1,000</div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Note:</strong> For Buy positions, profit occurs when close price &gt; open price. For Sell
                positions, profit occurs when open price &gt; close price. Results are converted to your account
                currency using current exchange rates.
              </div>
            </CardContent>
          </Card>

          <LiveMarketRates onRateUpdate={handleRateUpdate} />
        </main>
      </div>
    </TooltipProvider>
  )
}
