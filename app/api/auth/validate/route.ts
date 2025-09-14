import { type NextRequest, NextResponse } from "next/server"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, get } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyCisBYc9s_pjEFclbJomB_MxXg7jf9T_EA",
  authDomain: "trader-anu---calculate.firebaseapp.com",
  databaseURL: "https://trader-anu---calculate-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trader-anu---calculate",
  storageBucket: "trader-anu---calculate.firebasestorage.app",
  messagingSenderId: "49641339694",
  appId: "1:49641339694:web:8510fd06e3f5723dd818bf",
}

const app = initializeApp(firebaseConfig, "validation-app")
const database = getDatabase(app)

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Activation validation API called")

    const { activationKey, username } = await request.json()

    console.log("[v0] Validating key:", activationKey, "for user:", username)

    if (!activationKey || !username) {
      return NextResponse.json({ valid: false, error: "Missing activation key or username" }, { status: 400 })
    }

    try {
      const keyRef = ref(database, `activationKeys/${activationKey}`)
      const snapshot = await get(keyRef)

      if (!snapshot.exists()) {
        console.log("[v0] Key not found in database")
        return NextResponse.json({ valid: false, error: "Invalid activation key" })
      }

      const keyData = snapshot.val()
      console.log("[v0] Found key data:", keyData)

      // Check if key is expired
      if (keyData.expiryDate && new Date(keyData.expiryDate) < new Date()) {
        console.log("[v0] Key has expired")
        return NextResponse.json({ valid: false, error: "Activation key has expired" })
      }

      // Check if key is already used (for one-time keys)
      if (keyData.type === "one-time" && keyData.used) {
        console.log("[v0] Key already used")
        return NextResponse.json({ valid: false, error: "Activation key already used" })
      }

      // Check if user is banned
      const userRef = ref(database, `users/${username}`)
      const userSnapshot = await get(userRef)
      if (userSnapshot.exists() && userSnapshot.val().banned) {
        console.log("[v0] User is banned")
        return NextResponse.json({ valid: false, error: "User is banned", banned: true })
      }

      // Mark key as used if one-time
      if (keyData.type === "one-time") {
        console.log("[v0] Marking one-time key as used")
        await set(ref(database, `activationKeys/${activationKey}/used`), true)
        await set(ref(database, `activationKeys/${activationKey}/usedBy`), username)
        await set(ref(database, `activationKeys/${activationKey}/usedAt`), new Date().toISOString())
      }

      // Create/update user record
      console.log("[v0] Creating/updating user record")
      await set(ref(database, `users/${username}`), {
        activationKey: activationKey,
        lastLogin: new Date().toISOString(),
        banned: false,
      })

      console.log("[v0] Validation successful")
      return NextResponse.json({ valid: true, keyData })
    } catch (firebaseError: any) {
      console.error("[v0] Firebase operation failed:", firebaseError)

      if (firebaseError.code === "PERMISSION_DENIED") {
        return NextResponse.json(
          {
            valid: false,
            error: "Database permission error. Please check Firebase rules.",
          },
          { status: 500 },
        )
      }

      throw firebaseError
    }
  } catch (error) {
    console.error("[v0] Activation validation error:", error)
    return NextResponse.json({ valid: false, error: "Validation failed. Please try again." }, { status: 500 })
  }
}
