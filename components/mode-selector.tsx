"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ModeSelectorProps {
  mode: "text" | "sign"
  onChange: (mode: "text" | "sign") => void
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  const highlightRef = useRef<HTMLDivElement>(null)
  const textButtonRef = useRef<HTMLButtonElement>(null)
  const signButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (highlightRef.current && (mode === "text" ? textButtonRef.current : signButtonRef.current)) {
      const activeButton = mode === "text" ? textButtonRef.current : signButtonRef.current
      if (activeButton) {
        highlightRef.current.style.width = `${activeButton.offsetWidth}px`
        highlightRef.current.style.left = `${activeButton.offsetLeft}px`
      }
    }
  }, [mode])

  return (
    <div className="mode-selector">
      <div ref={highlightRef} className="mode-selector-highlight" aria-hidden="true" />
      <button
        ref={textButtonRef}
        onClick={() => onChange("text")}
        className={cn("mode-selector-button", mode === "text" && "active")}
        aria-pressed={mode === "text"}
      >
        Text Input
      </button>
      <button
        ref={signButtonRef}
        onClick={() => onChange("sign")}
        className={cn("mode-selector-button", mode === "sign" && "active")}
        aria-pressed={mode === "sign"}
      >
        Sign Language
      </button>
    </div>
  )
}
