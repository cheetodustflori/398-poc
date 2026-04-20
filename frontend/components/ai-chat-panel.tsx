"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { PiazzaPost, InstructorRequest, FeedbackReason } from "@/lib/types"
import {
  trendingTopics,
  instructorStatus,
  availabilitySchedule,
  mockInstructorRequests,
} from "@/lib/mock-data"
import { ChatMessage } from "./chat-message"
import { VisibilityBadge } from "./visibility-badge"
import { TrendingTopics } from "@/components/trending-topics"
import { InstructorAvailability } from "@/components/instructor-availability"
import { InstructorRequestsDropdown } from "@/components/instructor-requests-dropdown"
import { InstructorHelpDialog } from "@/components/instructor-help-dialog"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"

import {
  BotMessageSquare,
  SendHorizontal,
  X,
  Loader2,
  RotateCcw,
  Info,
  Zap,
  Flag,
  GraduationCap,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AIChatPanelProps {
  currentPost: PiazzaPost | null
  isOpen: boolean
  onClose: () => void
}

function getMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

// 1. Define the new feedback types
type FeedbackStatus = "idle" | "pending" | "answered";

type AppMessage = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  parts: Array<{ type: "text"; text: string }>;
  feedback?: {
    status: FeedbackStatus;
    note?: string;
    professorReply?: string;
  };
};

export function AIChatPanel({ currentPost, isOpen, onClose }: AIChatPanelProps) {
  const [input, setInput] = useState("")
  const [remaining, setRemaining] = useState<number | null>(null)
  const [dailyLimit, setDailyLimit] = useState(10)
  const [limitError, setLimitError] = useState<string | null>(null)
  const [instructorRequests, setInstructorRequests] = useState<InstructorRequest[]>(mockInstructorRequests)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  const [pendingHelpMessageId, setPendingHelpMessageId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Message state using the updated AppMessage type
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [status, setStatus] = useState<"idle" | "submitted">("idle")

  // 2. State for the feedback form UI
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/usage")
      if (res.ok) {
        const data = await res.json()
        setRemaining(data.remaining)
        setDailyLimit(data.limit)
        if (data.remaining > 0) setLimitError(null)
      }
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    if (isOpen) fetchUsage()
  }, [isOpen, fetchUsage])

  const sendMessage = async ({ text }: { text: string }) => {
    const userMsg: AppMessage = { 
      id: Date.now().toString(), 
      role: "user" as const, 
      content: text, 
      parts: [{ type: "text" as const, text: text }] 
    };
    
    setMessages((prev) => [...prev, userMsg])
    setStatus("submitted")
    setLimitError(null)

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: text,
          session_id: "student-123" 
        }),
      })

      if (!res.ok) throw new Error("Backend offline")

      const data = await res.json()

      const aiMsg: AppMessage = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant" as const, 
        content: data.answer,
        parts: [{ type: "text" as const, text: data.answer }] 
      };
      
      setMessages((prev) => [...prev, aiMsg])
      setRemaining((prev) => (prev !== null ? Math.max(0, prev - 1) : prev))
    } catch (error) {
      console.error("Chat API Error:", error)
      setLimitError("Failed to connect to the TA backend. Is Python running?")
    } finally {
      setStatus("idle")
    }
  }

  // 3. The Mock Professor Feedback Logic
  const submitFeedback = (messageId: string) => {
    // A. Update the message to 'pending' and save the student's note
    setMessages((prev) => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, feedback: { status: "pending", note: feedbackNote } }
        : msg
    ));

    // B. Close the form
    setActiveFeedbackId(null);
    setFeedbackNote("");

    // C. Simulate Professor response 4 seconds later
    setTimeout(() => {
      setMessages((current) => current.map(msg => 
        msg.id === messageId && msg.feedback?.status === "pending"
          ? {
              ...msg,
              feedback: {
                ...msg.feedback,
                status: "answered",
                professorReply: "Good catch! The AI's hint is technically correct, but it skips over an edge case. I've adjusted the grading rubric so you won't be penalized for this. Let's discuss it further in tomorrow's lecture."
              }
            }
          : msg
      ));
    }, 4000);
  };

  const isLoading = status === "submitted"
  const isAtLimit = remaining !== null && remaining <= 0

  useEffect(() => {
    if (scrollRef.current) {
      const scrollArea = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]")
      const target = scrollArea || scrollRef.current
      target.scrollTop = target.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || isAtLimit) return
    sendMessage({ text: input })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleReset = () => {
    setMessages([])
    setInput("")
    setLimitError(null)
    setActiveFeedbackId(null)
    fetchUsage()
  }

  const handleTrendingTopicSelect = (question: string) => {
    if (!isAtLimit) {
      sendMessage({ text: question })
    }
  }

  const handleMarkHelpful = (messageId: string) => {
    // In a real app, this would send to analytics or surface to classmates
    console.log("[v0] Message marked helpful:", messageId)
  }

  const handleRequestHelp = (messageId: string) => {
    setPendingHelpMessageId(messageId)
    setHelpDialogOpen(true)
  }

  const handleHelpSubmit = (reasons: FeedbackReason[], notes: string) => {
    if (!pendingHelpMessageId) return

    // Find the message and the user's question that preceded it
    const messageIndex = messages.findIndex((m) => m.id === pendingHelpMessageId)
    const aiMessage = messages[messageIndex]
    const userMessage = messageIndex > 0 ? messages[messageIndex - 1] : null

    const newRequest: InstructorRequest = {
      id: `req-${Date.now()}`,
      messageId: pendingHelpMessageId,
      originalQuestion: userMessage ? getMessageText(userMessage) : "Unknown question",
      aiResponse: getMessageText(aiMessage),
      reasons,
      notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    setInstructorRequests((prev) => [newRequest, ...prev])
    setPendingHelpMessageId(null)
  }

  const handleViewRequest = (request: InstructorRequest) => {
    // In a real app, this would open a detailed view or conversation thread
    console.log("[v0] View request:", request.id)
  }

  if (!isOpen) return null

  return (
    <div className="flex h-full w-96 flex-col border-l border-border bg-card">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BotMessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">AI Tutor</h2>
              <p className="text-[10px] text-muted-foreground">Socratic learning guide</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <InstructorRequestsDropdown
              requests={instructorRequests}
              onViewRequest={handleViewRequest}
            />
            {messages.length > 0 && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleReset}>
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        

        <div className="flex items-center gap-2 flex-wrap">
          <VisibilityBadge />

          {/* {remaining !== null && (
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium",
                isAtLimit
                  ? "bg-destructive/10 text-destructive"
                  : remaining <= 3
                    ? "bg-amber-500/10 text-amber-600"
                    : "bg-primary/5 text-primary"
              )}
            >
              <Zap className="h-3 w-3" />
              <span>
                {remaining}/{dailyLimit} uses left today
              </span>
            </div>
          )} */}
        </div>

        {currentPost && (
          <Badge variant="outline" className="w-fit gap-1 text-xs border-primary/20 text-primary bg-primary/5">
            Viewing: Post @{currentPost.number}
          </Badge>
        )}
      </div>

      <Separator />

      {/* Instructor Availability */}
      <div className="px-4 py-3">
        <InstructorAvailability
          status={instructorStatus}
          schedule={availabilitySchedule}
        />
      </div>

      <Separator />

      {/* Trending Topics - shown when no messages */}
      {messages.length === 0 && (
        <>
          <div className="px-4 py-3">
            <TrendingTopics
              topics={trendingTopics}
              onSelectTopic={handleTrendingTopicSelect}
              disabled={isAtLimit}
            />
          </div>
          <Separator />
        </>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BotMessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-medium text-foreground">How can I help you learn?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-65">
                I use the Socratic method to guide you toward understanding. I will ask questions and give hints rather than direct answers.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 mt-2 w-full">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Try asking</p>
              {[
                "Can you help me understand recursion?",
                "I'm stuck on HW3 Problem 1",
                "What's the difference between a list and a tuple?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => { if (!isAtLimit) sendMessage({ text: suggestion }) }}
                  disabled={isAtLimit}
                  className={cn(
                    "rounded-md border border-border px-3 py-2 text-left text-xs text-foreground transition-colors",
                    isAtLimit ? "cursor-not-allowed opacity-50" : "hover:bg-accent"
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-1.5">
                {/* 4. Render the standard ChatMessage */}
                <ChatMessage 
                message={message}
                onMarkHelpful={handleMarkHelpful}
                onRequestHelp={handleRequestHelp}
                 />

                {/* 5. The new Feedback UI (Only attaches to AI responses) */}
                {message.role === "assistant" && (
                  <div className="pl-11 pr-4 w-full flex flex-col gap-2 mt-1">
                    
                    {/* State A: Idle - Show Flag Button */}
                    {(!message.feedback || message.feedback.status === "idle") && activeFeedbackId !== message.id && (
                      <button
                        onClick={() => setActiveFeedbackId(message.id)}
                        className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/70 hover:text-primary transition-colors w-fit"
                      >
                        <Flag className="h-3 w-3" />
                        Flag for Instructor Review
                      </button>
                    )}

                    {/* State B: Requesting - Show Note Form */}
                    {activeFeedbackId === message.id && (!message.feedback || message.feedback.status === "idle") && (
                      <div className="flex flex-col gap-2 bg-muted/50 p-3 rounded-md border border-border animate-in fade-in slide-in-from-top-1">
                        <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5" />
                          Ask Professor
                        </p>
                        <textarea
                          value={feedbackNote}
                          onChange={(e) => setFeedbackNote(e.target.value)}
                          placeholder="What is confusing about this hint?"
                          className="text-xs p-2 rounded-md border border-input bg-background resize-none min-h-15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <div className="flex justify-end gap-2 mt-1">
                          <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => { setActiveFeedbackId(null); setFeedbackNote(""); }}>Cancel</Button>
                          <Button size="sm" className="h-6 text-xs px-3" disabled={!feedbackNote.trim()} onClick={() => submitFeedback(message.id)}>Submit Note</Button>
                        </div>
                      </div>
                    )}

                    {/* State C: Pending - Waiting for Mock Backend */}
                    {message.feedback?.status === "pending" && (
                      <div className="flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-500/10 px-3 py-2 rounded-md w-fit border border-amber-500/20">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Waiting for Instructor Response...
                      </div>
                    )}

                    {/* State D: Answered - Display the resolution */}
                    {message.feedback?.status === "answered" && (
                      <div className="flex flex-col gap-2.5 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md border border-blue-200 dark:border-blue-900 animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <User className="h-3 w-3" /> Your Note
                          </div>
                          <p className="text-xs text-foreground/80 pl-4 border-l-2 border-muted-foreground/20 ml-1">{message.feedback.note}</p>
                        </div>
                        <Separator className="bg-blue-200/50 dark:bg-blue-800/50" />
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                            <GraduationCap className="h-3.5 w-3.5" /> Instructor Response
                          </div>
                          <p className="text-xs text-foreground/90 pl-4 border-l-2 border-blue-400/50 ml-1">{message.feedback.professorReply}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <Separator />

      {(isAtLimit || limitError) && (
        <div className="flex items-start gap-2 bg-destructive/5 px-3 py-2.5 border-b border-destructive/10">
          <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
          <p className="text-xs text-destructive leading-relaxed">
            {limitError || "You've reached your daily limit. Post on Piazza or visit office hours for help!"}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-3">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAtLimit ? "Daily limit reached -- try Piazza or office hours" : "Ask a question..."}
            rows={1}
            disabled={isLoading || isAtLimit}
            className={cn(
              "flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "min-h-9 max-h-30"
            )}
          />
          <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={!input.trim() || isLoading || isAtLimit}>
            <SendHorizontal className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>

      <div className="flex items-start gap-1.5 px-3 pb-3">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/60" />
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          I guide your thinking, not give answers. Always verify with your instructor and post on Piazza for peer discussion.
        </p>
      </div>

      {/* Instructor Help Dialog */}
      <InstructorHelpDialog
        isOpen={helpDialogOpen}
        onClose={() => {
          setHelpDialogOpen(false)
          setPendingHelpMessageId(null)
        }}
        onSubmit={handleHelpSubmit}
        instructorStatus={instructorStatus}
      />


    </div>
  )
}