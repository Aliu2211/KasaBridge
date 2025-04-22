import React from "react"

export default function MeetMainStage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-10 bg-background text-center">
      <img src="/placeholder-logo.png" alt="KasaBridge Logo" className="w-20 h-20 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">KasaBridge Main Stage</h1>
      <p className="mb-6 text-muted-foreground text-lg">
        Use the full power of KasaBridge during your Google Meet session. Access transcription, Akan speech, and more—right here on the main stage.
      </p>
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">
        <textarea className="w-full min-h-[100px] rounded border border-primary/30 p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition" placeholder="Type your message for Akan speech..." />
        <button className="w-full py-3 px-4 rounded bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-md hover:from-secondary hover:to-primary transition">Generate Akan Speech</button>
        <button className="w-full py-3 px-4 rounded bg-secondary text-primary font-bold hover:bg-secondary/80 transition">Transcription</button>
      </div>
      <div className="mt-8 text-xs text-muted-foreground">Powered by KasaBridge</div>
    </div>
  )
}
