"use client"

import { useTheme } from "@/lib/theme-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Palette } from "lucide-react"

export function ThemeShowcase() {
  const { theme, currentThemeName, isDarkMode } = useTheme()

  // Extract the base theme name (without light- prefix)
  const baseThemeName = currentThemeName.replace("light-", "")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Current Theme: {baseThemeName.charAt(0).toUpperCase() + baseThemeName.slice(1)}
        </CardTitle>
        <CardDescription>{isDarkMode ? "Dark Mode" : "Light Mode"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                <span className="text-xs">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.secondary }}></div>
                <span className="text-xs">Secondary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                <span className="text-xs">Accent</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Elements</h3>
            <div className="space-y-2">
              <Button
                size="sm"
                className="w-full"
                style={{
                  backgroundColor: theme.buttonBg,
                  color: theme.foreground,
                  borderColor: theme.border,
                }}
              >
                Button
              </Button>

              <div
                className="p-2 rounded-md text-xs"
                style={{
                  backgroundColor: theme.secondary,
                  color: theme.foreground,
                  border: `1px solid ${theme.border}`,
                }}
              >
                Card Element
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="mt-4 p-3 rounded-md text-center text-sm"
          style={{
            background: theme.gradient,
            color: theme.foreground,
          }}
          animate={{
            boxShadow: [
              `0 0 0 rgba(${Number.parseInt(theme.primary.slice(1, 3), 16)}, ${Number.parseInt(theme.primary.slice(3, 5), 16)}, ${Number.parseInt(theme.primary.slice(5, 7), 16)}, 0.3)`,
              `0 0 20px rgba(${Number.parseInt(theme.primary.slice(1, 3), 16)}, ${Number.parseInt(theme.primary.slice(3, 5), 16)}, ${Number.parseInt(theme.primary.slice(5, 7), 16)}, 0.6)`,
              `0 0 0 rgba(${Number.parseInt(theme.primary.slice(1, 3), 16)}, ${Number.parseInt(theme.primary.slice(3, 5), 16)}, ${Number.parseInt(theme.primary.slice(5, 7), 16)}, 0.3)`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          Gradient with Animation
        </motion.div>
      </CardContent>
    </Card>
  )
}
