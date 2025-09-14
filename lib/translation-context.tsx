"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTranslation } from "@/lib/languages"

interface TranslationContextType {
  currentLanguage: string
  setLanguage: (language: string) => void
  t: any
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("selectedLanguage")
    if (savedLanguage && ["en", "bn", "hi"].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const setLanguage = (language: string) => {
    setCurrentLanguage(language)
    if (isClient) {
      localStorage.setItem("selectedLanguage", language)
    }
  }

  const t = useTranslation(currentLanguage)

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t }}>{children}</TranslationContext.Provider>
  )
}

export function useTranslationContext() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslationContext must be used within a TranslationProvider")
  }
  return context
}
