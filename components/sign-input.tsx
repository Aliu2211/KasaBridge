"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, CameraOff, Play, Square } from "lucide-react"
import { mockSignDetection } from "@/lib/sign-detection"
import { toast } from "@/components/ui/use-toast"

interface SignInputProps {
  onDetection: (text: string) => void
  isProcessing: boolean
}

export default function SignInput({ onDetection, isProcessing }: SignInputProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [detectedText, setDetectedText] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)

  const startWebcam = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)

      // Show a more user-friendly error message based on the error type
      let errorMessage = "There was an error accessing your camera."

      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          errorMessage = "Camera access was denied. Please allow camera access in your browser settings."
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          errorMessage = "No camera was found on your device."
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          errorMessage = "Your camera is in use by another application."
        } else if (err.name === "OverconstrainedError") {
          errorMessage = "The requested camera settings are not supported by your device."
        } else if (err.name === "TypeError") {
          errorMessage = "No camera is available or the camera constraints are not supported."
        }
      }

      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()

      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
      setIsDetecting(false)
    }
  }

  const toggleDetection = () => {
    if (isDetecting) {
      setIsDetecting(false)
    } else {
      setIsDetecting(true)
      detectSigns()
    }
  }

  const detectSigns = async () => {
    if (!isStreaming || !isDetecting) return

    try {
      // This is a mock function that would be replaced with actual sign language detection
      const result = await mockSignDetection()
      setDetectedText(result)

      // Only send to parent if we have a new detection
      if (result && result !== detectedText) {
        onDetection(result)
      }

      // Continue detection loop if still detecting
      if (isDetecting) {
        setTimeout(detectSigns, 2000) // Simulate detection every 2 seconds
      }
    } catch (err) {
      console.error("Error detecting signs:", err)
      setIsDetecting(false)
    }
  }

  useEffect(() => {
    return () => {
      stopWebcam()
    }
  }, [])

  useEffect(() => {
    if (isDetecting) {
      detectSigns()
    }
  }, [isDetecting])

  return (
    <div className="space-y-6">
      <div className="webcam-container">
        {isStreaming ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto rounded-lg border"
              style={{ backgroundColor: "#000" }}
            />
            <div className="webcam-overlay">
              <p className="text-sm font-medium">
                {isDetecting
                  ? "Detecting signs... Make gestures clearly in frame."
                  : 'Camera ready. Click "Start Recognition" to begin.'}
              </p>
            </div>
          </>
        ) : (
          <Card className="flex items-center justify-center h-[300px] bg-muted">
            <div className="text-center p-4">
              <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Camera access required for sign language detection</p>
              <Button onClick={startWebcam} className="mt-4" disabled={isProcessing}>
                Enable Camera
              </Button>
            </div>
          </Card>
        )}
      </div>

      <div className="flex space-x-2">
        {isStreaming && (
          <>
            <Button
              onClick={toggleDetection}
              className="flex-1"
              variant={isDetecting ? "destructive" : "default"}
              disabled={isProcessing}
            >
              {isDetecting ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Recognition
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Recognition
                </>
              )}
            </Button>

            <Button onClick={stopWebcam} variant="outline" disabled={isProcessing}>
              <CameraOff className="h-4 w-4 mr-2" />
              Disable Camera
            </Button>
          </>
        )}
      </div>

      {detectedText && (
        <div className="p-4 bg-muted rounded-lg mt-4">
          <p className="font-medium mb-1">Detected Text:</p>
          <p>{detectedText}</p>
        </div>
      )}
    </div>
  )
}
