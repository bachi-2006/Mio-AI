"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-900 to-secondary-900 text-white p-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center mb-6">
        <span className="text-2xl font-bold text-white">!</span>
      </div>
      <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
      <p className="text-center max-w-md mb-8 text-secondary-200">
        We apologize for the inconvenience. Please try again or return to the home page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-secondary-700 hover:bg-secondary-800 rounded-lg font-medium transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
