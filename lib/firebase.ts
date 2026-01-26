import { initializeApp, getApps, getApp } from "firebase/app"
import { getDatabase, ref, set, get, remove, onValue, off, Database } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyCisBYc9s_pjEFclbJomB_MxXg7jf9T_EA",
  authDomain: "trader-anu---calculate.firebaseapp.com",
  databaseURL: "https://trader-anu---calculate-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trader-anu---calculate",
  storageBucket: "trader-anu---calculate.firebasestorage.app",
  messagingSenderId: "49641339694",
  appId: "1:49641339694:web:8510fd06e3f5723dd818bf",
}

// Initialize Firebase lazily
let database: Database | null = null

function getDb(): Database {
  if (!database) {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    database = getDatabase(app)
  }
  return database
}

// Firebase utility functions
export const firebaseUtils = {
  // Activation key validation
  async validateActivationKey(key: string, username: string) {
    try {
      const keyRef = ref(getDb(), `activationKeys/${key}`)
      const snapshot = await get(keyRef)

      if (!snapshot.exists()) {
        return { valid: false, error: "Invalid activation key" }
      }

      const keyData = snapshot.val()

      // Check if key is expired
      if (keyData.expiryDate && new Date(keyData.expiryDate) < new Date()) {
        return { valid: false, error: "Activation key has expired" }
      }

      // Check if key is already used (for one-time keys)
      if (keyData.type === "one-time" && keyData.used) {
        return { valid: false, error: "Activation key already used" }
      }

      // Check if user is banned
      const userRef = ref(getDb(), `users/${username}`)
      const userSnapshot = await get(userRef)
      if (userSnapshot.exists() && userSnapshot.val().banned) {
        return { valid: false, error: "User is banned", banned: true }
      }

      // Mark key as used if one-time
      if (keyData.type === "one-time") {
        await set(ref(getDb(), `activationKeys/${key}/used`), true)
        await set(ref(getDb(), `activationKeys/${key}/usedBy`), username)
        await set(ref(getDb(), `activationKeys/${key}/usedAt`), new Date().toISOString())
      }

      // Create/update user record
      await set(ref(getDb(), `users/${username}`), {
        activationKey: key,
        lastLogin: new Date().toISOString(),
        banned: false,
      })

      return { valid: true, keyData }
    } catch (error) {
      console.error("Firebase validation error:", error)
      return { valid: false, error: "Connection error" }
    }
  },

  // Admin functions
  async generateActivationKey(type: "one-time" | "unlimited", expiryDate?: string, customKey?: string) {
    try {
      console.log("[v0] Generating activation key with type:", type, "expiry:", expiryDate, "custom:", !!customKey)

      const key = customKey || Math.random().toString(36).substring(2, 8).toUpperCase()

      const keyData = {
        key: key,
        type,
        isActive: true,
        createdAt: new Date().toISOString(),
        used: false,
        isCustom: !!customKey,
        ...(expiryDate && { expiryDate }),
      }

      console.log("[v0] Attempting to write key data:", keyData)

      const keyRef = ref(getDb(), `activationKeys/${key}`)
      await set(keyRef, keyData)

      console.log("[v0] Successfully generated key:", key)
      return key
    } catch (error) {
      console.error("[v0] Error in generateActivationKey:", error)
      throw error
    }
  },

  async getAllUsers() {
    try {
      console.log("[v0] Fetching all users...")
      const snapshot = await get(ref(getDb(), "users"))
      const users = snapshot.exists() ? snapshot.val() : {}
      console.log("[v0] Fetched users:", Object.keys(users).length, "users")
      return users
    } catch (error) {
      console.error("[v0] Error fetching users:", error)
      throw error
    }
  },

  async getAllKeys() {
    try {
      console.log("[v0] Fetching all keys...")
      const snapshot = await get(ref(getDb(), "activationKeys"))
      const keys = snapshot.exists() ? snapshot.val() : {}
      console.log("[v0] Fetched keys:", Object.keys(keys).length, "keys")
      return keys
    } catch (error) {
      console.error("[v0] Error fetching keys:", error)
      throw error
    }
  },

  async banUser(username: string) {
    await set(ref(getDb(), `users/${username}/banned`), true)
  },

  async unbanUser(username: string) {
    await set(ref(getDb(), `users/${username}/banned`), false)
  },

  async deleteUser(username: string) {
    await remove(ref(getDb(), `users/${username}`))
  },

  async deleteKey(key: string) {
    await remove(ref(getDb(), `activationKeys/${key}`))
  },

  // Real-time listeners
  onUsersChange(callback: (users: any) => void) {
    const usersRef = ref(getDb(), "users")
    onValue(usersRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : {})
    })
    return () => off(usersRef)
  },

  onKeysChange(callback: (keys: any) => void) {
    const keysRef = ref(getDb(), "activationKeys")
    onValue(keysRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : {})
    })
    return () => off(keysRef)
  },
}

export { getDb as database }
