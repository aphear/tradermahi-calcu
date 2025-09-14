import { type NextRequest, NextResponse } from "next/server"
import { firebaseUtils } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Generate key API called")

    const { adminPassword, type, expiryDate, keyMode, customKey } = await request.json()

    console.log("[v0] Request data:", {
      type,
      expiryDate,
      keyMode,
      customKey: customKey ? "***" : undefined,
      hasPassword: !!adminPassword,
    })

    if (adminPassword !== "admin123") {
      console.log("[v0] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Admin authenticated, generating key...")

    let key: string
    if (keyMode === "custom" && customKey) {
      // Validate custom key
      if (customKey.length < 4) {
        return NextResponse.json({ error: "Custom key must be at least 4 characters long" }, { status: 400 })
      }

      // Check if custom key already exists
      const existingKeys = await firebaseUtils.getAllKeys()
      if (existingKeys[customKey]) {
        return NextResponse.json(
          { error: "Custom key already exists. Please choose a different key." },
          { status: 400 },
        )
      }

      key = await firebaseUtils.generateActivationKey(type, expiryDate, customKey)
    } else {
      // Generate random key
      key = await firebaseUtils.generateActivationKey(type, expiryDate)
    }

    console.log("[v0] Key generated successfully:", key)

    return NextResponse.json({
      success: true,
      key,
      message: "Activation key generated successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error generating key:", error)

    let errorMessage = "Failed to generate key"
    if (error?.message?.includes("PERMISSION_DENIED")) {
      errorMessage = "Firebase permission denied. Please check your Firebase Realtime Database rules."
    } else if (error?.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
