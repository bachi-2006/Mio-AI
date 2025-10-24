"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"

interface LogoProps {
  size?: number
  animated?: boolean
  onClick?: () => void
}

export function Logo({ size = 40, animated = true, onClick }: LogoProps) {
  const { theme } = useTheme()

  // Simpler animation variants
  const simpleAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <div className="relative cursor-pointer" style={{ width: size, height: size }} onClick={onClick}>
      {animated ? (
        <motion.svg width={size} height={size} viewBox="0 0 100 100" initial="hidden" animate="visible">
          {/* Outer circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={theme.primary}
            strokeWidth="2"
            fill="transparent"
            variants={simpleAnimation}
          />

          {/* M letter */}
          <motion.path
            d="M30,65 L40,35 L50,50 L60,35 L70,65"
            fill="transparent"
            stroke={theme.primary}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={simpleAnimation}
          />

          {/* Dot for the i */}
          <motion.circle cx="80" cy="35" r="4" fill={theme.primary} variants={simpleAnimation} />
        </motion.svg>
      ) : (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke={theme.primary} strokeWidth="2" fill="transparent" />
          <path
            d="M30,65 L40,35 L50,50 L60,35 L70,65"
            fill="transparent"
            stroke={theme.primary}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="80" cy="35" r="4" fill={theme.primary} />
        </svg>
      )}
    </div>
  )
}
