"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CalendarIcon, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DateSelectionPage() {
  const router = useRouter()
  const [fxData, setFxData] = useState<any>(null)

  const [dateMode, setDateMode] = useState<"manual" | "calendar">("manual")

  // Manual date states
  const [manualYears, setManualYears] = useState<string>("")
  const [manualMonths, setManualMonths] = useState<string>("")
  const [manualDays, setManualDays] = useState<string>("")

  // Calendar date states (existing)
  const [includeAllDays, setIncludeAllDays] = useState(true)
  const [selectedDays, setSelectedDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  })
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  )
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem("fxManager")
    if (data) {
      setFxData(JSON.parse(data))
    } else {
      router.push("/fx-money-manager")
    }
  }, [router])

  const dayNames = [
    { key: "monday", label: "Monday", short: "Mon" },
    { key: "tuesday", label: "Tuesday", short: "Tue" },
    { key: "wednesday", label: "Wednesday", short: "Wed" },
    { key: "thursday", label: "Thursday", short: "Thu" },
    { key: "friday", label: "Friday", short: "Fri" },
    { key: "saturday", label: "Saturday", short: "Sat" },
    { key: "sunday", label: "Sunday", short: "Sun" },
  ]

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  const calculateManualTotalDays = () => {
    let totalDays = 0

    if (manualYears) {
      const years = Number.parseInt(manualYears)
      const currentYear = new Date().getFullYear()
      for (let i = 0; i < years; i++) {
        const year = currentYear + i
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
        totalDays += isLeapYear ? 366 : 365
      }
    }

    if (manualMonths) {
      const months = Number.parseInt(manualMonths)
      const currentDate = new Date()
      for (let i = 0; i < months; i++) {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() + i + 1, 0)
        totalDays += month.getDate()
      }
    }

    if (manualDays) {
      totalDays += Number.parseInt(manualDays)
    }

    return totalDays
  }

  const calculateTotalDays = () => {
    if (dateMode === "manual") {
      return calculateManualTotalDays()
    }

    if (!startDate || !endDate) return 0

    const start = new Date(startDate)
    const end = new Date(endDate)
    let totalDays = 0
    const current = new Date(start)

    while (current <= end) {
      const dayName = current.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
      if (includeAllDays || selectedDays[dayName]) {
        totalDays++
      }
      current.setDate(current.getDate() + 1)
    }

    return totalDays
  }

  const handleCalculate = async () => {
    setIsCalculating(true)

    // Simulate calculation time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const updatedData = {
      ...fxData,
      dateMode,
      manualYears: manualYears ? Number.parseInt(manualYears) : null,
      manualMonths: manualMonths ? Number.parseInt(manualMonths) : null,
      manualDays: manualDays ? Number.parseInt(manualDays) : null,
      includeAllDays: dateMode === "calendar" ? includeAllDays : null,
      selectedDays: dateMode === "calendar" && !includeAllDays ? selectedDays : null,
      startDate: dateMode === "calendar" ? startDate : null,
      endDate: dateMode === "calendar" ? endDate : null,
      totalDays: calculateTotalDays(),
    }

    localStorage.setItem("fxManager", JSON.stringify(updatedData))
    router.push("/fx-money-manager/results")
  }

  const totalDays = calculateTotalDays()
  const activeDays = includeAllDays ? 7 : Object.values(selectedDays).filter(Boolean).length

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
              <CalendarIcon className="h-5 w-5 text-[#2a7fff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">Date Selection</h1>
              <p className="text-sm text-[#8fa3bf]">Step 6 of 7</p>
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
                style={{ width: "85.7%" }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#e6eef9] font-['Rajdhani'] mb-2">Time Period & Dates</h2>
            <p className="text-[#8fa3bf] font-['Inter']">Configure your trading schedule and calculation period</p>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">
                  Date Selection Mode
                </CardTitle>
                <p className="text-[#8fa3bf] text-sm font-['Inter']">
                  Choose how you want to specify the calculation period
                </p>
              </CardHeader>
              <CardContent>
                <Tabs value={dateMode} onValueChange={(value) => setDateMode(value as "manual" | "calendar")}>
                  <TabsList className="grid w-full grid-cols-2 bg-[#0d1520] rounded-lg p-1 gap-1 border border-[#2a7fff]/20">
                    <TabsTrigger
                      value="manual"
                      className="px-4 py-2 rounded data-[state=active]:bg-[#2a7fff] data-[state=active]:text-white text-[#8fa3bf] hover:text-[#e6eef9] transition-all font-['Inter']"
                    >
                      Manual Date
                    </TabsTrigger>
                    <TabsTrigger
                      value="calendar"
                      className="px-4 py-2 rounded data-[state=active]:bg-[#2a7fff] data-[state=active]:text-white text-[#8fa3bf] hover:text-[#e6eef9] transition-all font-['Inter']"
                    >
                      Calendar Date
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="mt-6">
                    <div className="space-y-4">
                      <p className="text-[#8fa3bf] text-sm font-['Inter']">
                        Enter any combination of years, months, or days. The algorithm will calculate the exact number
                        of days.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#e6eef9] font-['Inter']">Years</label>
                          <Input
                            type="number"
                            placeholder="Enter years"
                            value={manualYears}
                            onChange={(e) => setManualYears(e.target.value)}
                            className="bg-[#0d1520] border-[#2a7fff]/30 text-[#e6eef9] placeholder-[#8fa3bf] font-['JetBrains_Mono']"
                            min="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#e6eef9] font-['Inter']">Months</label>
                          <Input
                            type="number"
                            placeholder="Enter months"
                            value={manualMonths}
                            onChange={(e) => setManualMonths(e.target.value)}
                            className="bg-[#0d1520] border-[#2a7fff]/30 text-[#e6eef9] placeholder-[#8fa3bf] font-['JetBrains_Mono']"
                            min="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#e6eef9] font-['Inter']">Days</label>
                          <Input
                            type="number"
                            placeholder="Enter days"
                            value={manualDays}
                            onChange={(e) => setManualDays(e.target.value)}
                            className="bg-[#0d1520] border-[#2a7fff]/30 text-[#e6eef9] placeholder-[#8fa3bf] font-['JetBrains_Mono']"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="calendar" className="mt-6">
                    <div className="space-y-6">
                      {/* Include All Days Toggle */}
                      <div className="flex items-center justify-between p-4 bg-[#0d1520] rounded-lg border border-[#2a7fff]/20">
                        <div>
                          <h3 className="text-lg font-medium text-[#e6eef9] font-['Rajdhani']">Include All Days</h3>
                          <p className="text-[#8fa3bf] text-sm font-['Inter']">
                            Calculate for all 7 days of the week or select specific trading days
                          </p>
                        </div>
                        <Switch
                          checked={includeAllDays}
                          onCheckedChange={setIncludeAllDays}
                          className="data-[state=checked]:bg-[#2a7fff]"
                        />
                      </div>

                      {!includeAllDays && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-[#e6eef9] font-['Rajdhani']">Select Trading Days</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                            {dayNames.map((day) => (
                              <button
                                key={day.key}
                                onClick={() => toggleDay(day.key)}
                                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                                  selectedDays[day.key]
                                    ? "border-[#2a7fff] bg-[#2a7fff]/10 text-[#2a7fff]"
                                    : "border-[#2a7fff]/20 bg-[#0d1520] text-[#8fa3bf] hover:border-[#2a7fff]/40"
                                }`}
                              >
                                <div className="text-xs font-medium font-['Inter']">{day.short}</div>
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-[#8fa3bf] font-['Inter']">
                            Selected: {activeDays} day{activeDays !== 1 ? "s" : ""} per week
                          </p>
                        </div>
                      )}

                      {/* Date Selection */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Start Date */}
                        <div className="space-y-2">
                          <label className="text-lg font-medium text-[#e6eef9] font-['Rajdhani']">Start Date</label>
                          <p className="text-[#8fa3bf] text-sm font-['Inter']">When to begin the calculation period</p>
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-[#0d1520] border-[#2a7fff]/30 text-[#e6eef9] font-['JetBrains_Mono'] text-lg p-4 rounded-xl focus:border-[#2a7fff] focus:ring-1 focus:ring-[#2a7fff]"
                          />
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                          <label className="text-lg font-medium text-[#e6eef9] font-['Rajdhani']">End Date</label>
                          <p className="text-[#8fa3bf] text-sm font-['Inter']">When to end the calculation period</p>
                          <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-[#0d1520] border-[#2a7fff]/30 text-[#e6eef9] font-['JetBrains_Mono'] text-lg p-4 rounded-xl focus:border-[#2a7fff] focus:ring-1 focus:ring-[#2a7fff]"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Calculation Summary */}
            <Card className="bg-[#131d2d] border-[#00d395]/30 rounded-2xl">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5 text-[#00d395]" />
                    <h3 className="text-lg font-bold text-[#e6eef9] font-['Rajdhani']">Calculation Summary</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-[#00d395] font-['JetBrains_Mono']">{totalDays}</p>
                      <p className="text-xs text-[#8fa3bf] font-['Inter']">Total Days</p>
                    </div>
                    {dateMode === "calendar" && (
                      <>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-[#2a7fff] font-['JetBrains_Mono']">{activeDays}</p>
                          <p className="text-xs text-[#8fa3bf] font-['Inter']">Days/Week</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-[#e6eef9] font-['JetBrains_Mono']">
                            {Math.ceil(
                              (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 7),
                            )}
                          </p>
                          <p className="text-xs text-[#8fa3bf] font-['Inter']">Weeks</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-purple-500 font-['JetBrains_Mono']">
                            {Math.ceil(
                              (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                                (1000 * 60 * 60 * 24 * 30),
                            )}
                          </p>
                          <p className="text-xs text-[#8fa3bf] font-['Inter']">Months</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calculate Button */}
          <div className="text-center mt-8">
            <Button
              onClick={handleCalculate}
              disabled={
                (dateMode === "manual" && !manualYears && !manualMonths && !manualDays) ||
                (dateMode === "calendar" && (!startDate || !endDate)) ||
                isCalculating
              }
              className="w-full max-w-md bg-[#00d395] hover:bg-[#00d395]/80 text-white font-medium py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-['Rajdhani'] text-lg"
            >
              {isCalculating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Calculating...
                </div>
              ) : (
                "Calculate Results"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
