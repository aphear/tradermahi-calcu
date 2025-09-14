"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { sessionUtils } from "@/lib/session"

interface RouteGuardProps {
  children: React.ReactNode
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuthentication = async () => {
      // Skip authentication check for root path (handled by main page component)
      if (pathname === "/") {
        setIsAuthenticated(true)
        return
      }

      // Skip authentication check for admin routes (handled by admin page)
      if (pathname.startsWith("/admin")) {
        setIsAuthenticated(true)
        return
      }

      // Check if user has valid session
      const session = sessionUtils.getSession()

      if (!session) {
        // No session, redirect to home
        router.push("/")
        return
      }

      // Validate session with server
      try {
        const response = await fetch("/api/auth/session-check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionData: session }),
        })

        const result = await response.json()

        if (result.valid) {
          setIsAuthenticated(true)
        } else {
          // Invalid session, clear it and redirect
          sessionUtils.clearSession()
          router.push("/")
        }
      } catch (error) {
        console.error("[v0] Session validation error:", error)
        // On error, redirect to home for safety
        router.push("/")
      }
    }

    checkAuthentication()
  }, [pathname, router])

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-neon">
          <i className="fas fa-shield-alt text-4xl text-primary"></i>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render children (redirect is happening)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse-neon">
            <i className="fas fa-lock text-4xl text-destructive"></i>
          </div>
          <p className="text-muted-foreground">Redirecting to authentication...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
