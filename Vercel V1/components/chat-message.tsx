"use client"
import { Copy, RefreshCw, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "./code-block"
import { useTheme } from "@/lib/theme-context"
import { formatText } from "@/lib/text-formatter"
import Image from "next/image"

interface ChatMessageProps {
  content: string
  role: "user" | "assistant"
  onRegenerate?: () => void
  onCopy?: () => void
  pinned?: boolean
  onPin?: () => void
  mode?: string
  imageUrl?: string
  error?: boolean
  fallbackUsed?: boolean
}

export function ChatMessage({
  content,
  role,
  onRegenerate,
  onCopy,
  pinned,
  onPin,
  mode,
  imageUrl,
  error = false,
  fallbackUsed = false,
}: ChatMessageProps) {
  const { theme } = useTheme()
  const isCode = mode === "code" && role === "assistant"
  const isImage = mode === "image" && imageUrl

  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${isCode ? "w-full" : ""}`}>
        {isCode ? (
          <CodeBlock code={content} onRegenerate={onRegenerate} />
        ) : (
          <div
            className={`p-4 rounded-lg shadow-lg backdrop-blur-sm relative group ${
              error ? "border-l-4 border-red-500" : ""
            }`}
            style={{
              backgroundColor: role === "user" ? `${theme.primary}20` : `${theme.accent}10`,
            }}
          >
            <div
              className="prose prose-invert max-w-none"
              style={{ fontFamily: "Segoe UI" }}
              dangerouslySetInnerHTML={{
                __html: formatText(content),
              }}
            />

            {isImage && (
              <div className="mt-4 relative">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt="Generated image"
                    width={512}
                    height={512}
                    className="max-w-full h-auto"
                    unoptimized // Since we're using data URLs
                  />
                </div>
                {fallbackUsed && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                    Fallback Model
                  </div>
                )}
              </div>
            )}

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button variant="ghost" size="icon" onClick={onCopy} className="text-gray-400 hover:text-white">
                <Copy className="h-4 w-4" />
              </Button>
              {role === "assistant" && (
                <>
                  <Button variant="ghost" size="icon" onClick={onRegenerate} className="text-gray-400 hover:text-white">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  {onPin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onPin}
                      className={`${pinned ? "text-yellow-500" : "text-gray-400"} hover:text-white`}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
