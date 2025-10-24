import { motion } from "framer-motion"
import { Copy, RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"
import { useState } from "react"

interface TerminalProps {
  content: string
  onRegenerate?: () => void
  onCopy?: () => void
}

export function Terminal({ content, onRegenerate, onCopy }: TerminalProps) {
  const { theme } = useTheme()
  const [liked, setLiked] = useState<boolean | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    onCopy?.()
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
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={handleCopy} className="hover:bg-gray-700/50">
            <Copy className="h-4 w-4" />
          </Button>
          {onRegenerate && (
            <Button variant="ghost" size="icon" onClick={onRegenerate} className="hover:bg-gray-700/50">
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLiked(true)}
            className={`hover:bg-gray-700/50 ${liked === true ? "text-green-500" : ""}`}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLiked(false)}
            className={`hover:bg-gray-700/50 ${liked === false ? "text-red-500" : ""}`}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4 font-mono text-sm overflow-x-auto">
        <pre className="whitespace-pre-wrap break-words" style={{ color: theme.accent }}>
          {content}
        </pre>
      </div>
    </motion.div>
  )
}
