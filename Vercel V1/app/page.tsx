"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { MessageSquare, Code, Mic, ImageIcon, ArrowRight, Sparkles, ChevronRight } from "lucide-react"
import LoginPage from "./components/login-page"
// Import useAuth from the providers directory instead of directly from auth-context
import { useAuth } from "@/components/providers/AuthProvider"
import { AnimatedLoader } from "@/components/ui/animated-loader"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Logo } from "./components/logo"
import {
  fadeIn,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  staggerItem,
  pulse,
} from "@/lib/animation-variants"

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const router = useRouter()
  const { isAuthenticated, isLoading, loginWithAuth0 } = useAuth()
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/chat")
    }
  }, [isAuthenticated, isLoading, router])

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: MessageSquare,
      title: "Smart Chat",
      description: "Engage in natural conversations powered by advanced AI technology.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Code,
      title: "Code Assistant",
      description: "Get help with programming and technical questions with intelligent suggestions.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Mic,
      title: "Voice Interaction",
      description: "Natural voice conversations with advanced speech recognition.",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: ImageIcon,
      title: "Image Generation",
      description: "Create unique images from text descriptions with stunning detail.",
      color: "from-rose-500 to-pink-600",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-900 to-secondary-900">
        <AnimatedLoader type="logo" size="lg" text="Loading Mio AI..." />
      </div>
    )
  }

  if (showLogin) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-900 to-secondary-950 text-white overflow-hidden">
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
        <motion.div
          className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <header className="container mx-auto p-6 flex justify-between items-center relative z-10">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo size={48} />
          <h1 className="text-3xl font-bold text-white ml-3">Mio AI</h1>
        </motion.div>
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatedButton
            onClick={() => setShowLogin(true)}
            variant="gradient"
            animation="bounce"
            className="bg-white text-primary-600 hover:bg-primary-50"
          >
            Sign In
          </AnimatedButton>
        </motion.nav>
      </header>

      <main className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div className="lg:w-1/2" variants={fadeInLeft} initial="hidden" animate="visible">
            <motion.h2
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              Your Intelligent AI Assistant
            </motion.h2>
            <motion.p
              className="text-xl mb-8 text-secondary-200"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              Experience the next generation of AI with multiple models and interaction modes
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <AnimatedButton
                onClick={() => setShowLogin(true)}
                variant="gradient"
                animation="scale"
                size="lg"
                className="group"
              >
                Get Started For Free
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </AnimatedButton>

              <AnimatedButton
                variant="outline"
                animation="subtle"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  const featuresSection = document.getElementById("features")
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Explore Features
              </AnimatedButton>
            </motion.div>

            <motion.div
              className="mt-8 flex items-center text-secondary-300"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              <motion.div animate={pulse}>
                <Sparkles className="h-5 w-5 mr-2 text-primary-500" />
              </motion.div>
              <span>Powered by state-of-the-art AI models</span>
            </motion.div>
          </motion.div>

          <motion.div className="lg:w-1/2" variants={fadeInRight} initial="hidden" animate="visible">
            <div id="features" className="relative">
              {/* Feature showcase with 3D card effect */}
              <motion.div
                className="relative perspective-1000"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence mode="wait">
                  {features.map(
                    (feature, index) =>
                      index === activeFeature && (
                        <motion.div
                          key={feature.title}
                          className={`w-full p-8 rounded-2xl bg-gradient-to-br ${feature.color} shadow-xl`}
                          initial={{ opacity: 0, rotateX: 10, y: 20 }}
                          animate={{ opacity: 1, rotateX: 0, y: 0 }}
                          exit={{ opacity: 0, rotateX: -10, y: -20 }}
                          transition={{ duration: 0.5, type: "spring" }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/20 rounded-lg">
                              <feature.icon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                              <p className="text-white/80">{feature.description}</p>
                            </div>
                          </div>

                          <div className="mt-6 flex justify-between items-center">
                            <div className="flex space-x-1">
                              {features.map((_, i) => (
                                <button
                                  key={i}
                                  className={`w-2 h-2 rounded-full transition-all ${i === activeFeature ? "bg-white w-6" : "bg-white/50"}`}
                                  onClick={() => setActiveFeature(i)}
                                />
                              ))}
                            </div>

                            <button
                              className="text-white/80 hover:text-white flex items-center text-sm font-medium"
                              onClick={() => setActiveFeature((activeFeature + 1) % features.length)}
                            >
                              Next feature
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                          </div>
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Feature cards in grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                    variants={staggerItem}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-lg inline-block mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-secondary-300">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      <motion.footer
        className="mt-24 py-12 border-t border-white/10 relative z-10"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Logo size={32} />
              <span className="text-xl font-bold ml-2">Mio AI</span>
            </div>

            <div className="text-secondary-400 text-sm">© {new Date().getFullYear()} Mio AI</div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
