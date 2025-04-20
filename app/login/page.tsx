"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth-provider"

// Add useAuth hook to the component
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { theme } = useTheme()
  const { login, signup } = useAuth() // Add this line to use the auth context

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Form validation errors
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({})
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({})

  // Update the handleLoginSubmit function to use the auth context's login function
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setLoginErrors({})

    // Validate form
    const errors: Record<string, string> = {}
    if (!loginForm.email) errors.email = "Email is required"
    if (!loginForm.password) errors.password = "Password is required"

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      // Use the auth context's login function
      await login(loginForm.email, loginForm.password)

      toast({
        title: "Login successful",
        description: "Welcome back to KasaBridge!",
      })

      // The redirect is handled by the login function in auth-provider
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Update the handleSignupSubmit function to use the auth context's signup function
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setSignupErrors({})

    // Validate form
    const errors: Record<string, string> = {}
    if (!signupForm.name) errors.name = "Name is required"
    if (!signupForm.email) errors.email = "Email is required"
    if (!signupForm.password) errors.password = "Password is required"
    if (signupForm.password.length < 8) errors.password = "Password must be at least 8 characters"
    if (signupForm.password !== signupForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      // Use the auth context's signup function
      await signup(signupForm.name, signupForm.email, signupForm.password)

      toast({
        title: "Account created",
        description: "Welcome to KasaBridge! Your account has been created successfully.",
      })

      // The redirect is handled by the signup function in auth-provider
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 ${theme === "light" ? "bg-gradient-to-br from-white to-gray-50" : ""}`}
    >
      <div className={`w-full max-w-md ${theme === "light" ? "shadow-lg" : ""}`}>
        <div className="text-center mb-8">
          <div
            className={`inline-block p-2 ${theme === "light" ? "bg-primary/10 shadow-sm" : "bg-primary/10"} rounded-full mb-4`}
          >
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">KasaBridge</h1>
          <p className={`${theme === "light" ? "text-gray-600" : "text-muted-foreground"} mt-2`}>
            Bridging communication gaps through technology
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <form onSubmit={handleLoginSubmit}>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className={cn(loginErrors.email && "border-destructive")}
                        disabled={isLoading}
                      />
                      {loginErrors.email && <p className="text-destructive text-sm mt-1">{loginErrors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className={cn(loginErrors.password && "border-destructive")}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {loginErrors.password && <p className="text-destructive text-sm mt-1">{loginErrors.password}</p>}
                    </div>
                    <div className="text-right">
                      <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Logging in...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Login
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <form onSubmit={handleSignupSubmit}>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>Join KasaBridge to start communicating effectively</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Full Name"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      className={cn(signupErrors.name && "border-destructive")}
                      disabled={isLoading}
                    />
                    {signupErrors.name && <p className="text-destructive text-sm">{signupErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      className={cn(signupErrors.email && "border-destructive")}
                      disabled={isLoading}
                    />
                    {signupErrors.email && <p className="text-destructive text-sm">{signupErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className={cn(signupErrors.password && "border-destructive")}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {signupErrors.password && <p className="text-destructive text-sm">{signupErrors.password}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="signup-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      className={cn(signupErrors.confirmPassword && "border-destructive")}
                      disabled={isLoading}
                    />
                    {signupErrors.confirmPassword && (
                      <p className="text-destructive text-sm">{signupErrors.confirmPassword}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Creating account...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Update the "Continue as Guest" button to set a guest auth token and redirect to chat */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => {
              // Set a guest auth token
              document.cookie = "auth_token=guest_token; path=/; max-age=86400"
              router.push("/chat")
            }}
          >
            <span className="text-sm text-muted-foreground hover:text-foreground">Continue as Guest</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
