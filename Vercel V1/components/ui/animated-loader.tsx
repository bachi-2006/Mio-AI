"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Logo } from "@/app/components/logo"

interface AnimatedLoaderProps {
  type?: "spinner" | "dots" | "pulse" | "logo" | "bar"
  size?: "sm" | "md" | "lg"
  color?: string
  text?: string
}

export function AnimatedLoader({ type = "logo", size = "md", color, text }: AnimatedLoaderProps) {
  const { theme } = useTheme()
  const loaderColor = color || theme.primary

  // Size mapping
  const sizeMap = {
    sm: { container: "h-8 w-8", text: "text-sm" },
    md: { container: "h-12 w-12", text: "text-base" },
    lg: { container: "h-16 w-16", text: "text-lg" },
  }

  // Spinner animation
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 1,
        ease: "linear",
      },
    },
  }

  // Dots animation
  const dotsContainerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const dotsVariants = {
    initial: { y: 0, opacity: 0.5 },
    animate: {
      y: [0, -10, 0],
      opacity: [0.5, 1, 0.5],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 1,
      },
    },
  }

  // Pulse animation
  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 1.5,
      },
    },
  }

  // Bar animation
  const barContainerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const barVariants = {
    initial: { height: 10 },
    animate: {
      height: [10, 30, 10],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 1,
        ease: "easeInOut",
      },
    },
  }

  // Logo animation
  const logoVariants = {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 10, -10, 10, 0],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 3,
        ease: "easeInOut",
      },
    },
  }

  // Render the appropriate loader based on type
  const renderLoader = () => {
    switch (type) {
      case "spinner":
        return (
          <motion.div
            className={`border-4 border-t-transparent rounded-full ${sizeMap[size].container}`}
            style={{ borderColor: `${loaderColor}40`, borderTopColor: loaderColor }}
            variants={spinnerVariants}
            animate="animate"
          />
        )

      case "dots":
        return (
          <motion.div className="flex space-x-2" variants={dotsContainerVariants} animate="animate">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="rounded-full"
                style={{
                  backgroundColor: loaderColor,
                  width: size === "sm" ? 6 : size === "md" ? 8 : 10,
                  height: size === "sm" ? 6 : size === "md" ? 8 : 10,
                }}
                variants={dotsVariants}
                initial="initial"
                animate="animate"
                custom={i}
              />
            ))}
          </motion.div>
        )

      case "pulse":
        return (
          <motion.div
            className={`rounded-full ${sizeMap[size].container}`}
            style={{ backgroundColor: loaderColor }}
            variants={pulseVariants}
            animate="animate"
          />
        )

      case "bar":
        return (
          <motion.div className="flex items-end space-x-1" variants={barContainerVariants} animate="animate">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 rounded-t-sm"
                style={{
                  backgroundColor: loaderColor,
                  width: size === "sm" ? 3 : size === "md" ? 4 : 5,
                }}
                variants={barVariants}
                initial="initial"
                animate="animate"
                custom={i}
              />
            ))}
          </motion.div>
        )

      case "logo":
      default:
        return (
          <motion.div variants={logoVariants} animate="animate">
            <Logo size={size === "sm" ? 30 : size === "md" ? 40 : 60} animated={false} />
          </motion.div>
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {renderLoader()}
      {text && (
        <p className={`mt-3 text-center ${sizeMap[size].text}`} style={{ color: loaderColor }}>
          {text}
        </p>
      )}
    </div>
  )
}
