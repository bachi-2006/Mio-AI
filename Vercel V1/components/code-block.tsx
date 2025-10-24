"use client"

import { useState } from "react"
import { Copy, RefreshCw, Volume2, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"
import { motion } from "framer-motion"

interface CodeBlockProps {
  code: string
  onRegenerate?: () => void
  language?: string
}

export function CodeBlock({ code, onRegenerate, language = "typescript" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)
  const { theme } = useTheme()

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(code)
    utterance.rate = 0.8 // Slower for code
    speechSynthesis.speak(utterance)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative rounded-lg overflow-hidden"
      style={{ backgroundColor: theme.secondary }}
    >
      <div className="flex items-center justify-between p-2 border-b" style={{ borderColor: theme.border }}>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="text-gray-400 hover:text-white">
            <Copy className="w-4 h-4 mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          {onRegenerate && (
            <Button variant="ghost" size="sm" onClick={onRegenerate} className="text-gray-400 hover:text-white">
              <RefreshCw className="w-4 h-4 mr-1" />
              Regenerate
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleSpeak} className="text-gray-400 hover:text-white">
            <Volume2 className="w-4 h-4 mr-1" />
            Read
          </Button>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLiked(true)}
              className={`${liked === true ? "text-green-500" : "text-gray-400"} hover:text-white`}
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLiked(false)}
              className={`${liked === false ? "text-red-500" : "text-gray-400"} hover:text-white`}
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </motion.div>
  )
}
