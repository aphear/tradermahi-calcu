"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import LiveMarketRates from "@/components/live-market-rates"

// Currency and pair data
const ACCOUNT_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
]

const CURRENCY_PAIRS = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "USD/CHF",
  "AUD/USD",
  "USD/CAD",
  "EUR/GBP",
  "EUR/JPY",
  "GBP/JPY",
  "AUD/JPY",
  "CAD/JPY",
  "CHF/JPY",
  "EUR/AUD",
  "GBP/AUD",
  "EUR/CAD",
  "GBP/CAD",
  "AUD/CAD",
  "NZD/USD",
  "XAU/USD",
  "XAU/EUR",
  "XAU/GBP",
  "XAU/JPY",
  "XAU/AUD",
  "XAU/CAD",
  "XAU/CHF",
]

const LOT_SIZES = [
  { value: "0.01", name: "Micro Lot (0.01)", description: "1,000 units" },
  { value: "0.1", name: "Mini Lot (0.1)", description: "10,000 units" },
  { value: "1", name: "Standard Lot (1.0)", description: "100,000 units" },
]

// Mock exchange rates (in real app, fetch from API)
const EXCHANGE_RATES: Record<string, number> = {
  "EUR/USD": 1.085,
  "GBP/USD": 1.265,
  "USD/JPY": 149.5,
  "USD/CHF": 0.875,
  "AUD/USD": 0.658,
  "USD/CAD": 1.362,
  "EUR/GBP": 0.858,
  "EUR/JPY": 162.1,
  "GBP/JPY": 189.15,
  "AUD/JPY": 98.35,
  "CAD/JPY": 109.8,
  "CHF/JPY": 170.85,
  "EUR/AUD": 1.649,
  "GBP/AUD": 1.922,
  "EUR/CAD": 1.478,
  "GBP/CAD": 1.723,
  "AUD/CAD": 0.897,
  "NZD/USD": 0.592,
  "XAU/USD": 2650.5,
  "XAU/EUR": 2442.75,
  "XAU/GBP": 2095.25,
  "XAU/JPY": 396250.0,
  "XAU/AUD": 4025.85,
  "XAU/CAD": 3610.18,
  "XAU/CHF": 2319.19,
}

export default function PipCalculatorPage() {
  const router = useRouter()
  const [accountCurrency, setAccountCurrency] = useState("USD")
  const [currencyPair, setCurrencyPair] = useState("EUR/USD")
  const [tradeSize, setTradeSize] = useState("1")
  const [customLotSize, setCustomLotSize] = useState("")
  const [pipAmount, setPipAmount] = useState("1")
  const [pipValue, setPipValue] = useState(0)
  const [isCustomLot, setIsCustomLot] = useState(false)
  const [currentMarketRate, setCurrentMarketRate] = useState<number>(0)

  const handleRateUpdate = useCallback(
    (rates: Record<string, any>) => {
      // Update exchange rates with live data
      Object.entries(rates).forEach(([pair, rateData]) => {
        EXCHANGE_RATES[pair] = rateData.ask // Use ask price for calculations
      })

      // Update current market rate for selected pair
      if (rates[currencyPair]) {
        setCurrentMarketRate(rates[currencyPair].ask)
      }

      // Recalculate pip value with new rates
      calculatePipValue()
    },
    [currencyPair],
  )

  // Calculate pip value
  const calculatePipValue = useCallback(() => {
    const lotSize = isCustomLot ? Number.parseFloat(customLotSize) || 0 : Number.parseFloat(tradeSize)

    if (!currencyPair || lotSize <= 0) {
      setPipValue(0)
      return
    }

    const [baseCurrency, quoteCurrency] = currencyPair.split("/")
    const isJpyPair = quoteCurrency === "JPY"
    const isGoldPair = baseCurrency === "XAU"
    const pipSize = isGoldPair ? 0.01 : isJpyPair ? 0.01 : 0.0001

    let calculatedPipValue = 0

    if (quoteCurrency === accountCurrency) {
      // Direct calculation
      calculatedPipValue = lotSize * 100000 * pipSize
    } else if (baseCurrency === accountCurrency) {
      // Inverse calculation
      const rate = EXCHANGE_RATES[currencyPair] || 1
      calculatedPipValue = (lotSize * 100000 * pipSize) / rate
    } else {
      // Cross currency calculation
      const rate = EXCHANGE_RATES[currencyPair] || 1
      const conversionPair = `${quoteCurrency}/${accountCurrency}`
      const reverseConversionPair = `${accountCurrency}/${quoteCurrency}`

      let conversionRate = EXCHANGE_RATES[conversionPair] || EXCHANGE_RATES[reverseConversionPair]

      if (EXCHANGE_RATES[reverseConversionPair]) {
        conversionRate = 1 / conversionRate
      }

      calculatedPipValue = lotSize * 100000 * pipSize * (conversionRate || 1)
    }

    setPipValue(calculatedPipValue)
  }, [accountCurrency, currencyPair, tradeSize, customLotSize, isCustomLot])

  // Recalculate when inputs change
  useEffect(() => {
    calculatePipValue()
  }, [calculatePipValue])

  useEffect(() => {
    setCurrentMarketRate(EXCHANGE_RATES[currencyPair] || 0)
  }, [currencyPair])

  const selectedCurrency = ACCOUNT_CURRENCIES.find((c) => c.code === accountCurrency)
  const [baseCurrency, quoteCurrency] = currencyPair.split("/")
  const isJpyPair = quoteCurrency === "JPY"
  const isGoldPair = baseCurrency === "XAU"
  const totalPipValue = pipValue * (Number.parseFloat(pipAmount) || 1)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-muted-foreground hover:text-foreground"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Pip Calculator</h1>
                {currentMarketRate > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Live Rate:{" "}
                    <span className="font-mono text-primary">
                      {currencyPair} @ {currentMarketRate}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <i className="fas fa-sliders-h text-primary"></i>
                  Calculator Inputs
                </CardTitle>
                <CardDescription>Configure your trade parameters to calculate pip values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Account Currency */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Account Currency
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <i className="fas fa-info-circle text-xs text-muted-foreground"></i>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The currency of your trading account</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Select value={accountCurrency} onValueChange={setAccountCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNT_CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{currency.symbol}</span>
                            <span>{currency.code}</span>
                            <span className="text-muted-foreground">- {currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Currency Pair */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Currency Pair
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <i className="fas fa-info-circle text-xs text-muted-foreground"></i>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The currency pair you want to trade</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Select value={currencyPair} onValueChange={setCurrencyPair}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_PAIRS.map((pair) => (
                        <SelectItem key={pair} value={pair}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">{pair}</span>
                            <span className="text-muted-foreground">
                              {EXCHANGE_RATES[pair] ? `@ ${EXCHANGE_RATES[pair]}` : ""}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trade Size */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Trade Size (Lots)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <i className="fas fa-info-circle text-xs text-muted-foreground"></i>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The size of your trade in lots</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>

                  <div className="space-y-3">
                    {/* Preset lot sizes */}
                    <div className="grid grid-cols-1 gap-2">
                      {LOT_SIZES.map((lot) => (
                        <Button
                          key={lot.value}
                          variant={tradeSize === lot.value && !isCustomLot ? "default" : "outline"}
                          className="justify-start h-auto p-3"
                          onClick={() => {
                            setTradeSize(lot.value)
                            setIsCustomLot(false)
                          }}
                        >
                          <div className="text-left">
                            <div className="font-semibold">{lot.name}</div>
                            <div className="text-xs text-muted-foreground">{lot.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>

                    {/* Custom lot size */}
                    <div className="space-y-2">
                      <Button
                        variant={isCustomLot ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setIsCustomLot(true)}
                      >
                        <i className="fas fa-edit mr-2"></i>
                        Custom Lot Size
                      </Button>
                      {isCustomLot && (
                        <Input
                          type="number"
                          placeholder="Enter custom lot size"
                          value={customLotSize}
                          onChange={(e) => setCustomLotSize(e.target.value)}
                          step="0.01"
                          min="0.01"
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Pip Amount */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Pip Amount
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <i className="fas fa-info-circle text-xs text-muted-foreground"></i>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of pips to calculate total value for</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    type="number"
                    placeholder="Enter number of pips"
                    value={pipAmount}
                    onChange={(e) => setPipAmount(e.target.value)}
                    step="1"
                    min="1"
                    className="font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Main Result */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <i className="fas fa-chart-line text-accent"></i>
                    Pip Value Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Per Pip Value</div>
                      <div className="text-3xl font-heading font-bold text-primary">
                        {selectedCurrency?.symbol}
                        {pipValue.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">per pip in {accountCurrency}</div>
                    </div>

                    {Number.parseFloat(pipAmount) > 1 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Total Value for {pipAmount} pips</div>
                          <div className="text-4xl font-heading font-bold text-accent neon-glow">
                            {selectedCurrency?.symbol}
                            {totalPipValue.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {pipAmount} pips × {selectedCurrency?.symbol}
                            {pipValue.toFixed(2)} per pip
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Currency Pair</div>
                        <div className="font-mono font-bold">{currencyPair}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Lot Size</div>
                        <div className="font-mono font-bold">{isCustomLot ? customLotSize : tradeSize} lots</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Pip Size</div>
                        <div className="font-mono font-bold">{isGoldPair ? "0.01" : isJpyPair ? "0.01" : "0.0001"}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Account Currency</div>
                        <div className="font-mono font-bold">{accountCurrency}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Educational Content */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <i className="fas fa-graduation-cap text-primary"></i>
                    Understanding Pips & Lots
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">What is a Pip?</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        A pip (percentage in point) is the smallest price move in a currency pair. For most pairs, it's
                        the 4th decimal place (0.0001), but for JPY pairs, it's the 2nd decimal place (0.01). Gold pairs
                        (XAU) also use 0.01 as the pip size.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Lot Sizes Explained</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Micro Lot (0.01):</span>
                          <span className="font-mono">1,000 units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mini Lot (0.1):</span>
                          <span className="font-mono">10,000 units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Standard Lot (1.0):</span>
                          <span className="font-mono">100,000 units</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <i className="fas fa-lightbulb"></i>
                      Example Calculation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>EUR/USD, 1 Standard Lot, USD Account:</strong>
                      <br />
                      Pip value = 1.0 × 100,000 × 0.0001 = $10 per pip
                      <br />
                      If EUR/USD moves from 1.0850 to 1.0860 (10 pips), your profit/loss would be $100.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <LiveMarketRates onRateUpdate={handleRateUpdate} />
      </div>
    </div>
  )
}
