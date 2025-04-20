"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email is required")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending the reset link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                {!isSubmitted
                  ? "Enter your email address and we'll send you a link to reset your password"
                  : "Check your email for a link to reset your password"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!isSubmitted ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className={error ? "border-destructive" : ""}
                      />
                      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the
                    instructions.
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter>
              {!isSubmitted ? (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Send Reset Link
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              ) : (
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Return to Login</Link>
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
