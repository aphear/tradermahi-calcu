import { type NextRequest, NextResponse } from "next/server"
import { firebaseUtils } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    const adminPassword = request.headers.get("admin-password")

    if (adminPassword !== "admin123") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await firebaseUtils.getAllUsers()
    const keys = await firebaseUtils.getAllKeys()

    return NextResponse.json({ users, keys })
  } catch (error) {
    console.error("Error fetching admin data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch data",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { adminPassword, action, username } = await request.json()

    if (adminPassword !== "admin123") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    switch (action) {
      case "ban":
        await firebaseUtils.banUser(username)
        break
      case "unban":
        await firebaseUtils.unbanUser(username)
        break
      case "delete":
        await firebaseUtils.deleteUser(username)
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `User ${action} successful`,
    })
  } catch (error) {
    console.error("Error managing user:", error)
    return NextResponse.json(
      {
        error: "Failed to manage user",
      },
      { status: 500 },
    )
  }
}
