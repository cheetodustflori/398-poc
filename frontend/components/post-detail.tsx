"use client"

import type { PiazzaPost, Answer, Followup as FollowupType } from "@/lib/types"
import { Badge } from "@/frontend/components/ui/badge"
import { Button } from "@/frontend/components/ui/button"
import { Separator } from "@/frontend/components/ui/separator"
import { ScrollArea } from "@/frontend/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/frontend/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Star,
  CheckCircle2,
  MessageSquareText,
  BotMessageSquare,
  Clock,
  HelpCircle,
  StickyNote,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

interface PostDetailProps {
  post: PiazzaPost
  onAskAI: () => void
}

function roleColor(role: string) {
  if (role === "instructor") return "text-primary font-semibold"
  if (role === "ta") return "text-emerald-600 font-medium"
  return "text-foreground"
}

function roleBadge(role: string) {
  if (role === "instructor")
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
        Instructor
      </Badge>
    )
  if (role === "ta")
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0">
        TA
      </Badge>
    )
  return null
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function AnswerSection({
  answer,
  label,
  variant,
}: {
  answer: Answer
  label: string
  variant: "instructor" | "student"
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        variant === "instructor"
          ? "border-primary/20 bg-primary/5"
          : "border-border bg-card"
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className={cn(
            "text-[10px]",
            variant === "instructor" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {initials(answer.author.name)}
          </AvatarFallback>
        </Avatar>
        <span className={cn("text-sm", roleColor(answer.author.role))}>
          {answer.author.name}
        </span>
        {roleBadge(answer.author.role)}
        {answer.isEndorsed && (
          <span className="flex items-center gap-0.5 text-xs text-amber-600">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            Endorsed
          </span>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(answer.created), { addSuffix: true })}
        </span>
      </div>
      <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
        {answer.content}
      </div>
      <p className="mt-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
    </div>
  )
}

function FollowupThread({ followup, depth = 0 }: { followup: FollowupType; depth?: number }) {
  return (
    <div className={cn("flex flex-col gap-3", depth > 0 && "ml-6 border-l-2 border-border pl-4")}>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[9px] bg-muted text-muted-foreground">
              {initials(followup.author.name)}
            </AvatarFallback>
          </Avatar>
          <span className={cn("text-sm", roleColor(followup.author.role))}>
            {followup.author.name}
          </span>
          {roleBadge(followup.author.role)}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(followup.created), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-foreground">{followup.content}</p>
      </div>
      {followup.replies.map((reply) => (
        <FollowupThread key={reply.id} followup={reply} depth={depth + 1} />
      ))}
    </div>
  )
}

export function PostDetail({ post, onAskAI }: PostDetailProps) {
  const typeIcon =
    post.type === "question" ? (
      <HelpCircle className="h-4 w-4 text-blue-600" />
    ) : (
      <StickyNote className="h-4 w-4 text-emerald-600" />
    )

  return (
    <ScrollArea className="flex-1">
      <div className="mx-auto max-w-2xl p-6">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {typeIcon}
            <span className="text-xs font-medium text-muted-foreground">
              Post @{post.number}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {post.type}
            </span>
            {post.isInstructorEndorsed && (
              <span className="flex items-center gap-0.5 text-xs text-amber-600">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                Instructor Endorsed
              </span>
            )}
          </div>

          <h1 className="text-xl font-semibold text-foreground leading-tight text-balance">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback
                  className={cn(
                    "text-[10px]",
                    post.author.role === "instructor"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {initials(post.author.name)}
                </AvatarFallback>
              </Avatar>
              <span className={roleColor(post.author.role)}>
                {post.author.name}
              </span>
              {roleBadge(post.author.role)}
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {format(new Date(post.created), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator className="my-5" />

        {/* Content */}
        <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Ask AI Button */}
        <div className="mt-6">
          <Button
            onClick={onAskAI}
            variant="outline"
            className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
          >
            <BotMessageSquare className="h-4 w-4" />
            Ask AI Tutor about this
          </Button>
        </div>

        {/* Answers */}
        {(post.instructorAnswer || post.studentAnswer) && (
          <>
            <Separator className="my-6" />
            <div className="flex flex-col gap-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Answers
              </h2>
              {post.instructorAnswer && (
                <AnswerSection
                  answer={post.instructorAnswer}
                  label="Instructor Answer"
                  variant="instructor"
                />
              )}
              {post.studentAnswer && (
                <AnswerSection
                  answer={post.studentAnswer}
                  label="Student Answer"
                  variant="student"
                />
              )}
            </div>
          </>
        )}

        {/* Followups */}
        {post.followups.length > 0 && (
          <>
            <Separator className="my-6" />
            <div className="flex flex-col gap-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MessageSquareText className="h-4 w-4 text-muted-foreground" />
                Follow-up Discussions ({post.followups.length})
              </h2>
              {post.followups.map((f) => (
                <FollowupThread key={f.id} followup={f} />
              ))}
            </div>
          </>
        )}

        {/* Footer disclaimer */}
        <Separator className="my-6" />
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Have a follow-up question? Post it on Piazza or visit office hours
          ({" "}
          <span className="font-medium">Mon/Wed 2-4pm, Thu 10-12pm</span>
          {" "}).
        </p>
      </div>
    </ScrollArea>
  )
}
