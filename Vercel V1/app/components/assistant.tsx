"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "ai/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Declare SpeechRecognition
declare var SpeechRecognition: any
declare var webkitSpeechRecognition: any

export function Assistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })
  const [isListening, setIsListening] = useState(false)
  const synthesis = useRef<SpeechSynthesis | null>(null)
  const recognition = useRef<SpeechRecognition | null>(null)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const lastTranscriptRef = useRef<string>("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesis.current = window.speechSynthesis
      if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognition.current = new SpeechRecognition()
        recognition.current.continuous = false // Changed to false to prevent duplicates
        recognition.current.interimResults = true
        setIsSpeechSupported(true)

        recognition.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join(" ")

          // Only update if the transcript has changed significantly
          if (transcript !== lastTranscriptRef.current) {
            lastTranscriptRef.current = transcript
            handleInputChange({ target: { value: transcript } } as React.ChangeEvent<HTMLInputElement>)
          }
        }

        recognition.current.onend = () => {
          if (isListening) {
            recognition.current?.start()
          }
        }

        recognition.current.onerror = (event) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
          toast({
            title: "Error",
            description: "There was an error with speech recognition. Please try again.",
            variant: "destructive",
          })
        }
      }
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop()
      }
    }
  }, [isListening])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleListening = () => {
    if (!isSpeechSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please type your message instead.",
        variant: "destructive",
      })
      return
    }

    setIsListening(!isListening)
    if (!isListening) {
      lastTranscriptRef.current = ""
      recognition.current?.start()
    } else {
      recognition.current?.stop()
    }
  }

  const speakResponse = (text: string) => {
    if (synthesis.current) {
      synthesis.current.cancel() // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0 // Normal speed
      utterance.pitch = 1.0 // Normal pitch
      synthesis.current.speak(utterance)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e)
      if (isListening) {
        toggleListening()
      }
    }
  }

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      speakResponse(messages[messages.length - 1].content)
    }
  }, [messages])

  return (
    <div className="relative w-full max-w-2xl mx-auto p-4">
      <motion.h1
        className="text-6xl font-bold mb-8 text-center holographic-text"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Mio AI
      </motion.h1>

      <div className="holographic-circle" />

      <motion.div
        className="relative bg-black/40 backdrop-blur-sm rounded-lg border border-blue-500/20 p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-[400px] overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-500/20">
          <AnimatePresence>
            {messages.map((message, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg backdrop-blur-sm ${
                    message.role === "user" ? "bg-red-500/90 text-white" : "bg-blue-500/20 text-blue-100"
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow bg-black/50 border-blue-500/20 text-white placeholder-gray-400 focus:ring-blue-500/40"
          />
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
          {isSpeechSupported && (
            <Button
              type="button"
              onClick={toggleListening}
              className={`${isListening ? "bg-blue-500 text-white" : "bg-red-500 text-white"} hover:opacity-90`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
        </form>
      </motion.div>
    </div>
  )
}
