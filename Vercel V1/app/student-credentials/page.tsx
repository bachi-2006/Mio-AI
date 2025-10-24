"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { StudentCredentialsProcessor } from "../components/student-credentials-processor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Sample data structure
interface Student {
  rollNo: string
  name: string
  email: string
}

export default function StudentCredentialsPage() {
  const [studentData, setStudentData] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result
        if (typeof content !== "string") {
          throw new Error("Invalid file content")
        }

        // Parse JSON content
        const data = JSON.parse(content)

        // Validate data structure
        if (!Array.isArray(data)) {
          throw new Error("Data must be an array")
        }

        // Basic validation of each student object
        const validatedData = data.map((student: any) => {
          return {
            rollNo: typeof student.rollNo === "string" ? student.rollNo : "",
            name: typeof student.name === "string" ? student.name : "",
            email: typeof student.email === "string" ? student.email : "",
          }
        })

        setStudentData(validatedData)
        toast({
          title: "Success",
          description: `Loaded ${validatedData.length} student records`,
        })
      } catch (err) {
        console.error("Error parsing file:", err)
        setError("Failed to parse file. Please ensure it's a valid JSON file with the correct structure.")
        toast({
          title: "Error",
          description: "Failed to parse file. Please ensure it's a valid JSON file.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    reader.onerror = () => {
      setError("Error reading file")
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive",
      })
    }

    reader.readAsText(file)
  }

  // Use sample data for demonstration
  useEffect(() => {
    // This is just a small subset for demonstration
    const sampleData: Student[] = [
      { rollNo: "23P61A6701", name: "A ABHIRAM REDDY", email: "23p61a6701@vbithyd.ac.in" },
      { rollNo: "23P61A6702", name: "ABDUL AKMAL ALLAM", email: "23p61a6702@vbithyd.ac.in" },
      { rollNo: "23P61A6703", name: "ABHIJEET OZA", email: "23p61a6703@vbithyd.ac.in" },
      { rollNo: "23P61A6704", name: "ADAMA KOUSHIK REDDY", email: "23p61a6704@vbithyd.ac.in" },
      { rollNo: "23P61A6705", name: "ADELLI GANAPATHI", email: "23p61a6705@vbithyd.ac.in" },
      { rollNo: "23P61A6706", name: "ADIDALA NIDVITHA", email: "23p61a6706@vbithyd.ac.in" },
      { rollNo: "23P61A6707", name: "AKKINEPALLY VIJAY KUMAR", email: "23p61a6707@vbithyd.ac.in" },
      { rollNo: "23P61A6708", name: "ALLAKA HAINDHAVI", email: "23p61a6708@vbithyd.ac.in" },
      { rollNo: "23P61A6709", name: "ALLURI KIRAN", email: "23p61a6709@vbithyd.ac.in" },
      { rollNo: "23P61A6710", name: "AMBATI SAIKARTHIK", email: "23p61a6710@vbithyd.ac.in" },
      // Add a few test cases
      { rollNo: "23P61A6746", name: "", email: "23p61a6746@vbithyd.ac.in" }, // Missing name
      { rollNo: "TESTER", name: "Tester", email: "tester@tester.com" }, // Different email format
    ]

    setStudentData(sampleData)
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Student Credentials Management</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Student Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                accept=".json"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button className="relative">
                <Upload className="h-4 w-4 mr-2" />
                Upload JSON File
              </Button>
            </div>
            <p className="text-sm text-gray-500">Upload a JSON file containing student data</p>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="mt-4 flex items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-primary-600 border-t-transparent rounded-full"></div>
              <p>Processing file...</p>
            </div>
          )}
        </CardContent>
      </Card>

      <StudentCredentialsProcessor studentData={studentData} />
    </div>
  )
}
