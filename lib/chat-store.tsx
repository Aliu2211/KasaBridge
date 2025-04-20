"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Chat, Message } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

type ChatContextType = {
  chats: Chat[]
  activeChat: Chat | null
  createNewChat: () => Chat
  updateChat: (chatId: string, updates: Partial<Chat>) => void
  addMessageToChat: (chatId: string, message: Omit<Message, "id" | "timestamp">) => void
  setActiveChat: (chatId: string) => void
  deleteChat: (chatId: string) => void
  moveChat: (chatId: string, folder: "recent" | "saved") => void
  setAudioUrl: (chatId: string, audioUrl: string | null) => void
  renameChat: (chatId: string, newTitle: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChatState] = useState<Chat | null>(null)

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem("chats")
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats) as Chat[]
        setChats(parsedChats)

        // Set the most recent chat as active if available
        if (parsedChats.length > 0) {
          const mostRecent = [...parsedChats].sort((a, b) => b.lastUpdated - a.lastUpdated)[0]
          setActiveChatState(mostRecent)
        }
      } catch (error) {
        console.error("Failed to parse saved chats:", error)
      }
    }
  }, [])

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("chats", JSON.stringify(chats))
    }
  }, [chats])

  const createNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
      lastUpdated: Date.now(),
      folder: "recent",
      audioUrl: null,
    }

    setChats((prevChats) => [newChat, ...prevChats])
    setActiveChatState(newChat)
    return newChat
  }

  const updateChat = (chatId: string, updates: Partial<Chat>) => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === chatId ? { ...chat, ...updates, lastUpdated: Date.now() } : chat)),
    )

    // Update activeChat if it's the one being modified
    if (activeChat?.id === chatId) {
      setActiveChatState((prev) => (prev ? { ...prev, ...updates, lastUpdated: Date.now() } : prev))
    }
  }

  const addMessageToChat = (chatId: string, message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: Date.now(),
    }

    // Create a serializable version of the message for storage
    // We can't store Blob objects directly in localStorage
    const serializableMessage = { ...newMessage }

    // For storage purposes, we'll just note that an audio blob exists
    // but won't try to serialize the actual blob
    if (newMessage.audioBlob) {
      // Keep the audioBlob in memory for the current session
      // but don't try to serialize it for localStorage
      serializableMessage.hasAudio = true
    }

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          // Update chat title based on first user message if it's still "New Chat"
          let title = chat.title
          if (title === "New Chat" && message.role === "user" && chat.messages.length === 0) {
            // Use first 30 chars of message as title
            title = message.content.length > 30 ? `${message.content.substring(0, 30)}...` : message.content
          }

          return {
            ...chat,
            messages: [...chat.messages, serializableMessage],
            lastUpdated: Date.now(),
            title,
          }
        }
        return chat
      }),
    )

    // Update activeChat if it's the one being modified
    if (activeChat?.id === chatId) {
      setActiveChatState((prev) => {
        if (!prev) return prev

        // Update chat title based on first user message if it's still "New Chat"
        let title = prev.title
        if (title === "New Chat" && message.role === "user" && prev.messages.length === 0) {
          // Use first 30 chars of message as title
          title = message.content.length > 30 ? `${message.content.substring(0, 30)}...` : message.content
        }

        return {
          ...prev,
          messages: [...prev.messages, newMessage], // Use the full message with audioBlob for in-memory usage
          lastUpdated: Date.now(),
          title,
        }
      })
    }
  }

  const setActiveChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId) || null
    setActiveChatState(chat)
  }

  const deleteChat = (chatId: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId))

    // If the active chat is deleted, set active to null or the most recent chat
    if (activeChat?.id === chatId) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId)
      if (remainingChats.length > 0) {
        const mostRecent = [...remainingChats].sort((a, b) => b.lastUpdated - a.lastUpdated)[0]
        setActiveChatState(mostRecent)
      } else {
        setActiveChatState(null)
      }
    }
  }

  const moveChat = (chatId: string, folder: "recent" | "saved") => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === chatId ? { ...chat, folder, lastUpdated: Date.now() } : chat)),
    )

    // Update activeChat if it's the one being modified
    if (activeChat?.id === chatId) {
      setActiveChatState((prev) => (prev ? { ...prev, folder, lastUpdated: Date.now() } : prev))
    }
  }

  const setAudioUrl = (chatId: string, audioUrl: string | null) => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === chatId ? { ...chat, audioUrl, lastUpdated: Date.now() } : chat)),
    )

    // Update activeChat if it's the one being modified
    if (activeChat?.id === chatId) {
      setActiveChatState((prev) => (prev ? { ...prev, audioUrl, lastUpdated: Date.now() } : prev))
    }
  }

  const renameChat = (chatId: string, newTitle: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === chatId ? { ...chat, title: newTitle, lastUpdated: Date.now() } : chat)),
    )

    // Update activeChat if it's the one being renamed
    if (activeChat?.id === chatId) {
      setActiveChatState((prev) => (prev ? { ...prev, title: newTitle, lastUpdated: Date.now() } : prev))
    }
  }

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        createNewChat,
        updateChat,
        addMessageToChat,
        setActiveChat,
        deleteChat,
        moveChat,
        setAudioUrl,
        renameChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
