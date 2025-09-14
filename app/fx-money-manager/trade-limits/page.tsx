"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Settings, HelpCircle, TrendingUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TradeLimitsPage() {
  const router = useRouter()
  const [fxData, setFxData] = useState<any>(null)

  const [enableDailyTrade, setEnableDailyTrade] = useState(false)
  const [enableWinRate, setEnableWinRate] = useState(false)
  const [enablePerTradeLot, setEnablePerTradeLot] = useState(false)

  const [dailyTrades, setDailyTrades] = useState<string>("5")
  const [winRate, setWinRate] = useState<number>(70)
  const [perTradeLot, setPerTradeLot] = useState<string>("0.1")

  useEffect(() => {
    const data = localStorage.getItem("fxManager")
    if (data) {
      setFxData(JSON.parse(data))
    } else {
      router.push("/fx-money-manager")
    }
  }, [router])

  const handleNext = () => {
    const updatedData = {
      ...fxData,
      enableDailyTrade,
      enableWinRate,
      enablePerTradeLot,
      dailyTrades: enableDailyTrade ? Number.parseInt(dailyTrades) : null,
      winRate: enableWinRate ? winRate : null,
      perTradeLot: enablePerTradeLot ? Number.parseFloat(perTradeLot) : null,
    }
    localStorage.setItem("fxManager", JSON.stringify(updatedData))
    router.push("/fx-money-manager/stop-loss")
  }

  if (!fxData) return null

  return (
    <div className="min-h-screen bg-[#0d1520] text-[#e6eef9]">
      {/* Header */}
      <header className="border-b border-[#2a7fff]/20 bg-[#131d2d]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="border-[#2a7fff]/30 hover:border-[#2a7fff]/50 bg-[#131d2d] text-[#e6eef9]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="w-10 h-10 rounded-lg bg-[#2a7fff]/20 flex items-center justify-center">
              <Settings className="h-5 w-5 text-[#2a7fff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Trade Limits</h1>
              <p className="text-sm text-[#8fa3bf]">Step 3 of 7</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-[#131d2d] rounded-full h-2">
              <div
                className="bg-[#2a7fff] h-2 rounded-full transition-all duration-300"
                style={{ width: "42.9%" }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#e6eef9] font-['Rajdhani'] mb-2">Daily Trade Limits</h2>
            <p className="text-[#8fa3bf] font-['Inter']">
              Configure your daily trading parameters for better risk management
            </p>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Daily Trade</CardTitle>
                  <Switch
                    checked={enableDailyTrade}
                    onCheckedChange={setEnableDailyTrade}
                    className="data-[state=checked]:bg-[#2a7fff]"
                  />
                </div>
                <p className="text-[#8fa3bf] text-sm font-['Inter']">
                  Enable to set specific limits on your daily trading activity
                </p>
              </CardHeader>

              {enableDailyTrade && (
                <CardContent className="space-y-6 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-[#e6eef9] font-['Inter']">Daily Trades</label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-[#8fa3bf]" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#131d2d] border-[#2a7fff]/30 text-[#e6eef9]">
                            <p>Maximum number of trades you want to execute per day</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      type="number"
                      placeholder="Enter number of trades per day"
                      value={dailyTrades}
                      onChange={(e) => setDailyTrades(e.target.value)}
                      className="bg-[#0d1520] border-[#2a7fff]/30 text-[#e6eef9] placeholder-[#8fa3bf] font-['JetBrains_Mono']"
                      min="1"
                      max="100"
                    />
                  </div>

                  {/* Risk Level Indicator */}
                  {Number.parseInt(dailyTrades) > 10 && (
                    <div className="p-4 rounded-lg bg-[#ff5c7c]/10 border border-[#ff5c7c]/30">
                      <div className="flex items-center gap-2 text-[#ff5c7c]">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium font-['Inter']">High Risk Warning</span>
                      </div>
                      <p className="text-xs text-[#ff5c7c]/80 mt-1 font-['Inter']">
                        Trading more than 10 times per day significantly increases risk exposure
                      </p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Win Rate</CardTitle>
                  <Switch
                    checked={enableWinRate}
                    onCheckedChange={setEnableWinRate}
                    className="data-[state=checked]:bg-[#2a7fff]"
                  />
                </div>
                <p className="text-[#8fa3bf] text-sm font-['Inter']">
                  Enable to set expected win rate for more accurate calculations
                </p>
              </CardHeader>

              {enableWinRate && (
                <CardContent className="space-y-6 pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-[#e6eef9] font-['Inter']">Win Rate</label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-[#8fa3bf]" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#131d2d] border-[#2a7fff]/30 text-[#e6eef9]">
                            <p>Expected percentage of winning trades for more accurate calculations</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="text-center mb-4">
                      <span className="text-2xl font-bold text-[#00d395] font-['JetBrains_Mono']">{winRate}%</span>
                      <p className="text-xs text-[#8fa3bf] font-['Inter']">Expected Win Rate</p>
                    </div>

                    <Slider
                      value={[winRate]}
                      onValueChange={(value) => setWinRate(value[0])}
                      max={95}
                      min={30}
                      step={5}
                      className="w-full"
                    />

                    <div className="flex justify-between text-xs text-[#8fa3bf] font-['Inter']">
                      <span>30%</span>
                      <span>95%</span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Per Trade Lot</CardTitle>
                  <Switch
                    checked={enablePerTradeLot}
                    onCheckedChange={setEnablePerTradeLot}
                    className="data-[state=checked]:bg-[#2a7fff]"
                  />
                </div>
                <p className="text-[#8fa3bf] text-sm font-['Inter']">Enable to set standard lot size for each trade</p>
              </CardHeader>

              {enablePerTradeLot && (
                <CardContent className="space-y-6 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-[#e6eef9] font-['Inter']">Per Trade Lot</label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-[#8fa3bf]" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#131d2d] border-[#2a7fff]/30 text-[#e6eef9]">
                            <p>Standard lot size for each trade (e.g., 0.1 = micro lot, 1.0 = standard lot)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      type="number"
                      placeholder="Enter lot size per trade"
                      value={perTradeLot}
                      onChange={(e) => setPerTradeLot(e.target.value)}
                      className="bg-[#0d1520] border-[#2a7fff]/30 text-[#e6eef9] placeholder-[#8fa3bf] font-['JetBrains_Mono']"
                      step="0.01"
                      min="0.01"
                      max="100"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Next Button */}
          <div className="text-center mt-8">
            <Button
              onClick={handleNext}
              className="w-full max-w-md bg-[#2a7fff] hover:bg-[#2a7fff]/80 text-white font-medium py-3 rounded-xl transition-all duration-200 font-['Rajdhani']"
            >
              Next Step
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
