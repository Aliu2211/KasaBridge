"use client"

import type React from "react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import useUser from "@/hooks/useUser";
import {
  Search,
  MessageSquare,
  FolderClosed,
  Settings,
  HelpCircle,
  Plus,
  Star,
  Trash2,
  MoreVertical,
  Video,
  Edit,
} from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader as UIDialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Link from "next/link"
import { UserAccountNav } from "@/components/user-account-nav"
import { useChat } from "@/lib/chat-store"
import { formatDistanceToNow } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// Import the RenameChatDialog component
import RenameChatDialog from "@/components/rename-chat-dialog"
import MeetStreamDialog from "@/components/meet-stream-dialog"


interface SidebarProps {
  onJoinMeeting?: () => void
}

export default function Sidebar({ onJoinMeeting }: SidebarProps) {
  const [activeFolder, setActiveFolder] = useState<"recent" | "saved">("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  // Add state for the rename dialog
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null)
  // Add state for the rename functionality
  const [newChatTitle, setNewChatTitle] = useState("")

  // Add state to control which chat's menu is open
  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null)

  // Update the useChat hook to include the renameChat function
  const { chats, activeChat, createNewChat, setActiveChat, deleteChat, moveChat, renameChat } = useChat()

  const { fullName, setFullName } = useUser();
  const [roomID, setRoomID] = useState("");
  const router = useRouter();

  useEffect(() => {
    setFullName("");
  }, [setFullName]);


  // Update the handleStartRename function to use the dialog
  const handleStartRename = (chatId: string) => {
    setRenamingChatId(chatId)
    setIsRenameDialogOpen(true)
  }

  // Add a function to handle the rename submission
  const handleRenameSubmit = (chatId: string) => {
    if (newChatTitle.trim()) {
      renameChat(chatId, newChatTitle.trim())
    }
    setRenamingChatId(null)
  }

  // Add a function to handle canceling the rename
  const handleRenameCancel = () => {
    setRenamingChatId(null)
  }

  // Add a function to handle key press events during rename
  const handleRenameKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleRenameSubmit(chatId)
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleRenameCancel()
    }
  }

  // Filter chats by folder and search query
  const filteredChats = chats
    .filter((chat) => chat.folder === activeFolder)
    .filter(
      (chat) =>
        searchQuery === "" ||
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => b.lastUpdated - a.lastUpdated)

  const handleNewChat = () => {
    createNewChat()
  }

  const handleChatClick = (chatId: string) => {
    setActiveChat(chatId)
  }

  const handleMoveChat = (chatId: string, folder: "recent" | "saved") => {
    moveChat(chatId, folder)
  }

  const handleDeleteChat = (chatId: string) => {
    setOpenMenuChatId(null) // Close the menu before deleting
    deleteChat(chatId)
  }

  const [meetStreamOpen, setMeetStreamOpen] = useState(false);

  return (
    <>
      <div
        className={`sidebar theme-transition ${theme === "light" ? "bg-white/90 border-r border-gray-200 shadow-sm" : ""}`}
      >
        <div
          className={`p-4 flex items-center justify-between theme-transition ${theme === "light" ? "border-b border-gray-100" : ""}`}
        >
          <Link href="/chat" className="flex items-center gap-2 hover:text-primary transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center theme-transition">
              <MessageSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold theme-transition">KasaBridge</h1>
          </Link>
          <UserAccountNav />
        </div>

        <div className="p-4 space-y-2">
          <Button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>

          {onJoinMeeting && (
            <Button onClick={onJoinMeeting} variant="outline" className="w-full flex items-center justify-center gap-2">
              <Video className="h-4 w-4" />
              Join Meeting
            </Button>
          )}

          <Button onClick={() => setMeetStreamOpen(true)} variant="outline" className="w-full flex items-center justify-center gap-2">
            <Video className="h-4 w-4" />
            KasaBridge Meet Stream
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={onJoinMeeting} variant="outline" className="w-full flex items-center justify-center gap-2">
                <Video className="h-4 w-4" />
                KasaBridge Meet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <UIDialogHeader>
                <DialogTitle className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text  font-extrabold text-transparent text-5xl text-center justify-center mb-10">KasaBridge Meet</DialogTitle>
                <DialogDescription>
                  <div className="mx-auto max-w-4xl text-center">
                    <h1 className="bg-white bg-clip-text  font-extrabold text-transparent text-2xl">
                      {`Create a new meeting `}
                    </h1>
                    <h1 className="bg-white bg-clip-text font-extrabold text-transparent text-2xl">
                      <span className="block">or Join a meeting</span>
                    </h1>

                    <div className="flex items-center justify-center gap-4 mt-6">
                      {/* <input
                      type="text"
                      id="name"
                      onChange={(e) => setFullName(e.target.value.toString())}
                      className="border rounded-md focus:border-transparent focus:outline-none focus:ring-0 px-4 py-2 w-full text-black"
                     //className={`absolute left-2 top-2.5 h-4 w-4 ${theme === "light" ? "text-gray-500" : "text-muted-foreground"}`}
                     placeholder="Enter your name"
                    /> */}
                      <Input
                        id="name"
                        placeholder="Enter Your Name"
                        type="text"
                        //value={meetingUrl}
                        onChange={(e) => setFullName(e.target.value.toString())}
                        className={theme === "light" ? "border-gray-300" : ""}
                      />
                    </div>

                    {fullName && fullName.length >= 3 && (
                      <>
                        <div className="flex items-center justify-center gap-4 mt-6">
                          <Input
                            type="text"
                            id="roomid"
                            value={roomID}
                            onChange={(e) => setRoomID(e.target.value)}
                            //className="border rounded-md focus:border-transparent focus:outline-none focus:ring-0 px-4 py-2 w-full text-black"
                            className={theme === "light" ? "border-gray-300" : ""}
                            placeholder="Enter room ID to join a meeting"
                          />
                          <Button
                            className="rounded-md bg-blue-600 px-10 py-[11px] text-sm font-medium text-white focus:outline-none sm:w-auto"
                            onClick={() => router.push(`/room/${roomID}`)}
                            disabled={!roomID}
                          >
                            Join
                          </Button>
                        </div>
                        <div className="mt-4 flex items-center justify-center">

                        </div>
                      </>
                    )}
                  </div>
                </DialogDescription>
              </UIDialogHeader>
              <DialogFooter>
                <Button
                  // className="text-lg font-medium hover:text-blue-400"
                  onClick={() => router.push(`/room/${uuid()}`)}
                >
                  Create a new meeting
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>

        <div className="px-4 py-2 theme-transition">
          <div className="relative">
            <Search
              className={`absolute left-2 top-2.5 h-4 w-4 ${theme === "light" ? "text-gray-500" : "text-muted-foreground"}`}
            />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-8 ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-secondary/50"} theme-transition`}
            />
          </div>
        </div>

        <div className="px-2 py-2 theme-transition">
          <h2
            className={`px-2 py-1 text-xs font-semibold ${theme === "light" ? "text-gray-500" : "text-muted-foreground"} uppercase theme-transition`}
          >
            Folders
          </h2>
          <nav className="space-y-1 mt-1">
            <button
              className={cn("sidebar-item theme-transition", activeFolder === "recent" && "active")}
              onClick={() => setActiveFolder("recent")}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Recent chats</span>
            </button>
            <button
              className={cn("sidebar-item theme-transition", activeFolder === "saved" && "active")}
              onClick={() => setActiveFolder("saved")}
            >
              <FolderClosed className="h-4 w-4" />
              <span>Saved chats</span>
            </button>
          </nav>
        </div>

        <div className="px-2 py-2 flex-1 overflow-y-auto theme-transition">
          <h2
            className={`px-2 py-1 text-xs font-semibold ${theme === "light" ? "text-gray-500" : "text-muted-foreground"} uppercase theme-transition`}
          >
            {filteredChats.length > 0 ? `Chats (${filteredChats.length})` : "No chats found"}
          </h2>
          <div className="space-y-1 mt-1">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "group flex items-center justify-between px-2 py-2 rounded-md cursor-pointer hover:bg-secondary/80 transition-colors",
                  activeChat?.id === chat.id && (theme === "light" ? "bg-gray-100" : "bg-secondary"),
                )}
              >
                <div
                  className="flex-1 min-w-0 overflow-hidden"
                  onClick={() => renamingChatId !== chat.id && handleChatClick(chat.id)}
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 flex-shrink-0 mr-2" />
                    <div className="truncate">
                      {renamingChatId === chat.id ? (
                        <Input
                          value={newChatTitle}
                          onChange={(e) => setNewChatTitle(e.target.value)}
                          onBlur={() => handleRenameSubmit(chat.id)}
                          onKeyDown={(e) => handleRenameKeyDown(e, chat.id)}
                          className="h-6 py-1 px-1 text-sm"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <p
                          className={`truncate font-medium ${activeChat?.id === chat.id ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {chat.title}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground truncate">
                        {formatDistanceToNow(new Date(chat.lastUpdated), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
                <DropdownMenu open={openMenuChatId === chat.id} onOpenChange={(open) => setOpenMenuChatId(open ? chat.id : null)}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStartRename(chat.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    {chat.folder === "recent" ? (
                      <DropdownMenuItem onClick={() => handleMoveChat(chat.id, "saved")}>
                        <Star className="h-4 w-4 mr-2" />
                        <span>Save chat</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleMoveChat(chat.id, "recent")}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span>Move to recent</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleDeleteChat(chat.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Delete chat</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border/50 mt-auto theme-transition">
          <div className="flex items-center justify-between">
            <Link href="/settings" className="sidebar-item theme-transition">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
            <Link href="/about" className="sidebar-item theme-transition">
              <HelpCircle className="h-4 w-4" />
              <span>Help</span>
            </Link>
          </div>
        </div>
      </div>

      {renamingChatId && (
        <RenameChatDialog
          chatId={renamingChatId}
          isOpen={isRenameDialogOpen}
          onClose={() => {
            setIsRenameDialogOpen(false)
            setRenamingChatId(null)
          }}
        />
      )}
      <MeetStreamDialog open={meetStreamOpen} onOpenChange={setMeetStreamOpen} />
    </>
  )
}
