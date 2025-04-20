"use client"

import { Camera, Video, VideoOff, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "next-themes"

interface ChatHeaderProps {
  title: string
  isWebcamActive: boolean
  isSignDetectionActive: boolean
  onToggleWebcam: () => void
  onToggleSignDetection: () => void
  onNewChat: () => void
}

export default function ChatHeader({
  title,
  isWebcamActive,
  isSignDetectionActive,
  onToggleWebcam,
  onToggleSignDetection,
  onNewChat,
}: ChatHeaderProps) {
  const { user } = useAuth()
  const { theme } = useTheme()

  return (
    <div
      className={`chat-header flex items-center justify-between theme-transition ${theme === "light" ? "bg-white border-b border-gray-200 shadow-sm" : ""}`}
    >
      <div className="flex items-center">
        <div>
          <h2 className={`text-lg font-semibold theme-transition ${theme === "light" ? "text-gray-900" : ""}`}>
            {title}
          </h2>
          <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-muted-foreground"} theme-transition`}>
            {user ? `Welcome, ${user.name}` : "Text or sign language to Akan speech"}
          </p>
        </div>
        {/* <Button variant="ghost" size="sm" onClick={onNewChat} className="ml-4 flex items-center gap-1">
          <Plus className="h-4 w-4" />
          New
        </Button> */}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={isWebcamActive ? "default" : "outline"}
          size="icon"
          onClick={onToggleWebcam}
          aria-label={isWebcamActive ? "Disable camera" : "Enable camera"}
          className="theme-transition"
        >
          <Camera className="h-4 w-4" />
        </Button>

        <Button
          variant={isSignDetectionActive ? "default" : "outline"}
          size="icon"
          onClick={onToggleSignDetection}
          disabled={!isWebcamActive}
          aria-label={isSignDetectionActive ? "Stop sign detection" : "Start sign detection"}
          className="theme-transition"
        >
          {isSignDetectionActive ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
        </Button>

        <ModeToggle />
      </div>
    </div>
  )
}
