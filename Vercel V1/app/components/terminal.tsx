import { motion } from "framer-motion"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface TerminalProps {
  content: string
}

export function Terminal({ content }: TerminalProps) {
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative bg-gray-900 rounded-lg p-4 font-mono text-sm"
    >
      <div className="flex space-x-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
        onClick={handleCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <pre className="whitespace-pre-wrap break-words text-green-400 mt-2">{content}</pre>
    </motion.div>
  )
}
