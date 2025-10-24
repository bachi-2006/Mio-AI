"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Camera, CameraOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface CameraProps {
  onImageCapture: (imageData: string) => Promise<void>
  isProcessing: boolean
}

export function CameraComponent({ onImageCapture, isProcessing }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isStreamActive, setIsStreamActive] = useState(false)
  const { toast } = useToast()

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsStreamActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please ensure you have granted permission.",
        variant: "destructive",
      })
    }
  }, [toast])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsStreamActive(false)
    }
  }, [])

  const captureImage = useCallback(async () => {
    if (!videoRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(videoRef.current, 0, 0)
    const imageData = canvas.toDataURL("image/jpeg")
    await onImageCapture(imageData)
  }, [onImageCapture])

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 shadow-xl">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
          {isStreamActive ? (
            <>
              <Button
                onClick={captureImage}
                disabled={isProcessing}
                className="bg-red-500 hover:bg-red-600 shadow-lg transform hover:scale-105 transition-all"
              >
                {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
              </Button>
              <Button
                onClick={stopCamera}
                variant="secondary"
                className="shadow-lg transform hover:scale-105 transition-all"
              >
                <CameraOff className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              onClick={startCamera}
              className="shadow-lg transform hover:scale-105 transition-all bg-blue-500 hover:bg-blue-600"
            >
              <Camera className="h-5 w-5 mr-2" />
              Start Camera
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
