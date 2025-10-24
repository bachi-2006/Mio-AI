import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import { getApiKey } from "@/lib/auth-context"

export async function POST(req: NextRequest) {
  try {
    const apiKey = getApiKey()

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API key. Please contact support." }, { status: 500 })
    }

    const formData = await req.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const imageBytes = await image.arrayBuffer()

    if (!imageBytes) {
      throw new Error("Failed to process image data")
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })

    const result = await model.generateContent([
      "Describe what you see in this image in detail, focusing on the main objects and their characteristics.",
      {
        inlineData: {
          mimeType: image.type,
          data: Buffer.from(imageBytes).toString("base64"),
        },
      },
    ])

    const response = await result.response
    const description = response.text()

    if (!description) {
      throw new Error("No description generated")
    }

    return NextResponse.json({ description })
  } catch (error) {
    console.error("Vision API Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to analyze image",
        details: error,
      },
      { status: 500 },
    )
  }
}
