export const adminSessionUtils = {
  setAdminSession() {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_authenticated", "true")
      // Set secure cookie for server-side validation
      document.cookie = "adminAuthenticated=true; path=/; max-age=3600; SameSite=Strict; Secure"
    }
  },

  clearAdminSession() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_authenticated")
      // Clear admin cookie
      document.cookie = "adminAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  },

  isAdminAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return localStorage.getItem("admin_authenticated") === "true"
  },
}
