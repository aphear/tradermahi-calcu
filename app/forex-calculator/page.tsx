"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, Calculator, Clock, Brain, DollarSign } from "lucide-react"

export default function ForexCalculatorPage() {
  const router = useRouter()

  const handleFxMoneyManageClick = () => {
    router.push("/fx-money-manager")
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
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">Forex Calculator</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Row - Two Cards Side by Side */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Pip Calculator Card - Blue Theme */}
            <Card className="glass-card rounded-2xl border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-blue-500/5 to-blue-600/10">
              <CardHeader className="text-center pb-2 sm:pb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-2 sm:mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Calculator className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-blue-500" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-heading text-blue-600 dark:text-blue-400">
                  Pip Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={() => router.push("/pip-calculator-options")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 sm:py-3 px-2 sm:px-4 lg:px-6 rounded-lg transition-colors text-xs sm:text-sm lg:text-base shadow-lg"
                >
                  Start
                </Button>
              </CardContent>
            </Card>

            {/* Forex Market Hour Card - Green Theme */}
            <Card className="glass-card rounded-2xl border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-green-500/5 to-green-600/10">
              <CardHeader className="text-center pb-2 sm:pb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-2 sm:mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-green-500" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-heading text-green-600 dark:text-green-400">
                  Forex Market Hour
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={() => router.push("/forex-market-hours")}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 sm:py-3 px-2 sm:px-4 lg:px-6 rounded-lg transition-colors text-xs sm:text-sm lg:text-base shadow-lg"
                >
                  Start
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - Large Smart Forex Calculator Card - Purple Theme */}
          <Card className="glass-card rounded-2xl border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-purple-500/5 to-purple-600/10">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Brain className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-purple-500" />
              </div>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-heading text-purple-600 dark:text-purple-400">
                Smart Forex Calculator
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Advanced trading calculations with AI-powered insights
              </p>
            </CardHeader>
            <CardContent className="text-center pb-6 sm:pb-8">
              <Button
                onClick={() => router.push("/smart-forex-calculator")}
                className="w-full max-w-md mx-auto bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 lg:px-8 rounded-lg transition-colors text-sm sm:text-base lg:text-lg shadow-lg"
              >
                Start
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-orange-500/5 to-orange-600/10">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-orange-500" />
              </div>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-heading text-orange-600 dark:text-orange-400">
                Fx Money Manage
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Before Trade In Forex Management You're Money First
              </p>
            </CardHeader>
            <CardContent className="text-center pb-6 sm:pb-8">
              <Button
                onClick={handleFxMoneyManageClick}
                className="w-full max-w-md mx-auto bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 lg:px-8 rounded-lg transition-colors text-sm sm:text-base lg:text-lg shadow-lg"
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
