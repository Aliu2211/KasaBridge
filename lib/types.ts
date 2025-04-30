export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  files?: File[]
  audioBlob?: Blob
  hasAudio?: boolean // Flag to indicate audio exists without storing the blob
  audioUrl?: string | null // URL for translated/generated audio (e.g., Akan TTS)
}

export type Chat = {
  id: string
  title: string
  messages: Message[]
  lastUpdated: number
  folder: "recent" | "saved"
  audioUrl?: string | null
}

export type User = {
  id: string
  name: string
  email: string
} | null
