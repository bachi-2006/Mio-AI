import { useState } from "react"
import { Copy, RefreshCw, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
  code: string
  onRegenerate: () => void
}

export function CodeBlock({ code, onRegenerate }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(code)
    speechSynthesis.speak(utterance)
  }

  return (
    <div className="bg-gray-900 text-white rounded-lg p-4 relative w-full">
      <pre className="overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-2">
        <Button onClick={handleCopy} size="sm" variant="ghost">
          <Copy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button onClick={onRegenerate} size="sm" variant="ghost">
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </Button>
        <Button onClick={handleSpeak} size="sm" variant="ghost">
          <Volume2 className="w-4 h-4" />
          Read Aloud
        </Button>
      </div>
    </div>
  )
}
