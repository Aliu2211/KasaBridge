"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { LinkIcon, Send, Copy, Check, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { generateAkanAudio } from "@/lib/text-to-speech"
import { useTheme } from "next-themes"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Script from "next/script"

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

interface MeetingIntegrationProps {
  onClose: () => void
}

export default function MeetingIntegration({ onClose }: MeetingIntegrationProps) {
  const [meetingUrl, setMeetingUrl] = useState("")
  const [isJoined, setIsJoined] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [meetingName, setMeetingName] = useState("")
  const [meetingDuration, setMeetingDuration] = useState(0)
  const [isCopied, setIsCopied] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()
  const { theme } = useTheme()
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const [jitsiApi, setJitsiApi] = useState<any>(null)
  const [jitsiScriptLoaded, setJitsiScriptLoaded] = useState(false)

  useEffect(() => {
    if (isJoined) {
      timerRef.current = setInterval(() => {
        setMeetingDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setMeetingDuration(0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isJoined])

  // Helper to check if the container is visible and sized
  function isContainerReady() {
    const el = jitsiContainerRef.current
    if (!el) return false
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  }

  useEffect(() => {
    let api: any = null
    let retryCount = 0
    function tryInitJitsi() {
      if (
        isJoined &&
        meetingUrl &&
        jitsiContainerRef.current &&
        jitsiScriptLoaded &&
        window.JitsiMeetExternalAPI &&
        isContainerReady()
      ) {
        let room = ""
        try {
          const url = new URL(meetingUrl.trim().replace(/^https?:\/\//, "https://"))
          room = url.pathname.replace(/^\//, "").split(/[/?#]/)[0]
        } catch {
          room = meetingUrl.trim()
        }
        if (!room) room = "SpeechAssistRoom"
        if (jitsiApi) {
          jitsiApi.dispose()
        }
        api = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName: room,
          parentNode: jitsiContainerRef.current,
          width: "100%",
          height: "100%",
          userInfo: { displayName: "User" },
        })
        setJitsiApi(api)
      } else if (isJoined && retryCount < 10) {
        // Retry a few times if container is not ready
        retryCount++
        setTimeout(tryInitJitsi, 300)
      }
    }
    tryInitJitsi()
    return () => {
      if (api) api.dispose()
    }
    // eslint-disable-next-line
  }, [isJoined, meetingUrl, jitsiScriptLoaded])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingUrl)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
    toast({ title: "Link copied", description: "Meeting link copied to clipboard" })
  }

  const handleJoinMeeting = () => {
    if (!meetingUrl) {
      toast({ title: "Missing meeting link", description: "Please enter a valid meeting URL", variant: "destructive" })
      return
    }
    setIsJoined(true)
    setMeetingName("Embedded Meeting")
    toast({ title: "Meeting embedded", description: "The meeting is now embedded in the app." })
  }

  const handleLeaveMeeting = () => {
    setIsJoined(false)
    setMeetingName("")
    setMeetingDuration(0)
    toast({ title: "Meeting closed", description: "You've left the embedded meeting." })
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isProcessing) return
    setIsProcessing(true)
    try {
      const audioUrl = await generateAkanAudio(currentMessage)
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        toast({ title: "Message ready", description: "Your message has been converted to speech." })
      }
      setCurrentMessage("")
    } catch (error) {
      toast({ title: "Translation failed", description: "Failed to translate your message", variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Script src="https://meet.jit.si/external_api.js" strategy="afterInteractive" onLoad={() => setJitsiScriptLoaded(true)} />
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className={cn("w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col", theme === "light" ? "border-gray-200 shadow-lg" : "")}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Meeting</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <span className="sr-only">Close</span>X
              </Button>
            </div>
            <CardDescription>
              Join and participate in your meeting directly within KasaBridge. Use the transcription feature below.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {!isJoined ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meeting-url">Meeting URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="meeting-url"
                      placeholder="Paste your meeting link (Jitsi, Zoom, Google Meet, etc.)"
                      value={meetingUrl}
                      onChange={e => setMeetingUrl(e.target.value)}
                      className={theme === "light" ? "border-gray-300" : ""}
                    />
                    <Button variant="outline" size="icon" onClick={handleCopyLink} disabled={!meetingUrl}>
                      {isCopied ? "✓" : "Copy"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6 h-[70vh]">
                <div className="flex-1 bg-black rounded-lg overflow-hidden flex items-center justify-center shadow-lg min-h-[300px]">
                  <div ref={jitsiContainerRef} className="w-full h-full min-h-[300px]">
                    {!jitsiScriptLoaded && (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <span>Loading meeting controls...</span>
                      </div>
                    )}
                    {jitsiScriptLoaded && !isContainerReady() && (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <span>Preparing meeting area...</span>
                      </div>
                    )}
                    {jitsiScriptLoaded && isContainerReady() && !jitsiApi && (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <span>Connecting to meeting...</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-[350px] flex flex-col gap-4 bg-background/80 rounded-lg p-4 shadow-lg border border-border min-h-[300px]">
                  <div className="mb-2">
                    <Label className="text-lg font-semibold">Transcription / Akan Speech</Label>
                  </div>
                  <Textarea
                    placeholder="Type your message to be spoken in the meeting..."
                    value={currentMessage}
                    onChange={e => setCurrentMessage(e.target.value)}
                    className="min-h-[120px] resize-none rounded-md border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isProcessing}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-md hover:from-secondary hover:to-primary transition"
                  >
                    {isProcessing ? "Processing..." : "Generate Akan Speech"}
                  </Button>
                  <audio ref={audioRef} className="hidden" />
                  <div className="mt-4 text-xs text-muted-foreground text-center">
                    <span>Tip: Type your message and click <b>Generate Akan Speech</b> to speak in the meeting!</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            {!isJoined ? (
              <Button onClick={handleJoinMeeting} disabled={!meetingUrl} className="w-full">
                Join Meeting
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground text-center w-full">
                You are participating in the meeting within KasaBridge.
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
