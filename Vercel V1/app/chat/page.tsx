"use client"

import React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Code,
  ImageIcon,
  History,
  LogOut,
  AlertTriangle,
  Settings,
  Menu,
  Moon,
  Sun,
  ChevronDown,
  Sparkles,
  Clock,
  CloudRain,
  Mic,
  ImportIcon as Translate,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
// Update the import to use the provider
import { useAuth } from "@/components/providers/AuthProvider"
import { useTheme } from "@/lib/theme-context"
import { ChatMessage } from "../components/chat-message"
import { ChatHistory } from "../components/chat-history"
import { AnimatedLoader } from "@/components/ui/animated-loader"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Logo } from "../components/logo"
import { VoiceInput } from "../components/voice-input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { getTelanganaWeather } from "@/lib/services/utility-service"
import { stripFormatting } from "@/lib/text-formatter"
import {
  fadeIn,
  fadeInUp,
  fadeInDown,
  staggerContainer,
  staggerItem,
  pulse,
  fadeInLeft,
  fadeInRight,
} from "@/lib/animation-variants"
import { format } from "date-fns"
import { ImageGeneration } from "../components/image-generation"
import { TranslationMode } from "../components/translation-mode"

// Memoize the Sidebar component to prevent unnecessary re-renders
const Sidebar = React.memo(
  ({
    user,
    logout,
    router,
    isDarkMode,
    toggleDarkMode,
    currentTime,
    currentWeather,
    isLoadingWeather,
    mode,
    setMode,
  }: {
    user: any
    logout: () => void
    router: any
    isDarkMode: boolean
    toggleDarkMode: () => void
    currentTime: string
    currentWeather: any
    isLoadingWeather: boolean
    mode: Mode
    setMode: (mode: Mode) => void
  }) => {
    const handleLogout = useCallback(() => {
      logout()
      router.push("/")
    }, [logout, router])

    return (
      <motion.div
        className="h-full flex flex-col bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-800"
        variants={fadeInLeft}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      >
        {/* Sidebar Header */}
        <motion.div
          className="p-4 border-b border-secondary-200 dark:border-secondary-800"
          variants={fadeInDown}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <h1 className="text-xl font-bold text-secondary-900 dark:text-white">Mio AI</h1>
          </div>
        </motion.div>

        {/* User Profile */}
        <motion.div
          className="p-4 border-b border-secondary-200 dark:border-secondary-800"
          variants={fadeInDown}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary-500/20">
              <AvatarImage
                src={user.picture || `https://ui-avatars.com/api/?name=${user.name || "User"}&background=random`}
              />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-secondary-900 dark:text-white truncate">{user.name || "User"}</p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">{user.email}</p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <motion.div className="space-y-1" variants={staggerContainer} initial="hidden" animate="visible">
                  <motion.div variants={staggerItem}>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <Button variant="ghost" className="w-full justify-start" onClick={toggleDarkMode}>
                      {isDarkMode ? (
                        <>
                          <Sun className="h-4 w-4 mr-2" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="h-4 w-4 mr-2" />
                          Dark Mode
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </PopoverContent>
            </Popover>
          </div>
        </motion.div>

        {/* Time and Weather */}
        <motion.div
          className="p-4 border-b border-secondary-200 dark:border-secondary-800"
          variants={fadeInDown}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-secondary-700 dark:text-secondary-300">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">{currentTime}</span>
            </div>
          </div>

          {currentWeather && (
            <div className="flex items-center text-secondary-700 dark:text-secondary-300">
              <CloudRain className="h-4 w-4 mr-2" />
              <span className="text-sm">
                {currentWeather.location}, Telangana: {currentWeather.temperature}°C, {currentWeather.description}
              </span>
            </div>
          )}

          {isLoadingWeather && (
            <div className="flex items-center text-secondary-700 dark:text-secondary-300">
              <AnimatedLoader type="dots" size="sm" />
              <span className="text-sm ml-2">Loading Telangana weather...</span>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <motion.nav
          className="flex-1 overflow-y-auto p-2"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
          layoutId="sidebar-nav"
          layout="preserve-aspect"
        >
          <div className="space-y-1">
            {[
              { id: "chat" as const, icon: MessageSquare, label: "Chat" },
              { id: "code" as const, icon: Code, label: "Code" },
              { id: "voice" as const, icon: Mic, label: "Voice" },
              { id: "image" as const, icon: ImageIcon, label: "Image" },
              { id: "history" as const, icon: History, label: "History" },
              { id: "translate" as const, icon: Translate, label: "Translate" },
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === item.id
                    ? "bg-primary-100 text-primary-900 dark:bg-primary-900/20 dark:text-primary-300"
                    : "text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-800"
                }`}
                variants={staggerItem}
                whileHover={{
                  scale: 1.02,
                  backgroundColor:
                    mode === item.id ? "" : isDarkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(241, 245, 249, 0.8)",
                }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.nav>

        {/* Settings */}
        <motion.div
          className="p-4 border-t border-secondary-200 dark:border-secondary-800"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <AnimatedButton variant="outline" animation="subtle" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </AnimatedButton>
        </motion.div>
      </motion.div>
    )
  },
)

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  mode?: string
  imageUrl?: string
  error?: boolean
  fallbackUsed?: boolean
}

type Mode = "chat" | "code" | "image" | "history" | "voice" | "translate"

export default function ChatPage() {
  // Fix the side drawer glitch by updating the state management
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [mode, setMode] = useState<Mode>("chat")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(true) // Default to true for automatic speaking
  const [previousMode, setPreviousMode] = useState<Mode>("chat")
  const [imageGenerationFailed, setImageGenerationFailed] = useState(false)
  const [currentTime, setCurrentTime] = useState(format(new Date(), "h:mm a"))
  const [currentWeather, setCurrentWeather] = useState<any>(null)
  const [isLoadingWeather, setIsLoadingWeather] = useState(true)
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true)
  const [pageLoading, setPageLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme, currentThemeName, isDarkMode, toggleDarkMode } = useTheme()
  const synthesis = useRef<SpeechSynthesis | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const lastResponseRef = useRef<string>("")
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if ("speechSynthesis" in window) {
          synthesis.current = window.speechSynthesis

          // Pre-load voices to avoid issues later
          const loadVoices = () => {
            // Just accessing voices can help initialize the speech synthesis system
            const voices = synthesis.current?.getVoices() || []
            console.log(`Loaded ${voices.length} voices for speech synthesis`)
          }

          // Chrome needs this event, other browsers might not
          if (synthesis.current.onvoiceschanged !== undefined) {
            synthesis.current.onvoiceschanged = loadVoices
          }

          // Try to load voices immediately as well
          loadVoices()
        } else {
          console.warn("Speech synthesis not supported in this browser")
        }
      } catch (error) {
        console.error("Error initializing speech synthesis:", error)
      }
    }

    return () => {
      if (synthesis.current) {
        try {
          synthesis.current.cancel()
        } catch (error) {
          console.error("Error canceling speech synthesis:", error)
        }
      }
    }
  }, [])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), "h:mm a"))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Get Telangana weather directly
  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoadingWeather(true)
      try {
        const weather = await getTelanganaWeather()
        if (weather) {
          setCurrentWeather(weather)
        }
      } catch (error) {
        console.error("Error fetching weather:", error)
      } finally {
        setIsLoadingWeather(false)
      }
    }

    fetchWeather()
  }, [])

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Greet the user when they first load the page
    if (user && synthesis.current) {
      const greeting = `Welcome, ${user.name || "User"}! How can I assist you today?`
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: greeting,
        timestamp: new Date(),
        mode: "chat",
      }

      // Add a slight delay for the welcome animation
      setTimeout(() => {
        setMessages([welcomeMessage])
        setShowWelcomeAnimation(false)
        lastResponseRef.current = greeting

        // Focus the input field
        setTimeout(() => {
          inputRef.current?.focus()
        }, 500)
      }, 2000)
    }
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Clear messages when switching modes
    if (mode !== previousMode && mode !== "history") {
      const modeMessage =
        mode === "translate"
          ? "You are now in translate mode. Enter text to translate between languages."
          : mode === "voice"
            ? "You are now in voice mode. Speak or type your message, and I'll read my responses aloud automatically."
            : `You are now in ${mode} mode. How can I help you?`

      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: modeMessage,
          timestamp: new Date(),
          mode,
        },
      ])
      setPreviousMode(mode)
      setImageGenerationFailed(false)
      lastResponseRef.current = modeMessage

      // Enable auto-speak in voice mode
      if (mode === "voice") {
        setAutoSpeakEnabled(true)
        // Speak the welcome message
        setTimeout(() => {
          speakResponse(modeMessage)
        }, 500)
      } else {
        // Turn off speaking when leaving voice mode
        stopSpeaking()
        setIsSpeaking(false)
      }

      // Focus the input field after mode change
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [mode, previousMode])

  // Fix the speakResponse function to handle multiple paragraphs and implement automatic voice output
  const speakResponse = (text: string) => {
    if (!synthesis.current) {
      console.error("Speech synthesis not available")
      setIsSpeaking(false)
      return
    }

    // Cancel any ongoing speech
    try {
      stopSpeaking()
    } catch (error) {
      console.error("Error stopping previous speech:", error)
    }

    // Strip formatting from text before speaking
    const plainText = stripFormatting(text)

    // Safety check for empty text
    if (!plainText || plainText.trim() === "") {
      console.warn("Empty text provided to speech synthesis")
      setIsSpeaking(false)
      return
    }

    // Break text into smaller chunks (not just sentences)
    const chunks = plainText.match(/[^.!?]+[.!?]+|[^.!?]+/g) || [plainText]

    setIsSpeaking(true)

    try {
      // Get all available voices
      const voices = synthesis.current.getVoices()

      // Find Google UK English Female voice
      const ukFemaleVoice = voices.find(
        (v) =>
          v.name.includes("Google UK English Female") ||
          (v.lang === "en-GB" && v.name.toLowerCase().includes("female")),
      )

      // If the voice isn't found, try to use any en-GB voice as fallback
      const fallbackVoice =
        voices.find((v) => v.lang === "en-GB") ||
        voices.find((v) => v.lang.startsWith("en")) ||
        (voices.length > 0 ? voices[0] : null)

      // Use UK Female voice or fallback
      const voiceToUse = ukFemaleVoice || fallbackVoice

      if (!voiceToUse) {
        console.warn("No suitable voice found for speech synthesis")
      }

      // Function to speak chunks sequentially with better error handling
      const speakNextChunk = (index: number) => {
        // Exit condition
        if (index >= chunks.length || !synthesis.current) {
          setIsSpeaking(false)
          return
        }

        try {
          const chunk = chunks[index].trim()
          if (!chunk) {
            // Skip empty chunks
            speakNextChunk(index + 1)
            return
          }

          const utterance = new SpeechSynthesisUtterance(chunk)

          // Set voice properties
          utterance.rate = 0.9 // Slightly slower for better clarity
          utterance.pitch = 1.0

          if (voiceToUse) {
            utterance.voice = voiceToUse
            // Ensure the language matches the voice
            utterance.lang = voiceToUse.lang
          }

          // Improved error handling
          utterance.onend = () => {
            // Move to the next chunk when this one finishes
            speakNextChunk(index + 1)
          }

          utterance.onerror = (event) => {
            console.error("Speech synthesis error:", event)

            // Log detailed error info
            if (event instanceof ErrorEvent) {
              console.error("Error message:", event.message)
            }

            // Try to continue with next chunk despite error
            if (index + 1 < chunks.length) {
              console.log(`Attempting to continue with next chunk (${index + 1}/${chunks.length})`)
              setTimeout(() => speakNextChunk(index + 1), 500)
            } else {
              // Reset speaking state if we can't continue
              setIsSpeaking(false)
            }
          }

          // Store the current utterance for potential cancellation
          currentUtteranceRef.current = utterance

          // Speak with a small delay between chunks
          setTimeout(() => {
            if (synthesis.current) {
              synthesis.current.speak(utterance)
            }
          }, 100)
        } catch (error) {
          console.error(`Error speaking chunk ${index}:`, error)

          // Try to recover by moving to next chunk
          if (index + 1 < chunks.length) {
            setTimeout(() => speakNextChunk(index + 1), 500)
          } else {
            setIsSpeaking(false)
          }
        }
      }

      // Start speaking the first chunk
      speakNextChunk(0)
    } catch (error) {
      console.error("Fatal error in speech synthesis:", error)
      setIsSpeaking(false)
      toast({
        title: "Speech Synthesis Error",
        description: "There was a problem with text-to-speech. Please try again.",
        variant: "destructive",
      })
    }
  }

  const stopSpeaking = () => {
    if (synthesis.current) {
      try {
        // Cancel any ongoing speech
        synthesis.current.cancel()

        // Clear the current utterance reference
        currentUtteranceRef.current = null

        // Always reset the speaking state
        setIsSpeaking(false)
      } catch (error) {
        console.error("Error stopping speech synthesis:", error)
        // Force the speaking state to false even if there was an error
        setIsSpeaking(false)
      }
    }
  }

  const generateImage = async (prompt: string) => {
    try {
      const response = await fetch("https://api.runware.ai/v1/generate/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer tHFg5w2lpN03QhV6mIgbVWL29fvStLF3",
        },
        body: JSON.stringify({
          prompt: prompt,
          width: 512,
          height: 512,
          num_images: 1,
          model: "stable-diffusion-xl",
          guidance_scale: 7.5,
          negative_prompt: "blurry, distorted, low quality, ugly, bad anatomy",
        }),
      })

      if (!response.ok) {
        throw new Error(`Image generation failed: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.images || data.images.length === 0) {
        throw new Error("No image returned from model")
      }

      // runware API returns base64 encoded images
      const imageUrl = `data:image/jpeg;base64,${data.images[0]}`

      setImageGenerationFailed(false)
      return {
        imageUrl,
        description: "Here's the image I generated based on your prompt.",
        fallbackUsed: false,
      }
    } catch (error) {
      console.error("Image generation failed:", error)
      setImageGenerationFailed(true)

      // No fallback, just throw the error to be handled by the caller
      throw new Error("Image generation failed. Please try again later or with a different prompt.")
    }
  }

  const handleSubmit = useCallback(
    async (e?: React.FormEvent, voiceInput?: string) => {
      if (e) e.preventDefault()

      const userPrompt = voiceInput || input
      if (!userPrompt.trim() || isProcessing) return

      // Stop any ongoing speech when submitting a new message
      stopSpeaking()

      setIsProcessing(true)
      if (!voiceInput) setInput("")

      try {
        const messageId = Date.now().toString()
        const newMessage: Message = {
          id: messageId,
          role: "user",
          content: userPrompt,
          timestamp: new Date(),
          mode,
        }
        setMessages((prev) => [...prev, newMessage])

        let data: any = null

        if (mode === "code") {
          const response = await fetch("/api/generate-code", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: userPrompt,
            }),
          })

          if (!response.ok) {
            throw new Error(`Failed to process code request: ${response.statusText}`)
          }

          data = await response.json()
        } else if (mode === "image") {
          try {
            data = await generateImage(userPrompt)
          } catch (error) {
            console.error("Image generation failed:", error)
            data = {
              description:
                "I couldn't generate the image you requested. Please try again later or with a different prompt.",
              error: true,
            }
          }
        } else {
          // Regular chat mode
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: userPrompt,
            }),
          })

          if (!response.ok) {
            throw new Error(`Failed to process message: ${response.statusText}`)
          }

          data = await response.json()
        }

        // Safely extract content from the response
        const responseContent =
          mode === "image"
            ? data?.description || "Here's the generated image:"
            : data?.response || data?.code || "I'm not sure how to respond to that."

        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
          mode,
          imageUrl: mode === "image" ? data?.imageUrl : undefined,
          error: data?.error || false,
          fallbackUsed: data?.fallbackUsed || false,
        }

        setMessages((prev) => [...prev, assistantMessage])
        lastResponseRef.current = responseContent

        // If in voice mode and auto-speak is enabled, speak the response
        if (mode === "voice" && autoSpeakEnabled) {
          speakResponse(responseContent)
        }

        // Save to history
        try {
          const history = JSON.parse(localStorage.getItem("chatHistory") || "[]")
          history.unshift({
            id: Date.now().toString(),
            timestamp: new Date(),
            preview: userPrompt.substring(0, 50) + (userPrompt.length > 50 ? "..." : ""),
            messages: [...messages, newMessage, assistantMessage],
          })
          localStorage.setItem("chatHistory", JSON.stringify(history.slice(0, 50))) // Keep only the last 50 conversations
        } catch (error) {
          console.error("Error saving to chat history:", error)
          // Don't let history errors affect the main functionality
        }

        // Focus the input field after response
        setTimeout(() => {
          inputRef.current?.focus()
        }, 100)
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive",
        })

        // Add error message to the chat
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "An unexpected error occurred"}. Please try again.`,
            timestamp: new Date(),
            mode,
            error: true,
          },
        ])
      } finally {
        setIsProcessing(false)
      }
    },
    [input, isProcessing, mode, messages, toast, autoSpeakEnabled],
  )

  const handleRegenerate = useCallback(
    async (messageIndex: number) => {
      if (isProcessing) return

      // Stop any ongoing speech when regenerating
      stopSpeaking()

      setIsProcessing(true)

      try {
        // Get the original user message
        const userMessage = messages[messageIndex - 1]
        if (!userMessage || userMessage.role !== "user") {
          throw new Error("Cannot find the original user message")
        }

        // Remove the assistant message that we're regenerating
        setMessages((prev) => prev.slice(0, messageIndex))

        // Re-submit the original user message
        const currentInput = userMessage.content

        let data: any = null

        if (mode === "code") {
          const response = await fetch("/api/generate-code", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: currentInput,
            }),
          })

          if (!response.ok) {
            throw new Error(`Failed to process code request: ${response.statusText}`)
          }

          data = await response.json()
        } else if (mode === "image") {
          try {
            data = await generateImage(currentInput)
          } catch (error) {
            console.error("Image generation failed:", error)
            data = {
              description:
                "I couldn't generate the image you requested. Please try again later or with a different prompt.",
              error: true,
            }
          }
        } else {
          // Regular chat mode
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: currentInput,
            }),
          })

          if (!response.ok) {
            throw new Error(`Failed to process message: ${response.statusText}`)
          }

          data = await response.json()
        }

        // Safely extract content from the response
        const responseContent =
          mode === "image"
            ? data?.description || "Here's the generated image:"
            : data?.response || data?.code || "I'm not sure how to respond to that."

        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
          mode,
          imageUrl: mode === "image" ? data?.imageUrl : undefined,
          error: data?.error || false,
          fallbackUsed: data?.fallbackUsed || false,
        }

        setMessages((prev) => [...prev, assistantMessage])
        lastResponseRef.current = responseContent

        // If in voice mode and auto-speak is enabled, speak the regenerated response
        if (mode === "voice" && autoSpeakEnabled) {
          speakResponse(responseContent)
        }
      } catch (error) {
        console.error("Error regenerating response:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to regenerate response",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [messages, isProcessing, mode, toast, autoSpeakEnabled],
  )

  const handleVoiceInput = (text: string) => {
    // Stop any ongoing speech when receiving new voice input
    stopSpeaking()
    handleSubmit(undefined, text)
  }

  const handleSpeakToggle = (speaking: boolean) => {
    setAutoSpeakEnabled(speaking)

    if (!speaking) {
      // If turning off auto-speak, stop any ongoing speech
      stopSpeaking()
    } else if (lastResponseRef.current && mode === "voice") {
      // If turning on auto-speak in voice mode, speak the last response
      speakResponse(lastResponseRef.current)
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    })
  }

  const loadHistory = (historyMessages: Message[]) => {
    setMessages(historyMessages)
    setMode("chat") // Switch back to chat mode when loading history

    // Update last response for TTS
    const lastAssistantMessage = historyMessages.filter((msg) => msg.role === "assistant").pop()

    if (lastAssistantMessage) {
      lastResponseRef.current = lastAssistantMessage.content
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-resize textarea as user types
  const autoResizeTextarea = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`
    }
  }

  // Show page loading animation
  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Logo size={80} animated={true} />
          <motion.h1
            className="mt-6 text-3xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Mio AI
          </motion.h1>
          <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <AnimatedLoader type="dots" size="lg" text="Loading your experience..." />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-secondary-900">
        <AnimatedLoader type="logo" size="lg" text="Loading Mio AI..." />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-secondary-50 dark:bg-secondary-950 overflow-hidden">
      {/* Welcome animation */}
      <AnimatePresence>
        {showWelcomeAnimation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Logo size={100} animated={true} />
              <motion.h1
                className="mt-4 text-2xl font-bold text-white text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Welcome to Mio AI
              </motion.h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <motion.div
        className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-800 relative z-30"
        variants={fadeInDown}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <h1 className="text-xl font-bold text-secondary-900 dark:text-white">Mio AI</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Mobile Drawer */}
      <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DrawerContent className="h-[90vh] p-0 z-50">
          <DrawerHeader className="border-b border-secondary-200 dark:border-secondary-800">
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-auto">
            <Sidebar
              user={user}
              logout={logout}
              router={router}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              currentTime={currentTime}
              currentWeather={currentWeather}
              isLoadingWeather={isLoadingWeather}
              mode={mode}
              setMode={setMode}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-64 h-screen">
        <Sidebar
          user={user}
          logout={logout}
          router={router}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          currentTime={currentTime}
          currentWeather={currentWeather}
          isLoadingWeather={isLoadingWeather}
          mode={mode}
          setMode={setMode}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="flex-1 flex flex-col h-screen md:h-auto overflow-hidden relative"
        variants={fadeInRight}
        initial="hidden"
        animate="visible"
      >
        {/* Mode Header */}
        <motion.header
          className="bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-800 p-4 relative z-20"
          variants={fadeInDown}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </h2>
            {mode === "voice" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-500 dark:text-secondary-400">
                  {autoSpeakEnabled ? "Auto-read enabled" : "Auto-read disabled"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSpeakToggle(!autoSpeakEnabled)}
                  className={autoSpeakEnabled ? "bg-primary-100 dark:bg-primary-900/20" : ""}
                >
                  {autoSpeakEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                  {autoSpeakEnabled ? "Disable Auto-Read" : "Enable Auto-Read"}
                </Button>
              </div>
            )}
            {mode === "image" && imageGenerationFailed && (
              <motion.div
                className="flex items-center text-warning-500 text-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Image generation issues</span>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* Chat Area */}
        <motion.div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-secondary-50 dark:bg-secondary-950 relative z-10"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          {mode === "history" ? (
            <div className="max-w-3xl mx-auto">
              <ChatHistory onSelect={loadHistory} />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {mode === "image" && (
                <div className="max-w-3xl mx-auto w-full">
                  <ImageGeneration
                    onImageGenerated={(imageUrl, prompt) => {
                      const newMessage: Message = {
                        id: Date.now().toString(),
                        role: "assistant",
                        content: `Here's the image I generated based on your prompt: "${prompt}"`,
                        timestamp: new Date(),
                        mode: "image",
                        imageUrl: imageUrl,
                      }
                      setMessages((prev) => [...prev, newMessage])
                      lastResponseRef.current = newMessage.content
                    }}
                  />
                </div>
              )}
              {mode === "translate" && (
                <div className="max-w-3xl mx-auto w-full">
                  <TranslationMode
                    onTranslationComplete={(sourceText, translatedText) => {
                      // Add the translation to the chat history
                      const userMessage: Message = {
                        id: Date.now().toString(),
                        role: "user",
                        content: sourceText,
                        timestamp: new Date(),
                        mode: "translate",
                      }

                      const assistantMessage: Message = {
                        id: Date.now().toString() + 1,
                        role: "assistant",
                        content: translatedText,
                        timestamp: new Date(),
                        mode: "translate",
                      }

                      setMessages([...messages, userMessage, assistantMessage])
                      lastResponseRef.current = translatedText
                    }}
                  />
                </div>
              )}
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 1,
                    }}
                  >
                    <ChatMessage
                      content={msg.content}
                      role={msg.role}
                      mode={msg.mode || mode}
                      onCopy={() => handleCopyMessage(msg.content)}
                      onRegenerate={msg.role === "assistant" ? () => handleRegenerate(index) : undefined}
                      imageUrl={msg.imageUrl}
                      error={msg.error}
                      fallbackUsed={msg.fallbackUsed}
                    />
                    {/* Add speak button for assistant messages in voice mode */}
                    {mode === "voice" && msg.role === "assistant" && (
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => speakResponse(msg.content)}
                          className="text-primary-600 border-primary-600"
                        >
                          {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                          {isSpeaking ? "Stop Speaking" : "Read Aloud"}
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="bg-white dark:bg-secondary-900 rounded-lg p-6 shadow-md">
                    <AnimatedLoader
                      type={mode === "image" ? "pulse" : "dots"}
                      size="md"
                      text={mode === "image" ? "Generating image..." : "Thinking..."}
                    />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </motion.div>

        {/* Input Area */}
        {mode !== "history" && (
          <motion.div
            className="p-4 bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800 relative z-10"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="relative">
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      autoResizeTextarea()
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      mode === "chat"
                        ? "Message Mio AI..."
                        : mode === "code"
                          ? "Describe the code you need..."
                          : mode === "voice"
                            ? "Speak or type your message..."
                            : "Describe the image you want to generate..."
                    }
                    className="w-full rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-4 py-3 pr-16 text-secondary-900 dark:text-white placeholder:text-secondary-500 dark:placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 resize-none min-h-[60px] max-h-[150px]"
                    disabled={isProcessing}
                    rows={1}
                  />
                </motion.div>

                <div className="absolute right-2 bottom-2 flex items-center gap-2">
                  {/* Voice Input Button - Only show in voice mode */}
                  {mode === "voice" && (
                    <VoiceInput
                      onSpeechResult={handleVoiceInput}
                      onSpeakToggle={handleSpeakToggle}
                      disabled={isProcessing}
                      stopSpeakingCallback={stopSpeaking}
                      isSpeakingEnabled={autoSpeakEnabled}
                    />
                  )}

                  {/* Send Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AnimatedButton
                          type="submit"
                          disabled={isProcessing || !input.trim()}
                          animation="scale"
                          className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          {isProcessing ? (
                            <AnimatedLoader type="spinner" size="sm" />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5 transform rotate-45 translate-x-[-1px] translate-y-[1px]"
                            >
                              <line x1="22" y1="2" x2="11" y2="13"></line>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                          )}
                        </AnimatedButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Send message</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <motion.div
                className="mt-2 flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <motion.div className="flex items-center" animate={pulse}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  <span>Powered by Mio AI</span>
                </motion.div>
                <div>
                  Press <kbd className="px-1 py-0.5 bg-secondary-200 dark:bg-secondary-700 rounded">Enter</kbd> to send
                  or use voice input
                </div>
              </motion.div>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
