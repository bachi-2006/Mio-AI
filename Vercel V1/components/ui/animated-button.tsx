"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { buttonHover, buttonTap } from "@/lib/animation-variants"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        gradient: "bg-gradient-to-r from-primary-600 to-primary-400 text-white hover:brightness-110",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        subtle: "transition-all duration-300",
        bounce: "transition-all duration-300",
        glow: "transition-all duration-300",
        scale: "transition-all duration-300",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "subtle",
    },
  },
)

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, animation, asChild = false, isLoading, loadingText, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Different animation variants based on the animation prop
    const getAnimationProps = () => {
      switch (animation) {
        case "bounce":
          return {
            whileHover: { scale: 1.05, y: -3 },
            whileTap: { scale: 0.98 },
          }
        case "glow":
          return {
            whileHover: {
              boxShadow: `0 0 15px 2px ${variant === "primary" ? "rgba(79, 70, 229, 0.6)" : "rgba(255, 255, 255, 0.2)"}`,
            },
            whileTap: { scale: 0.98 },
          }
        case "scale":
          return {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.98 },
          }
        case "subtle":
        default:
          return {
            whileHover: buttonHover,
            whileTap: buttonTap,
          }
      }
    }

    return (
      <motion.div {...getAnimationProps()}>
        <Comp
          className={cn(buttonVariants({ variant, size, animation, className }))}
          ref={ref}
          disabled={isLoading || props.disabled}
          {...props}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {loadingText || "Loading..."}
            </div>
          ) : (
            children
          )}
        </Comp>
      </motion.div>
    )
  },
)
AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton, buttonVariants }
