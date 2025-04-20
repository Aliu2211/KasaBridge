"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TextInput from "@/components/text-input"
import SignInput from "@/components/sign-input"
import AudioOutput from "@/components/audio-output"
import Header from "@/components/header"
import { useToast } from "@/hooks/use-toast"

export default function MainContainer() {
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
    <div className="container mx-auto px-4 py-6 space-y-8">
      <Header />

      <Card className="w-full">
        <CardContent className="p-6">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="text">Text Input</TabsTrigger>
              <TabsTrigger value="sign">Sign Language</TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <TextInput onSubmit={handleTextSubmit} isProcessing={isProcessing} />
            </TabsContent>

            <TabsContent value="sign">
              <SignInput onDetection={handleSignDetection} isProcessing={isProcessing} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {translatedText && <AudioOutput text={translatedText} originalInput={inputText} />}
    </div>
  )
}
