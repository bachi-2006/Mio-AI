import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { getApiKey } from "@/lib/auth-context"

async function testGeminiAPI() {
  try {
    const apiKey = getApiKey()

    if (!apiKey) {
      console.error("Missing Gemini API key")
      return false
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Simple prompt to test connection
    const result = await model.generateContent("Hello")
    const response = await result.response
    return response.text() ? true : false
  } catch (error) {
    console.error("Gemini API test failed:", error)
    return false
  }
}

export async function GET() {
  try {
    const geminiStatus = await testGeminiAPI()

    return NextResponse.json({
      ok: true,
      status: {
        gemini: geminiStatus ? "operational" : "failed",
      },
    })
  } catch (error) {
    console.error("API Status Check Error:", error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Service check failed",
        status: {
          gemini: "unknown",
        },
      },
      { status: 500 },
    )
  }
}
