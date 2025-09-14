"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ComingSoonContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from")

  const getTitle = () => {
    switch (from) {
      case "pip-calculator":
        return "Pip Calculator"
      case "forex-market-hour":
        return "Forex Market Hour"
      default:
        return "Feature"
    }
  }

  const getIcon = () => {
    switch (from) {
      case "pip-calculator":
        return "fas fa-coins"
      case "forex-market-hour":
        return "fas fa-clock"
      default:
        return "fas fa-cog"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="glass-card border-primary/30 hover:border-primary/50"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back
            </Button>
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <i className={`${getIcon()} text-primary`}></i>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">{getTitle()}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="glass-card max-w-md w-full text-center">
            <CardHeader>
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <i className={`${getIcon()} text-4xl text-primary`}></i>
              </div>
              <CardTitle className="text-2xl font-heading mb-2">{getTitle()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg font-medium text-foreground">Coming Soon</p>
                <p className="text-muted-foreground">
                  This feature is currently under development and will be available soon.
                </p>
                <Button onClick={() => router.push("/forex-calculator")} variant="outline" className="mt-6">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Forex Calculator
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComingSoonContent />
    </Suspense>
  )
}
