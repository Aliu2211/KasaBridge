import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { ChatProvider } from "@/lib/chat-store"
import { Toaster } from "@/components/ui/toaster"
import RegisterSW from "@/components/register-sw"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KasaBridge - Inclusive Communication",
  description: "Bridging communication gaps for speech-impaired individuals through text and sign language",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="KasaBridge" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KasaBridge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} gradient-bg min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <ChatProvider>
              {children}
              <Toaster />
              <RegisterSW />
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
