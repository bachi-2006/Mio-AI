"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Share, RefreshCw, Sparkles, ImageIcon, Wand2, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface ImageGenerationProps {
  onImageGenerated: (imageUrl: string, prompt: string) => void
}

export function ImageGeneration({ onImageGenerated }: ImageGenerationProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("prompt")
  const [imageStyle, setImageStyle] = useState("realistic")
  const [negativePrompt, setNegativePrompt] = useState("blurry, distorted, low quality, ugly, bad anatomy")
  const [useNegativePrompt, setUseNegativePrompt] = useState(true)
  const [guidanceScale, setGuidanceScale] = useState(7.5)
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [recentPrompts, setRecentPrompts] = useState<string[]>([])
  const [imageLoadError, setImageLoadError] = useState(false)
  const promptInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Load recent prompts from localStorage
  useEffect(() => {
    try {
      const savedPrompts = localStorage.getItem("recentImagePrompts")
      if (savedPrompts) {
        setRecentPrompts(JSON.parse(savedPrompts).slice(0, 5))
      }
    } catch (e) {
      console.error("Error loading recent prompts:", e)
    }
  }, [])

  // Save recent prompts to localStorage
  const saveRecentPrompt = (newPrompt: string) => {
    try {
      const updatedPrompts = [newPrompt, ...recentPrompts.filter((p) => p !== newPrompt)].slice(0, 5)
      setRecentPrompts(updatedPrompts)
      localStorage.setItem("recentImagePrompts", JSON.stringify(updatedPrompts))
    } catch (e) {
      console.error("Error saving recent prompts:", e)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for the image you want to generate.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)
    setImageLoadError(false)

    try {
      // Calculate dimensions based on aspect ratio
      let width = 512
      let height = 512

      if (aspectRatio === "16:9") {
        width = 640
        height = 360
      } else if (aspectRatio === "4:3") {
        width = 640
        height = 480
      } else if (aspectRatio === "3:4") {
        width = 480
        height = 640
      } else if (aspectRatio === "9:16") {
        width = 360
        height = 640
      }

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          negative_prompt: useNegativePrompt ? negativePrompt : "",
          style: imageStyle,
          guidance_scale: guidanceScale,
          width,
          height,
        }),
      })

      if (!response.ok) {
        throw new Error(`Image generation failed: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.imageUrl) {
        throw new Error("No image URL returned from model")
      }

      // Save to recent prompts
      saveRecentPrompt(prompt)

      setGeneratedImage(data.imageUrl)
      onImageGenerated(data.imageUrl, prompt)
    } catch (error) {
      console.error("Image generation error:", error)
      setError(error instanceof Error ? error.message : "Failed to generate image")
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return

    try {
      // For base64 images
      if (generatedImage.startsWith("data:")) {
        const link = document.createElement("a")
        link.href = generatedImage
        link.download = `mio-ai-image-${Date.now()}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // For URL images
        fetch(generatedImage)
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `mio-ai-image-${Date.now()}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
          })
      }

      toast({
        title: "Image downloaded",
        description: "Your generated image has been downloaded.",
      })
    } catch (error) {
      console.error("Error downloading image:", error)
      toast({
        title: "Download failed",
        description: "There was an error downloading the image.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (!generatedImage || !navigator.share) return

    try {
      let blob: Blob

      // For base64 images
      if (generatedImage.startsWith("data:")) {
        const base64Response = await fetch(generatedImage)
        blob = await base64Response.blob()
      } else {
        // For URL images
        const response = await fetch(generatedImage)
        blob = await response.blob()
      }

      const file = new File([blob], "mio-ai-image.jpg", { type: "image/jpeg" })

      await navigator.share({
        title: "Image generated by Mio AI",
        files: [file],
      })
    } catch (error) {
      console.error("Error sharing image:", error)
      toast({
        title: "Sharing failed",
        description: "Failed to share the image.",
        variant: "destructive",
      })
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const handleUseRecentPrompt = (recentPrompt: string) => {
    setPrompt(recentPrompt)
    if (promptInputRef.current) {
      promptInputRef.current.focus()
    }
  }

  const handleImageLoadError = () => {
    setImageLoadError(true)
    toast({
      title: "Image loading error",
      description: "The generated image couldn't be loaded. Please try regenerating.",
      variant: "destructive",
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="prompt" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Prompt
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Advanced Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Input
                ref={promptInputRef}
                type="text"
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="pr-24"
                disabled={isGenerating}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isGenerating && prompt.trim()) {
                    handleGenerate()
                  }
                }}
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="absolute right-1 top-1 h-8"
                size="sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>

            {recentPrompts.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Recent prompts:</h3>
                <div className="flex flex-wrap gap-2">
                  {recentPrompts.map((recentPrompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleUseRecentPrompt(recentPrompt)}
                      className="text-xs truncate max-w-[200px]"
                    >
                      {recentPrompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor="style">Image Style</Label>
                    <Select value={imageStyle} onValueChange={setImageStyle}>
                      <SelectTrigger id="style">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realistic">Realistic</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                        <SelectItem value="digital-art">Digital Art</SelectItem>
                        <SelectItem value="oil-painting">Oil Painting</SelectItem>
                        <SelectItem value="watercolor">Watercolor</SelectItem>
                        <SelectItem value="pixel-art">Pixel Art</SelectItem>
                        <SelectItem value="sketch">Sketch</SelectItem>
                        <SelectItem value="comic">Comic</SelectItem>
                        <SelectItem value="3d-render">3D Render</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger id="aspect-ratio">
                        <SelectValue placeholder="Select aspect ratio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">Square (1:1)</SelectItem>
                        <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                        <SelectItem value="4:3">Landscape (4:3)</SelectItem>
                        <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                        <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-negative-prompt"
                      checked={useNegativePrompt}
                      onCheckedChange={setUseNegativePrompt}
                    />
                    <Label htmlFor="use-negative-prompt">Use negative prompt</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="guidance-scale">Guidance Scale: {guidanceScale}</Label>
                </div>
                <Slider
                  id="guidance-scale"
                  min={1}
                  max={20}
                  step={0.1}
                  value={[guidanceScale]}
                  onValueChange={(value) => setGuidanceScale(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Controls how closely the image follows your prompt. Higher values make the image more closely match
                  your prompt.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="negative-prompt">Negative Prompt</Label>
                <Input
                  id="negative-prompt"
                  placeholder="Things to avoid in the generated image..."
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  disabled={!useNegativePrompt}
                />
                <p className="text-xs text-muted-foreground">
                  Specify what you don't want to see in the generated image.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {generatedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  {!imageLoadError ? (
                    <div className="relative w-full aspect-square md:aspect-auto">
                      <Image
                        src={generatedImage || "/placeholder.svg"}
                        alt="Generated image"
                        width={800}
                        height={800}
                        className="rounded-lg w-full h-auto"
                        onLoad={() => setImageLoadError(false)}
                        onError={handleImageLoadError}
                        unoptimized // Important for base64 images
                      />
                    </div>
                  ) : (
                    <div
                      className="bg-secondary-100 dark:bg-secondary-800 rounded-lg flex flex-col items-center justify-center p-8"
                      style={{ height: "400px" }}
                    >
                      <AlertTriangle className="h-12 w-12 text-warning-500 mb-4" />
                      <p className="text-center text-warning-700 dark:text-warning-400 mb-4">Image failed to load</p>
                      <Button onClick={handleRegenerate} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try regenerating
                      </Button>
                    </div>
                  )}

                  {!imageLoadError && (
                    <motion.div
                      className="absolute bottom-4 right-4 flex gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <Button
                        onClick={handleDownload}
                        variant="secondary"
                        size="sm"
                        className="backdrop-blur-sm bg-black/50 text-white hover:bg-black/70"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {navigator.share && (
                        <Button
                          onClick={handleShare}
                          variant="secondary"
                          size="sm"
                          className="backdrop-blur-sm bg-black/50 text-white hover:bg-black/70"
                        >
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      )}
                      <Button
                        onClick={handleRegenerate}
                        variant="secondary"
                        size="sm"
                        className="backdrop-blur-sm bg-black/50 text-white hover:bg-black/70"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {error && !generatedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <Card className="border-red-500">
              <CardContent className="p-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={handleGenerate} className="mt-4" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
