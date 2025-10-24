"use client"

import { useState, useEffect } from "react"
import { Palette, Moon, Sun, Check } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { AnimatedButton } from "@/components/ui/animated-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { currentThemeName, setTheme, availableThemes, isDarkMode, toggleDarkMode } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Get base themes (without light- prefix)
  const baseThemes = availableThemes.filter((theme) => !theme.name.startsWith("light-"))

  return (
    <div className="flex items-center gap-2">
      <AnimatedButton
        variant="ghost"
        size="icon"
        animation="subtle"
        className="w-9 h-9 rounded-full"
        onClick={toggleDarkMode}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isDarkMode ? 0 : 180 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.div>
        <span className="sr-only">Toggle dark mode</span>
      </AnimatedButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AnimatedButton variant="ghost" size="icon" animation="subtle" className="w-9 h-9 rounded-full">
            <Palette className="h-4 w-4" />
            <span className="sr-only">Switch theme</span>
          </AnimatedButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {baseThemes.map((theme) => {
            // Get the current theme name without light- prefix for comparison
            const currentBase = currentThemeName.replace("light-", "")
            const isActive = currentBase === theme.name

            // Get theme color based on name
            let themeColor = "#0EA5E9" // Default blue
            if (theme.name === "red") themeColor = "#ef4444"
            if (theme.name === "wave") themeColor = "#38BDF8"
            if (theme.name === "berry") themeColor = "#D53F8C"
            if (theme.name === "neon") themeColor = isDarkMode ? "#00FF9D" : "#00CC7A"
            if (theme.name === "cyberpunk") themeColor = "#FF8906"

            return (
              <DropdownMenuItem
                key={theme.name}
                onClick={() => setTheme(theme.name)}
                className={`flex items-center gap-2 ${isActive ? "bg-accent text-accent-foreground" : ""}`}
              >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeColor }} />
                <span className="flex-1">{theme.label}</span>
                {isActive && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
