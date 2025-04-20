"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useChat } from "@/lib/chat-store"

interface RenameChatDialogProps {
  chatId: string
  isOpen: boolean
  onClose: () => void
}

export default function RenameChatDialog({ chatId, isOpen, onClose }: RenameChatDialogProps) {
  const { chats, renameChat } = useChat()
  const [newTitle, setNewTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Set the initial title when the dialog opens
  useEffect(() => {
    if (isOpen && chatId) {
      const chat = chats.find((c) => c.id === chatId)
      if (chat) {
        setNewTitle(chat.title)
      }
    }
  }, [isOpen, chatId, chats])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTitle.trim()) return

    setIsSubmitting(true)

    // Rename the chat
    renameChat(chatId, newTitle.trim())

    // Close the dialog
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>Enter a new name for this chat conversation.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter chat name"
              className="w-full"
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newTitle.trim() || isSubmitting}>
              {isSubmitting ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
