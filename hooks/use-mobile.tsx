"use client"

import { useState, useEffect } from "react"

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if the screen is mobile-sized
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return isMobile
}
