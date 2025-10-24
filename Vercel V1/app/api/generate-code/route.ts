import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

// Use the provided API key
const GEMINI_API_KEY = "AIzaSyBgl-L1XzFr62P4L_XYAn1qcSVPhOoV-ms"

export async function POST(req: NextRequest) {
  try {
    const { message, prompt } = await req.json()
    const userPrompt = message || prompt

    if (!userPrompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContent(
      `Write code for: ${userPrompt}. Provide only the code without explanations.`,
    )
    const response = await result.response
    const generatedCode = response.text()

    if (!generatedCode) {
      throw new Error("No code generated")
    }

    return NextResponse.json({ code: generatedCode })
  } catch (error) {
    console.error("Code Generation Error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate code",
        code: "// I couldn't generate the code you requested.\n// Please try a different prompt or be more specific.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
