"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { PiazzaPost } from "@/lib/types"
import { ChatMessage } from "./chat-message"
import { VisibilityBadge } from "./visibility-badge"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AIChatPanelProps {
  currentPost: PiazzaPost | null
  isOpen: boolean
  onClose: () => void
}

export function AIChatPanel({ currentPost, isOpen, onClose }: AIChatPanelProps) {
  const [input, setInput] = useState("")
  const [remaining, setRemaining] = useState<number | null>(null)
  const [dailyLimit, setDailyLimit] = useState(10)
  const [limitError, setLimitError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // --- FIX 1: Make `content` required again in the state ---
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: "system" | "user" | "assistant";
    content: string; 
    parts: Array<{ type: "text"; text: string }>;
  }>>([]);
  
  const [status, setStatus] = useState<"idle" | "submitted">("idle")

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
    // --- FIX 2: Include BOTH `content` and `parts` for the User message ---
    const userMsg = { 
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

      // --- FIX 3: Include BOTH `content` and `parts` for the AI message ---
      const aiMsg = { 
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
    fetchUsage()
  }

  if (!isOpen) return null

  return (
    <div className="flex h-full w-96 flex-col border-l border-border bg-card">
      {/* Header */}
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
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleReset}
                aria-label="Reset conversation"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onClose}
              aria-label="Close AI tutor panel"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <VisibilityBadge />

        <div className="flex items-center gap-2">
          {remaining !== null && (
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
          )}
        </div>

        {currentPost && (
          <Badge
            variant="outline"
            className="w-fit gap-1 text-xs border-primary/20 text-primary bg-primary/5"
          >
            Viewing: Post @{currentPost.number}
          </Badge>
        )}
      </div>

      <Separator />

      {/* FIX 4: Added min-h-0 to ScrollArea so it doesn't push off the screen */}
      <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BotMessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-medium text-foreground">
                How can I help you learn?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-65">
                I use the Socratic method to guide you toward understanding. I
                will ask questions and give hints rather than direct answers.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 mt-2 w-full">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Try asking
              </p>
              {[
                "Can you help me understand recursion?",
                "I'm stuck on HW3 Problem 1",
                "What's the difference between a list and a tuple?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    if (!isAtLimit) sendMessage({ text: suggestion })
                  }}
                  disabled={isAtLimit}
                  className={cn(
                    "rounded-md border border-border px-3 py-2 text-left text-xs text-foreground transition-colors",
                    isAtLimit
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-accent"
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
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
            {limitError ||
              "You've reached your daily limit. Post on Piazza or visit office hours for help!"}
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
            placeholder={
              isAtLimit
                ? "Daily limit reached -- try Piazza or office hours"
                : "Ask a question..."
            }
            rows={1}
            disabled={isLoading || isAtLimit}
            className={cn(
              "flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "min-h-9 max-h-30"
            )}
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 shrink-0"
            disabled={!input.trim() || isLoading || isAtLimit}
          >
            <SendHorizontal className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>

      <div className="flex items-start gap-1.5 px-3 pb-3">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/60" />
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          I guide your thinking, not give answers. Always verify with your
          instructor and post on Piazza for peer discussion.
        </p>
      </div>
    </div>
  )
}