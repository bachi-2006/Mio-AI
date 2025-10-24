"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { validateCredentials } from "@/lib/auth"
import { useTheme } from "@/lib/theme-context"
import { analyticsStore } from "@/lib/analytics"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  isSignIn: boolean
}

export function AuthModal({ isOpen, onClose, isSignIn }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { setTesterMode } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = validateCredentials(email, password)
      if (!user) {
        throw new Error("Invalid credentials")
      }

      const isTester = user.id === "tester"
      setTesterMode(isTester)

      // Add session to analytics
      analyticsStore.addSession({
        id: user.id,
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString(),
        isTester,
      })

      // Store user info
      localStorage.setItem("isSignedIn", "true")
      localStorage.setItem("userName", user.name)
      localStorage.setItem("userEmail", user.email)
      localStorage.setItem("userId", user.id)
      localStorage.setItem("isTester", String(isTester))

      // Successful login
      toast({
        title: "Success",
        description: `Welcome to SATURDAY, ${user.name}!${isTester ? " Tester mode activated." : ""}`,
      })

      // Close modal and redirect
      onClose()
      router.push("/chat")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900/90 p-8 rounded-lg border border-gray-800 shadow-xl w-full max-w-md mx-4"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-red-500">Welcome to SATURDAY</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={isLoading}>
              {isLoading ? "Please wait..." : isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
