export interface UserSession {
  username: string
  activationKey: string
  loginTime: string
  expiryTime: string
}

export const sessionUtils = {
  setSession(username: string, activationKey: string) {
    const session: UserSession = {
      username,
      activationKey,
      loginTime: new Date().toISOString(),
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("tradingSession", JSON.stringify(session))
      document.cookie = `tradingSession=${JSON.stringify(session)}; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`
    }
  },

  getSession(): UserSession | null {
    if (typeof window === "undefined") return null

    const sessionData = localStorage.getItem("tradingSession")
    if (!sessionData) return null

    try {
      const session: UserSession = JSON.parse(sessionData)

      // Check if session is expired
      if (new Date(session.expiryTime) < new Date()) {
        this.clearSession()
        return null
      }

      return session
    } catch {
      this.clearSession()
      return null
    }
  },

  clearSession() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tradingSession")
      document.cookie = "tradingSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  },

  isValidSession(): boolean {
    return this.getSession() !== null
  },

  async checkUserBanStatus(username: string): Promise<{ banned: boolean; deleted: boolean }> {
    try {
      const response = await fetch("/api/auth/check-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })

      if (!response.ok) {
        return { banned: false, deleted: false }
      }

      const data = await response.json()
      return { banned: data.banned || false, deleted: data.deleted || false }
    } catch (error) {
      console.error("Error checking user ban status:", error)
      return { banned: false, deleted: false }
    }
  },
}
