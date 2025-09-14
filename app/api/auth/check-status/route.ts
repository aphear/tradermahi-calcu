import { type NextRequest, NextResponse } from "next/server"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, get } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyCisBYc9s_pjEFclbJomB_MxXg7jf9T_EA",
  authDomain: "trader-anu---calculate.firebaseapp.com",
  databaseURL: "https://trader-anu---calculate-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trader-anu---calculate",
  storageBucket: "trader-anu---calculate.firebasestorage.app",
  messagingSenderId: "49641339694",
  appId: "1:49641339694:web:8510fd06e3f5723dd818bf",
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 })
    }

    console.log("[v0] Checking user status for:", username)

    // Check if user exists and get their status
    const userRef = ref(database, `users/${username}`)
    const userSnapshot = await get(userRef)

    if (!userSnapshot.exists()) {
      console.log("[v0] User not found, marking as deleted")
      return NextResponse.json({ banned: false, deleted: true })
    }

    const userData = userSnapshot.val()
    console.log("[v0] User data:", userData)

    return NextResponse.json({
      banned: userData.banned || false,
      deleted: false,
    })
  } catch (error) {
    console.error("[v0] Error checking user status:", error)
    return NextResponse.json({ error: "Failed to check user status" }, { status: 500 })
  }
}
