"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { generateAkanAudio } from "@/lib/text-to-speech"

interface AudioOutputProps {
  text: string
  originalInput: string
}

export default function AudioOutput({ text, originalInput }: AudioOutputProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const waveformRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    // Generate audio when text changes
    const generateAudio = async () => {
      try {
        const url = await generateAkanAudio(text)
        setAudioUrl(url)

        if (audioRef.current) {
          audioRef.current.src = url
          audioRef.current.load()
        }
      } catch (error) {
        console.error("Error generating audio:", error)
      }
    }

    generateAudio()

    // Cleanup function
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [text])

  useEffect(() => {
    if (!audioRef.current) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    audioRef.current.addEventListener("play", handlePlay)
    audioRef.current.addEventListener("pause", handlePause)
    audioRef.current.addEventListener("ended", handleEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("play", handlePlay)
        audioRef.current.removeEventListener("pause", handlePause)
        audioRef.current.removeEventListener("ended", handleEnded)
      }
    }
  }, [])

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
      animateWaveform()
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return

    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const animateWaveform = () => {
    if (!waveformRef.current || !isPlaying) return

    const bars = waveformRef.current.querySelectorAll(".audio-waveform-bar")

    bars.forEach((bar) => {
      const height = Math.floor(Math.random() * 40) + 5
      ;(bar as HTMLElement).style.height = `${height}px`
    })

    animationRef.current = requestAnimationFrame(animateWaveform)
  }

  useEffect(() => {
    if (isPlaying) {
      animateWaveform()
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)

      // Reset bars to default height
      if (waveformRef.current) {
        const bars = waveformRef.current.querySelectorAll(".audio-waveform-bar")
        bars.forEach((bar) => {
          ;(bar as HTMLElement).style.height = "5px"
        })
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Audio Output</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-medium mb-1">Original Input:</p>
          <p>{originalInput}</p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <p className="font-medium mb-1">Akan Translation:</p>
          <p>{text}</p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div ref={waveformRef} className="audio-waveform w-full max-w-md" aria-hidden="true">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="audio-waveform-bar" style={{ height: "5px" }} />
            ))}
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={togglePlayback}
              variant="default"
              size="lg"
              disabled={!audioUrl}
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              onClick={toggleMute}
              variant="outline"
              size="lg"
              disabled={!audioUrl}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <audio ref={audioRef} />
      </CardContent>
    </Card>
  )
}
