import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./clientLayout"
import RouteGuard from "@/components/route-guard"
import "./globals.css" // Import globals.css at the top of the file

export const metadata: Metadata = {
  title: "MT Smart Calculator - Professional Trading Tools",
  description: "Advanced MT Smart Calculator with real-time analysis and comprehensive reporting",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClientLayout>
      <RouteGuard>{children}</RouteGuard>
    </ClientLayout>
  )
}
