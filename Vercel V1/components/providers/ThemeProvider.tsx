"use client"

import type React from "react"
import { ThemeProvider as MioThemeProvider } from "@/lib/theme-context"

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <MioThemeProvider>{children}</MioThemeProvider>
}
