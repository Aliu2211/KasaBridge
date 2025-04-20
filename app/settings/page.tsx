"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Save,
  Trash2,
  Download,
  Upload,
  Bell,
  Volume2,
  Keyboard,
  Monitor,
  User,
  Shield,
  Video,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { toast } = useToast()
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)

  // General settings
  const [offlineMode, setOfflineMode] = useState(false)
  const [autoPlayAudio, setAutoPlayAudio] = useState(true)
  const [saveHistory, setSaveHistory] = useState(true)
  const [language, setLanguage] = useState("en")

  // Audio settings
  const [volume, setVolume] = useState(80)
  const [speechRate, setSpeechRate] = useState(1)
  const [voiceType, setVoiceType] = useState("female")
  const [audioQuality, setAudioQuality] = useState("high")

  // Accessibility settings
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [screenReaderOptimized, setScreenReaderOptimized] = useState(false)

  // Notification settings
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [meetingReminders, setMeetingReminders] = useState(true)

  // Meeting settings
  const [defaultMicOn, setDefaultMicOn] = useState(false)
  const [defaultCameraOn, setDefaultCameraOn] = useState(false)
  const [autoJoinMeetings, setAutoJoinMeetings] = useState(false)
  const [preferredPlatform, setPreferredPlatform] = useState("zoom")

  // Account settings
  const [displayName, setDisplayName] = useState("Demo User")
  const [email, setEmail] = useState("user@example.com")

  // Privacy settings
  const [dataCollection, setDataCollection] = useState(false)
  const [shareUsageData, setShareUsageData] = useState(false)
  const [storeSignData, setStoreSignData] = useState(true)

  const handleSaveSettings = () => {
    setIsLoading(true)

    // Simulate saving settings
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully",
      })
    }, 1000)
  }

  const handleExportData = () => {
    // Simulate exporting data
    const data = {
      settings: {
        general: { offlineMode, autoPlayAudio, saveHistory, language },
        audio: { volume, speechRate, voiceType, audioQuality },
        accessibility: { highContrast, largeText, reduceMotion, screenReaderOptimized },
        notifications: { enableNotifications, soundAlerts, meetingReminders },
        meetings: { defaultMicOn, defaultCameraOn, autoJoinMeetings, preferredPlatform },
        account: { displayName, email },
        privacy: { dataCollection, shareUsageData, storeSignData },
      },
      // Add other data like chat history, etc.
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `kasabridge-settings-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Data exported",
      description: "Your settings and data have been exported successfully",
    })
  }

  const handleImportData = () => {
    // In a real app, this would open a file picker and import the data
    toast({
      title: "Import feature",
      description: "This feature would allow importing settings from a file",
    })
  }

  const handleClearData = () => {
    // Simulate clearing data
    toast({
      title: "Data cleared",
      description: "All your data has been cleared successfully",
      variant: "destructive",
    })
  }

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
          <h1 className="text-3xl font-bold ml-4">Settings</h1>
        </div>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <div className="space-y-4">
          <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
            <CardContent className="p-4">
              <nav className="space-y-1">
                <Button
                  variant={activeTab === "general" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("general")}
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  General
                </Button>
                <Button
                  variant={activeTab === "audio" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("audio")}
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  Audio
                </Button>
                <Button
                  variant={activeTab === "accessibility" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("accessibility")}
                >
                  <Keyboard className="mr-2 h-4 w-4" />
                  Accessibility
                </Button>
                <Button
                  variant={activeTab === "notifications" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button
                  variant={activeTab === "meetings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("meetings")}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Meetings
                </Button>
                <Button
                  variant={activeTab === "account" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("account")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
                <Button
                  variant={activeTab === "privacy" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("privacy")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy
                </Button>
                <Button
                  variant={activeTab === "data" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("data")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Data Management
                </Button>
              </nav>
            </CardContent>
          </Card>

          <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">
                <p>Need help with settings?</p>
                <Link href="/help" className="text-primary hover:underline block mt-2">
                  Visit Help Center
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic application preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="offline-mode" className="font-medium">
                        Offline Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">Enable offline functionality</p>
                    </div>
                    <Switch id="offline-mode" checked={offlineMode} onCheckedChange={setOfflineMode} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-play" className="font-medium">
                        Auto-Play Audio
                      </Label>
                      <p className="text-sm text-muted-foreground">Automatically play audio after conversion</p>
                    </div>
                    <Switch id="auto-play" checked={autoPlayAudio} onCheckedChange={setAutoPlayAudio} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="save-history" className="font-medium">
                        Save History
                      </Label>
                      <p className="text-sm text-muted-foreground">Save your conversation history</p>
                    </div>
                    <Switch id="save-history" checked={saveHistory} onCheckedChange={setSaveHistory} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language" className="font-medium">
                      Interface Language
                    </Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Select your preferred language for the interface</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audio Settings */}
          {activeTab === "audio" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>Audio Settings</CardTitle>
                <CardDescription>Configure audio playback and speech synthesis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="volume" className="font-medium">
                        Volume
                      </Label>
                      <span className="text-sm text-muted-foreground">{volume}%</span>
                    </div>
                    <Slider
                      id="volume"
                      min={0}
                      max={100}
                      step={1}
                      value={[volume]}
                      onValueChange={(value) => setVolume(value[0])}
                    />
                    <p className="text-sm text-muted-foreground">Adjust the volume of audio playback</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="speech-rate" className="font-medium">
                        Speech Rate
                      </Label>
                      <span className="text-sm text-muted-foreground">{speechRate}x</span>
                    </div>
                    <Slider
                      id="speech-rate"
                      min={0.5}
                      max={2}
                      step={0.1}
                      value={[speechRate]}
                      onValueChange={(value) => setSpeechRate(value[0])}
                    />
                    <p className="text-sm text-muted-foreground">Adjust the speed of speech synthesis</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voice-type" className="font-medium">
                      Voice Type
                    </Label>
                    <Select value={voiceType} onValueChange={setVoiceType}>
                      <SelectTrigger id="voice-type">
                        <SelectValue placeholder="Select voice type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Select the type of voice for speech synthesis</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audio-quality" className="font-medium">
                      Audio Quality
                    </Label>
                    <Select value={audioQuality} onValueChange={setAudioQuality}>
                      <SelectTrigger id="audio-quality">
                        <SelectValue placeholder="Select audio quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Faster)</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High (Better quality)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Select the quality of audio output</p>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      Test Audio
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Accessibility Settings */}
          {activeTab === "accessibility" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>Accessibility Settings</CardTitle>
                <CardDescription>Configure accessibility preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="high-contrast" className="font-medium">
                        High Contrast Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                    <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="large-text" className="font-medium">
                        Large Text
                      </Label>
                      <p className="text-sm text-muted-foreground">Increase text size throughout the application</p>
                    </div>
                    <Switch id="large-text" checked={largeText} onCheckedChange={setLargeText} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reduce-motion" className="font-medium">
                        Reduce Motion
                      </Label>
                      <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                    </div>
                    <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={setReduceMotion} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="screen-reader" className="font-medium">
                        Screen Reader Optimization
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Optimize for screen readers and assistive technology
                      </p>
                    </div>
                    <Switch
                      id="screen-reader"
                      checked={screenReaderOptimized}
                      onCheckedChange={setScreenReaderOptimized}
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="font-medium">Keyboard Shortcuts</h3>
                    <p className="text-sm text-muted-foreground">Configure keyboard shortcuts for quick access</p>
                    <Button variant="outline" className="mt-2">
                      Configure Shortcuts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-notifications" className="font-medium">
                        Enable Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive notifications from KasaBridge</p>
                    </div>
                    <Switch
                      id="enable-notifications"
                      checked={enableNotifications}
                      onCheckedChange={setEnableNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sound-alerts" className="font-medium">
                        Sound Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">Play sound when notifications are received</p>
                    </div>
                    <Switch
                      id="sound-alerts"
                      checked={soundAlerts}
                      onCheckedChange={setSoundAlerts}
                      disabled={!enableNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="meeting-reminders" className="font-medium">
                        Meeting Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive reminders for upcoming meetings</p>
                    </div>
                    <Switch
                      id="meeting-reminders"
                      checked={meetingReminders}
                      onCheckedChange={setMeetingReminders}
                      disabled={!enableNotifications}
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="font-medium">Notification Permissions</h3>
                    <p className="text-sm text-muted-foreground">
                      KasaBridge needs permission to send notifications. If you've denied permission, you'll need to
                      update your browser settings.
                    </p>
                    <Button variant="outline" className="mt-2">
                      Request Permissions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meeting Settings */}
          {activeTab === "meetings" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>Meeting Settings</CardTitle>
                <CardDescription>Configure video meeting preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="default-mic" className="font-medium">
                        Default Microphone On
                      </Label>
                      <p className="text-sm text-muted-foreground">Start meetings with microphone enabled</p>
                    </div>
                    <Switch id="default-mic" checked={defaultMicOn} onCheckedChange={setDefaultMicOn} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="default-camera" className="font-medium">
                        Default Camera On
                      </Label>
                      <p className="text-sm text-muted-foreground">Start meetings with camera enabled</p>
                    </div>
                    <Switch id="default-camera" checked={defaultCameraOn} onCheckedChange={setDefaultCameraOn} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-join" className="font-medium">
                        Auto-Join Meetings
                      </Label>
                      <p className="text-sm text-muted-foreground">Automatically join meetings from calendar events</p>
                    </div>
                    <Switch id="auto-join" checked={autoJoinMeetings} onCheckedChange={setAutoJoinMeetings} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred-platform" className="font-medium">
                      Preferred Meeting Platform
                    </Label>
                    <Select value={preferredPlatform} onValueChange={setPreferredPlatform}>
                      <SelectTrigger id="preferred-platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="google-meet">Google Meet</SelectItem>
                        <SelectItem value="teams">Microsoft Teams</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Select your preferred video conferencing platform</p>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="font-medium">Calendar Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your calendar to automatically detect and join scheduled meetings
                    </p>
                    <Button variant="outline" className="mt-2">
                      Connect Calendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Settings */}
          {activeTab === "account" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="display-name" className="font-medium">
                      Display Name
                    </Label>
                    <Input id="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    <p className="text-sm text-muted-foreground">Your name as displayed to others</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">
                      Email Address
                    </Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <p className="text-sm text-muted-foreground">Your email address for account notifications</p>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-muted-foreground">Change your account password</p>
                    <Button variant="outline" className="mt-2">
                      Change Password
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="font-medium text-destructive">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="mt-2">
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all of
                            your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground">
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Settings */}
          {activeTab === "privacy" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-collection" className="font-medium">
                        Data Collection
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow KasaBridge to collect usage data to improve the service
                      </p>
                    </div>
                    <Switch id="data-collection" checked={dataCollection} onCheckedChange={setDataCollection} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="share-usage" className="font-medium">
                        Share Usage Data
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Share anonymous usage data to help improve the application
                      </p>
                    </div>
                    <Switch
                      id="share-usage"
                      checked={shareUsageData}
                      onCheckedChange={setShareUsageData}
                      disabled={!dataCollection}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="store-sign" className="font-medium">
                        Store Sign Language Data
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Store sign language detection data to improve recognition accuracy
                      </p>
                    </div>
                    <Switch id="store-sign" checked={storeSignData} onCheckedChange={setStoreSignData} />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="font-medium">Privacy Policy</h3>
                    <p className="text-sm text-muted-foreground">
                      Review our privacy policy to understand how we handle your data
                    </p>
                    <Button variant="outline" className="mt-2" asChild>
                      <Link href="/privacy">View Privacy Policy</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Management */}
          {activeTab === "data" && (
            <Card className={theme === "light" ? "border-gray-200 shadow-sm" : ""}>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your data and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Export Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Export all your data including settings, chat history, and preferences
                    </p>
                    <Button variant="outline" className="mt-2" onClick={handleExportData}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="font-medium">Import Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Import previously exported data to restore your settings and history
                    </p>
                    <Button variant="outline" className="mt-2" onClick={handleImportData}>
                      <Upload className="mr-2 h-4 w-4" />
                      Import Data
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="font-medium text-destructive">Clear Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Clear all your data including settings, chat history, and preferences
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="mt-2">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Clear All Data
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all your data including settings,
                            chat history, and preferences.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground"
                            onClick={handleClearData}
                          >
                            Clear All Data
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
