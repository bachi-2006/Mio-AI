"use client"

import { motion } from "framer-motion"

interface SkeletonLoaderProps {
  type?: "text" | "card" | "image" | "avatar" | "button"
  count?: number
  className?: string
}

export function SkeletonLoader({ type = "text", count = 1, className = "" }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case "text":
        return <div className={`h-4 bg-gray-300 dark:bg-gray-700 rounded ${className}`} />
      case "card":
        return <div className={`h-32 bg-gray-300 dark:bg-gray-700 rounded-lg ${className}`} />
      case "image":
        return <div className={`aspect-square bg-gray-300 dark:bg-gray-700 rounded-lg ${className}`} />
      case "avatar":
        return <div className={`h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full ${className}`} />
      case "button":
        return <div className={`h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-md ${className}`} />
      default:
        return <div className={`h-4 bg-gray-300 dark:bg-gray-700 rounded ${className}`} />
    }
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  )
}
