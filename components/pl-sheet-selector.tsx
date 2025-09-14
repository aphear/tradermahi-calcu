"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign } from "lucide-react"
import PLSheet from "@/components/pl-sheet"

interface PLSheetSelectorProps {
  onBack: () => void
  prePopulatedData?: {
    currency: string
    currencySymbol: string
    entries: any[]
    totalDays: number
    isFromResults: boolean
    type?: "binary" | "forex" // Added type to determine which sheet to use
  }
}

export default function PLSheetSelector({ onBack, prePopulatedData }: PLSheetSelectorProps) {
  const [selectedType, setSelectedType] = useState<"binary" | "forex" | null>(null)

  if (prePopulatedData?.type && !selectedType) {
    setSelectedType(prePopulatedData.type)
  }

  const handleTypeSelect = (type: "binary" | "forex") => {
    setSelectedType(type)
  }

  const handleBackToSelector = () => {
    setSelectedType(null)
  }

  if (selectedType) {
    return (
      <PLSheet
        onBack={handleBackToSelector}
        prePopulatedData={prePopulatedData}
        sheetType={selectedType} // Pass the sheet type to PLSheet
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">P/L Sheet</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card
          className="glass-card border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-blue-500/5 to-blue-600/10 cursor-pointer"
          onClick={() => handleTypeSelect("binary")}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle className="text-xl font-heading text-blue-600 dark:text-blue-400">Binary Sheet</CardTitle>
            <CardDescription>P/L sheets created from Binary trading results</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => handleTypeSelect("binary")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-lg"
            >
              Open Binary Sheet
            </Button>
          </CardContent>
        </Card>

        <Card
          className="glass-card border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-orange-500/5 to-orange-600/10 cursor-pointer"
          onClick={() => handleTypeSelect("forex")}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
            <CardTitle className="text-xl font-heading text-orange-600 dark:text-orange-400">Forex Sheet</CardTitle>
            <CardDescription>P/L sheets created from Forex trading results</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => handleTypeSelect("forex")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-lg"
            >
              Open Forex Sheet
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        <p>
          Choose between Binary Sheet for results created from Binary trading calculations, or Forex Sheet for results
          created from Forex trading calculations. Each type maintains separate P/L records.
        </p>
      </div>
    </div>
  )
}
