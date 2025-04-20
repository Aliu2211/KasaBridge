"use client"

import { useRef, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Play, Pause, MessageSquare, Camera, Mic, FileText, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import type { Message } from "@/lib/types"
import Image from "next/image"

interface ChatContentProps {
  messages: Message[]
  audioUrl: string | null
  isWebcamActive: boolean
  isSignDetectionActive: boolean
}

export default function ChatContent({ messages, audioUrl, isWebcamActive, isSignDetectionActive }: ChatContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const waveformRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const { theme } = useTheme()
  const [filePreviewUrls, setFilePreviewUrls] = useState<Map<File, string>>(new Map())
  const [audioUrls, setAudioUrls] = useState<Map<string, string>>(new Map())
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Setup webcam
  useEffect(() => {
    if (isWebcamActive && videoRef.current) {
      const setupWebcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: "user",
            },
          })

          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (err) {
          console.error("Error accessing webcam:", err)
          // Provide a more user-friendly error handling approach
          // Instead of throwing an error, we'll handle it gracefully

          // Create a custom event to notify the parent component about the webcam error
          const errorEvent = new CustomEvent("webcamError", {
            detail: { message: "Could not access camera. Please check permissions and try again." },
          })
          window.dispatchEvent(errorEvent)
        }
      }

      setupWebcam()

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream
          stream.getTracks().forEach((track) => track.stop())
          videoRef.current.srcObject = null
        }
      }
    }
  }, [isWebcamActive])

  // Setup audio
  useEffect(() => {
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl)
      } else {
        audioRef.current.src = audioUrl
        audioRef.current.load()
      }
    }
  }, [audioUrl])

  useEffect(() => {
    if (!audioRef.current) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    audioRef.current.addEventListener("play", handlePlay)
    audioRef.current.addEventListener("pause", handlePause)
    audioRef.current.addEventListener("ended", handleEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("play", handlePlay)
        audioRef.current.removeEventListener("pause", handlePause)
        audioRef.current.removeEventListener("ended", handleEnded)
      }
    }
  }, [audioRef.current])

  // Generate preview URLs for files and audio blobs
  useEffect(() => {
    const newPreviewUrls = new Map<File, string>()
    const newAudioUrls = new Map<string, string>()

    messages.forEach((message) => {
      // Handle image files
      if (message.files && message.files.length > 0) {
        message.files.forEach((file) => {
          if (!filePreviewUrls.has(file) && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file)
            newPreviewUrls.set(file, url)
          }
        })
      }

      // Handle audio blobs - add proper type checking
      if (message.audioBlob && !audioUrls.has(message.id)) {
        try {
          // Ensure it's a valid blob before creating URL
          if (message.audioBlob instanceof Blob) {
            const url = URL.createObjectURL(message.audioBlob)
            newAudioUrls.set(message.id, url)
          }
        } catch (error) {
          console.error("Error creating URL for audio blob:", error)
        }
      }
    })

    if (newPreviewUrls.size > 0) {
      setFilePreviewUrls((prev) => new Map([...prev, ...newPreviewUrls]))
    }

    if (newAudioUrls.size > 0) {
      setAudioUrls((prev) => new Map([...prev, ...newAudioUrls]))
    }

    // Cleanup function to revoke object URLs
    return () => {
      newPreviewUrls.forEach((url) => {
        URL.revokeObjectURL(url)
      })
      newAudioUrls.forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [messages])

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
      animateWaveform()
    }
  }

  const animateWaveform = () => {
    if (!waveformRef.current || !isPlaying) return

    const bars = waveformRef.current.querySelectorAll(".audio-waveform-bar")

    bars.forEach((bar) => {
      const height = Math.floor(Math.random() * 30) + 5
      ;(bar as HTMLElement).style.height = `${height}px`
    })

    animationRef.current = requestAnimationFrame(animateWaveform)
  }

  useEffect(() => {
    if (isPlaying) {
      animateWaveform()
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)

      // Reset bars to default height
      if (waveformRef.current) {
        const bars = waveformRef.current.querySelectorAll(".audio-waveform-bar")
        bars.forEach((bar) => {
          ;(bar as HTMLElement).style.height = "5px"
        })
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  // Function to get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) {
      return <FileText className="h-4 w-4" />
    } else if (file.type.includes("word") || file.type.includes("document")) {
      return <FileText className="h-4 w-4" />
    } else if (file.type.includes("excel") || file.type.includes("spreadsheet")) {
      return <FileText className="h-4 w-4" />
    } else if (file.type.includes("audio")) {
      return <Mic className="h-4 w-4" />
    } else if (file.type.includes("video")) {
      return <Camera className="h-4 w-4" />
    } else if (file.type.includes("image")) {
      return <ImageIcon className="h-4 w-4" />
    } else {
      return <FileText className="h-4 w-4" />
    }
  }

  // Handle audio playback for voice messages
  const handleAudioPlay = (messageId: string) => {
    // If another audio is playing, stop it
    if (playingAudioId && playingAudioId !== messageId) {
      const audioElement = document.getElementById(`audio-${playingAudioId}`) as HTMLAudioElement
      if (audioElement) {
        audioElement.pause()
      }
    }

    setPlayingAudioId(messageId === playingAudioId ? null : messageId)
  }

  return (
    <div className="chat-messages theme-transition">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold mb-6 theme-transition">How can I help you today?</h2>
          <p className="text-muted-foreground mb-8 max-w-md theme-transition">
            I can convert your text or sign language to Akan speech. Choose your preferred input method below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
            <div className="feature-card theme-transition">
              <MessageSquare className="h-8 w-8 text-primary mb-2 theme-transition" />
              <h3 className="font-medium theme-transition">Text Input</h3>
              <p className="text-xs text-muted-foreground theme-transition">Type your message</p>
            </div>

            <div className="feature-card theme-transition">
              <Camera className="h-8 w-8 text-primary mb-2 theme-transition" />
              <h3 className="font-medium theme-transition">Sign Language</h3>
              <p className="text-xs text-muted-foreground theme-transition">Use sign language</p>
            </div>

            <div className="feature-card theme-transition">
              <Mic className="h-8 w-8 text-primary mb-2 theme-transition" />
              <h3 className="font-medium theme-transition">Akan Speech</h3>
              <p className="text-xs text-muted-foreground theme-transition">Listen to output</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 p-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-4 theme-transition",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : theme === "light"
                      ? "bg-gray-100 text-gray-900 border border-gray-200"
                      : "bg-secondary text-secondary-foreground dark:bg-secondary",
                )}
              >
                <p>{message.content}</p>

                {/* Display files if present */}
                {message.files && message.files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.files.map((file, index) => {
                      const isImage = file.type.startsWith("image/")
                      const previewUrl = filePreviewUrls.get(file)

                      return (
                        <div key={index} className="flex items-center gap-2">
                          {isImage && previewUrl ? (
                            <div className="mt-2">
                              <div className="relative h-40 w-full rounded-md overflow-hidden">
                                <Image
                                  src={previewUrl || "/placeholder.svg"}
                                  alt={file.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <p className="text-xs mt-1 opacity-70">
                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-background/20 rounded p-2">
                              <div className="h-8 w-8 flex items-center justify-center bg-background/30 rounded">
                                {getFileIcon(file)}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs opacity-70">{(file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Display audio recording if present */}
                {message.audioBlob && audioUrls.has(message.id) && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 bg-background/20 rounded p-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex items-center justify-center bg-background/30 rounded"
                        onClick={() => handleAudioPlay(message.id)}
                      >
                        {playingAudioId === message.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Voice Message</p>
                        {audioUrls.get(message.id) && (
                          <audio
                            id={`audio-${message.id}`}
                            src={audioUrls.get(message.id)}
                            className="hidden"
                            controls
                            onPlay={() => setPlayingAudioId(message.id)}
                            onPause={() => setPlayingAudioId(null)}
                            onEnded={() => setPlayingAudioId(null)}
                            autoPlay={playingAudioId === message.id}
                          />
                        )}
                        <div className="w-full h-1 bg-background/30 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-primary ${playingAudioId === message.id ? "animate-progress" : ""}`}
                            style={{ width: playingAudioId === message.id ? "100%" : "0%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {audioUrl && (
            <div className="flex justify-center">
              <Card className="p-4 w-full max-w-md theme-transition">
                <div className="flex flex-col items-center">
                  <div ref={waveformRef} className="audio-waveform w-full mb-4" aria-hidden="true">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div key={i} className="audio-waveform-bar theme-transition" style={{ height: "5px" }} />
                    ))}
                  </div>

                  <Button onClick={togglePlayback} className="gap-2 theme-transition">
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Play Akan Audio
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {isWebcamActive && (
        <div className="fixed bottom-20 right-6 w-64 h-48 rounded-lg overflow-hidden border border-border shadow-lg theme-transition">
          {videoRef.current && videoRef.current.srcObject ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-2 text-center">
              <Camera className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">Waiting for camera access...</p>
              <p className="text-xs text-muted-foreground mt-1">Please allow camera access in your browser</p>
            </div>
          )}
          {isSignDetectionActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="px-2 py-1 bg-primary rounded text-xs font-medium text-primary-foreground theme-transition">
                Detecting signs...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
