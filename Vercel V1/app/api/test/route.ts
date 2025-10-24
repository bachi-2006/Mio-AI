import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

// Use the provided API key
const GEMINI_API_KEY = "AIzaSyBgl-L1XzFr62P4L_XYAn1qcSVPhOoV-ms"

export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json()

    // Use the provided API key if available, otherwise use the default one
    const key = apiKey || GEMINI_API_KEY

    if (!key) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(key)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Simple test to validate the API key
    const result = await model.generateContent("Hello")
    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error("Failed to generate content")
    }

    return NextResponse.json({ success: true, message: "API key is valid" })
  } catch (error) {
    console.error("API Key Test Error:", error)
    return NextResponse.json(
      {
        error: "Invalid API key",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    )
  }
}
