"use client"

import { cn } from "@/lib/utils"
import type { UIMessage } from "ai"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { BotMessageSquare, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { MessageFeedback } from "@/components/message-feedback"

interface ChatMessageProps {
  message: UIMessage
  onMarkHelpful?: (messageId: string) => void
  onRequestHelp?: (messageId: string) => void
}

function getMessageText(msg: UIMessage): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function ChatMessage({
  message,
  onMarkHelpful,
  onRequestHelp,
}: ChatMessageProps) {
  const isUser = message.role === "user"
  const text = getMessageText(message)

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn("h-7 w-7 shrink-0", isUser ? "mt-0.5" : "mt-0.5")}>
        <AvatarFallback
          className={cn(
            "text-xs",
            isUser
              ? "bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          {isUser ? <User className="h-3.5 w-3.5" /> : <BotMessageSquare className="h-3.5 w-3.5" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex flex-col gap-1 max-w-[85%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {isUser ? "You" : "AI Tutor"}
        </span>
        <div
          className={cn(
            "rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {isUser ? (
            <p>{text}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-pre:my-2 prose-pre:bg-background/50 prose-pre:text-foreground prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {text}
              </ReactMarkdown>
            </div>
          )}
        </div>
         {/* Feedback buttons for assistant messages */}
        {!isUser && onMarkHelpful && onRequestHelp && (
          <MessageFeedback
            messageId={message.id}
            onMarkHelpful={onMarkHelpful}
            onRequestHelp={onRequestHelp}
          />
        )}
      </div>
    </div>
  )
}
