"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Mic, Plus } from "lucide-react"

interface EmptyStateProps {
  onNewChat: () => void
}

export default function EmptyState({ onNewChat }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md">
        <h2 className="text-2xl font-bold mb-4">Welcome to KasaBridge</h2>
        <p className="text-muted-foreground mb-8">
          Start a new conversation to convert text to Akan speech.
        </p>

        <Button onClick={onNewChat} size="lg" className="mb-8 gap-2">
          <Plus className="h-4 w-4" />
          New Conversation
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="feature-card">
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">Text Input</h3>
            <p className="text-xs text-muted-foreground">Type your message</p>
          </div>

          <div className="feature-card">
            <Mic className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">Akan Speech</h3>
            <p className="text-xs text-muted-foreground">Listen to output</p>
          </div>
        </div>
      </div>
    </div>
  )
}
