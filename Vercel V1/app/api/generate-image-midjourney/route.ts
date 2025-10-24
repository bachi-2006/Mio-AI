import { type NextRequest, NextResponse } from "next/server"
import { Client } from "@gradio/client"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 })
    }

    // Connect to the Midjourney Gradio client
    const client = await Client.connect("mukaist/Midjourney")

    // Generate the image with a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Image generation timed out")), 60000) // 60 second timeout for Midjourney
    })

    const generationPromise = client.predict("/run", {
      prompt: prompt,
      negative_prompt: "blurry, distorted, low quality, ugly, bad anatomy",
      use_negative_prompt: true,
      style: "2560 x 1440", // High resolution style
      seed: Math.floor(Math.random() * 1000000),
      width: 512,
      height: 512,
      guidance_scale: 7.5,
      randomize_seed: true,
    })

    // Race between the generation and the timeout
    const result = (await Promise.race([generationPromise, timeoutPromise])) as any

    // Extract the image URL from the result
    const imageUrl = result.data[0]

    if (!imageUrl) {
      throw new Error("No image URL returned from model")
    }

    // Generate a description using the prompt
    const description = `Here's the image I generated based on your prompt: "${prompt}"`

    return NextResponse.json({
      imageUrl,
      description,
    })
  } catch (error) {
    console.error("Midjourney Image Generation Error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate image with Midjourney",
        description:
          "I couldn't generate the image with the Midjourney model. Please try again later or with a different prompt.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
