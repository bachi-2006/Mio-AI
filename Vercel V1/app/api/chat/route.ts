import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import { getCurrentTime, getCurrentDate, getWeatherByCity } from "@/lib/services/utility-service"

// Use the provided API key
const GEMINI_API_KEY = "AIzaSyBgl-L1XzFr62P4L_XYAn1qcSVPhOoV-ms"

// Function to check if the message is asking about time
function isTimeQuery(message: string): boolean {
  const timeRegex = /what(?:'s| is) the (?:current )?time|(?:current )?time|what time is it/i
  return timeRegex.test(message)
}

// Function to check if the message is asking about date
function isDateQuery(message: string): boolean {
  const dateRegex = /what(?:'s| is) (?:the )?(?:current )?date|what day is (?:it|today)|(?:current )?date/i
  return dateRegex.test(message)
}

// Function to check if the message is asking about weather
function isWeatherQuery(message: string): boolean {
  const weatherRegex = /weather(?: in | for )?|how(?:'s| is) the weather(?: in | for )?/i
  return weatherRegex.test(message)
}

// Function to extract location from weather query
function extractLocationFromWeatherQuery(message: string): string | null {
  const locationRegex = /weather(?: in | for )([a-zA-Z\s]+)|how(?:'s| is) the weather(?: in | for )([a-zA-Z\s]+)/i
  const match = message.match(locationRegex)

  if (match && (match[1] || match[2])) {
    return (match[1] || match[2]).trim()
  }

  return null
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Handle special queries directly
    if (isTimeQuery(message)) {
      const time = getCurrentTime("long")
      return NextResponse.json({ response: `The current time is ${time}.` })
    }

    if (isDateQuery(message)) {
      const date = getCurrentDate("long")
      return NextResponse.json({ response: `Today's date is ${date}.` })
    }

    if (isWeatherQuery(message)) {
      const location = extractLocationFromWeatherQuery(message)

      if (location) {
        const weatherData = await getWeatherByCity(location)

        if (weatherData) {
          const response = `The current weather in ${weatherData.location} is ${weatherData.description} with a temperature of ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C). The humidity is ${weatherData.humidity}% and wind speed is ${weatherData.windSpeed} m/s.`
          return NextResponse.json({ response })
        }
      }

      // If we couldn't get weather data, fall back to AI
    }

    // For all other queries, use Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContent(message)
    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error("No response generated")
    }

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
