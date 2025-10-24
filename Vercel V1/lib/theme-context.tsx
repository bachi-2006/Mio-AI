"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Theme {
  name: string
  background: string
  foreground: string
  primary: string
  secondary: string
  accent: string
  border: string
  gradient: string
  buttonBg: string
  buttonHover: string
}

// Dark themes
export const blueTheme: Theme = {
  name: "blue",
  background: "#0A1120",
  foreground: "#ffffff",
  primary: "#0EA5E9",
  secondary: "#1E293B",
  accent: "#60A5FA",
  border: "#334155",
  gradient: "linear-gradient(180deg, rgba(12, 74, 110, 0.9) 0%, rgba(3, 27, 52, 0.95) 100%)",
  buttonBg: "rgb(25, 62, 97)",
  buttonHover: "rgb(37, 99, 155)",
}

export const redTheme: Theme = {
  name: "red",
  background: "#0A0A0F",
  foreground: "#ffffff",
  primary: "#ef4444",
  secondary: "#1a1b26",
  accent: "#3b82f6",
  border: "#1f2937",
  gradient: "linear-gradient(180deg, rgba(69, 0, 24, 0.9) 0%, rgba(20, 8, 0, 0.95) 100%)",
  buttonBg: "#ef4444",
  buttonHover: "#dc2626",
}

export const waveTheme: Theme = {
  name: "wave",
  background: "#0F172A",
  foreground: "#ffffff",
  primary: "#38BDF8",
  secondary: "#1E293B",
  accent: "#7DD3FC",
  border: "#334155",
  gradient: "linear-gradient(180deg, rgba(12, 74, 110, 0.9) 0%, rgba(3, 27, 52, 0.95) 100%)",
  buttonBg: "#0284C7",
  buttonHover: "#0369A1",
}

// Light themes
export const lightBlueTheme: Theme = {
  name: "light-blue",
  background: "#F0F9FF",
  foreground: "#0F172A",
  primary: "#0EA5E9",
  secondary: "#E0F2FE",
  accent: "#38BDF8",
  border: "#BAE6FD",
  gradient: "linear-gradient(180deg, rgba(224, 242, 254, 0.9) 0%, rgba(186, 230, 253, 0.95) 100%)",
  buttonBg: "#0EA5E9",
  buttonHover: "#0284C7",
}

export const lightRedTheme: Theme = {
  name: "light-red",
  background: "#FEF2F2",
  foreground: "#0F172A",
  primary: "#EF4444",
  secondary: "#FEE2E2",
  accent: "#F87171",
  border: "#FECACA",
  gradient: "linear-gradient(180deg, rgba(254, 226, 226, 0.9) 0%, rgba(254, 202, 202, 0.95) 100%)",
  buttonBg: "#EF4444",
  buttonHover: "#DC2626",
}

export const lightWaveTheme: Theme = {
  name: "light-wave",
  background: "#F0F9FF",
  foreground: "#0F172A",
  primary: "#0EA5E9",
  secondary: "#E0F2FE",
  accent: "#38BDF8",
  border: "#BAE6FD",
  gradient: "linear-gradient(180deg, rgba(224, 242, 254, 0.9) 0%, rgba(186, 230, 253, 0.95) 100%)",
  buttonBg: "#0EA5E9",
  buttonHover: "#0284C7",
}

// New themes
export const berryTheme: Theme = {
  name: "berry",
  background: "#1A0B1C",
  foreground: "#ffffff",
  primary: "#D53F8C",
  secondary: "#2D1A30",
  accent: "#F687B3",
  border: "#4A2D4F",
  gradient: "linear-gradient(180deg, rgba(213, 63, 140, 0.9) 0%, rgba(159, 43, 104, 0.95) 100%)",
  buttonBg: "#D53F8C",
  buttonHover: "#B83280",
}

export const lightBerryTheme: Theme = {
  name: "light-berry",
  background: "#FDF2F8",
  foreground: "#0F172A",
  primary: "#D53F8C",
  secondary: "#FCE7F3",
  accent: "#F472B6",
  border: "#FBCFE8",
  gradient: "linear-gradient(180deg, rgba(252, 231, 243, 0.9) 0%, rgba(251, 207, 232, 0.95) 100%)",
  buttonBg: "#D53F8C",
  buttonHover: "#B83280",
}

// Neon theme
export const neonTheme: Theme = {
  name: "neon",
  background: "#0D0D0D",
  foreground: "#ffffff",
  primary: "#00FF9D",
  secondary: "#1A1A1A",
  accent: "#FF00FF",
  border: "#333333",
  gradient: "linear-gradient(180deg, rgba(0, 255, 157, 0.2) 0%, rgba(255, 0, 255, 0.2) 100%)",
  buttonBg: "#00FF9D",
  buttonHover: "#00CC7A",
}

export const lightNeonTheme: Theme = {
  name: "light-neon",
  background: "#F5F5F5",
  foreground: "#0D0D0D",
  primary: "#00CC7A",
  secondary: "#E6E6E6",
  accent: "#CC00CC",
  border: "#CCCCCC",
  gradient: "linear-gradient(180deg, rgba(0, 204, 122, 0.2) 0%, rgba(204, 0, 204, 0.2) 100%)",
  buttonBg: "#00CC7A",
  buttonHover: "#00994D",
}

// Cyberpunk theme
export const cyberpunkTheme: Theme = {
  name: "cyberpunk",
  background: "#0F0E17",
  foreground: "#FFFFFE",
  primary: "#FF8906",
  secondary: "#1A1A2E",
  accent: "#F25F4C",
  border: "#2E2F3E",
  gradient: "linear-gradient(180deg, rgba(255, 137, 6, 0.2) 0%, rgba(242, 95, 76, 0.2) 100%)",
  buttonBg: "#FF8906",
  buttonHover: "#E67E00",
}

export const lightCyberpunkTheme: Theme = {
  name: "light-cyberpunk",
  background: "#FFFFFE",
  foreground: "#0F0E17",
  primary: "#FF8906",
  secondary: "#F2F2F2",
  accent: "#F25F4C",
  border: "#E6E6E6",
  gradient: "linear-gradient(180deg, rgba(255, 137, 6, 0.2) 0%, rgba(242, 95, 76, 0.2) 100%)",
  buttonBg: "#FF8906",
  buttonHover: "#E67E00",
}

interface ThemeContextType {
  theme: Theme
  currentThemeName: string
  setTheme: (themeName: string) => void
  availableThemes: { name: string; label: string }[]
  testerMode: boolean
  setTesterMode: (value: boolean) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: blueTheme,
  currentThemeName: "blue",
  setTheme: () => {},
  availableThemes: [
    { name: "blue", label: "Blue" },
    { name: "red", label: "Red" },
    { name: "wave", label: "Wave" },
    { name: "berry", label: "Berry" },
    { name: "neon", label: "Neon" },
    { name: "cyberpunk", label: "Cyberpunk" },
  ],
  testerMode: false,
  setTesterMode: () => {},
  isDarkMode: true,
  toggleDarkMode: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentThemeName, setCurrentThemeName] = useState("blue")
  const [theme, setThemeState] = useState<Theme>(blueTheme)
  const [testerMode, setTesterMode] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const availableThemes = [
    { name: "blue", label: "Blue" },
    { name: "red", label: "Red" },
    { name: "wave", label: "Wave" },
    { name: "berry", label: "Berry" },
    { name: "neon", label: "Neon" },
    { name: "cyberpunk", label: "Cyberpunk" },
  ]

  // Load theme from localStorage on initial load
  useEffect(() => {
    try {
      // Check if we're in the browser environment
      if (typeof window !== "undefined") {
        const storedTheme = localStorage.getItem("theme")
        const storedDarkMode = localStorage.getItem("darkMode")

        // Set dark mode based on stored preference or system preference
        if (storedDarkMode) {
          setIsDarkMode(storedDarkMode === "true")
        } else {
          // Check system preference if no stored preference
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
          setIsDarkMode(prefersDark)
        }

        // Apply theme based on stored preference or default
        if (storedTheme) {
          setCurrentThemeName(storedTheme)
          applyTheme(storedTheme, storedDarkMode === "true")
        } else {
          // Default theme based on mode
          applyTheme(isDarkMode ? "blue" : "light-blue", isDarkMode)
        }
      }
    } catch (error) {
      console.error("Error initializing theme:", error)
      // Use default theme if there's an error
      applyTheme(isDarkMode ? "blue" : "light-blue", isDarkMode)
    }
  }, [])

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change if user hasn't set a preference
      if (!localStorage.getItem("darkMode")) {
        setIsDarkMode(e.matches)

        // Update theme based on new mode
        const baseThemeName = currentThemeName.replace("light-", "")
        applyTheme(baseThemeName, e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [currentThemeName])

  const applyTheme = (themeName: string, isDark: boolean) => {
    // If we're switching modes, convert the theme name
    let finalThemeName = themeName
    if (isDark && themeName.startsWith("light-")) {
      finalThemeName = themeName.replace("light-", "")
    } else if (!isDark && !themeName.startsWith("light-")) {
      finalThemeName = `light-${themeName}`
    }

    setCurrentThemeName(finalThemeName)

    switch (finalThemeName) {
      case "red":
        setThemeState(redTheme)
        break
      case "light-red":
        setThemeState(lightRedTheme)
        break
      case "wave":
        setThemeState(waveTheme)
        break
      case "light-wave":
        setThemeState(lightWaveTheme)
        break
      case "berry":
        setThemeState(berryTheme)
        break
      case "light-berry":
        setThemeState(lightBerryTheme)
        break
      case "neon":
        setThemeState(neonTheme)
        break
      case "light-neon":
        setThemeState(lightNeonTheme)
        break
      case "cyberpunk":
        setThemeState(cyberpunkTheme)
        break
      case "light-cyberpunk":
        setThemeState(lightCyberpunkTheme)
        break
      case "light-blue":
        setThemeState(lightBlueTheme)
        break
      case "blue":
      default:
        setThemeState(blueTheme)
        break
    }

    // Update document class for global styling
    if (isDark) {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    }
  }

  const setTheme = (themeName: string) => {
    try {
      localStorage.setItem("theme", themeName)
      applyTheme(themeName, isDarkMode)
    } catch (error) {
      console.error("Error saving theme to localStorage:", error)
    }
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)

    try {
      localStorage.setItem("darkMode", String(newMode))

      // Convert current theme to appropriate mode
      const baseThemeName = currentThemeName.replace("light-", "")
      applyTheme(baseThemeName, newMode)
    } catch (error) {
      console.error("Error saving dark mode preference to localStorage:", error)
    }
  }

  useEffect(() => {
    try {
      const storedTesterMode = localStorage.getItem("testerMode")
      if (storedTesterMode) {
        setTesterMode(storedTesterMode === "true")
      }
    } catch (error) {
      console.error("Error loading tester mode from localStorage:", error)
    }
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentThemeName,
        setTheme,
        availableThemes,
        testerMode,
        setTesterMode: (value) => {
          setTesterMode(value)
          try {
            localStorage.setItem("testerMode", String(value))
          } catch (error) {
            console.error("Error saving tester mode to localStorage:", error)
          }
        },
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
