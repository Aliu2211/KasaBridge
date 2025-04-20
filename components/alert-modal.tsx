"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  children?: React.ReactNode
}

export default function AlertModal({ isOpen, onClose, title, message, children }: AlertModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Trap focus inside modal
      document.body.style.overflow = "hidden"
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      document.body.style.overflow = ""
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div
      className={cn("modal-overlay", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={cn("modal-content", isOpen ? "scale-100" : "scale-95")}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle id="modal-title" className="text-lg font-medium flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{message}</p>
            {children}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
