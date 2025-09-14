"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { sessionUtils } from "@/lib/session"
import ActivationPage from "@/components/activation-page"
import TradingDashboard from "@/components/trading-dashboard"
import { useTranslationContext } from "@/lib/translation-context"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const [userStatus, setUserStatus] = useState<{ banned: boolean; deleted: boolean }>({ banned: false, deleted: false })

  const { currentLanguage, setLanguage, t } = useTranslationContext()

  const isCheckingStatus = useRef(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const checkAuthStatus = useCallback(async () => {
    if (isCheckingStatus.current) {
      return
    }

    isCheckingStatus.current = true

    try {
      const session = sessionUtils.getSession()
      if (session) {
        // Check if user is banned or deleted
        const status = await sessionUtils.checkUserBanStatus(session.username)
        setUserStatus(status)

        if (status.deleted || status.banned) {
          // If user is deleted or banned, clear session and logout
          if (status.deleted) {
            sessionUtils.clearSession()
            setIsAuthenticated(false)
          } else {
            setIsAuthenticated(true) // Keep authenticated but show ban message
          }
        } else {
          setIsAuthenticated(true)
        }
      } else {
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Error checking auth status:", error)
      setIsLoading(false)
    } finally {
      isCheckingStatus.current = false
    }
  }, []) // Empty dependency array since function doesn't depend on any state

  useEffect(() => {
    checkAuthStatus()

    const interval = setInterval(() => {
      checkAuthStatus()
    }, 5000)

    return () => clearInterval(interval)
  }, [checkAuthStatus]) // Add checkAuthStatus as dependency

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true)
    setUserStatus({ banned: false, deleted: false })
  }, [])

  const handleLogout = useCallback(() => {
    sessionUtils.clearSession()
    setIsAuthenticated(false)
    setUserStatus({ banned: false, deleted: false })
  }, [])

  const handleLanguageChange = useCallback(
    (language: string) => {
      setLanguage(language)
    },
    [setLanguage],
  )

  if (isLoading || !isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-neon">
          <i className="fas fa-chart-line text-4xl text-primary"></i>
        </div>
      </div>
    )
  }

  if (isAuthenticated && userStatus.banned) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-8xl animate-pulse-neon text-destructive">🚫</div>
          <div className="space-y-2">
            <h1 className="text-4xl font-heading font-bold text-destructive">{t.youAreBanned}</h1>
            <p className="text-muted-foreground">{t.accountSuspended}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-destructive/20 border border-destructive/30 rounded-lg text-destructive hover:bg-destructive/30 transition-colors"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            {t.logout}
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <ActivationPage
        onLoginSuccess={handleLoginSuccess}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
    )
  }

  return (
    <TradingDashboard
      onLogout={handleLogout}
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
    />
  )
}
