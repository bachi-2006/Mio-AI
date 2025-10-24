"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyRound } from "lucide-react"

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void
}

export function ApiKeySetup({ onApiKeySet }: ApiKeySetupProps) {
  // Use the provided API key as default
  const [apiKey, setApiKey] = useState("AIzaSyBgl-L1XzFr62P4L_XYAn1qcSVPhOoV-ms")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Store the API key in localStorage
      localStorage.setItem("gemini-api-key", apiKey)

      toast({
        title: "Success",
        description: "API key has been set successfully",
      })

      onApiKeySet(apiKey)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set API key",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Set Your Gemini API Key</CardTitle>
          <CardDescription>
            To use Mio AI, you need to provide your Gemini API key. You can get one from the Google AI Studio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <KeyRound className="h-4 w-4 text-gray-500" />
                <label htmlFor="apiKey" className="text-sm font-medium">
                  Gemini API Key
                </label>
              </div>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} style={{ background: "rgb(25, 62, 97)" }}>
              {isLoading ? "Validating..." : "Set API Key"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-xs text-gray-500">
            Your API key is stored locally in your browser and is never sent to our servers.
          </p>
          <a
            href="https://ai.google.dev/tutorials/setup"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline mt-2"
          >
            Learn how to get a Gemini API key
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
