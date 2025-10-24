// Utility service for time, location, and weather information

// OpenWeather API key
const OPENWEATHER_API_KEY = "67709c2e497bf79b688a180ce9fe9f26"

export interface WeatherData {
  location: string
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  feelsLike: number
}

export interface LocationData {
  city: string
  country: string
  latitude: number
  longitude: number
}

// Default location (Telangana, India)
const DEFAULT_LOCATION: LocationData = {
  city: "Hyderabad",
  country: "IN",
  latitude: 17.385,
  longitude: 78.4867,
}

// Get current time in a specific format
export function getCurrentTime(format: "short" | "medium" | "long" = "medium"): string {
  const now = new Date()

  switch (format) {
    case "short":
      return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    case "long":
      return now.toLocaleString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    case "medium":
    default:
      return now.toLocaleString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
  }
}

// Get current date in a specific format
export function getCurrentDate(format: "short" | "medium" | "long" = "medium"): string {
  const now = new Date()

  switch (format) {
    case "short":
      return now.toLocaleDateString()
    case "long":
      return now.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    case "medium":
    default:
      return now.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
  }
}

// Get user's location using browser geolocation API with fallback
export async function getUserLocation(): Promise<LocationData> {
  return new Promise((resolve) => {
    // Always resolve with the default location (Telangana/Hyderabad)
    // This avoids geolocation permission issues entirely
    resolve(DEFAULT_LOCATION)

    // The code below is kept for reference but not used
    /*
    // Check if geolocation is available
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser")
      resolve(DEFAULT_LOCATION)
      return
    }

    // Try to get user's location with a timeout
    const timeoutId = setTimeout(() => {
      console.log("Geolocation request timed out")
      resolve(DEFAULT_LOCATION)
    }, 5000)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId)
        try {
          const { latitude, longitude } = position.coords
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${OPENWEATHER_API_KEY}`,
          )

          if (!response.ok) {
            console.log("Failed to fetch location data, using fallback")
            resolve(DEFAULT_LOCATION)
            return
          }

          const data = await response.json()
          if (data && data.length > 0) {
            resolve({
              city: data[0].name,
              country: data[0].country,
              latitude,
              longitude,
            })
          } else {
            resolve(DEFAULT_LOCATION)
          }
        } catch (error) {
          console.error("Error getting location details:", error)
          resolve(DEFAULT_LOCATION)
        }
      },
      (error) => {
        clearTimeout(timeoutId)
        console.error("Geolocation error:", error)
        resolve(DEFAULT_LOCATION)
      },
      { timeout: 10000, enableHighAccuracy: false, maximumAge: 0 },
    )
    */
  })
}

// Get weather data for a location
export async function getWeatherData(latitude: number, longitude: number): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const data = await response.json()

    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like),
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return null
  }
}

// Get weather data for a city by name
export async function getWeatherByCity(city = "Hyderabad"): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const data = await response.json()

    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like),
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return null
  }
}

// Get Telangana weather directly
export async function getTelanganaWeather(): Promise<WeatherData | null> {
  return getWeatherByCity("Hyderabad,Telangana,IN")
}
