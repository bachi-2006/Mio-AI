"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  animation?: "slide" | "fade" | "scale" | "none"
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, type, label, error, icon, animation = "slide", ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue)

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value)
      props.onChange?.(e)
    }

    // Animation variants
    const getInputVariants = () => {
      switch (animation) {
        case "slide":
          return {
            rest: {
              borderColor: error ? "rgb(239, 68, 68)" : "rgb(226, 232, 240)",
              transition: { duration: 0.2 },
            },
            focus: {
              borderColor: error ? "rgb(239, 68, 68)" : "rgb(99, 102, 241)",
              transition: { duration: 0.2 },
            },
          }
        case "fade":
          return {
            rest: {
              opacity: 0.9,
              borderColor: error ? "rgb(239, 68, 68)" : "rgb(226, 232, 240)",
              transition: { duration: 0.2 },
            },
            focus: {
              opacity: 1,
              borderColor: error ? "rgb(239, 68, 68)" : "rgb(99, 102, 241)",
              transition: { duration: 0.2 },
            },
          }
        case "scale":
          return {
            rest: {
              scale: 1,
              borderColor: error ? "rgb(239, 68, 68)" : "rgb(226, 232, 240)",
              transition: { duration: 0.2 },
            },
            focus: {
              scale: 1.01,
              borderColor: error ? "rgb(239, 68, 68)" : "rgb(99, 102, 241)",
              transition: { duration: 0.2 },
            },
          }
        case "none":
        default:
          return {
            rest: {
              borderColor: error ? "rgb(239, 68, 68)" : "rgb(226, 232, 240)",
            },
            focus: {
              borderColor: error ? "rgb(239, 68, 68)" : "rgb(99, 102, 241)",
            },
          }
      }
    }

    const getLabelVariants = () => {
      if (!label) return {}

      return {
        rest: {
          y: 0,
          scale: 1,
          color: error ? "rgb(239, 68, 68)" : "rgb(100, 116, 139)",
          transition: { duration: 0.2 },
        },
        focus: {
          y: -24,
          scale: 0.85,
          color: error ? "rgb(239, 68, 68)" : "rgb(99, 102, 241)",
          transition: { duration: 0.2 },
        },
        filled: {
          y: -24,
          scale: 0.85,
          color: error ? "rgb(239, 68, 68)" : "rgb(100, 116, 139)",
          transition: { duration: 0.2 },
        },
      }
    }

    return (
      <div className="relative">
        <motion.div
          className="relative"
          variants={getInputVariants()}
          initial="rest"
          animate={isFocused ? "focus" : "rest"}
        >
          {label && (
            <motion.label
              className="absolute left-3 pointer-events-none origin-left"
              style={{ top: "50%", transform: "translateY(-50%)" }}
              variants={getLabelVariants()}
              initial="rest"
              animate={isFocused ? "focus" : hasValue ? "filled" : "rest"}
            >
              {label}
            </motion.label>
          )}

          <div className="relative">
            {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{icon}</div>}

            <input
              type={type}
              className={cn(
                "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                icon && "pl-10",
                error && "border-red-500 focus-visible:ring-red-500",
                className,
              )}
              ref={ref}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...props}
            />
          </div>
        </motion.div>

        {error && (
          <motion.p
            className="mt-1 text-sm text-red-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  },
)
AnimatedInput.displayName = "AnimatedInput"

export { AnimatedInput }
