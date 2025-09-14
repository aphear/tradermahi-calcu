import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sessionData } = await request.json()

    if (!sessionData) {
      return NextResponse.json({ valid: false, error: "No session data provided" }, { status: 400 })
    }

    // Parse session data
    let session
    try {
      session = typeof sessionData === "string" ? JSON.parse(sessionData) : sessionData
    } catch (error) {
      return NextResponse.json({ valid: false, error: "Invalid session format" }, { status: 400 })
    }

    // Check if session has required fields
    if (!session.username || !session.activationKey || !session.expiryTime) {
      return NextResponse.json({ valid: false, error: "Incomplete session data" }, { status: 400 })
    }

    // Check if session is expired
    if (new Date(session.expiryTime) < new Date()) {
      return NextResponse.json({ valid: false, error: "Session expired" }, { status: 401 })
    }

    // Session is valid
    return NextResponse.json({ valid: true, username: session.username })
  } catch (error) {
    console.error("[v0] Session validation error:", error)
    return NextResponse.json({ valid: false, error: "Session validation failed" }, { status: 500 })
  }
}
