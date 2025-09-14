"use client"

import type React from "react"
import { Suspense } from "react"
import { Rajdhani, Poppins, Roboto_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { TranslationProvider } from "@/lib/translation-context"
import "./globals.css"

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto-mono",
})

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`font-sans ${rajdhani.variable} ${poppins.variable} ${robotoMono.variable}`}>
        <TranslationProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </TranslationProvider>
        <Analytics />
      </body>
    </html>
  )
}
