"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminPanel from "@/components/admin-panel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { adminSessionUtils } from "@/lib/admin-session"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Admin password (in production, this should be more secure)
  const ADMIN_PASSWORD = "TMXCALCU"

  useEffect(() => {
    // Check if already authenticated in session
    if (adminSessionUtils.isAdminAuthenticated()) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      adminSessionUtils.setAdminSession()
      toast({
        title: "Success",
        description: "Admin access granted",
      })
    } else {
      toast({
        title: "Error",
        description: "Invalid admin password",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    adminSessionUtils.clearAdminSession()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="glass-card max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse-neon">
              <i className="fas fa-shield-alt text-2xl text-destructive"></i>
            </div>
            <CardTitle className="font-heading text-destructive">Admin Panel Access</CardTitle>
            <CardDescription>Enter admin credentials to access the control panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Admin Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="bg-input border-border"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90">
                <i className="fas fa-unlock mr-2"></i>
                Access Admin Panel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => router.push("/")}
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Main App
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <i className="fas fa-cog text-destructive"></i>
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold">MT Calculator Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/")} size="sm">
              <i className="fas fa-home"></i>
            </Button>
            <Button variant="destructive" onClick={handleLogout} size="sm">
              <i className="fas fa-sign-out-alt"></i>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <AdminPanel currentLanguage="en" />
      </main>
    </div>
  )
}
