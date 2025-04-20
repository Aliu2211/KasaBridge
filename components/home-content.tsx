"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import ModeSelector from "@/components/mode-selector"
import TextInput from "@/components/text-input"
import SignInput from "@/components/sign-input"
import AudioOutput from "@/components/audio-output"
import { useToast } from "@/hooks/use-toast"

export default function HomeContent() {
  const [mode, setMode] = useState<"text" | "sign">("text")
  const [inputText, setInputText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleTextSubmit = async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to translate",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setInputText(text)
      setTranslatedText(text) // In a real app, this would be the translated text

      toast({
        title: "Text processed",
        description: "Your text has been processed and is ready for playback",
      })
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your text",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSignDetection = async (detectedText: string) => {
    if (!detectedText.trim()) return

    setIsProcessing(true)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setInputText(detectedText)
      setTranslatedText(detectedText) // In a real app, this would be the translated text

      toast({
        title: "Sign detected",
        description: "Your signs have been detected and processed",
      })
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing the sign language",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">Let your words be heard</h1>
        <p className="text-lg text-muted-foreground">Communicate effortlessly in Akan through text or sign language</p>
      </div>

      <div className="mb-8 flex justify-center">
        <ModeSelector mode={mode} onChange={setMode} />
      </div>

      <Card className="mb-8 shadow-md">
        <CardContent className="p-6">
          {mode === "text" ? (
            <TextInput onSubmit={handleTextSubmit} isProcessing={isProcessing} />
          ) : (
            <SignInput onDetection={handleSignDetection} isProcessing={isProcessing} />
          )}
        </CardContent>
      </Card>

      {translatedText && <AudioOutput text={translatedText} originalInput={inputText} />}
    </div>
  )
}
