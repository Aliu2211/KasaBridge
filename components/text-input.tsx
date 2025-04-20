"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Volume2 } from "lucide-react"

interface TextInputProps {
  onSubmit: (text: string) => void
  isProcessing: boolean
}

export default function TextInput({ onSubmit, isProcessing }: TextInputProps) {
  const [text, setText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(text)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="text-input" className="text-lg font-medium">
          Type your message below
        </label>
        <Textarea
          id="text-input"
          placeholder="Enter your message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[150px] text-lg"
          disabled={isProcessing}
          aria-label="Text input for translation"
        />
      </div>

      <Button onClick={handleSubmit} className="w-full text-lg py-6" disabled={isProcessing || !text.trim()} size="lg">
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Volume2 className="mr-2 h-5 w-5" />
            Convert to Akan Speech
          </>
        )}
      </Button>
    </div>
  )
}
