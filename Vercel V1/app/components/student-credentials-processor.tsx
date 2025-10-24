"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Search, Volume2, VolumeX, Copy, Download, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Student {
  rollNo: string
  name: string
  email: string
}

interface ProcessedStudent extends Student {
  password: string
  displayName: string
}

interface StudentCredentialsProcessorProps {
  studentData: Student[]
}

export function StudentCredentialsProcessor({ studentData }: StudentCredentialsProcessorProps) {
  const [processedStudents, setProcessedStudents] = useState<ProcessedStudent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number | null>(null)
  const [downloadReady, setDownloadReady] = useState(false)
  const { toast } = useToast()
  const synthesis = useRef<SpeechSynthesis | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesis.current = window.speechSynthesis
    }

    return () => {
      if (synthesis.current) {
        synthesis.current.cancel()
      }
    }
  }, [])

  // Process student data
  useEffect(() => {
    if (!studentData || !Array.isArray(studentData)) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const processed = studentData.map((student) => {
        // Ensure email is a string before using string methods
        const email = typeof student.email === "string" ? student.email : ""

        // Extract password (characters before @)
        const atIndex = email.indexOf("@")
        const password = atIndex > 0 ? email.substring(0, atIndex) : ""

        // Use 'User' if name is missing or empty
        const name =
          student.name && typeof student.name === "string" && student.name.trim() !== "" ? student.name : "User"

        return {
          ...student,
          password,
          displayName: name,
        }
      })

      setProcessedStudents(processed)
      setDownloadReady(true)
    } catch (error) {
      console.error("Error processing student data:", error)
      toast({
        title: "Error",
        description: "Failed to process student data. Please check the console for details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [studentData, toast])

  // Filter students based on search term
  const filteredStudents = processedStudents.filter((student) => {
    const searchLower = typeof searchTerm === "string" ? searchTerm.toLowerCase() : ""

    // Ensure all values are strings before using string methods
    const name = typeof student.displayName === "string" ? student.displayName.toLowerCase() : ""
    const email = typeof student.email === "string" ? student.email.toLowerCase() : ""
    const rollNo = typeof student.rollNo === "string" ? student.rollNo.toLowerCase() : ""

    return name.includes(searchLower) || email.includes(searchLower) || rollNo.includes(searchLower)
  })

  // Speak student name
  const speakName = (name: string, index: number) => {
    if (!synthesis.current) return

    // Ensure name is a string
    const nameToSpeak = typeof name === "string" ? name : "Unknown"

    // Cancel any ongoing speech
    synthesis.current.cancel()

    const utterance = new SpeechSynthesisUtterance(nameToSpeak)
    utterance.rate = 0.9 // Slightly slower for clarity

    // Get available voices
    const voices = synthesis.current.getVoices()
    const preferredVoice =
      voices.find((voice) => voice.lang === "en-US" && voice.name.includes("Google")) ||
      voices.find((voice) => voice.lang === "en-US")

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    setIsSpeaking(true)
    setCurrentSpeakingIndex(index)

    utterance.onend = () => {
      setIsSpeaking(false)
      setCurrentSpeakingIndex(null)
    }

    synthesis.current.speak(utterance)
  }

  // Stop speaking
  const stopSpeaking = () => {
    if (synthesis.current) {
      synthesis.current.cancel()
      setIsSpeaking(false)
      setCurrentSpeakingIndex(null)
    }
  }

  // Copy credentials to clipboard
  const copyCredentials = (email: string, password: string) => {
    // Ensure values are strings
    const emailStr = typeof email === "string" ? email : ""
    const passwordStr = typeof password === "string" ? password : ""

    const text = `Email: ${emailStr}\nPassword: ${passwordStr}`
    navigator.clipboard.writeText(text)

    toast({
      title: "Copied",
      description: "Credentials copied to clipboard",
    })
  }

  // Download all credentials as CSV
  const downloadCredentials = () => {
    if (!processedStudents.length) return

    const headers = ["Roll No", "Name", "Email", "Password"]
    const csvRows = [headers.join(",")]

    processedStudents.forEach((student) => {
      // Ensure all values are strings and properly escaped for CSV
      const rollNo = typeof student.rollNo === "string" ? `"${student.rollNo.replace(/"/g, '""')}"` : '""'
      const name = typeof student.displayName === "string" ? `"${student.displayName.replace(/"/g, '""')}"` : '""'
      const email = typeof student.email === "string" ? `"${student.email.replace(/"/g, '""')}"` : '""'
      const password = typeof student.password === "string" ? `"${student.password.replace(/"/g, '""')}"` : '""'

      csvRows.push([rollNo, name, email, password].join(","))
    })

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "student_credentials.csv")
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Downloaded",
      description: "Student credentials downloaded as CSV",
    })
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Student Credentials Processor</span>
            {downloadReady && (
              <Button onClick={downloadCredentials} className="bg-primary-600 hover:bg-primary-700">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder="Search by name, email, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : processedStudents.length === 0 ? (
            <div className="text-center py-12">
              <Info className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No student data available.</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Info className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No students match your search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStudents.map((student, index) => (
                  <motion.div
                    key={student.rollNo || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className={`overflow-hidden ${currentSpeakingIndex === index ? "border-primary-500 ring-2 ring-primary-500/50" : ""}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-primary-100">
                            <AvatarImage
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.displayName)}&background=random`}
                            />
                            <AvatarFallback>{student.displayName.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-lg truncate">{student.displayName}</h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => {
                                  if (isSpeaking && currentSpeakingIndex === index) {
                                    stopSpeaking()
                                  } else {
                                    speakName(student.displayName, index)
                                  }
                                }}
                              >
                                {isSpeaking && currentSpeakingIndex === index ? (
                                  <VolumeX className="h-4 w-4 text-primary-600" />
                                ) : (
                                  <Volume2 className="h-4 w-4 text-gray-500" />
                                )}
                              </Button>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{student.email}</p>
                            <div className="mt-2 flex items-center">
                              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-sm font-mono">
                                Password: {student.password}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-2"
                                onClick={() => copyCredentials(student.email, student.password)}
                              >
                                <Copy className="h-4 w-4 text-gray-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="text-center text-sm text-gray-500 mt-4">
                Showing {filteredStudents.length} of {processedStudents.length} students
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
