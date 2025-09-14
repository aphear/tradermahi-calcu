"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface MarketRate {
  pair: string
  bid: number
  ask: number
  spread: number
  change: number
  changePercent: number
  lastUpdate: string
}

interface LiveMarketRatesProps {
  onRateUpdate?: (rates: Record<string, MarketRate>) => void
}

export default function LiveMarketRates({ onRateUpdate }: LiveMarketRatesProps) {
  const [rates, setRates] = useState<Record<string, MarketRate>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Major currency pairs and metals
  const watchedPairs = [
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

  // Simulate real-time market data (in production, connect to real forex API)
  const generateMarketData = (): Record<string, MarketRate> => {
    const baseRates: Record<string, number> = {
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

    const newRates: Record<string, MarketRate> = {}

    watchedPairs.forEach((pair) => {
      const baseRate = baseRates[pair] || 1.0
      // Add small random fluctuation to simulate real market movement
      const fluctuation = (Math.random() - 0.5) * 0.002 // ±0.1% fluctuation
      const currentRate = baseRate * (1 + fluctuation)

      // Calculate spread (typically 1-3 pips for majors, more for exotics)
      const isGoldPair = pair.startsWith("XAU")
      const isJpyPair = pair.includes("JPY")
      const pipSize = isGoldPair ? 0.01 : isJpyPair ? 0.01 : 0.0001
      const spreadPips = isGoldPair ? 0.5 : isJpyPair ? 1.5 : 1.2
      const spread = spreadPips * pipSize

      const bid = currentRate - spread / 2
      const ask = currentRate + spread / 2

      // Calculate change from previous rate
      const previousRate = rates[pair]?.ask || baseRate
      const change = ask - previousRate
      const changePercent = (change / previousRate) * 100

      newRates[pair] = {
        pair,
        bid: Number(bid.toFixed(isJpyPair || isGoldPair ? 2 : 5)),
        ask: Number(ask.toFixed(isJpyPair || isGoldPair ? 2 : 5)),
        spread: Number(spread.toFixed(isJpyPair || isGoldPair ? 2 : 5)),
        change: Number(change.toFixed(isJpyPair || isGoldPair ? 2 : 5)),
        changePercent: Number(changePercent.toFixed(3)),
        lastUpdate: new Date().toISOString(),
      }
    })

    return newRates
  }

  // Fetch market data
  const fetchMarketData = async () => {
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newRates = generateMarketData()
      setRates(newRates)
      setLastUpdateTime(new Date())

      // Notify parent component of rate updates
      if (onRateUpdate) {
        onRateUpdate(newRates)
      }
    } catch (error) {
      console.error("Failed to fetch market data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchMarketData()

    if (autoRefresh) {
      const interval = setInterval(fetchMarketData, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const formatPrice = (price: number, pair: string) => {
    const isJpyPair = pair.includes("JPY")
    const isGoldPair = pair.startsWith("XAU")
    return price.toFixed(isJpyPair || isGoldPair ? 2 : 5)
  }

  const getPairCategory = (pair: string) => {
    if (pair.startsWith("XAU")) return "Metals"
    if (pair.includes("USD")) return "Majors"
    return "Crosses"
  }

  const groupedPairs = watchedPairs.reduce(
    (acc, pair) => {
      const category = getPairCategory(pair)
      if (!acc[category]) acc[category] = []
      acc[category].push(pair)
      return acc
    },
    {} as Record<string, string[]>,
  )

  return (
    <Card className="glass-card rounded-2xl border-primary/30 mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-heading flex items-center gap-2">
            <i className="fas fa-chart-line text-primary"></i>
            Live Market Rates
            {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">Last updated: {lastUpdateTime.toLocaleTimeString()}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`glass-card border-primary/30 ${autoRefresh ? "bg-primary/10" : ""}`}
            >
              <i className={`fas ${autoRefresh ? "fa-pause" : "fa-play"} mr-2`}></i>
              {autoRefresh ? "Pause" : "Resume"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMarketData}
              disabled={isLoading}
              className="glass-card border-primary/30 bg-transparent"
            >
              <i className="fas fa-refresh mr-2"></i>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedPairs).map(([category, pairs]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3 text-primary">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pairs.map((pair) => {
                  const rate = rates[pair]
                  if (!rate) return null

                  return (
                    <div
                      key={pair}
                      className="bg-card/50 border border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-mono font-bold text-foreground">{pair}</div>
                        <Badge
                          variant={rate.changePercent >= 0 ? "default" : "destructive"}
                          className={`text-xs ${
                            rate.changePercent >= 0
                              ? "bg-green-500/20 text-green-500 border-green-500/30"
                              : "bg-red-500/20 text-red-500 border-red-500/30"
                          }`}
                        >
                          {rate.changePercent >= 0 ? "+" : ""}
                          {rate.changePercent.toFixed(2)}%
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Bid:</span>
                          <span className="font-mono text-red-500">{formatPrice(rate.bid, pair)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ask:</span>
                          <span className="font-mono text-green-500">{formatPrice(rate.ask, pair)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Spread:</span>
                          <span className="font-mono text-muted-foreground">{formatPrice(rate.spread, pair)}</span>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-border/30">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Change:</span>
                          <span className={`font-mono ${rate.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {rate.change >= 0 ? "+" : ""}
                            {formatPrice(rate.change, pair)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-2">
            <i className="fas fa-info-circle"></i>
            Market Information
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Rates update automatically every 5 seconds during market hours</p>
            <p>• Bid price is for selling, Ask price is for buying</p>
            <p>• Spread represents the difference between bid and ask prices</p>
            <p>• All prices are indicative and may vary from actual trading prices</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
