"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Search,
  MessageSquare,
  Camera,
  Mic,
  Video,
  Keyboard,
  HelpCircle,
  FileText,
  BookOpen,
  Play,
  ExternalLink,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function HelpPage() {
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("guides")

  // Filter content based on search query
  const filterContent = (content: string) => {
    if (!searchQuery) return true
    return content.toLowerCase().includes(searchQuery.toLowerCase())
  }

  // Keyboard shortcuts data
  const keyboardShortcuts = [
    { key: "Ctrl + N", description: "Create a new chat" },
    { key: "Ctrl + B", description: "Toggle sidebar" },
    { key: "Ctrl + M", description: "Join a meeting" },
    { key: "Ctrl + S", description: "Save current chat" },
    { key: "Ctrl + D", description: "Delete current chat" },
    { key: "Ctrl + F", description: "Search in chats" },
    { key: "Ctrl + /", description: "Show keyboard shortcuts" },
    { key: "Ctrl + Shift + C", description: "Toggle camera" },
    { key: "Ctrl + Shift + M", description: "Toggle microphone" },
    { key: "Ctrl + Enter", description: "Send message" },
    { key: "Esc", description: "Cancel current action" },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/chat">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Chat
            </Button>
          </Link>
          <h1 className="text-3xl font-bold ml-4">Help Center</h1>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help topics..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <div className="space-y-4">
          <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
            <CardContent className="p-4">
              <nav className="space-y-1">
                <Button
                  variant={activeTab === "guides" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("guides")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  User Guides
                </Button>
                <Button
                  variant={activeTab === "faq" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("faq")}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  FAQ
                </Button>
                <Button
                  variant={activeTab === "tutorials" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("tutorials")}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Video Tutorials
                </Button>
                <Button
                  variant={activeTab === "shortcuts" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("shortcuts")}
                >
                  <Keyboard className="mr-2 h-4 w-4" />
                  Keyboard Shortcuts
                </Button>
                <Button
                  variant={activeTab === "troubleshooting" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("troubleshooting")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Troubleshooting
                </Button>
              </nav>
            </CardContent>
          </Card>

          <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
            <CardContent className="p-4">
              <div className="text-sm">
                <h3 className="font-medium mb-2">Need more help?</h3>
                <p className="text-muted-foreground mb-4">
                  If you can't find what you're looking for, you can contact our support team.
                </p>
                <Button className="w-full">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* User Guides */}
          {activeTab === "guides" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>User Guides</CardTitle>
                <CardDescription>Comprehensive guides to help you use KasaBridge effectively</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filterContent("Getting Started with KasaBridge") && (
                    <AccordionItem value="getting-started">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Getting Started with KasaBridge
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p>
                            Welcome to KasaBridge! This guide will help you get started with our platform designed to
                            aid speech-impaired individuals through text and sign language input with Akan audio
                            conversion.
                          </p>

                          <h4 className="font-medium text-lg">Initial Setup</h4>
                          <ol className="list-decimal pl-5 space-y-2">
                            <li>Create an account or continue as a guest</li>
                            <li>Choose your preferred input method (text or sign language)</li>
                            <li>Adjust audio settings for optimal output</li>
                            <li>Explore the interface to familiarize yourself with features</li>
                          </ol>

                          <h4 className="font-medium text-lg">Basic Features</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              <strong>Text Input:</strong> Type your message and convert it to Akan speech
                            </li>
                            <li>
                              <strong>Sign Language:</strong> Use your device's camera for sign language detection
                            </li>
                            <li>
                              <strong>Audio Output:</strong> Listen to the converted Akan speech
                            </li>
                            <li>
                              <strong>Chat History:</strong> Access and manage your conversation history
                            </li>
                          </ul>

                          <Button variant="outline" asChild>
                            <Link href="/help/getting-started">Read Full Guide</Link>
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Using Text Input") && (
                    <AccordionItem value="text-input">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Using Text Input
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p>
                            The text input feature allows you to type messages that will be converted to Akan speech.
                            This guide covers all aspects of using text input effectively.
                          </p>

                          <h4 className="font-medium text-lg">Text Input Features</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Basic text entry and formatting</li>
                            <li>Attaching files and images</li>
                            <li>Recording voice messages</li>
                            <li>Using emoji and special characters</li>
                            <li>Text prediction and suggestions</li>
                          </ul>

                          <h4 className="font-medium text-lg">Tips for Effective Text Input</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Use short, clear sentences for better translation</li>
                            <li>Check your message before sending for accuracy</li>
                            <li>Save frequently used phrases for quick access</li>
                            <li>Adjust speech rate and volume in settings</li>
                          </ul>

                          <Button variant="outline" asChild>
                            <Link href="/help/text-input">Read Full Guide</Link>
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Sign Language Detection") && (
                    <AccordionItem value="sign-language">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Camera className="mr-2 h-4 w-4" />
                          Sign Language Detection
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p>
                            KasaBridge's sign language detection feature uses your device's camera to interpret sign
                            language and convert it to text and Akan speech.
                          </p>

                          <h4 className="font-medium text-lg">Setting Up Sign Language Detection</h4>
                          <ol className="list-decimal pl-5 space-y-2">
                            <li>Enable camera access in your browser</li>
                            <li>Position yourself in a well-lit area</li>
                            <li>Ensure your hands are clearly visible in the frame</li>
                            <li>Start the sign language detection feature</li>
                          </ol>

                          <h4 className="font-medium text-lg">Tips for Better Detection</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Use clear, deliberate signs</li>
                            <li>Maintain good lighting conditions</li>
                            <li>Avoid busy or cluttered backgrounds</li>
                            <li>Position the camera at an appropriate distance</li>
                            <li>Wear solid-colored clothing for better contrast</li>
                          </ul>

                          <Button variant="outline" asChild>
                            <Link href="/help/sign-language">Read Full Guide</Link>
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Meeting Integration") && (
                    <AccordionItem value="meeting-integration">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Video className="mr-2 h-4 w-4" />
                          Meeting Integration
                          <Badge variant="outline" className="ml-2 text-xs">
                            New
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p>
                            KasaBridge's meeting integration feature allows you to join video conferencing platforms and
                            use text or sign language to communicate during meetings.
                          </p>

                          <h4 className="font-medium text-lg">How Meeting Integration Works</h4>
                          <p>
                            KasaBridge works as a companion to your video meetings. It converts your text or sign
                            language to speech that can be shared in your meeting.
                          </p>

                          <h4 className="font-medium text-lg">Using Meeting Integration</h4>
                          <ol className="list-decimal pl-5 space-y-2">
                            <li>Click "Join Meeting" in the sidebar</li>
                            <li>Enter the meeting URL (Zoom, Google Meet, etc.)</li>
                            <li>Join the meeting in a new tab</li>
                            <li>Use KasaBridge to convert your input to speech</li>
                            <li>Share your computer audio in the meeting</li>
                          </ol>

                          <h4 className="font-medium text-lg">Supported Platforms</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Zoom</li>
                            <li>Google Meet</li>
                            <li>Microsoft Teams</li>
                            <li>Other platforms that support computer audio sharing</li>
                          </ul>

                          <Button variant="outline" asChild>
                            <Link href="/help/meeting-integration">Read Full Guide</Link>
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Managing Chats") && (
                    <AccordionItem value="managing-chats">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Managing Chats
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p>
                            Learn how to effectively manage your chats, including creating new chats, saving important
                            conversations, and organizing your chat history.
                          </p>

                          <h4 className="font-medium text-lg">Chat Management Features</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Creating new chats</li>
                            <li>Saving important conversations</li>
                            <li>Organizing chats into folders</li>
                            <li>Searching through chat history</li>
                            <li>Deleting unwanted chats</li>
                          </ul>

                          <h4 className="font-medium text-lg">Chat Organization Tips</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Use descriptive chat titles</li>
                            <li>Save important chats to the "Saved" folder</li>
                            <li>Regularly clean up your chat history</li>
                            <li>Use the search function to find specific conversations</li>
                          </ul>

                          <Button variant="outline" asChild>
                            <Link href="/help/managing-chats">Read Full Guide</Link>
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Audio Settings and Customization") && (
                    <AccordionItem value="audio-settings">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Mic className="mr-2 h-4 w-4" />
                          Audio Settings and Customization
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p>
                            Customize your audio experience in KasaBridge by adjusting various settings to suit your
                            preferences and needs.
                          </p>

                          <h4 className="font-medium text-lg">Available Audio Settings</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Volume control</li>
                            <li>Speech rate adjustment</li>
                            <li>Voice type selection</li>
                            <li>Audio quality settings</li>
                            <li>Auto-play preferences</li>
                          </ul>

                          <h4 className="font-medium text-lg">Optimizing Audio for Different Environments</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Settings for quiet environments</li>
                            <li>Settings for noisy environments</li>
                            <li>Settings for meetings and presentations</li>
                            <li>Settings for personal use</li>
                          </ul>

                          <Button variant="outline" asChild>
                            <Link href="/help/audio-settings">Read Full Guide</Link>
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          )}

          {/* FAQ */}
          {activeTab === "faq" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to common questions about KasaBridge</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filterContent("What is KasaBridge?") && (
                    <AccordionItem value="what-is-kasabridge">
                      <AccordionTrigger>What is KasaBridge?</AccordionTrigger>
                      <AccordionContent>
                        KasaBridge is a Progressive Web App (PWA) designed to aid speech-impaired individuals by
                        converting text and sign language input into Akan audio. It serves as a communication bridge,
                        allowing users to express themselves through alternative input methods and be heard through
                        natural-sounding speech.
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Is KasaBridge free to use?") && (
                    <AccordionItem value="is-kasabridge-free">
                      <AccordionTrigger>Is KasaBridge free to use?</AccordionTrigger>
                      <AccordionContent>
                        Yes, KasaBridge is currently free to use with all core features available to all users. We may
                        introduce premium features in the future, but the essential communication tools will always
                        remain accessible at no cost.
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Do I need to create an account?") && (
                    <AccordionItem value="need-account">
                      <AccordionTrigger>Do I need to create an account?</AccordionTrigger>
                      <AccordionContent>
                        While you can use KasaBridge as a guest, creating an account provides additional benefits such
                        as saving your chat history, syncing your settings across devices, and accessing your
                        conversations from anywhere. We recommend creating an account for the best experience.
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Which sign languages are supported?") && (
                    <AccordionItem value="supported-sign-languages">
                      <AccordionTrigger>Which sign languages are supported?</AccordionTrigger>
                      <AccordionContent>
                        Currently, KasaBridge supports American Sign Language (ASL) with the highest accuracy. We are
                        continuously working to expand our support for other sign languages, including British Sign
                        Language (BSL), Ghanaian Sign Language, and others. Our goal is to make KasaBridge accessible to
                        as many sign language users as possible.
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Can I use KasaBridge offline?") && (
                    <AccordionItem value="offline-use">
                      <AccordionTrigger>Can I use KasaBridge offline?</AccordionTrigger>
                      <AccordionContent>
                        Yes, KasaBridge is designed as a Progressive Web App (PWA) which means you can install it on
                        your device and use many features offline. However, some features like sign language detection
                        and advanced audio generation may require an internet connection for optimal performance.
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("How does the meeting integration work?") && (
                    <AccordionItem value="meeting-integration-faq">
                      <AccordionTrigger>How does the meeting integration work?</AccordionTrigger>
                      <AccordionContent>
                        KasaBridge's meeting integration works as a companion to your video meetings. When you join a
                        meeting, KasaBridge opens the meeting in a new tab while keeping the KasaBridge interface open.
                        You can type text or use sign language in KasaBridge, which converts your input to speech. By
                        sharing your computer audio in the meeting, others can hear the generated speech as if you were
                        speaking directly.
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Is my data private and secure?") && (
                    <AccordionItem value="data-privacy">
                      <AccordionTrigger>Is my data private and secure?</AccordionTrigger>
                      <AccordionContent>
                        Yes, we take your privacy and data security seriously. Your conversations and personal
                        information are encrypted and stored securely. We do not share your data with third parties
                        without your explicit consent. You can review our privacy policy for more details on how we
                        handle your data.
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Can I customize the voice output?") && (
                    <AccordionItem value="customize-voice">
                      <AccordionTrigger>Can I customize the voice output?</AccordionTrigger>
                      <AccordionContent>
                        Yes, KasaBridge offers several customization options for voice output. You can adjust the speech
                        rate, volume, and select different voice types (male, female, or neutral). These settings can be
                        configured in the Audio Settings section of the Settings page.
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("What devices are compatible with KasaBridge?") && (
                    <AccordionItem value="compatible-devices">
                      <AccordionTrigger>What devices are compatible with KasaBridge?</AccordionTrigger>
                      <AccordionContent>
                        KasaBridge works on most modern devices with a web browser, including smartphones, tablets,
                        laptops, and desktop computers. For the best experience, we recommend using the latest version
                        of Chrome, Firefox, Safari, or Edge. For sign language detection, your device needs a camera.
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("How can I provide feedback or report issues?") && (
                    <AccordionItem value="feedback">
                      <AccordionTrigger>How can I provide feedback or report issues?</AccordionTrigger>
                      <AccordionContent>
                        We welcome your feedback and are committed to continuously improving KasaBridge. You can provide
                        feedback or report issues by clicking the "Contact Support" button in the Help Center or by
                        emailing us at support@kasabridge.com. Please include as much detail as possible to help us
                        address your concerns effectively.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          )}

          {/* Video Tutorials */}
          {activeTab === "tutorials" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>Learn how to use KasaBridge with step-by-step video guides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterContent("Getting Started with KasaBridge") && (
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground opacity-50" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">Getting Started with KasaBridge</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          A complete introduction to KasaBridge and its features
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">5:32</Badge>
                          <Button variant="outline" size="sm" className="gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {filterContent("Text to Speech Tutorial") && (
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground opacity-50" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">Text to Speech Tutorial</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Learn how to use the text input feature effectively
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">3:45</Badge>
                          <Button variant="outline" size="sm" className="gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {filterContent("Sign Language Detection Guide") && (
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground opacity-50" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">Sign Language Detection Guide</h3>
                        <p className="text-sm text-muted-foreground mb-2">Master the sign language detection feature</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">7:18</Badge>
                          <Button variant="outline" size="sm" className="gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {filterContent("Meeting Integration Tutorial") && (
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground opacity-50" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">Meeting Integration Tutorial</h3>
                        <p className="text-sm text-muted-foreground mb-2">How to use KasaBridge in video meetings</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">6:24</Badge>
                          <Button variant="outline" size="sm" className="gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {filterContent("Managing Your Chat History") && (
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground opacity-50" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">Managing Your Chat History</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Learn how to organize and manage your conversations
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">4:10</Badge>
                          <Button variant="outline" size="sm" className="gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {filterContent("Customizing KasaBridge Settings") && (
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground opacity-50" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">Customizing KasaBridge Settings</h3>
                        <p className="text-sm text-muted-foreground mb-2">Personalize your KasaBridge experience</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">5:52</Badge>
                          <Button variant="outline" size="sm" className="gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Keyboard Shortcuts */}
          {activeTab === "shortcuts" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>Keyboard Shortcuts</CardTitle>
                <CardDescription>Boost your productivity with these keyboard shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {keyboardShortcuts
                      .filter((shortcut) => filterContent(`${shortcut.key} ${shortcut.description}`))
                      .map((shortcut, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-md ${theme === "light" ? "bg-gray-50 border border-gray-200" : "bg-secondary/50"}`}
                        >
                          <span>{shortcut.description}</span>
                          <kbd
                            className={`px-2 py-1 rounded text-xs font-semibold ${theme === "light" ? "bg-white border border-gray-300 shadow-sm" : "bg-background border border-border"}`}
                          >
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                  </div>

                  <Separator />

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      You can customize these shortcuts in the Accessibility section of the Settings page.
                    </p>
                    <Button variant="outline" asChild>
                      <Link href="/settings?tab=accessibility">
                        <Keyboard className="mr-2 h-4 w-4" />
                        Customize Shortcuts
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Troubleshooting */}
          {activeTab === "troubleshooting" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>Solutions to common issues you might encounter</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filterContent("Camera access issues") && (
                    <AccordionItem value="camera-issues">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Camera className="mr-2 h-4 w-4" />
                          Camera access issues
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p>
                            If you're having trouble accessing your camera for sign language detection, try these
                            solutions:
                          </p>

                          <h4 className="font-medium">Check Browser Permissions</h4>
                          <ol className="list-decimal pl-5 space-y-2">
                            <li>Click the lock icon in your browser's address bar</li>
                            <li>Ensure camera permissions are set to "Allow"</li>
                            <li>If denied, change to "Allow" and refresh the page</li>
                          </ol>

                          <h4 className="font-medium">Other Solutions</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Make sure no other applications are using your camera</li>
                            <li>Try using a different browser</li>
                            <li>Restart your device</li>
                            <li>Check if your camera is working in other applications</li>
                            <li>Update your browser to the latest version</li>
                          </ul>

                          <p className="text-sm text-muted-foreground">
                            If you're still having issues, please contact our support team for assistance.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Audio playback problems") && (
                    <AccordionItem value="audio-problems">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Mic className="mr-2 h-4 w-4" />
                          Audio playback problems
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p>If you're experiencing issues with audio playback, try these solutions:</p>

                          <h4 className="font-medium">Check Audio Settings</h4>
                          <ol className="list-decimal pl-5 space-y-2">
                            <li>Ensure your device volume is turned up</li>
                            <li>Check if your device is muted</li>
                            <li>Try using headphones to rule out speaker issues</li>
                            <li>Adjust the volume in KasaBridge settings</li>
                          </ol>

                          <h4 className="font-medium">Browser Audio Permissions</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Click the lock icon in your browser's address bar</li>
                            <li>Ensure sound permissions are set to "Allow"</li>
                            <li>Check if your browser is blocking autoplay</li>
                          </ul>

                          <h4 className="font-medium">Other Solutions</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Refresh the page</li>
                            <li>Clear your browser cache</li>
                            <li>Try using a different browser</li>
                            <li>Restart your device</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Sign language detection not working") && (
                    <AccordionItem value="sign-detection-issues">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Camera className="mr-2 h-4 w-4" />
                          Sign language detection not working
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p>If sign language detection is not working properly, try these solutions:</p>

                          <h4 className="font-medium">Improve Detection Conditions</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Ensure you have good lighting (natural light works best)</li>
                            <li>Position yourself against a plain, contrasting background</li>
                            <li>Make sure your hands are clearly visible in the frame</li>
                            <li>Perform signs at a moderate pace</li>
                            <li>Position your camera at an appropriate distance</li>
                          </ul>

                          <h4 className="font-medium">Technical Solutions</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Check your internet connection (detection requires a stable connection)</li>
                            <li>Ensure your browser is up to date</li>
                            <li>Try using a device with a better camera</li>
                            <li>Close other applications that might be using system resources</li>
                            <li>Refresh the page or restart the application</li>
                          </ul>

                          <p className="text-sm text-muted-foreground">
                            Note: Sign language detection works best with American Sign Language (ASL) currently.
                            Support for other sign languages is being improved continuously.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("Meeting integration issues") && (
                    <AccordionItem value="meeting-issues">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Video className="mr-2 h-4 w-4" />
                          Meeting integration issues
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p>If you're having trouble with the meeting integration feature, try these solutions:</p>

                          <h4 className="font-medium">Audio Not Being Heard in Meeting</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Make sure you've enabled "Share computer audio" in your meeting platform</li>
                            <li>Check that your computer's audio is working properly</li>
                            <li>Ensure KasaBridge has permission to play audio</li>
                            <li>Try using headphones to prevent audio feedback</li>
                          </ul>

                          <h4 className="font-medium">Meeting Link Issues</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Ensure you're using a valid meeting link</li>
                            <li>Check that you're logged into the meeting platform (if required)</li>
                            <li>Try copying the link directly from the meeting invitation</li>
                          </ul>

                          <h4 className="font-medium">Browser Compatibility</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Use a modern browser like Chrome, Firefox, or Edge</li>
                            <li>Ensure your browser allows pop-ups from KasaBridge</li>
                            <li>Try disabling browser extensions that might interfere</li>
                          </ul>

                          <p className="text-sm text-muted-foreground">
                            Remember: KasaBridge works as a companion to your meetings. You need to join the meeting in
                            a separate tab and share your computer audio for others to hear the generated speech.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {filterContent("App performance issues") && (
                    <AccordionItem value="performance-issues">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          App performance issues
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p>
                            If KasaBridge is running slowly or experiencing performance issues, try these solutions:
                          </p>

                          <h4 className="font-medium">Improve Browser Performance</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Close unused tabs and applications</li>
                            <li>Clear your browser cache and cookies</li>
                            <li>Disable unnecessary browser extensions</li>
                            <li>Update your browser to the latest version</li>
                          </ul>

                          <h4 className="font-medium">Optimize KasaBridge</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Reduce the quality settings in Audio Settings</li>
                            <li>Clear old chat history that you no longer need</li>
                            <li>Disable features you're not using (like camera when not needed)</li>
                            <li>Install KasaBridge as a PWA for better performance</li>
                          </ul>

                          <h4 className="font-medium">Device Considerations</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Ensure your device meets the minimum requirements</li>
                            <li>Restart your device to free up system resources</li>
                            <li>Check your internet connection speed</li>
                            <li>Consider using a device with better specifications for optimal performance</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
