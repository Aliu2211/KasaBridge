import React from "react"

export default function MeetSidePanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-background text-center">
      <img src="/placeholder-logo.png" alt="KasaBridge Logo" className="w-16 h-16 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">KasaBridge for Google Meet</h1>
      <p className="mb-4 text-muted-foreground">
        Welcome! Use this side panel to access Akan speech features and tools during your Google Meet session.
      </p>
      <div className="w-full flex flex-col gap-4">
        <button className="w-full py-2 px-4 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition">Generate Akan Speech</button>
        <button className="w-full py-2 px-4 rounded bg-secondary text-primary font-semibold hover:bg-secondary/80 transition">Transcription</button>
      </div>
      <div className="mt-6 text-xs text-muted-foreground">Powered by KasaBridge</div>
    </div>
  )
}
