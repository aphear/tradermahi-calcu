"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface MarketSession {
  name: string
  city: string
  openUTC: number
  closeUTC: number
  color: string
  icon: string
}

interface TimezoneOption {
  value: string
  label: string
  offset: number
}

const marketSessions: MarketSession[] = [
  { name: "Sydney", city: "Sydney", openUTC: 22, closeUTC: 7, color: "bg-blue-500", icon: "fas fa-sun" },
  { name: "Tokyo", city: "Tokyo", openUTC: 0, closeUTC: 9, color: "bg-red-500", icon: "fas fa-yen-sign" },
  { name: "London", city: "London", openUTC: 8, closeUTC: 17, color: "bg-green-500", icon: "fas fa-pound-sign" },
  { name: "New York", city: "New York", openUTC: 13, closeUTC: 22, color: "bg-yellow-500", icon: "fas fa-dollar-sign" },
]

const timezones: TimezoneOption[] = [
  { value: "Asia/Dhaka", label: "Dhaka (GMT+6)", offset: 6 },
  { value: "America/New_York", label: "New York (GMT-5/-4)", offset: -5 },
  { value: "Europe/London", label: "London (GMT+0/+1)", offset: 0 },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+9)", offset: 9 },
  { value: "Australia/Sydney", label: "Sydney (GMT+10/+11)", offset: 10 },
  { value: "Europe/Frankfurt", label: "Frankfurt (GMT+1/+2)", offset: 1 },
  { value: "Asia/Singapore", label: "Singapore (GMT+8)", offset: 8 },
]

export default function ForexMarketHoursPage() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Dhaka")
  const [userTimezoneOffset, setUserTimezoneOffset] = useState(6)

  useEffect(() => {
    // Auto-detect user's timezone
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const matchedTimezone = timezones.find((tz) => tz.value === detectedTimezone)

    if (matchedTimezone) {
      setSelectedTimezone(matchedTimezone.value)
      setUserTimezoneOffset(matchedTimezone.offset)
    }

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleTimezoneChange = (timezone: string) => {
    setSelectedTimezone(timezone)
    const selectedTz = timezones.find((tz) => tz.value === timezone)
    if (selectedTz) {
      setUserTimezoneOffset(selectedTz.offset)
    }
  }

  const getCurrentUTCHour = () => {
    return currentTime.getUTCHours()
  }

  const convertUTCToLocal = (utcHour: number) => {
    let localHour = utcHour + userTimezoneOffset
    if (localHour >= 24) localHour -= 24
    if (localHour < 0) localHour += 24
    return localHour
  }

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:00 ${period}`
  }

  const isSessionActive = (session: MarketSession) => {
    const currentUTCHour = getCurrentUTCHour()

    if (session.openUTC <= session.closeUTC) {
      return currentUTCHour >= session.openUTC && currentUTCHour < session.closeUTC
    } else {
      // Session crosses midnight
      return currentUTCHour >= session.openUTC || currentUTCHour < session.closeUTC
    }
  }

  const getSessionLiquidity = (session: MarketSession) => {
    const overlaps = marketSessions.filter((s) => s !== session && isSessionActive(s) && isSessionActive(session))

    if (overlaps.length > 0) return { level: "High", color: "text-green-400" }
    if (isSessionActive(session)) return { level: "Medium", color: "text-yellow-400" }
    return { level: "Low", color: "text-gray-400" }
  }

  const getActiveSession = () => {
    const activeSessions = marketSessions.filter(isSessionActive)
    return activeSessions.length > 0 ? activeSessions[0] : null
  }

  const renderTimeBar = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="relative w-full h-16 bg-gray-800 rounded-lg overflow-hidden">
        {/* Hour markers */}
        <div className="absolute top-0 left-0 w-full h-full flex">
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex-1 border-r border-gray-600 last:border-r-0 flex items-center justify-center text-xs text-gray-400"
            >
              {hour}
            </div>
          ))}
        </div>

        {/* Session bars */}
        {marketSessions.map((session, index) => {
          const isActive = isSessionActive(session)
          const startPercent = (session.openUTC / 24) * 100
          let widthPercent

          if (session.openUTC <= session.closeUTC) {
            widthPercent = ((session.closeUTC - session.openUTC) / 24) * 100
          } else {
            widthPercent = ((24 - session.openUTC + session.closeUTC) / 24) * 100
          }

          return (
            <div
              key={session.name}
              className={`absolute h-3 ${session.color} ${isActive ? "opacity-100" : "opacity-40"} rounded`}
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`,
                top: `${20 + index * 8}px`,
              }}
            />
          )
        })}

        {/* Current time indicator */}
        <div
          className="absolute top-0 w-0.5 h-full bg-white z-10"
          style={{ left: `${(getCurrentUTCHour() / 24) * 100}%` }}
        />
      </div>
    )
  }

  const activeSession = getActiveSession()

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
              <i className="fas fa-clock text-primary"></i>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">Forex Market Hours</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Timezone Selector */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-globe text-primary"></i>
                Timezone Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Your Timezone</label>
                  <Select value={selectedTimezone} onValueChange={handleTimezoneChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Time:{" "}
                  {currentTime.toLocaleTimeString([], {
                    timeZone: selectedTimezone,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Session Status */}
          {activeSession && (
            <Card className="glass-card border-primary/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${activeSession.color} animate-pulse`}></div>
                  <span className="text-lg font-medium">{activeSession.name} Session - Active</span>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Liquidity:</span>
                    <span className={`font-medium ${getSessionLiquidity(activeSession).color}`}>
                      {getSessionLiquidity(activeSession).level}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 24-Hour Time Bar */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Market Sessions (UTC Time)</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTimeBar()}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {marketSessions.map((session) => (
                  <div key={session.name} className="flex items-center gap-2 text-sm">
                    <div className={`w-3 h-3 rounded ${session.color}`}></div>
                    <span>{session.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketSessions.map((session) => {
              const isActive = isSessionActive(session)
              const liquidity = getSessionLiquidity(session)
              const localOpen = convertUTCToLocal(session.openUTC)
              const localClose = convertUTCToLocal(session.closeUTC)

              return (
                <Card
                  key={session.name}
                  className={`glass-card transition-all duration-300 ${
                    isActive ? "border-primary/50 shadow-lg" : "border-border/30"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className={`${session.icon} text-lg`}></i>
                        <CardTitle className="text-lg">{session.name}</CardTitle>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${session.color} ${isActive ? "animate-pulse" : "opacity-40"}`}
                      ></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Local Time</div>
                      <div className="font-medium">
                        {formatTime(localOpen)} - {formatTime(localClose)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">UTC Time</div>
                      <div className="font-medium">
                        {formatTime(session.openUTC)} - {formatTime(session.closeUTC)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className={`text-sm font-medium ${isActive ? "text-green-400" : "text-gray-400"}`}>
                        {isActive ? "Active" : "Closed"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Liquidity:</span>
                      <span className={`text-sm font-medium ${liquidity.color}`}>{liquidity.level}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Information Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-info-circle text-primary"></i>
                Market Hours Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Trading Sessions</h4>
                <p className="text-sm text-muted-foreground">
                  The forex market operates 24 hours a day, 5 days a week across four major trading sessions. Each
                  session has different characteristics in terms of volatility and liquidity.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Overlap Periods</h4>
                <p className="text-sm text-muted-foreground">
                  When two sessions overlap, trading volume and volatility typically increase, providing better trading
                  opportunities. The most active overlap is between London and New York sessions.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Liquidity Levels</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    <span className="text-green-400">High:</span> Multiple sessions active (overlap periods)
                  </li>
                  <li>
                    <span className="text-yellow-400">Medium:</span> Single major session active
                  </li>
                  <li>
                    <span className="text-gray-400">Low:</span> No major sessions active
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
