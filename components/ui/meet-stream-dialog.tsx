"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./dialog";
import { Input } from "./input";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import type { SelectSingleEventHandler } from "react-day-picker";

interface MeetStreamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MeetStreamDialog({ open, onOpenChange }: MeetStreamDialogProps) {
  const [mode, setMode] = useState<"instant" | "schedule">("instant");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const router = useRouter();

  const handleCreateInstant = () => {
    if (!userName || !meetingTitle) return;
    const roomId = uuidv4();
    onOpenChange(false);
    router.push(`/kasameet?callId=${roomId}&title=${encodeURIComponent(meetingTitle)}&user=${encodeURIComponent(userName)}`);
  };

  const handleSchedule = () => {
    if (!userName || !meetingTitle || !scheduledDate || !scheduledTime) return;
    setScheduled(true);
    // In a real app, save meeting info to backend here
  };

  // Handle date selection properly with the correct type
  const handleDateSelect: SelectSingleEventHandler = (day) => {
    setScheduledDate(day || null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>KasaBridge Meet Stream</DialogTitle>
          <DialogDescription>
            {mode === "instant"
              ? "Start an instant meeting right now."
              : "Schedule a meeting for later."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Button variant={mode === "instant" ? "default" : "outline"} onClick={() => setMode("instant")}>Instant Meeting</Button>
          <Button variant={mode === "schedule" ? "default" : "outline"} onClick={() => setMode("schedule")}>Schedule Meeting</Button>
        </div>
        <div className="space-y-3">
          <Input
            placeholder="Your Name"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            required
          />
          <Input
            placeholder="Meeting Title"
            value={meetingTitle}
            onChange={e => setMeetingTitle(e.target.value)}
            required
          />
          {mode === "schedule" && (
            <>
              <Calendar
                mode="single"
                selected={scheduledDate || undefined}
                onSelect={handleDateSelect}
                className="w-full"
                fromDate={new Date()}
              />
              <Input
                type="time"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                required
              />
            </>
          )}
        </div>
        <DialogFooter>
          {mode === "instant" && (
            <Button onClick={handleCreateInstant} disabled={!userName || !meetingTitle}>
              Start Meeting
            </Button>
          )}
          {mode === "schedule" && !scheduled && (
            <Button onClick={handleSchedule} disabled={!userName || !meetingTitle || !scheduledDate || !scheduledTime}>
              Schedule Meeting
            </Button>
          )}
          {mode === "schedule" && scheduled && (
            <div className="text-green-600 font-semibold text-center w-full">
              Meeting scheduled for {scheduledDate && format(scheduledDate, "PPP")} at {scheduledTime}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
