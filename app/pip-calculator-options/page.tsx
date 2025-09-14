"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function PipCalculatorOptionsPage() {
  const router = useRouter()

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
              <i className="fas fa-coins text-primary"></i>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">Pip Calculator</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Smart Pip Calculator Card */}
          <Card className="glass-card rounded-2xl border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <i className="fas fa-calculator text-3xl text-primary"></i>
              </div>
              <CardTitle className="text-xl font-heading">Smart Pip Calculator</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => router.push("/pip-calculator")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Start
              </Button>
            </CardContent>
          </Card>

          {/* Pip Profit Calculator Card */}
          <Card className="glass-card rounded-2xl border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <i className="fas fa-chart-line text-3xl text-primary"></i>
              </div>
              <CardTitle className="text-xl font-heading">Pip Profit Calculator</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => router.push("/forex-profit-calculator")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Start
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
