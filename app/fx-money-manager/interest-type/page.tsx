"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, TrendingUp, Percent } from "lucide-react"

export default function InterestTypePage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string>("")
  const [customRate, setCustomRate] = useState<number>(10)
  const [fxData, setFxData] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem("fxManager")
    if (data) {
      setFxData(JSON.parse(data))
    } else {
      router.push("/fx-money-manager")
    }
  }, [router])

  const handleNext = () => {
    if (selectedType) {
      const updatedData = {
        ...fxData,
        interestType: selectedType,
        interestRate: selectedType === "custom" ? customRate : null,
      }
      localStorage.setItem("fxManager", JSON.stringify(updatedData))
      router.push("/fx-money-manager/trade-limits")
    }
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
              <TrendingUp className="h-5 w-5 text-[#2a7fff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Interest Type</h1>
              <p className="text-sm text-[#8fa3bf]">Step 2 of 7</p>
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
                style={{ width: "28.6%" }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#e6eef9] font-['Rajdhani'] mb-2">Select Interest Type</h2>
            <p className="text-[#8fa3bf] font-['Inter']">Choose how you want to calculate your daily earnings</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Low Interest Option */}
            <Card
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedType === "low"
                  ? "bg-[#00d395]/10 border-[#00d395] shadow-lg shadow-[#00d395]/20"
                  : "bg-[#131d2d] border-[#2a7fff]/30 hover:border-[#00d395]/50"
              }`}
              onClick={() => setSelectedType("low")}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00d395]/20 flex items-center justify-center">
                  <Percent className="h-8 w-8 text-[#00d395]" />
                </div>
                <CardTitle className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Low Interest</CardTitle>
                <p className="text-[#00d395] font-medium font-['Inter']">7-10% daily earnings from initial capital</p>
              </CardHeader>
              <CardContent>
                <p className="text-[#8fa3bf] text-sm font-['Inter'] text-center">
                  Earn a fixed percentage daily based on your initial capital only. Safe and predictable returns.
                </p>
              </CardContent>
            </Card>

            {/* Custom Interest Option */}
            <Card
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedType === "custom"
                  ? "bg-[#2a7fff]/10 border-[#2a7fff] shadow-lg shadow-[#2a7fff]/20"
                  : "bg-[#131d2d] border-[#2a7fff]/30 hover:border-[#2a7fff]/50"
              }`}
              onClick={() => setSelectedType("custom")}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2a7fff]/20 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-[#2a7fff]" />
                </div>
                <CardTitle className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Custom Interest</CardTitle>
                <p className="text-[#2a7fff] font-medium font-['Inter']">Compound interest earnings</p>
              </CardHeader>
              <CardContent>
                <p className="text-[#8fa3bf] text-sm font-['Inter'] text-center mb-4">
                  Earnings are reinvested daily for compound growth. Higher potential returns with compounding.
                </p>

                {selectedType === "custom" && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-[#2a7fff] font-['JetBrains_Mono']">{customRate}%</span>
                      <p className="text-xs text-[#8fa3bf] font-['Inter']">Daily Interest Rate</p>
                    </div>
                    <Slider
                      value={[customRate]}
                      onValueChange={(value) => setCustomRate(value[0])}
                      max={50}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-[#8fa3bf] font-['Inter']">
                      <span>1%</span>
                      <span>50%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Next Button */}
          <div className="text-center">
            <Button
              onClick={handleNext}
              disabled={!selectedType}
              className="w-full max-w-md bg-[#2a7fff] hover:bg-[#2a7fff]/80 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-['Rajdhani']"
            >
              Next Step
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
