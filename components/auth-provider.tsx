"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Define the User type
type User = {
  id: string
  name: string
  email: string
} | null

// Define the AuthContext type
type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if the user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you would check for a valid auth token and fetch user data
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Ensure the login and signup functions correctly redirect to the chat interface
  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // In a real app, you would make an API call to authenticate
      // For demo purposes, we'll simulate a successful login
      const mockUser = {
        id: "user_123",
        name: "Demo User",
        email,
      }

      // Store the user in localStorage (in a real app, you'd store tokens securely)
      localStorage.setItem("user", JSON.stringify(mockUser))

      // Set a cookie for middleware authentication check
      document.cookie = "auth_token=demo_token; path=/; max-age=86400"

      setUser(mockUser)
      router.push("/chat") // Ensure this redirects to the chat interface
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update the signup function to redirect to the chat interface
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      // In a real app, you would make an API call to create a user
      // For demo purposes, we'll simulate a successful signup
      const mockUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name,
        email,
      }

      // Store the user in localStorage (in a real app, you'd store tokens securely)
      localStorage.setItem("user", JSON.stringify(mockUser))

      // Set a cookie for middleware authentication check
      document.cookie = "auth_token=demo_token; path=/; max-age=86400"

      setUser(mockUser)
      router.push("/chat") // Ensure this redirects to the chat interface
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    // Clear user data
    localStorage.removeItem("user")

    // Clear auth cookie
    document.cookie = "auth_token=; path=/; max-age=0"

    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
