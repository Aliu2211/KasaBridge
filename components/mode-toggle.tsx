"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label="Toggle theme"
        className="theme-transition border-gray-300 bg-white/80 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Toggle theme"
          className={`theme-transition ${theme === "light" ? "border-gray-300 bg-white/80 text-gray-700 hover:bg-gray-100 hover:text-gray-900" : ""}`}
        >
          {theme === "light" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={`theme-transition ${theme === "light" ? "bg-white border border-gray-200 shadow-md" : ""}`}
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`theme-transition ${theme === "light" ? "bg-gray-100 text-gray-900" : ""}`}
        >
          <Sun className="h-4 w-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`theme-transition ${theme === "dark" ? "bg-accent" : ""}`}
        >
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`theme-transition ${theme === "system" ? "bg-gray-100 text-gray-900" : ""}`}
        >
          <span className="h-4 w-4 mr-2">💻</span>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
