"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "next-themes"

interface ChatHeaderProps {
  title: string
  onNewChat: () => void
}

export default function ChatHeader({
  title,
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
            {user ? `Welcome, ${user.name}` : "Text to Akan speech"}
          </p>
        </div>
        {/* <Button variant="ghost" size="sm" onClick={onNewChat} className="ml-4 flex items-center gap-1">
          <Plus className="h-4 w-4" />
          New
        </Button> */}
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </div>
  )
}
