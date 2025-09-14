"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, PieChart, BarChart3 } from "lucide-react"

export default function ReportTypePage() {
  const router = useRouter()
  const [fxData, setFxData] = useState<any>(null)
  const [selectedReport, setSelectedReport] = useState<string>("")

  useEffect(() => {
    const data = localStorage.getItem("fxManager")
    if (data) {
      setFxData(JSON.parse(data))
    } else {
      router.push("/fx-money-manager")
    }
  }, [router])

  const handleNext = () => {
    if (selectedReport) {
      const updatedData = {
        ...fxData,
        reportType: selectedReport,
      }
      localStorage.setItem("fxManager", JSON.stringify(updatedData))
      router.push("/fx-money-manager/date-selection")
    }
  }

  const reportOptions = [
    {
      id: "trade-list",
      title: "Daily Trade List",
      description: "Focus on individual trade details, entry/exit points, and trade-by-trade analysis",
      icon: FileText,
      features: ["Trade timestamps", "Entry/Exit prices", "Profit/Loss per trade", "Trade duration"],
      color: "blue",
    },
    {
      id: "management-list",
      title: "Daily Management List",
      description: "Focus on money management, risk analysis, and capital allocation strategies",
      icon: PieChart,
      features: ["Risk percentages", "Capital allocation", "Drawdown analysis", "Position sizing"],
      color: "green",
    },
    {
      id: "comprehensive",
      title: "Comprehensive Report",
      description: "Complete analysis combining both trade details and money management insights",
      icon: BarChart3,
      features: ["All trade details", "Complete risk analysis", "Performance metrics", "Growth projections"],
      color: "purple",
    },
  ]

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
              <BarChart3 className="h-5 w-5 text-[#2a7fff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Report Type</h1>
              <p className="text-sm text-[#8fa3bf]">Step 5 of 7</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-[#131d2d] rounded-full h-2">
              <div
                className="bg-[#2a7fff] h-2 rounded-full transition-all duration-300"
                style={{ width: "71.4%" }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#e6eef9] font-['Rajdhani'] mb-2">Select What You Want!</h2>
            <p className="text-[#8fa3bf] font-['Inter']">
              Choose the type of analysis and reporting that best fits your trading needs
            </p>
          </div>

          {/* Report Options Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {reportOptions.map((option) => {
              const IconComponent = option.icon
              const isSelected = selectedReport === option.id

              const colorClasses = {
                blue: {
                  border: isSelected ? "border-[#2a7fff]" : "border-[#2a7fff]/30 hover:border-[#2a7fff]/50",
                  bg: isSelected ? "bg-[#2a7fff]/10" : "bg-[#131d2d] hover:bg-[#2a7fff]/5",
                  shadow: isSelected ? "shadow-lg shadow-[#2a7fff]/20" : "",
                  iconBg: "bg-[#2a7fff]/20",
                  iconColor: "text-[#2a7fff]",
                  titleColor: "text-[#2a7fff]",
                },
                green: {
                  border: isSelected ? "border-[#00d395]" : "border-[#00d395]/30 hover:border-[#00d395]/50",
                  bg: isSelected ? "bg-[#00d395]/10" : "bg-[#131d2d] hover:bg-[#00d395]/5",
                  shadow: isSelected ? "shadow-lg shadow-[#00d395]/20" : "",
                  iconBg: "bg-[#00d395]/20",
                  iconColor: "text-[#00d395]",
                  titleColor: "text-[#00d395]",
                },
                purple: {
                  border: isSelected ? "border-purple-500" : "border-purple-500/30 hover:border-purple-500/50",
                  bg: isSelected ? "bg-purple-500/10" : "bg-[#131d2d] hover:bg-purple-500/5",
                  shadow: isSelected ? "shadow-lg shadow-purple-500/20" : "",
                  iconBg: "bg-purple-500/20",
                  iconColor: "text-purple-500",
                  titleColor: "text-purple-500",
                },
              }[option.color]

              return (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-2xl ${colorClasses.border} ${colorClasses.bg} ${colorClasses.shadow}`}
                  onClick={() => setSelectedReport(option.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full ${colorClasses.iconBg} flex items-center justify-center`}
                    >
                      <IconComponent className={`h-8 w-8 ${colorClasses.iconColor}`} />
                    </div>
                    <CardTitle className={`text-xl font-bold font-['Rajdhani'] ${colorClasses.titleColor}`}>
                      {option.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[#8fa3bf] text-sm font-['Inter'] text-center">{option.description}</p>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-[#e6eef9] font-['Inter']">Key Features:</p>
                      <ul className="space-y-1">
                        {option.features.map((feature, index) => (
                          <li key={index} className="text-xs text-[#8fa3bf] font-['Inter'] flex items-center">
                            <div className={`w-1.5 h-1.5 rounded-full ${colorClasses.iconBg} mr-2`}></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {isSelected && (
                      <div className={`mt-4 p-2 rounded-lg ${colorClasses.bg} border ${colorClasses.border}`}>
                        <p className={`text-xs font-medium text-center font-['Inter'] ${colorClasses.titleColor}`}>
                          Selected
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Selection Summary */}
          {selectedReport && (
            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl mb-8">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[#e6eef9] font-['Rajdhani'] mb-2">Selected Report Type</h3>
                  <p className="text-[#2a7fff] font-medium font-['Inter']">
                    {reportOptions.find((opt) => opt.id === selectedReport)?.title}
                  </p>
                  <p className="text-[#8fa3bf] text-sm font-['Inter'] mt-1">
                    {reportOptions.find((opt) => opt.id === selectedReport)?.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Button */}
          <div className="text-center">
            <Button
              onClick={handleNext}
              disabled={!selectedReport}
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
