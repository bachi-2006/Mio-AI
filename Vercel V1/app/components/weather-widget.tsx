"use client"

import { useState, useEffect } from "react"
import { CloudRain, MapPin } from "lucide-react"
import { getTelanganaWeather, type WeatherData } from "@/lib/services/utility-service"
import Image from "next/image"
import { motion } from "framer-motion"
import { SkeletonLoader } from "./skeleton-loader"

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeather() {
      try {
        setIsLoading(true)
        const weatherData = await getTelanganaWeather()

        if (!weatherData) {
          setError("Unable to fetch Telangana weather data")
          setIsLoading(false)
          return
        }

        setWeather(weatherData)
        setError(null)
      } catch (err) {
        setError("Error fetching Telangana weather data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()
  }, [])

  if (isLoading) {
    return (
      <div className="p-4 bg-white dark:bg-secondary-800 rounded-lg shadow-sm">
        <div className="flex items-center mb-2">
          <SkeletonLoader type="text" className="w-32" />
        </div>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <SkeletonLoader type="text" className="w-16 h-8" />
            <SkeletonLoader type="text" className="w-24" />
          </div>
          <SkeletonLoader type="avatar" className="h-16 w-16" />
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="p-4 bg-white dark:bg-secondary-800 rounded-lg shadow-sm">
        <p className="text-sm text-secondary-700 dark:text-secondary-300 flex items-center">
          <CloudRain className="h-4 w-4 mr-2 text-secondary-400" />
          {error || "Telangana weather data unavailable"}
        </p>
      </div>
    )
  }

  return (
    <motion.div
      className="p-4 bg-white dark:bg-secondary-800 rounded-lg shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-secondary-500 dark:text-secondary-400" />
            <h3 className="font-medium text-secondary-900 dark:text-white">{weather.location}, Telangana</h3>
          </div>

          <div className="mt-1">
            <p className="text-3xl font-bold text-secondary-900 dark:text-white">{weather.temperature}°C</p>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 capitalize">{weather.description}</p>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-secondary-500 dark:text-secondary-400">
            <div>
              <span className="block">Humidity</span>
              <span className="font-medium text-secondary-700 dark:text-secondary-300">{weather.humidity}%</span>
            </div>
            <div>
              <span className="block">Wind</span>
              <span className="font-medium text-secondary-700 dark:text-secondary-300">{weather.windSpeed} m/s</span>
            </div>
          </div>
        </div>

        {weather.icon && (
          <motion.div
            className="flex-shrink-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src={weather.icon || "/placeholder.svg"}
              alt={weather.description}
              width={64}
              height={64}
              className="w-16 h-16"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
