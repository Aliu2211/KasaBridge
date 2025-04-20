"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Info, Home } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <header className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mr-4">Speech Assist</h1>
      </div>

      <div className="flex items-center space-x-2">
        {isHomePage ? (
          <Link href="/about">
            <Button variant="outline" size="icon" aria-label="About">
              <Info className="h-5 w-5" />
            </Button>
          </Link>
        ) : (
          <Link href="/">
            <Button variant="outline" size="icon" aria-label="Home">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
        )}
        <ModeToggle />
      </div>
    </header>
  )
}
