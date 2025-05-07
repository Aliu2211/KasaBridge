"use client"

import { Camera, Video, VideoOff, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "next-themes"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader as UIDialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { useState } from "react"
interface ChatHeaderProps {
  title: string
  isWebcamActive: boolean
  isSignDetectionActive: boolean
  onToggleWebcam: () => void
  onToggleSignDetection: () => void
  onNewChat: () => void
}

export default function ChatHeader({
  title,
  onNewChat,
}: ChatHeaderProps) {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)

    // Helper to download the chrome-extension folder as a zip
    const handleDownload = async () => {
      // Dynamically import JSZip only when needed
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()
      // Add the chrome-extension folder recursively
      // This requires a backend or static hosting for security reasons
      // For demo, just add a README
      zip.file("chrome-extension/README.txt", "Add your extension files here.")
      const blob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "chrome-extension.zip"
      a.click()
      URL.revokeObjectURL(url)
    }

  return (
    <div
      className={`chat-header flex items-center justify-between theme-transition ${theme === "light" ? "bg-white border-b border-gray-200 shadow-sm" : ""}`}
    >
      <div className="flex items-center">
        <div>
          <h2 className={`text-lg font-semibold theme-transition ${theme === "light" ? "text-gray-900" : ""}`}>
            {title}
          </h2>
          <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-muted-foreground"} theme-transition`}>
            {user ? `Welcome, ${user.name}` : "Text or sign language to Akan speech"}
          </p>
        </div>
    
      </div>

      <div className="flex items-center gap-2">


      <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
              Install Extension
            </Button>
          </DialogTrigger>
          <DialogContent>
            <UIDialogHeader>
              <DialogTitle>Manual Extension Installation</DialogTitle>
              <DialogDescription>
                <ol className="list-decimal pl-4 space-y-2 text-left mt-2">
                  <li>Click the <b>Download Extension</b> button below to get a zip of the extension folder.</li>
                  <li>Unzip the downloaded file on your computer.</li>
                  <li>
                    Open the Chrome Extensions page by copying and pasting the following URL into your browser's address bar:
                    <div className="flex items-center mt-2">
                      <input
                        type="text"
                        value="chrome://extensions/"
                        readOnly
                        className="border rounded px-2 py-1 text-sm w-56 mr-2 bg-muted"
                        onFocus={e => e.target.select()}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText("chrome://extensions/")
                        }}
                      >
                        Copy URL
                      </Button>
                    </div>
                  </li>
                  <li>Enable <b>Developer mode</b> (top right).</li>
                  <li>Click <b>Load unpacked</b> and select the unzipped <b>chrome-extension</b> folder.</li>
                  <li>The extension will be added to your browser.</li>
                </ol>
              </DialogDescription>
            </UIDialogHeader>
            <DialogFooter>
              <Button onClick={handleDownload}>
                Download Extension
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ModeToggle />
      </div>
    </div>
  )
}
