"use client"
import { useChat } from "ai/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface ChatInterfaceProps {
  apiKey: string
}

export function ChatInterface({ apiKey }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    headers: { "X-API-Key": apiKey },
  })

  return (
    <div className="w-full p-4">
      {/* Chat Message Display Box */}
      <div className="h-[350px] overflow-y-auto mb-4 p-4 bg-gray-800 rounded-lg">
        {messages.map((message, i) => (
          <div key={i} className={`mb-3 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block px-3 py-2 rounded-lg ${message.role === "user" ? "bg-red-500 text-white" : "bg-yellow-500 text-black"}`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>

      {/* Input & Button */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="w-3/5 h-10 p-2 bg-gray-800 text-white border border-red-500 rounded-lg"
        />
        <Button
          type="submit"
          className="h-10 px-4 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          <Send className="h-4 w-4 mr-1" />
          Send
        </Button>
      </form>
    </div>
  )
}
