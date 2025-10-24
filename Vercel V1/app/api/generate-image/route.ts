import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      negative_prompt = "blurry, distorted, low quality, ugly, bad anatomy",
      style = "realistic",
      guidance_scale = 7.5,
      width = 512,
      height = 512,
    } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 })
    }

    // Enhance prompt based on style
    let enhancedPrompt = prompt
    if (style === "anime") {
      enhancedPrompt = `${prompt}, anime style, anime art, detailed anime drawing`
    } else if (style === "digital-art") {
      enhancedPrompt = `${prompt}, digital art, digital painting, detailed digital illustration`
    } else if (style === "oil-painting") {
      enhancedPrompt = `${prompt}, oil painting, detailed brushstrokes, canvas texture`
    } else if (style === "watercolor") {
      enhancedPrompt = `${prompt}, watercolor painting, soft colors, watercolor texture`
    } else if (style === "pixel-art") {
      enhancedPrompt = `${prompt}, pixel art, 8-bit style, pixelated`
    } else if (style === "sketch") {
      enhancedPrompt = `${prompt}, pencil sketch, hand-drawn, detailed sketch`
    } else if (style === "comic") {
      enhancedPrompt = `${prompt}, comic book style, comic art, bold lines`
    } else if (style === "3d-render") {
      enhancedPrompt = `${prompt}, 3D render, 3D modeling, realistic 3D`
    } else {
      // Default to realistic
      enhancedPrompt = `${prompt}, realistic, detailed, high quality photograph`
    }

    // Call the runware API
    const response = await fetch("https://api.runware.ai/v1/generate/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer tHFg5w2lpN03QhV6mIgbVWL29fvStLF3",
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        width: width,
        height: height,
        num_images: 1,
        model: "stable-diffusion-xl",
        guidance_scale: guidance_scale,
        negative_prompt: negative_prompt,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("runware API error response:", errorText)
      throw new Error(`runware API error: ${errorText}`)
    }

    const data = await response.json()

    if (!data.images || data.images.length === 0) {
      throw new Error("No image returned from model")
    }

    // runware API returns base64 encoded images
    const imageUrl = `data:image/jpeg;base64,${data.images[0]}`

    // Generate a description using the prompt
    const description = `Here's the image I generated based on your prompt: "${prompt}"`

    return NextResponse.json({
      imageUrl,
      description,
    })
  } catch (error) {
    console.error("Image Generation Error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate image",
        description: "I couldn't generate the image you requested. Please try a different prompt.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
