"use client"

import React, { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import ChatHeader from "@/components/chat-header"
import ChatContent from "@/components/chat-content"
import ChatInput from "@/components/chat-input"
import AlertModal from "@/components/alert-modal"
import MeetingIntegration from "@/components/meeting-integration"
import { useToast } from "@/hooks/use-toast"
import { generateAkanAudio } from "@/lib/text-to-speech"
import { useTheme } from "next-themes"
import { useChat } from "@/lib/chat-store"
import EmptyState from "@/components/empty-state"

export default function ChatInterface() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [showMeetingIntegration, setShowMeetingIntegration] = useState(false)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { activeChat, createNewChat, addMessageToChat, setAudioUrl } = useChat()
  // Add webcam error handling to the ChatInterface component
  // First, add a new state for webcam errors
  const [webcamError, setWebcamError] = useState<string | null>(null)

  // Set dark theme as default on component mount
  useEffect(() => {
    setTheme("dark")
  }, [])

  // Create a new chat if there's no active chat
  useEffect(() => {
    if (!activeChat) {
      createNewChat()
    }
  }, [activeChat, createNewChat])

  // Add an effect to listen for webcam errors
  useEffect(() => {
    const handleWebcamError = (event: CustomEvent) => {
      setWebcamError(event.detail.message)
      setIsWebcamActive(false)
      toast({
        title: "Camera Error",
        description: event.detail.message,
        variant: "destructive",
      })
    }

    // Add event listener for webcam errors
    window.addEventListener("webcamError", handleWebcamError as EventListener)

    // Clean up the event listener
    return () => {
      window.removeEventListener("webcamError", handleWebcamError as EventListener)
    }
  }, [toast])

  // Update the handleTextSubmit function to properly handle audio blobs
  const handleTextSubmit = async (text: string, files?: File[], audioBlob?: Blob) => {
    if ((!text.trim() && (!files || files.length === 0) && !audioBlob) || !activeChat) return

    // Create content with text and file information
    let content = text.trim()

    // If there's an audio recording but no text, add a placeholder
    if (!content && audioBlob) {
      content = "[Voice message]"
    }

    // Add user message to the active chat
    addMessageToChat(activeChat.id, {
      role: "user",
      content,
      files,
      audioBlob,
    })

    setIsProcessing(true)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate audio
      const url = await generateAkanAudio(text || "Voice message received")
      setAudioUrl(activeChat.id, url)

      // Add assistant message
      let responseMessage = "I've processed your message."

      if (text.trim()) {
        responseMessage = "I've converted your message to Akan speech. You can play it using the audio controls below."
      }

      if (files && files.length > 0) {
        responseMessage += ` I've received ${files.length} file${files.length > 1 ? "s" : ""}.`
      }

      if (audioBlob) {
        responseMessage += " I've received your voice message."
      }

      addMessageToChat(activeChat.id, {
        role: "assistant",
        content: responseMessage,
      })

      // Show alert modal
      setAlertMessage(responseMessage)
      setIsAlertOpen(true)

      toast({
        title: "Message processed",
        description: getToastDescription(text, files, audioBlob),
      })
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your message",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getToastDescription = (text: string, files?: File[], audioBlob?: Blob) => {
    const parts = []

    if (text.trim()) {
      parts.push("Your message has been converted to Akan speech")
    }

    if (files && files.length > 0) {
      parts.push(`${files.length} file${files.length > 1 ? "s" : ""} received`)
    }

    if (audioBlob) {
      parts.push("Voice message received")
    }

    return parts.join(", ")
  }

  // Add a function to check browser camera support before activating
  const checkCameraSupport = () => {
    // Check if the browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Camera Not Supported",
        description: "Your browser doesn't support camera access. Please try a different browser.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  // Update the webcam toggle function to check for support first
  const toggleWebcam = () => {
    if (!isWebcamActive) {
      // Check if camera is supported before activating
      if (!checkCameraSupport()) {
        return
      }
    }
    setIsWebcamActive(!isWebcamActive)
  }

  // Audio player component for the modal
  const AudioPlayer = () => {
    if (!activeChat?.audioUrl) return null

    return (
      <div className="mt-4">
        <audio src={activeChat.audioUrl} controls className="w-full" />
      </div>
    )
  }

  return (
    <>
      <Sidebar onJoinMeeting={() => setShowMeetingIntegration(true)} />
      <div className="flex-1 flex flex-col h-full">
        <ChatHeader
          title={activeChat?.title || "New Chat"}
         // isWebcamActive={isWebcamActive}
         // onToggleWebcam={toggleWebcam}
          onNewChat={() => createNewChat()}
        />

        {activeChat ? (
          <>
            <ChatContent
              messages={activeChat.messages}
              audioUrl={activeChat.audioUrl ?? null}
              isWebcamActive={isWebcamActive}
             // isSignDetectionActive={false} // Set this to the appropriate value
            />
            <ChatInput onSubmit={handleTextSubmit} isProcessing={isProcessing} />
          </>
        ) : (
          <EmptyState onNewChat={() => createNewChat()} />
        )}
      </div>

      <AlertModal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} title="Audio Ready" message={alertMessage}>
        <AudioPlayer />
      </AlertModal>

      {showMeetingIntegration && <MeetingIntegration onClose={() => setShowMeetingIntegration(false)} />}
    </>
  )
}
