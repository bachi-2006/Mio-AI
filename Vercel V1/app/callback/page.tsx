"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth0 } from "@auth0/auth0-react"

export default function CallbackPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, error } = useAuth0()

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        console.error("Authentication error:", error)
        router.push("/")
      } else if (isAuthenticated) {
        router.push("/chat")
      } else {
        router.push("/")
      }
    }
  }, [isLoading, isAuthenticated, error, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
        <span className="text-2xl font-bold text-white">M</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-4">Authenticating...</h1>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}
