"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Volume2, VolumeX, ArrowUpDownIcon as ArrowsUpDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AnimatedLoader } from "@/components/ui/animated-loader"

declare var SpeechRecognition: any
declare var webkitSpeechRecognition: any

interface VoiceTranslatorProps {
  onTranslation: (sourceText: string, sourceLanguage: string, targetLanguage: string) => Promise<string>
  initialSourceLanguage?: string
  initialTargetLanguage?: string
}

// Language options for voice interaction
const LANGUAGES = [
  { value: "en-US", label: "English", code: "en" },
  { value: "es-ES", label: "Spanish", code: "es" },
  { value: "fr-FR", label: "French", code: "fr" },
  { value: "de-DE", label: "German", code: "de" },
  { value: "it-IT", label: "Italian", code: "it" },
  { value: "ja-JP", label: "Japanese", code: "ja" },
  { value: "ko-KR", label: "Korean", code: "ko" },
  { value: "pt-BR", label: "Portuguese", code: "pt" },
  { value: "ru-RU", label: "Russian", code: "ru" },
  { value: "zh-CN", label: "Chinese", code: "zh" },
  { value: "hi-IN", label: "Hindi", code: "hi" },
  { value: "te-IN", label: "Telugu", code: "te" },
]

export function VoiceTranslator({
  onTranslation,
  initialSourceLanguage = "en-US",
  initialTargetLanguage = "es-ES",
}: VoiceTranslatorProps) {
  const [sourceLanguage, setSourceLanguage] = useState(initialSourceLanguage)
  const [targetLanguage, setTargetLanguage] = useState(initialTargetLanguage)
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(true)
  const [isSpeechSynthesisSupported, setIsSpeechSynthesisSupported] = useState(true)

  const recognitionRef = useRef<any>(null)
  const recognitionInstance = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const { toast } = useToast()
  const isInitializedRef = useRef(false)
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const MAX_RETRIES = 3

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window === "undefined") return

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
    } else {
      setIsSpeechSynthesisSupported(false)
    }

    isInitializedRef.current = true

    return () => {
      cleanupRecognition()
      stopSpeaking()
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }
    }
  }, [])

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

  // Create a new recognition instance
  const createRecognitionInstance = () => {
    if (!recognitionRef.current) return null

    try {
      const instance = new recognitionRef.current()

      instance.continuous = false
      instance.interimResults = true
      instance.lang = sourceLanguage

      instance.onresult = (event: any) => {
        const result = event.results[event.results.length - 1]
        const transcriptText = result[0].transcript
        setTranscript(transcriptText)

        // If result is final, set as source text
        if (result.isFinal) {
          setSourceText(transcriptText)
          stopListening()
          // Automatically translate after speech recognition
          translateText(transcriptText)
        }
      }

      instance.onerror = (event: any) => {
        console.log(`Speech recognition error: ${event.error}`)

        if (event.error === "no-speech") {
          toast({
            title: "No Speech Detected",
            description: "I couldn't hear anything. Please try speaking again.",
            variant: "default",
          })
        } else if (event.error !== "aborted") {
          toast({
            title: "Speech Recognition Issue",
            description: `Recognition error: ${event.error}. Please try again.`,
            variant: "destructive",
          })

          setIsListening(false)
        }
      }

      instance.onend = () => {
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

  const startListening = () => {
    if (!isInitializedRef.current) return

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
      startListening()
    }
  }

  const translateText = async (text?: string) => {
    const textToTranslate = text || sourceText

    if (!textToTranslate.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter or speak text to translate.",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)

    try {
      // Get language codes from the full language codes
      const sourceLangCode = LANGUAGES.find((lang) => lang.value === sourceLanguage)?.code || "en"
      const targetLangCode = LANGUAGES.find((lang) => lang.value === targetLanguage)?.code || "es"

      // Call the translation function passed as prop
      const result = await onTranslation(textToTranslate, sourceLangCode, targetLangCode)
      setTranslatedText(result)

      // Automatically speak translation if speech synthesis is supported
      if (isSpeechSynthesisSupported) {
        speakTranslation(result, targetLangCode)
      }
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: "Translation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
      setTranslatedText("Translation failed. Please try again.")
    } finally {
      setIsTranslating(false)
    }
  }

  const speakTranslation = (text: string, languageCode: string) => {
    if (!synthesisRef.current) return

    // Cancel any ongoing speech
    stopSpeaking()

    try {
      // Break long text into sentences for better synthesis
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

      setIsSpeaking(true)

      // Function to speak sentences sequentially
      const speakNextSentence = (index: number) => {
        if (index >= sentences.length) {
          setIsSpeaking(false)
          return
        }

        const utterance = new SpeechSynthesisUtterance(sentences[index].trim())
        utterance.lang = languageCode

        // Get available voices
        const voices = synthesisRef.current!.getVoices()

        // For English, try to use Google UK Female
        if (languageCode.startsWith("en")) {
          const ukFemaleVoice = voices.find(
            (v) =>
              v.name.includes("Google UK English Female") ||
              (v.lang === "en-GB" && v.name.toLowerCase().includes("female")),
          )

          if (ukFemaleVoice) {
            utterance.voice = ukFemaleVoice
            utterance.lang = ukFemaleVoice.lang
          }
        } else {
          // For other languages, find the best matching voice
          const voice = voices.find((v) => v.lang.startsWith(languageCode.split("-")[0]))
          if (voice) {
            utterance.voice = voice
          }
        }

        utterance.onend = () => {
          speakNextSentence(index + 1)
        }

        utterance.onerror = () => {
          setIsSpeaking(false)
        }

        synthesisRef.current!.speak(utterance)
      }

      speakNextSentence(0)
    } catch (error) {
      console.error("Error in speech synthesis:", error)
      setIsSpeaking(false)
      toast({
        title: "Speech Error",
        description: "There was an error with the speech synthesis. Please try again.",
        variant: "destructive",
      })
    }
  }

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const swapLanguages = () => {
    const tempLang = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(tempLang)

    // Also swap the text
    setSourceText(translatedText)
    setTranslatedText("")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Voice Translator</h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              Speak in one language, translate to another
            </p>
          </div>

          <Button variant="outline" onClick={swapLanguages} className="gap-2">
            <ArrowsUpDown className="h-4 w-4" />
            <span>Swap</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Language Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Source Language</label>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={`source-${lang.value}`} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={`Type or speak in ${LANGUAGES.find((l) => l.value === sourceLanguage)?.label}...`}
                className="h-[120px] resize-none"
              />

              <div className="absolute right-2 bottom-2 flex gap-2">
                {isRecognitionSupported && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleListening}
                    className={
                      isListening ? "bg-primary-100 text-primary-900 dark:bg-primary-900/20 dark:text-primary-300" : ""
                    }
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>

            {isListening && (
              <div className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 flex items-center">
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                  }}
                  className="mr-2 h-2 w-2 rounded-full bg-primary-500"
                />
                Listening: {transcript || "Say something..."}
              </div>
            )}
          </div>

          {/* Target Language Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Target Language</label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={`target-${lang.value}`} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <div
                className={`min-h-[120px] p-3 rounded-md border ${isTranslating ? "border-dashed" : ""} border-input`}
              >
                {isTranslating ? (
                  <div className="h-full flex items-center justify-center">
                    <AnimatedLoader type="dots" size="md" text="Translating..." />
                  </div>
                ) : translatedText ? (
                  <p className="whitespace-pre-wrap">{translatedText}</p>
                ) : (
                  <p className="text-secondary-400 dark:text-secondary-500">Translation will appear here...</p>
                )}
              </div>

              {translatedText && !isTranslating && (
                <div className="absolute right-2 bottom-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      isSpeaking
                        ? stopSpeaking()
                        : speakTranslation(
                            translatedText,
                            LANGUAGES.find((lang) => lang.value === targetLanguage)?.code || "en",
                          )
                    }
                    disabled={!isSpeechSynthesisSupported}
                  >
                    {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => translateText()}
            disabled={!sourceText.trim() || isTranslating}
            className="min-w-[120px]"
          >
            {isTranslating ? <AnimatedLoader type="dots" size="sm" /> : "Translate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
