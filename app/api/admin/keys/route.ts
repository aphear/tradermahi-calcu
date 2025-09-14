import { type NextRequest, NextResponse } from "next/server"
import { firebaseUtils } from "@/lib/firebase"

export async function DELETE(request: NextRequest) {
  try {
    const { adminPassword, key } = await request.json()

    if (adminPassword !== "TMXCALCU") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await firebaseUtils.deleteKey(key)

    return NextResponse.json({
      success: true,
      message: "Key deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting key:", error)
    return NextResponse.json(
      {
        error: "Failed to delete key",
      },
      { status: 500 },
    )
  }
}
