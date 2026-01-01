"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { sessionUtils } from "@/lib/session"
import { useTranslationContext } from "@/lib/translation-context"

interface ActivationPageProps {
  onLoginSuccess: () => void
  currentLanguage: string
  onLanguageChange: (language: string) => void
}

export default function ActivationPage({ onLoginSuccess, currentLanguage, onLanguageChange }: ActivationPageProps) {
  const [activationKey, setActivationKey] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isBanned, setIsBanned] = useState(false)
  const [shake, setShake] = useState(false)

  const { t } = useTranslationContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!activationKey.trim() || !username.trim()) {
      setError("Please fill in all fields")
      triggerShake()
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Validating activation key via API...")

      const response = await fetch("/api/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activationKey: activationKey.trim(),
          username: username.trim(),
        }),
      })

      if (!response.ok) {
        console.log("[v0] API response not OK:", response.status, response.statusText)
        setError("Server error. Please try again later.")
        triggerShake()
        return
      }

      let result
      try {
        result = await response.json()
      } catch (parseError) {
        console.error("[v0] Failed to parse response:", parseError)
        setError("Server returned invalid response. Please try again.")
        triggerShake()
        return
      }

      console.log("[v0] Validation response:", result)

      if (result.valid) {
        sessionUtils.setSession(username.trim(), activationKey.trim())
        onLoginSuccess()
      } else {
        setError(result.error || "Invalid credentials")
        if (result.banned) {
          setIsBanned(true)
        }
        triggerShake()
      }
    } catch (error) {
      console.error("[v0] Activation error:", error)
      setError("Connection error. Please try again.")
      triggerShake()
    } finally {
      setIsLoading(false)
    }
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  if (isBanned) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className={`w-full max-w-md glass-card border-destructive ${shake ? "animate-shake" : ""}`}>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-6xl text-destructive animate-pulse-neon">
                <i className="fas fa-ban"></i>
              </div>
              <h2 className="text-2xl font-heading font-bold text-destructive">Access Denied</h2>
              <p className="text-muted-foreground">Your account has been suspended. Please contact support.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setIsBanned(false)
                  setError("")
                  setActivationKey("")
                  setUsername("")
                }}
                className="neon-border border-destructive text-destructive hover:bg-destructive/10"
              >
                Try Different Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Main Activation Card */}
      <Card className={`w-full max-w-md glass-card ${shake ? "animate-shake" : ""}`}>
        <CardHeader className="text-center space-y-4">
          {/* Animated Key Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-neon">
            <i className="fas fa-key text-2xl text-primary"></i>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-heading font-bold text-foreground">{t.activationTitle}</CardTitle>
            <CardDescription className="text-muted-foreground">{t.activationSubtitle}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Floating Label Input for Activation Key */}
            <div className="relative">
              <Input
                type="text"
                value={activationKey}
                onChange={(e) => setActivationKey(e.target.value)}
                className="peer bg-input border-border focus:border-primary transition-colors placeholder-transparent"
                placeholder={t.activationKey}
                disabled={isLoading}
              />
              <label className="absolute left-3 -top-2.5 bg-background px-2 text-sm text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary">
                {t.activationKey}
              </label>
            </div>

            {/* Floating Label Input for Username */}
            <div className="relative">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="peer bg-input border-border focus:border-primary transition-colors placeholder-transparent"
                placeholder={t.username}
                disabled={isLoading}
              />
              <label className="absolute left-3 -top-2.5 bg-background px-2 text-sm text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary">
                {t.username}
              </label>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="border-destructive">
                <i className="fas fa-exclamation-triangle w-4 h-4"></i>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium neon-glow transition-all duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <i className="fas fa-spinner animate-spin"></i>
                  Validating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <i className="fas fa-sign-in-alt"></i>
                  {t.login}
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Disclaimer Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-primary/30 p-3">
        <div className="text-center text-sm text-muted-foreground">
          <span>{t.tradingCalculatorOwner} </span>
          <a
            href="https://t.me/MTFUTURESIGNAL01"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <i className="fab fa-telegram mr-1"></i>
            Trader Mahi
          </a>
        </div>
      </div>
    </div>
  )
}
