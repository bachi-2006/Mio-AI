"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { analyticsStore, type UserSession } from "@/lib/analytics"
import { useTheme } from "@/lib/theme-context"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"

export function Analytics() {
  const [sessions, setSessions] = useState<UserSession[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    const updateSessions = () => {
      setSessions(analyticsStore.getSessions())
    }

    updateSessions()
    // Update every 30 seconds
    const interval = setInterval(updateSessions, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleGreetUser = (session: UserSession) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel() // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(`Hello ${session.name}! Welcome to SATURDAY.`)
      // Get available voices
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice =
        voices.find((voice) => voice.lang === "en-US" && voice.name.includes("Google")) ||
        voices.find((voice) => voice.lang === "en-US")

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.rate = 0.9 // Slightly slower for clarity
      utterance.pitch = 1.0 // Natural pitch
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg mb-4"
      style={{ backgroundColor: theme.secondary }}
    >
      <h3 className="text-xl font-bold mb-4 flex items-center justify-between" style={{ color: theme.primary }}>
        <span>Active Sessions</span>
        <span className="text-sm font-normal text-gray-400">
          {sessions.length} user{sessions.length !== 1 ? "s" : ""} online
        </span>
      </h3>
      <div className="space-y-4 max-h-[200px] overflow-y-auto">
        {sessions.map((session) => (
          <motion.div
            key={session.loginTime}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-lg border"
            style={{
              borderColor: theme.border,
              backgroundColor: `${theme.background}40`,
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{session.name}</p>
                <p className="text-sm text-gray-400">{session.email}</p>
                <p className="text-xs text-gray-500">Logged in: {new Date(session.loginTime).toLocaleString()}</p>
              </div>
              <Button
                onClick={() => handleGreetUser(session)}
                variant="ghost"
                size="icon"
                className="hover:bg-gray-700/50"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
        {sessions.length === 0 && <p className="text-center text-gray-400">No active sessions</p>}
      </div>
    </motion.div>
  )
}
