"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Volume2, VolumeX, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedLoader } from "@/components/ui/animated-loader"
import { useTheme } from "@/lib/theme-context"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VoiceInputProps {
  onSpeechResult: (text: string) => void
  onSpeakToggle?: (isSpeaking: boolean) => void
  disabled?: boolean
  language?: string
  onLanguageChange?: (language: string) => void
  stopSpeakingCallback?: () => void
  isSpeakingEnabled?: boolean
}

// Language options for speech recognition
const LANGUAGES = [
  { value: "en-US", label: "English (US)" },
  { value: "es-ES", label: "Spanish" },
  { value: "fr-FR", label: "French" },
  { value: "de-DE", label: "German" },
  { value: "it-IT", label: "Italian" },
  { value: "ja-JP", label: "Japanese" },
  { value: "ko-KR", label: "Korean" },
  { value: "pt-BR", label: "Portuguese" },
  { value: "ru-RU", label: "Russian" },
  { value: "zh-CN", label: "Chinese (Simplified)" },
  { value: "te-IN", label: "Telugu" },
]

export function VoiceInput({
  onSpeechResult,
  onSpeakToggle,
  disabled = false,
  language = "en-US",
  onLanguageChange,
  stopSpeakingCallback,
  isSpeakingEnabled = true,
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(isSpeakingEnabled)
  const [transcript, setTranscript] = useState("")
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(true)
  const [isSpeechSynthesisSupported, setIsSpeechSynthesisSupported] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const recognitionRef = useRef<any>(null)
  const recognitionInstance = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const { theme } = useTheme()
  const { toast } = useToast()
  const isInitializedRef = useRef(false)
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const MAX_RETRIES = 3

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      // Check if SpeechRecognition is supported
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        setIsRecognitionSupported(false)
        return
      }

      // Create the recognition constructor but don't instantiate yet
      recognitionRef.current = SpeechRecognition

      // Check if Speech Synthesis is supported
      if ("speechSynthesis" in window) {
        synthesisRef.current = window.speechSynthesis

        // Pre-load voices to avoid issues later
        const loadVoices = () => {
          // Just accessing voices can help initialize the speech synthesis system
          const voices = synthesisRef.current?.getVoices() || []
          console.log(`Loaded ${voices.length} voices for speech recognition`)
        }

        // Chrome needs this event, other browsers might not
        if (synthesisRef.current.onvoiceschanged !== undefined) {
          synthesisRef.current.onvoiceschanged = loadVoices
        }

        // Try to load voices immediately as well
        loadVoices()
      } else {
        setIsSpeechSynthesisSupported(false)
      }

      isInitializedRef.current = true

      // Add network status listener
      const handleNetworkChange = () => {
        if (!navigator.onLine && isListening) {
          // If we go offline while listening, stop listening
          stopListening()
          toast({
            title: "Network Disconnected",
            description: "Speech recognition stopped because your device is offline.",
            variant: "destructive",
          })
        }
      }

      window.addEventListener("online", handleNetworkChange)
      window.addEventListener("offline", handleNetworkChange)

      return () => {
        cleanupRecognition()
        stopSpeaking()
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current)
        }
        window.removeEventListener("online", handleNetworkChange)
        window.removeEventListener("offline", handleNetworkChange)
      }
    } catch (error) {
      console.error("Error initializing speech recognition:", error)
      setIsRecognitionSupported(false)
      return
    }
  }, [])

  // Update language when it changes
  useEffect(() => {
    setSelectedLanguage(language)
  }, [language])

  // Update speaking state when isSpeakingEnabled changes
  useEffect(() => {
    setIsSpeaking(isSpeakingEnabled)
    if (onSpeakToggle) {
      onSpeakToggle(isSpeakingEnabled)
    }
  }, [isSpeakingEnabled, onSpeakToggle])

  // Create a new recognition instance
  const createRecognitionInstance = () => {
    if (!recognitionRef.current) return null

    try {
      const instance = new recognitionRef.current()

      instance.continuous = false
      instance.interimResults = true
      instance.lang = selectedLanguage

      instance.onresult = (event: any) => {
        try {
          const result = event.results[event.results.length - 1]
          const transcriptText = result[0].transcript
          setTranscript(transcriptText)

          // If result is final, send it to parent
          if (result.isFinal) {
            // Stop any ongoing speech synthesis when new input is received
            if (stopSpeakingCallback) {
              stopSpeakingCallback()
            }

            onSpeechResult(transcriptText)
            stopListening()
          }
        } catch (error) {
          console.error("Error processing speech recognition result:", error)
          toast({
            title: "Recognition Error",
            description: "There was an error processing your speech. Please try again.",
            variant: "destructive",
          })
          stopListening()
        }
      }

      instance.onerror = (event: any) => {
        console.log(`Speech recognition error: ${event.error}`)

        // Handle different error types
        if (event.error === "network") {
          // Network error handling
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current++

            toast({
              title: "Network Issue",
              description: `Retrying speech recognition (${retryCountRef.current}/${MAX_RETRIES})...`,
              variant: "default",
            })

            // Retry after a delay
            if (restartTimeoutRef.current) {
              clearTimeout(restartTimeoutRef.current)
            }

            restartTimeoutRef.current = setTimeout(() => {
              if (isListening) {
                cleanupRecognition()
                startListening()
              }
            }, 2000)
          } else {
            // Max retries reached
            toast({
              title: "Network Error",
              description: "Unable to connect to speech recognition service. Please check your internet connection.",
              variant: "destructive",
            })

            setIsListening(false)
            retryCountRef.current = 0
            cleanupRecognition()
          }
        } else if (event.error === "no-speech") {
          // No speech detected
          toast({
            title: "No Speech Detected",
            description: "I couldn't hear anything. Please try speaking again.",
            variant: "default",
          })

          // Don't stop listening, just let it continue
          if (isListening) {
            // Restart recognition to keep listening
            if (recognitionInstance.current) {
              try {
                recognitionInstance.current.stop()
                setTimeout(() => {
                  if (isListening && recognitionInstance.current) {
                    recognitionInstance.current.start()
                  }
                }, 100)
              } catch (e) {
                console.log("Error restarting recognition:", e)
              }
            }
          }
        } else if (event.error !== "aborted") {
          // For other errors (except aborted)
          toast({
            title: "Speech Recognition Issue",
            description: `Recognition error: ${event.error}. Please try again.`,
            variant: "destructive",
          })

          // Set listening state to false
          setIsListening(false)
        } else {
          // Just clean up for aborted errors without notification
          setIsListening(false)
        }
      }

      instance.onend = () => {
        // Only set isListening to false if we're not trying to restart
        if (!restartTimeoutRef.current) {
          setIsListening(false)
        }
      }

      return instance
    } catch (error) {
      console.error("Error creating speech recognition instance:", error)
      return null
    }
  }

  // Clean up the current recognition instance
  const cleanupRecognition = () => {
    if (recognitionInstance.current) {
      try {
        // First remove all event listeners to prevent callbacks
        recognitionInstance.current.onresult = null
        recognitionInstance.current.onerror = null
        recognitionInstance.current.onend = null

        // Then try to stop it if it's running
        if (isListening) {
          recognitionInstance.current.abort()
          recognitionInstance.current.stop()
        }
      } catch (e) {
        // Ignore errors during cleanup
        console.log("Cleanup error (can be ignored):", e)
      }

      // Clear the reference
      recognitionInstance.current = null
    }
  }

  const startListening = () => {
    if (!isInitializedRef.current || disabled) return

    // Reset retry counter
    retryCountRef.current = 0

    // Check for network connectivity
    if (typeof navigator !== "undefined" && "onLine" in navigator && !navigator.onLine) {
      toast({
        title: "Offline",
        description:
          "Speech recognition requires an internet connection. Please connect to the internet and try again.",
        variant: "destructive",
      })
      return
    }

    // First clean up any existing instance
    cleanupRecognition()

    // Create a fresh instance
    const instance = createRecognitionInstance()
    if (!instance) {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Speech recognition couldn't be initialized. Please try again later.",
        variant: "destructive",
      })
      return
    }

    recognitionInstance.current = instance

    // Stop any ongoing speech synthesis when starting to listen
    if (stopSpeakingCallback) {
      stopSpeakingCallback()
    }

    // Use a small delay to ensure clean start
    setTimeout(() => {
      try {
        recognitionInstance.current.start()
        setIsListening(true)
        setTranscript("")
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        toast({
          title: "Speech Recognition Error",
          description: "Could not start speech recognition. Please try again.",
          variant: "destructive",
        })
        setIsListening(false)
      }
    }, 100)
  }

  const stopListening = () => {
    if (!recognitionInstance.current) return

    try {
      recognitionInstance.current.stop()
    } catch (error) {
      console.log("Error stopping recognition (can be ignored):", error)
    }

    setIsListening(false)
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      // Make sure network is available
      if (typeof navigator !== "undefined" && "onLine" in navigator && !navigator.onLine) {
        toast({
          title: "Offline",
          description:
            "Speech recognition requires an internet connection. Please connect to the internet and try again.",
          variant: "destructive",
        })
        return
      }

      startListening()
    }
  }

  const toggleSpeaking = () => {
    const newSpeakingState = !isSpeaking
    setIsSpeaking(newSpeakingState)
    if (onSpeakToggle) {
      onSpeakToggle(newSpeakingState)
    }
  }

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      if (onSpeakToggle) onSpeakToggle(false)
    }
  }

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
    if (onLanguageChange) {
      onLanguageChange(value)
    }

    // Update the recognition instance language if it exists
    if (recognitionInstance.current) {
      recognitionInstance.current.lang = value
    }

    toast({
      title: "Language Changed",
      description: `Speech recognition language set to ${LANGUAGES.find((lang) => lang.value === value)?.label || value}`,
    })
  }

  if (!isRecognitionSupported) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled={true}
        title="Speech recognition is not supported in your browser"
        className="text-secondary-400"
      >
        <MicOff className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Language Selector Button */}
      <AnimatedButton
        variant="ghost"
        size="icon"
        animation="subtle"
        onClick={() => setShowLanguageSelector(!showLanguageSelector)}
        className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
        title="Change language"
      >
        <Globe className="h-5 w-5" />
      </AnimatedButton>

      {/* Language Selector Dropdown */}
      {showLanguageSelector && (
        <div className="absolute bottom-20 right-4 bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-4 z-50 w-64">
          <h3 className="text-sm font-medium mb-2">Select Recognition Language</h3>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* TTS Button */}
      {isSpeechSynthesisSupported && (
        <AnimatedButton
          variant="ghost"
          size="icon"
          animation="subtle"
          onClick={toggleSpeaking}
          disabled={disabled}
          className={`relative ${isSpeaking ? "text-primary-500" : "text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"}`}
          title={isSpeaking ? "Turn off automatic reading" : "Turn on automatic reading"}
        >
          {isSpeaking ? (
            <>
              <Volume2 className="h-5 w-5" />
              <motion.span
                className="absolute inset-0 rounded-full border-2"
                initial={{ opacity: 0.3, scale: 1 }}
                animate={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                style={{ borderColor: theme.primary }}
              />
            </>
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </AnimatedButton>
      )}

      {/* Voice Input Button */}
      <AnimatedButton
        variant="ghost"
        size="icon"
        animation="subtle"
        onClick={toggleListening}
        disabled={disabled}
        className={`relative ${isListening ? "text-primary-500" : "text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"}`}
        title={isListening ? "Stop listening" : "Speak your message"}
      >
        {isListening ? (
          <>
            <Mic className="h-5 w-5" />
            <motion.span
              className="absolute inset-0 rounded-full border-2"
              initial={{ opacity: 0.3, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              style={{ borderColor: theme.primary }}
            />
          </>
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </AnimatedButton>

      {/* Listening status */}
      {isListening && (
        <div className="fixed bottom-20 left-0 right-0 mx-auto w-4/5 max-w-lg bg-secondary-900/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-40 text-center">
          <AnimatedLoader type="wave" size="sm" className="mb-2" />
          <p className="text-white font-medium mb-1">
            Listening in {LANGUAGES.find((lang) => lang.value === selectedLanguage)?.label || selectedLanguage}...
          </p>
          <p className="text-secondary-300 text-sm overflow-hidden text-ellipsis">{transcript || "Say something..."}</p>
        </div>
      )}
    </div>
  )
}
