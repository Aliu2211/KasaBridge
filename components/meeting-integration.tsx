"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  LinkIcon,
  Send,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { generateAkanAudio } from "@/lib/text-to-speech"
import { useTheme } from "next-themes"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MeetingIntegrationProps {
  onClose: () => void
}

export default function MeetingIntegration({ onClose }: MeetingIntegrationProps) {
  const [meetingUrl, setMeetingUrl] = useState("")
  const [meetingPlatform, setMeetingPlatform] = useState<"zoom" | "google-meet" | "teams" | "other">("zoom")
  const [isJoined, setIsJoined] = useState(false)
  const [isMicActive, setIsMicActive] = useState(false)
  const [isVideoActive, setIsVideoActive] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [meetingName, setMeetingName] = useState("")
  const [meetingDuration, setMeetingDuration] = useState(0)
  const [activeTab, setActiveTab] = useState<"text" | "sign">("text")
  const [isAutoTranslate, setIsAutoTranslate] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [meetingWindowOpened, setMeetingWindowOpened] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const { theme } = useTheme()

  // Simulate meeting duration timer
  useEffect(() => {
    if (isJoined) {
      timerRef.current = setInterval(() => {
        setMeetingDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setMeetingDuration(0)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isJoined])

  // Handle webcam for sign language detection
  useEffect(() => {
    if (isVideoActive && videoRef.current) {
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
          setIsVideoActive(false)

          // Provide more specific error messages based on the error type
          let errorMessage = "Could not access your camera."

          if (err instanceof DOMException) {
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
              errorMessage = "Camera access was denied. Please allow camera access in your browser settings."
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
              errorMessage = "No camera was found on your device."
            } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
              errorMessage = "Your camera is in use by another application."
            }
          }

          toast({
            title: "Camera access failed",
            description: errorMessage,
            variant: "destructive",
          })
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
  }, [isVideoActive, toast])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const detectPlatform = (url: string) => {
    if (url.includes("zoom.us")) return "zoom"
    if (url.includes("meet.google.com")) return "google-meet"
    if (url.includes("teams.microsoft.com")) return "teams"
    return "other"
  }

  const extractMeetingName = (url: string, platform: string) => {
    switch (platform) {
      case "zoom":
        return "Zoom Meeting"
      case "google-meet":
        return "Google Meet"
      case "teams":
        return "Microsoft Teams Meeting"
      default:
        return "Video Conference"
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setMeetingUrl(url)

    if (url) {
      const platform = detectPlatform(url)
      setMeetingPlatform(platform as any)
    }
  }

  const openMeetingInNewTab = () => {
    if (!meetingUrl) return

    window.open(meetingUrl, "_blank", "noopener,noreferrer")
    setMeetingWindowOpened(true)

    toast({
      title: "Meeting opened",
      description: "The meeting has been opened in a new tab",
    })
  }

  const handleJoinMeeting = () => {
    if (!meetingUrl) {
      toast({
        title: "Missing meeting link",
        description: "Please enter a valid meeting URL",
        variant: "destructive",
      })
      return
    }

    // Open the meeting in a new tab first
    openMeetingInNewTab()

    // Then set up our companion interface
    setIsJoined(true)
    setMeetingName(extractMeetingName(meetingUrl, meetingPlatform))

    toast({
      title: "KasaBridge companion ready",
      description: "Use this window to translate your text or sign language to speech in the meeting",
    })
  }

  const handleLeaveMeeting = () => {
    setIsJoined(false)
    setIsMicActive(false)
    setIsVideoActive(false)
    setIsTranslating(false)
    setMeetingWindowOpened(false)

    toast({
      title: "Meeting companion closed",
      description: "You've left the KasaBridge meeting companion",
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingUrl)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)

    toast({
      title: "Link copied",
      description: "Meeting link copied to clipboard",
    })
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isProcessing) return

    setIsProcessing(true)

    try {
      // Generate audio from text
      const audioUrl = await generateAkanAudio(currentMessage)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.onended = () => {
          setIsTranslating(false)
          setIsMicActive(false)
        }

        // Play the audio in this window
        setIsTranslating(true)
        setIsMicActive(true)
        audioRef.current.play()

        toast({
          title: "Message ready",
          description: "Your message has been converted to speech. Play it in your meeting by sharing this audio.",
        })
      }

      setCurrentMessage("")
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "Failed to translate your message",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSignDetection = () => {
    if (!isVideoActive) {
      setIsVideoActive(true)
      return
    }

    // Simulate sign language detection
    setIsProcessing(true)

    setTimeout(() => {
      const detectedText = "Hello everyone, this is a demonstration of sign language translation."
      setCurrentMessage(detectedText)
      setIsProcessing(false)

      if (isAutoTranslate) {
        handleSendMessage()
      }

      toast({
        title: "Sign language detected",
        description: "Sign language has been detected and converted to text",
      })
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        className={cn(
          "w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col",
          theme === "light" ? "border-gray-200 shadow-lg" : "",
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Meeting Companion</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <VideoOff className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <CardDescription>
            Use KasaBridge alongside video meetings to communicate with sign language or text
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important: How this feature works</AlertTitle>
            <AlertDescription>
              KasaBridge works as a companion to your meeting, not as a direct integration. You'll need to:
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>Join the meeting in a separate tab/window</li>
                <li>Use KasaBridge to convert your text/sign language to speech</li>
                <li>Share your computer audio in the meeting when you want to speak</li>
              </ol>
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => setShowInstructions(!showInstructions)}
              >
                {showInstructions ? "Hide detailed instructions" : "Show detailed instructions"}
              </Button>
            </AlertDescription>
          </Alert>

          {showInstructions && (
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Detailed Instructions</h3>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Enter your meeting URL and click "Join Meeting"</li>
                <li>The meeting will open in a new tab</li>
                <li>In the meeting tab, join the meeting normally</li>
                <li>Return to this KasaBridge tab</li>
                <li>Type text or use sign language in KasaBridge</li>
                <li>
                  When you want to speak in the meeting:
                  <ul className="list-disc ml-5 mt-1">
                    <li>Click "Speak in Meeting" to generate audio</li>
                    <li>In your meeting tab, share your computer audio</li>
                    <li>The audio will play through your computer and be heard in the meeting</li>
                  </ul>
                </li>
                <li>For best results, use headphones to prevent audio feedback</li>
              </ol>
            </div>
          )}

          {!isJoined ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meeting-url">Meeting URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="meeting-url"
                    placeholder="Paste Zoom, Google Meet, or Teams meeting link"
                    value={meetingUrl}
                    onChange={handleUrlChange}
                    className={theme === "light" ? "border-gray-300" : ""}
                  />
                  <Button variant="outline" size="icon" onClick={handleCopyLink} disabled={!meetingUrl}>
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Meeting Platform</Label>
                <Select value={meetingPlatform} onValueChange={(value) => setMeetingPlatform(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="google-meet">Google Meet</SelectItem>
                    <SelectItem value="teams">Microsoft Teams</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Meeting Options</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="join-audio">Enable microphone</Label>
                      <p className="text-sm text-muted-foreground">For sign language detection</p>
                    </div>
                    <Switch id="join-audio" checked={isMicActive} onCheckedChange={setIsMicActive} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="join-video">Enable camera</Label>
                      <p className="text-sm text-muted-foreground">For sign language detection</p>
                    </div>
                    <Switch id="join-video" checked={isVideoActive} onCheckedChange={setIsVideoActive} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                <div>
                  <h3 className="font-medium">{meetingName}</h3>
                  <p className="text-sm text-muted-foreground">KasaBridge companion • {formatTime(meetingDuration)}</p>
                </div>
                <div className="flex gap-2">
                  {!meetingWindowOpened && (
                    <Button variant="outline" size="sm" onClick={openMeetingInNewTab}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open Meeting
                    </Button>
                  )}
                  <Button
                    variant={isMicActive ? "default" : "outline"}
                    size="icon"
                    onClick={() => setIsMicActive(!isMicActive)}
                    className={isMicActive ? "bg-primary" : ""}
                  >
                    {isMicActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isVideoActive ? "default" : "outline"}
                    size="icon"
                    onClick={() => setIsVideoActive(!isVideoActive)}
                    className={isVideoActive ? "bg-primary" : ""}
                  >
                    {isVideoActive ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="icon" onClick={handleLeaveMeeting}>
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    {isVideoActive ? (
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <VideoOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Camera is turned off</p>
                      </div>
                    )}

                    {isTranslating && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-background/90 px-3 py-1 rounded-full text-sm font-medium">
                          Translating and speaking...
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-translate">Auto-translate sign language</Label>
                      <p className="text-xs text-muted-foreground">Automatically speak detected signs</p>
                    </div>
                    <Switch id="auto-translate" checked={isAutoTranslate} onCheckedChange={setIsAutoTranslate} />
                  </div>
                </div>

                <div className="space-y-4">
                  <Tabs defaultValue="text" value={activeTab} onValueChange={(v) => setActiveTab(v as "text" | "sign")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="text">Text Input</TabsTrigger>
                      <TabsTrigger value="sign">Sign Language</TabsTrigger>
                    </TabsList>

                    <TabsContent value="text" className="space-y-4 mt-4">
                      <Textarea
                        placeholder="Type your message to be spoken in the meeting..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        className="min-h-[120px]"
                        disabled={isProcessing || isTranslating}
                      />

                      <Button
                        onClick={handleSendMessage}
                        disabled={!currentMessage.trim() || isProcessing || isTranslating}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Generate Speech
                          </>
                        )}
                      </Button>
                    </TabsContent>

                    <TabsContent value="sign" className="space-y-4 mt-4">
                      <div className="bg-muted p-4 rounded-lg text-center">
                        {isVideoActive ? (
                          <div>
                            <p className="mb-2">
                              {isProcessing
                                ? "Detecting sign language..."
                                : "Make signs clearly in front of the camera"}
                            </p>
                            {currentMessage && (
                              <div className="mt-4 p-3 bg-background rounded-lg">
                                <p className="font-medium">Detected:</p>
                                <p className="text-sm">{currentMessage}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <VideoOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p>Enable camera to use sign language</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleSignDetection}
                          disabled={isProcessing || isTranslating}
                          className="flex-1"
                          variant={isVideoActive ? "default" : "outline"}
                        >
                          {isVideoActive ? (
                            <>
                              {isProcessing ? (
                                <>
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  Detecting...
                                </>
                              ) : (
                                <>
                                  <Video className="mr-2 h-4 w-4" />
                                  Detect Signs
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <Video className="mr-2 h-4 w-4" />
                              Enable Camera
                            </>
                          )}
                        </Button>

                        {isVideoActive && currentMessage && (
                          <Button
                            onClick={handleSendMessage}
                            disabled={!currentMessage.trim() || isProcessing || isTranslating}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Generate Speech
                          </Button>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          )}

          <audio ref={audioRef} className="hidden" />
        </CardContent>

        <CardFooter className="border-t pt-4">
          {!isJoined ? (
            <Button onClick={handleJoinMeeting} disabled={!meetingUrl} className="w-full">
              <LinkIcon className="mr-2 h-4 w-4" />
              Join Meeting
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground text-center w-full">
              KasaBridge is helping you communicate in this meeting. Share your computer audio in the meeting to be
              heard.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
