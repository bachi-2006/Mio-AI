"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Github, Mail, ArrowRight, User, Lock, AlertCircle } from "lucide-react"
// Update the import to use the provider
import { useAuth } from "@/components/providers/AuthProvider"
import { useAuth0 } from "@auth0/auth0-react"
import { useToast } from "@/components/ui/use-toast"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedInput } from "@/components/ui/animated-input"
import { AnimatedLoader } from "@/components/ui/animated-loader"
import { Logo } from "./logo"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fadeIn, fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerItem } from "@/lib/animation-variants"

interface SignupData {
  email: string
  password: string
  name: string
}

export function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({})
  const [showLoginHelp, setShowLoginHelp] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const {
    loginWithRedirect,
    isAuthenticated: isAuth0Authenticated,
    isLoading: isAuth0Loading,
    user: auth0User,
  } = useAuth0()
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated || (isAuth0Authenticated && auth0User)) {
      router.push("/chat")
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, isAuth0Authenticated, auth0User, router])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handlePasswordInfo = () => {
    setShowLoginHelp(!showLoginHelp)
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    if (isSignup && !name) {
      newErrors.name = "Name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      if (isSignup) {
        // Handle signup
        toast({
          title: "Signup successful",
          description: "Please login with your credentials",
        })
        setIsSignup(false)
        setPassword("")
      } else {
        // Handle login
        const success = await login(email, password)
        if (success) {
          toast({
            title: "Login successful",
            description: "Welcome to Mio AI!",
          })
          router.push("/chat")
        } else {
          // If login returns false but no error was thrown, it means the name dialog is showing
          // We don't need to do anything here as the dialog will handle the rest
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAuth0Login = async (provider: string) => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: `${window.location.origin}/callback`,
        },
      })
    } catch (error) {
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    }
  }

  if (isLoading || isAuth0Loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-secondary-900">
        <AnimatedLoader type="logo" size="lg" text="Loading..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-primary-900 to-secondary-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Left side - Branding and information */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 relative z-10"
        variants={fadeInLeft}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="max-w-md mx-auto md:mx-0">
          <motion.div
            className="flex items-center mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Logo size={48} />
            <h1 className="text-4xl font-bold text-white ml-3">Mio AI</h1>
          </motion.div>

          <motion.h2
            className="text-3xl font-bold text-white mb-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            Your AI Assistant for Everything
          </motion.h2>

          <motion.p
            className="text-secondary-200 mb-8 text-lg"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            Mio AI helps you generate text, code, and images with state-of-the-art AI models. Join thousands of users
            who are already enhancing their productivity.
          </motion.p>

          <motion.div
            className="grid grid-cols-3 gap-4 mb-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              { title: "Chat", description: "Natural conversations with advanced AI" },
              { title: "Code", description: "Generate and explain code in any language" },
              { title: "Images", description: "Create stunning visuals from text descriptions" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-secondary-200 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right side - Login/Signup form */}
      <motion.div
        className="w-full md:w-1/2 flex items-center justify-center p-8 relative z-10"
        variants={fadeInRight}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="w-full max-w-md"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignup ? "signup" : "login"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-secondary-900 dark:text-white">
                  {isSignup ? "Create an account" : "Welcome back"}
                </h2>

                {showLoginHelp && (
                  <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
                      <p className="mb-1">
                        <strong>Login Tip:</strong> Your password is the part of your email before the @ symbol (e.g.,
                        for "john@example.com", use "john").
                      </p>
                      <p>You can also use the default password "123456" if needed.</p>
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence>
                    {isSignup && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AnimatedInput
                          label="Full Name"
                          icon={<User className="h-4 w-4 text-secondary-500" />}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          error={errors.name}
                          animation="slide"
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatedInput
                    label="Email Address"
                    icon={<Mail className="h-4 w-4 text-secondary-500" />}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    error={errors.email}
                    animation="slide"
                    required
                  />

                  <div className="relative">
                    <AnimatedInput
                      label={
                        <div className="flex items-center">
                          <span>Password</span>
                          <button
                            type="button"
                            onClick={handlePasswordInfo}
                            className="ml-1 text-primary-500 hover:text-primary-600 text-xs underline"
                          >
                            Need help?
                          </button>
                        </div>
                      }
                      icon={<Lock className="h-4 w-4 text-secondary-500" />}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      error={errors.password}
                      animation="slide"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {!isSignup && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          type="checkbox"
                          className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300"
                        >
                          Remember me
                        </label>
                      </div>
                      <a
                        href="#"
                        className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Forgot password?
                      </a>
                    </div>
                  )}

                  <AnimatedButton
                    type="submit"
                    variant="gradient"
                    animation="scale"
                    isLoading={isSubmitting}
                    loadingText={isSignup ? "Creating account..." : "Signing in..."}
                    disabled={isSubmitting}
                    className="w-full py-2.5 text-base font-medium"
                  >
                    {isSignup ? "Create account" : "Sign in"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </AnimatedButton>
                </form>

                {!isSignup && (
                  <>
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-secondary-300 dark:border-secondary-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white dark:bg-secondary-800 text-secondary-500 dark:text-secondary-400">
                            Or continue with
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <AnimatedButton
                          type="button"
                          onClick={() => handleAuth0Login("auth0")}
                          variant="outline"
                          animation="subtle"
                          className="w-full py-2.5"
                        >
                          <Mail className="w-5 h-5 mr-2" />
                          <span>Auth0</span>
                        </AnimatedButton>
                        <AnimatedButton
                          type="button"
                          onClick={() => handleAuth0Login("github")}
                          variant="outline"
                          animation="subtle"
                          className="w-full py-2.5"
                        >
                          <Github className="w-5 h-5 mr-2" />
                          <span>GitHub</span>
                        </AnimatedButton>
                      </div>
                    </div>
                  </>
                )}

                <motion.p
                  className="mt-6 text-center text-sm text-secondary-700 dark:text-secondary-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(!isSignup)
                      setPassword("")
                      setName("")
                      setErrors({})
                    }}
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    {isSignup ? "Sign in" : "Sign up"}
                  </button>
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage
