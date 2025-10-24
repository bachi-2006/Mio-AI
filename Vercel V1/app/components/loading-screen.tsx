"use client"

import { motion } from "framer-motion"
import { Logo } from "./logo"
import { AnimatedLoader } from "@/components/ui/animated-loader"

interface LoadingScreenProps {
  message?: string
  showLogo?: boolean
  type?: "fullscreen" | "inline"
}

export function LoadingScreen({ message = "Loading...", showLogo = true, type = "fullscreen" }: LoadingScreenProps) {
  if (type === "inline") {
    return (
      <div className="flex items-center justify-center p-8">
        <AnimatedLoader type="dots" size="md" text={message} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-900">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {showLogo && <Logo size={80} animated={true} />}

        <motion.h1
          className="mt-6 text-3xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          SATURDAY
        </motion.h1>

        <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <AnimatedLoader type="dots" size="lg" text={message} />
        </motion.div>
      </motion.div>
    </div>
  )
}
