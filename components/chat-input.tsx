"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, Paperclip, ImageIcon, X, StopCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Image from "next/image"
import { formatTime } from "@/lib/utils"

interface ChatInputProps {
  onSubmit: (text: string, files?: File[], audioBlob?: Blob) => void
  isProcessing: boolean
}

export default function ChatInput({ onSubmit, isProcessing }: ChatInputProps) {
  const [text, setText] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  const inputRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const { theme } = useTheme()

  // Handle recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording, isPaused])

  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const handleSubmit = () => {
    if ((!text.trim() && files.length === 0 && !audioBlob) || isProcessing) return
    onSubmit(text, files.length > 0 ? files : undefined, audioBlob || undefined)
    setText("")
    setFiles([])
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    if (inputRef.current) {
      inputRef.current.textContent = ""
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageClick = () => {
    imageInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
      e.target.value = "" // Reset the input
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const url = URL.createObjectURL(audioBlob)

        setAudioBlob(audioBlob)
        setAudioUrl(url)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setIsPaused(false)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setAudioBlob(null)
      setAudioUrl(null)
      setRecordingTime(0)
    }
  }

  const togglePause = () => {
    if (!mediaRecorderRef.current || !isRecording) return

    if (isPaused) {
      mediaRecorderRef.current.resume()
    } else {
      mediaRecorderRef.current.pause()
    }

    setIsPaused(!isPaused)
  }

  const deleteAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
  }

  // Function to get file preview
  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file)
    }
    return null
  }

  // Function to get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) {
      return "📄"
    } else if (file.type.includes("word") || file.type.includes("document")) {
      return "📝"
    } else if (file.type.includes("excel") || file.type.includes("spreadsheet")) {
      return "📊"
    } else if (file.type.includes("audio")) {
      return "🎵"
    } else if (file.type.includes("video")) {
      return "🎬"
    } else {
      return "📎"
    }
  }

  return (
    <div
      className={`chat-input-container theme-transition ${theme === "light" ? "bg-white border-t border-gray-200 shadow-sm" : ""}`}
    >
      {/* File previews */}
      {files.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => {
              const preview = getFilePreview(file)
              return (
                <div key={index} className="relative group bg-secondary/50 rounded-md p-2 flex items-center gap-2">
                  {preview ? (
                    <div className="relative h-10 w-10 rounded-md overflow-hidden">
                      <Image src={preview || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 flex items-center justify-center bg-secondary rounded-md text-lg">
                      {getFileIcon(file)}
                    </div>
                  )}
                  <div className="max-w-[120px]">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 absolute -top-2 -right-2 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Audio recording preview */}
      {(isRecording || audioUrl) && (
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="bg-secondary/50 rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isRecording ? (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full bg-destructive ${isPaused ? "opacity-50" : "animate-pulse"}`}
                  ></div>
                  <span className="text-sm font-medium">
                    {isPaused ? "Paused" : "Recording"}: {formatTime(recordingTime)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">Audio: {formatTime(recordingTime)}</span>
                </div>
              )}

              {audioUrl && !isRecording && <audio src={audioUrl} controls className="h-8 w-48" />}
            </div>

            <div className="flex items-center gap-2">
              {isRecording ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={cancelRecording}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Cancel recording</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={togglePause}
                  >
                    {isPaused ? <Mic className="h-4 w-4" /> : <StopCircle className="h-4 w-4" />}
                    <span className="sr-only">{isPaused ? "Resume recording" : "Pause recording"}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={stopRecording}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Finish recording</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={deleteAudio}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete audio</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className={`chat-input theme-transition ${theme === "light" ? "bg-gray-50 border border-gray-200" : ""}`}>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground theme-transition"
            aria-label="Attach file"
            onClick={handleFileClick}
            disabled={isProcessing || isRecording}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple
            disabled={isProcessing || isRecording}
          />

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground theme-transition"
            aria-label="Add image"
            onClick={handleImageClick}
            disabled={isProcessing || isRecording}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            disabled={isProcessing || isRecording}
          />

          <div
            ref={inputRef}
            contentEditable={!isProcessing && !isRecording}
            className={cn(
              "flex-1 outline-none bg-transparent py-2 px-2 max-h-32 overflow-y-auto theme-transition",
              theme === "light" ? "text-gray-900 placeholder:text-gray-500" : "",
              (isProcessing || isRecording) && "opacity-50",
            )}
            onInput={(e) => setText(e.currentTarget.textContent || "")}
            onKeyDown={handleKeyDown}
            suppressContentEditableWarning
            aria-label="Message input"
            role="textbox"
            aria-multiline="true"
          >
            {text === "" && !isProcessing && !isRecording && (
              <span className="pointer-events-none select-none text-gray-500 opacity-60">Type your message...</span>
            )}
            {text}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-muted-foreground theme-transition",
              isRecording && "text-destructive hover:text-destructive/90",
            )}
            aria-label={isRecording ? "Stop recording" : "Voice input"}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
          >
            {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={(text.trim() === "" && files.length === 0 && !audioBlob) || isProcessing || isRecording}
            size="icon"
            className="bg-primary text-primary-foreground hover:bg-primary/90 theme-transition"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
