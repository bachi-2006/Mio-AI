"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Search, Trash2, Clock, MessageSquare, Code, ImageIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { staggerContainer, staggerItem, fadeIn, fadeInUp } from "@/lib/animation-variants"

interface HistoryEntry {
  id: string
  timestamp: Date
  preview: string
  messages: any[]
}

export function ChatHistory({ onSelect }: { onSelect: (messages: any[]) => void }) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    // Load chat history from localStorage
    try {
      const savedHistory = localStorage.getItem("chatHistory")
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory)
          // Convert string timestamps to Date objects
          const formattedHistory = parsed.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          }))
          setHistory(formattedHistory)
        } catch (error) {
          console.error("Error parsing chat history:", error)
          setHistory([])
          // Clear corrupted data
          localStorage.removeItem("chatHistory")
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      setHistory([])
    }
  }, [])

  const filteredHistory = history.filter((entry) => entry.preview.toLowerCase().includes(searchTerm.toLowerCase()))

  const deleteEntry = (id: string) => {
    const newHistory = history.filter((entry) => entry.id !== id)
    setHistory(newHistory)
    localStorage.setItem("chatHistory", JSON.stringify(newHistory))
  }

  const clearAllHistory = () => {
    setHistory([])
    localStorage.removeItem("chatHistory")
  }

  // Get the mode icon for a conversation
  const getModeIcon = (messages: any[]) => {
    if (!messages || messages.length === 0) return MessageSquare

    // Find the first message with a mode
    const messageWithMode = messages.find((msg) => msg.mode)

    if (!messageWithMode) return MessageSquare

    switch (messageWithMode.mode) {
      case "code":
        return Code
      case "image":
        return ImageIcon
      default:
        return MessageSquare
    }
  }

  return (
    <motion.div className="h-full flex flex-col" variants={fadeIn} initial="hidden" animate="visible">
      <motion.div
        className="p-4 border-b border-secondary-200 dark:border-secondary-800"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-secondary-900 dark:text-white">Conversation History</h2>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`pl-10 transition-all duration-300 ${isSearchFocused ? "ring-2 ring-primary-500" : ""}`}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={16} />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              onClick={() => setSearchTerm("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        {filteredHistory.length > 0 ? (
          <>
            <motion.div
              className="p-4 flex justify-end"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <AnimatedButton
                variant="outline"
                size="sm"
                animation="subtle"
                onClick={clearAllHistory}
                className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
              >
                <Trash2 size={14} className="mr-1" />
                Clear All
              </AnimatedButton>
            </motion.div>

            <motion.div
              className="space-y-2 px-4 pb-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              transition={{ delayChildren: 0.3, staggerChildren: 0.1 }}
            >
              <AnimatePresence>
                {filteredHistory.map((entry) => {
                  const IconComponent = getModeIcon(entry.messages)
                  const isSelected = selectedEntry === entry.id

                  return (
                    <motion.div
                      key={entry.id}
                      variants={staggerItem}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        backgroundColor: isSelected ? "" : "rgba(var(--primary-500), 0.05)",
                      }}
                      className={`p-4 rounded-lg cursor-pointer border transition-all duration-300 ${
                        isSelected
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                          : "border-secondary-200 dark:border-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-800"
                      }`}
                      onClick={() => {
                        setSelectedEntry(entry.id)
                        onSelect(entry.messages)
                      }}
                      layout
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <motion.div
                            className={`p-2 rounded-full ${
                              isSelected
                                ? "bg-primary-500 text-white"
                                : "bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <IconComponent size={16} />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-secondary-900 dark:text-white line-clamp-1">
                              {entry.preview}
                            </p>
                            <div className="flex items-center mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                              <Clock size={12} className="mr-1" />
                              <span>{format(new Date(entry.timestamp), "MMM d, yyyy h:mm a")}</span>
                            </div>
                          </div>
                        </div>
                        <AnimatedButton
                          variant="ghost"
                          size="icon"
                          animation="subtle"
                          className="h-8 w-8 text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteEntry(entry.id)
                          }}
                        >
                          <Trash2 size={14} />
                        </AnimatedButton>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center h-full p-4 text-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="p-4 rounded-full bg-secondary-100 dark:bg-secondary-800 mb-4"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <MessageSquare className="h-8 w-8 text-secondary-400" />
            </motion.div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">No conversations yet</h3>
            <p className="text-secondary-500 dark:text-secondary-400 max-w-md">
              Your conversation history will appear here once you start chatting with Mio AI.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
