"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageSquare, Mic, ImageIcon, Code } from "lucide-react"

interface ModeSelectorProps {
  currentMode: "text" | "voice" | "generate" | "code"
  onModeChange: (mode: "text" | "voice" | "generate" | "code") => void
  disabled?: boolean
}

export function ModeSelector({ currentMode, onModeChange, disabled }: ModeSelectorProps) {
  const modes = [
    { id: "text" as const, icon: MessageSquare, label: "Text Chat" },
    { id: "voice" as const, icon: Mic, label: "Voice Chat" },
    { id: "generate" as const, icon: ImageIcon, label: "Generate Image" },
    { id: "code" as const, icon: Code, label: "Code Mode" },
  ]

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F] backdrop-blur-sm border-b border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-center gap-4">
          {modes.map(({ id, icon: Icon, label }) => (
            <motion.div key={id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => onModeChange(id)}
                variant={currentMode === id ? "default" : "outline"}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  currentMode === id
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-transparent hover:bg-gray-800 text-gray-300 border border-gray-700"
                }`}
                disabled={disabled}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
