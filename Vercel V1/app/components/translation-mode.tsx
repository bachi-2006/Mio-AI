"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ImportIcon as Translate, Copy, Volume2, VolumeX, RotateCcw, Mic } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedLoader } from "@/components/ui/animated-loader"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Button } from "@/components/ui/button"

// Language options for translation
const LANGUAGES = [
  { value: "en", label: "English", voiceCode: "en-US" },
  { value: "es", label: "Spanish", voiceCode: "es-ES" },
  { value: "fr", label: "French", voiceCode: "fr-FR" },
  { value: "de", label: "German", voiceCode: "de-DE" },
  { value: "it", label: "Italian", voiceCode: "it-IT" },
  { value: "ja", label: "Japanese", voiceCode: "ja-JP" },
  { value: "ko", label: "Korean", voiceCode: "ko-KR" },
  { value: "pt", label: "Portuguese", voiceCode: "pt-BR" },
  { value: "ru", label: "Russian", voiceCode: "ru-RU" },
  { value: "zh", label: "Chinese (Simplified)", voiceCode: "zh-CN" },
  { value: "ar", label: "Arabic", voiceCode: "ar-SA" },
  { value: "hi", label: "Hindi", voiceCode: "hi-IN" },
  { value: "bn", label: "Bengali", voiceCode: "bn-IN" },
  { value: "te", label: "Telugu", voiceCode: "te-IN" }, // Telugu language support
]

interface TranslationModeProps {
  onTranslationComplete?: (sourceText: string, translatedText: string) => void
}

export function TranslationMode({ onTranslationComplete }: TranslationModeProps) {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("te") // Default to Telugu as target language
  const [isTranslating, setIsTranslating] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const recognitionRef = useRef<any>(null)
  const recognitionInstance = useRef<any>(null)
  const { toast } = useToast()

  // Initialize speech synthesis and recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Initialize speech synthesis
        if ("speechSynthesis" in window) {
          synthesisRef.current = window.speechSynthesis
        }

        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognition) {
          recognitionRef.current = SpeechRecognition
        }
      } catch (error) {
        console.error("Error initializing speech services:", error)
      }
    }

    return () => {
      stopSpeaking()
      stopListening()
    }
  }, [])

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter text to translate.",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)
    setTranslatedText("")

    try {
      // Prepare the prompt for Gemini
      const prompt = `Translate the following text from ${LANGUAGES.find((l) => l.value === sourceLanguage)?.label} to ${LANGUAGES.find((l) => l.value === targetLanguage)?.label}:\n\n"${sourceText}"\n\nOnly provide the translated text without any explanations or additional text.`

      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
        }),
      })

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`)
      }

      const data = await response.json()

      // Extract the translated text
      const result = data.response || "Translation failed. Please try again."

      // Clean up the result (remove quotes if present)
      const cleanResult = result.replace(/^["']|["']$/g, "").trim()

      setTranslatedText(cleanResult)

      if (onTranslationComplete) {
        onTranslationComplete(sourceText, cleanResult)
      }

      // Automatically speak the translation if target language is supported
      if (targetLanguage === "te") {
        // Special handling for Telugu
        setTimeout(() => {
          speakText(cleanResult, "te-IN")
        }, 500)
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

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    if (!recognitionRef.current) return

    try {
      // Stop any ongoing speech
      stopSpeaking()

      const instance = new recognitionRef.current()
      instance.continuous = false
      instance.interimResults = true

      // Get the voice code for the source language
      const sourceVoiceCode = LANGUAGES.find((lang) => lang.value === sourceLanguage)?.voiceCode || "en-US"
      instance.lang = sourceVoiceCode

      instance.onresult = (event: any) => {
        try {
          const result = event.results[event.results.length - 1]
          const transcriptText = result[0].transcript
          setTranscript(transcriptText)

          if (result.isFinal) {
            setSourceText(transcriptText)
            stopListening()

            // Auto-translate after voice input if there's text
            if (transcriptText.trim()) {
              setTimeout(() => {
                handleTranslate()
              }, 500)
            }
          }
        } catch (error) {
          console.error("Error processing speech result:", error)
          stopListening()
        }
      }

      instance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        })
        stopListening()
      }

      instance.onend = () => {
        setIsListening(false)
      }

      recognitionInstance.current = instance
      instance.start()
      setIsListening(true)
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      toast({
        title: "Speech Recognition Error",
        description: "Could not start speech recognition. Please try again.",
        variant: "destructive",
      })
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (recognitionInstance.current) {
      try {
        recognitionInstance.current.stop()
      } catch (error) {
        console.log("Error stopping recognition:", error)
      }
      recognitionInstance.current = null
    }
    setIsListening(false)
  }

  const handleCopyTranslation = () => {
    navigator.clipboard.writeText(translatedText)
    toast({
      title: "Copied",
      description: "Translation copied to clipboard",
    })
  }

  const handleSwapLanguages = () => {
    // Only swap if we have a translation
    if (translatedText) {
      const tempLang = sourceLanguage
      setSourceLanguage(targetLanguage)
      setTargetLanguage(tempLang)

      // Swap the text
      setSourceText(translatedText)
      setTranslatedText("")
    } else {
      // Just swap languages
      const tempLang = sourceLanguage
      setSourceLanguage(targetLanguage)
      setTargetLanguage(tempLang)
    }
  }

  const speakText = (text: string, languageCode: string) => {
    if (!synthesisRef.current) return

    // Cancel any ongoing speech
    stopSpeaking()

    try {
      // Break text into smaller chunks for better synthesis
      const chunks = text.match(/[^.!?]+[.!?]+|[^.!?]+/g) || [text]

      if (chunks.length === 0) {
        console.warn("No text chunks to speak")
        return
      }

      setIsSpeaking(true)

      // Initialize voices first
      const voices = synthesisRef.current.getVoices()
      let selectedVoice = null

      // Find appropriate voice
      if (voices && voices.length > 0) {
        selectedVoice =
          voices.find((v) => v.lang === languageCode) ||
          voices.find((v) => v.lang.startsWith(languageCode.split("-")[0])) ||
          voices[0] // Fallback to first voice
      }

      // Function to speak chunks sequentially with better error handling
      const speakNextChunk = (index: number) => {
        if (index >= chunks.length || !synthesisRef.current) {
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
          utterance.lang = languageCode

          if (selectedVoice) {
            utterance.voice = selectedVoice
          }

          utterance.onend = () => {
            speakNextChunk(index + 1)
          }

          utterance.onerror = (event) => {
            console.error("Speech synthesis error:", event)

            // Try to continue with next chunk
            if (index + 1 < chunks.length) {
              setTimeout(() => speakNextChunk(index + 1), 300)
            } else {
              setIsSpeaking(false)
            }
          }

          // Add a small delay between chunks
          setTimeout(() => {
            if (synthesisRef.current) {
              synthesisRef.current.speak(utterance)
            }
          }, 100)
        } catch (error) {
          console.error(`Error speaking chunk ${index}:`, error)
          setIsSpeaking(false)
        }
      }

      speakNextChunk(0)
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
      try {
        synthesisRef.current.cancel()
        setIsSpeaking(false)
      } catch (error) {
        console.error("Error stopping speech:", error)
      }
    }
    setIsSpeaking(false)
  }

  // Get voice code for a language
  const getVoiceCode = (langCode: string) => {
    return LANGUAGES.find((lang) => lang.value === langCode)?.voiceCode || "en-US"
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Translate className="h-5 w-5 mr-2" />
              Translation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Source Language</label>
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger>
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
              <div>
                <label className="block text-sm font-medium mb-2">Target Language</label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
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
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Text to Translate</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleVoiceInput}
                    className={`relative ${isListening ? "text-primary-500" : "text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"}`}
                  >
                    {isListening ? (
                      <>
                        <Mic className="h-5 w-5" />
                        <motion.span
                          className="absolute inset-0 rounded-full border-2"
                          initial={{ opacity: 0.3, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.5 }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        />
                      </>
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </Button>
                  {sourceText && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => speakText(sourceText, getVoiceCode(sourceLanguage))}
                      disabled={isSpeaking}
                      className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
                    >
                      {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  )}
                </div>
              </div>
              <Textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={`Enter text in ${LANGUAGES.find((l) => l.value === sourceLanguage)?.label}...`}
                className="min-h-[120px]"
                disabled={isTranslating}
              />
              {isListening && (
                <div className="mt-2 p-2 bg-primary-50 dark:bg-primary-900/20 rounded text-sm">
                  <p className="font-medium">Listening...</p>
                  <p className="text-secondary-500 dark:text-secondary-400">{transcript || "Say something..."}</p>
                </div>
              )}
            </div>

            <div className="flex justify-center mb-4">
              <AnimatedButton
                variant="outline"
                animation="scale"
                onClick={handleSwapLanguages}
                className="mx-2"
                title="Swap languages"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Swap
              </AnimatedButton>
              <AnimatedButton onClick={handleTranslate} disabled={!sourceText.trim() || isTranslating} className="mx-2">
                {isTranslating ? (
                  <>
                    <AnimatedLoader type="spinner" size="sm" className="mr-2" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Translate className="h-4 w-4 mr-2" />
                    Translate
                  </>
                )}
              </AnimatedButton>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Translation</label>
                {translatedText && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyTranslation}
                      className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => speakText(translatedText, getVoiceCode(targetLanguage))}
                      disabled={isSpeaking}
                      className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
                    >
                      {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  </div>
                )}
              </div>
              <div className="bg-secondary-50 dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-md p-4 min-h-[120px]">
                {isTranslating ? (
                  <div className="flex justify-center items-center h-[120px]">
                    <AnimatedLoader type="dots" size="md" text="Translating..." />
                  </div>
                ) : translatedText ? (
                  <p className="whitespace-pre-wrap">{translatedText}</p>
                ) : (
                  <p className="text-secondary-400 dark:text-secondary-500">Translation will appear here...</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-sm text-secondary-500 dark:text-secondary-400 mt-4">
          <p>
            <strong>Tip:</strong> Click the microphone icon to speak in the source language, and use the speaker buttons
            to hear the translation in the target language. Telugu language is now supported for translation!
          </p>
        </div>
      </motion.div>
    </div>
  )
}
