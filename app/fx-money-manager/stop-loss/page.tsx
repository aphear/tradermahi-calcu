"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Shield, AlertTriangle, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function StopLossPage() {
  const router = useRouter()
  const [fxData, setFxData] = useState<any>(null)
  const [enableStopLoss, setEnableStopLoss] = useState(false)
  const [stopLossType, setStopLossType] = useState<string>("percentage")
  const [stopLossValue, setStopLossValue] = useState<string>("")

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
      enableStopLoss,
      stopLossType: enableStopLoss ? stopLossType : null,
      stopLossValue: enableStopLoss ? Number.parseFloat(stopLossValue) : null,
    }
    localStorage.setItem("fxManager", JSON.stringify(updatedData))
    router.push("/fx-money-manager/report-type")
  }

  const getRiskLevel = () => {
    if (!enableStopLoss || !stopLossValue) return null

    const value = Number.parseFloat(stopLossValue)
    if (stopLossType === "percentage") {
      if (value > 20) return "high"
      if (value > 10) return "medium"
      return "low"
    } else {
      // For fixed amount, we need to compare with initial capital
      if (fxData?.initialCapital) {
        const percentage = (value / fxData.initialCapital) * 100
        if (percentage > 20) return "high"
        if (percentage > 10) return "medium"
        return "low"
      }
    }
    return null
  }

  const riskLevel = getRiskLevel()

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
              <Shield className="h-5 w-5 text-[#2a7fff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Stop Loss</h1>
              <p className="text-sm text-[#8fa3bf]">Step 4 of 7</p>
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
                style={{ width: "57.1%" }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#e6eef9] font-['Rajdhani'] mb-2">Daily Stop Loss</h2>
            <p className="text-[#8fa3bf] font-['Inter']">
              Set daily loss limits to protect your capital from excessive drawdowns
            </p>
          </div>

          <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Daily Stop Loss</CardTitle>
                <Switch
                  checked={enableStopLoss}
                  onCheckedChange={setEnableStopLoss}
                  className="data-[state=checked]:bg-[#2a7fff]"
                />
              </div>
              <p className="text-[#8fa3bf] text-sm font-['Inter']">
                Enable to automatically limit daily losses and protect your capital
              </p>
            </CardHeader>

            {enableStopLoss && (
              <CardContent className="space-y-6 pt-0">
                {/* Stop Loss Type Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-[#e6eef9] font-['Inter']">Stop Loss Type</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-[#8fa3bf]" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#131d2d] border-[#2a7fff]/30 text-[#e6eef9]">
                          <p>Choose between percentage-based or fixed amount stop loss</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <RadioGroup value={stopLossType} onValueChange={setStopLossType} className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" className="border-[#2a7fff] text-[#2a7fff]" />
                      <Label htmlFor="percentage" className="text-[#e6eef9] font-['Inter'] cursor-pointer">
                        Percentage
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" className="border-[#2a7fff] text-[#2a7fff]" />
                      <Label htmlFor="fixed" className="text-[#e6eef9] font-['Inter'] cursor-pointer">
                        Fixed Amount
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Stop Loss Value Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#e6eef9] font-['Inter']">
                    {stopLossType === "percentage" ? "Stop Loss Percentage" : "Stop Loss Amount"}
                  </label>
                  <div className="relative">
                    {stopLossType === "percentage" ? (
                      <>
                        <Input
                          type="number"
                          placeholder="Enter percentage (e.g., 5 for 5%)"
                          value={stopLossValue}
                          onChange={(e) => setStopLossValue(e.target.value)}
                          className="bg-[#0d1520] border-[#2a7fff]/30 text-[#e6eef9] placeholder-[#8fa3bf] font-['JetBrains_Mono'] pr-8"
                          step="0.1"
                          min="0.1"
                          max="50"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8fa3bf] font-['JetBrains_Mono']">
                          %
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8fa3bf] font-['JetBrains_Mono']">
                          {fxData?.currency ? currencies.find((c) => c.code === fxData.currency)?.symbol || "$" : "$"}
                        </span>
                        <Input
                          type="number"
                          placeholder="Enter fixed amount"
                          value={stopLossValue}
                          onChange={(e) => setStopLossValue(e.target.value)}
                          className="bg-[#0d1520] border-[#2a7fff]/30 text-[#e6eef9] placeholder-[#8fa3bf] font-['JetBrains_Mono'] pl-12"
                          step="1"
                          min="1"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Risk Level Indicator */}
                {riskLevel && (
                  <div
                    className={`p-4 rounded-lg border ${
                      riskLevel === "high"
                        ? "bg-[#ff5c7c]/10 border-[#ff5c7c]/30"
                        : riskLevel === "medium"
                          ? "bg-yellow-500/10 border-yellow-500/30"
                          : "bg-[#00d395]/10 border-[#00d395]/30"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        riskLevel === "high"
                          ? "text-[#ff5c7c]"
                          : riskLevel === "medium"
                            ? "text-yellow-500"
                            : "text-[#00d395]"
                      }`}
                    >
                      {riskLevel === "high" ? <AlertTriangle className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      <span className="text-sm font-medium font-['Inter'] capitalize">{riskLevel} Risk Level</span>
                    </div>
                    <p
                      className={`text-xs mt-1 font-['Inter'] ${
                        riskLevel === "high"
                          ? "text-[#ff5c7c]/80"
                          : riskLevel === "medium"
                            ? "text-yellow-500/80"
                            : "text-[#00d395]/80"
                      }`}
                    >
                      {riskLevel === "high"
                        ? "High stop loss may result in frequent trade exits"
                        : riskLevel === "medium"
                          ? "Moderate stop loss provides balanced risk management"
                          : "Conservative stop loss offers good capital protection"}
                    </p>
                  </div>
                )}

                {/* Current Capital Reference */}
                {fxData?.initialCapital && (
                  <div className="p-3 rounded-lg bg-[#2a7fff]/5 border border-[#2a7fff]/20">
                    <p className="text-xs text-[#8fa3bf] font-['Inter']">
                      Your initial capital:{" "}
                      <span className="text-[#e6eef9] font-['JetBrains_Mono']">
                        {fxData.currency ? currencies.find((c) => c.code === fxData.currency)?.symbol || "$" : "$"}
                        {fxData.initialCapital.toLocaleString()}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            )}

            {!enableStopLoss && (
              <CardContent className="pt-0">
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8fa3bf]/10 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-[#8fa3bf]" />
                  </div>
                  <p className="text-[#8fa3bf] font-['Inter']">
                    No daily stop loss will be applied. Trading will continue without automatic loss limits.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

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

// Currency data for symbol reference
const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", symbol: "$" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", symbol: "CHF" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿", symbol: "NZ$" },
]
