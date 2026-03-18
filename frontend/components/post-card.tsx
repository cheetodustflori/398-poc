"use client"

import { cn } from "@/lib/utils"
import type { PiazzaPost } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Eye,
  CheckCircle2,
  CircleDot,
  StickyNote,
  HelpCircle,
  Star,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  post: PiazzaPost
  isActive: boolean
  onClick: () => void
}

const typeConfig = {
  question: {
    icon: HelpCircle,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  note: {
    icon: StickyNote,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  poll: {
    icon: CircleDot,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
}

const statusConfig = {
  answered: { label: "Answered", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  unanswered: { label: "Unanswered", className: "bg-amber-50 text-amber-700 border-amber-200" },
  open: { label: "Open", className: "bg-muted text-muted-foreground border-border" },
}

export function PostCard({ post, isActive, onClick }: PostCardProps) {
  const typeInfo = typeConfig[post.type]
  const statusInfo = statusConfig[post.status]
  const TypeIcon = typeInfo.icon
  const timeAgo = formatDistanceToNow(new Date(post.created), { addSuffix: true })

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full flex-col gap-2 rounded-lg border p-3 text-left transition-all",
        isActive
          ? "border-primary/30 bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/20 hover:bg-accent/50"
      )}
    >
      {/* Top row: type icon + post number + badges */}
      <div className="flex items-center gap-2">
        <div className={cn("flex h-5 w-5 items-center justify-center rounded", typeInfo.bg)}>
          <TypeIcon className={cn("h-3 w-3", typeInfo.color)} />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          @{post.number}
        </span>
        <Badge variant="outline" className={cn("ml-auto text-[10px] px-1.5 py-0 border", statusInfo.className)}>
          {statusInfo.label}
        </Badge>
        {post.isInstructorEndorsed && (
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium leading-snug text-card-foreground line-clamp-2">
        {post.title}
      </h3>

      {/* Meta row */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className={cn(
          "font-medium",
          post.author.role === "instructor" && "text-primary",
          post.author.role === "ta" && "text-emerald-600"
        )}>
          {post.author.name}
        </span>
        <span>{timeAgo}</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-0.5">
            <Eye className="h-3 w-3" />
            {post.viewCount}
          </span>
          {post.followupCount > 0 && (
            <span className="flex items-center gap-0.5">
              <MessageSquare className="h-3 w-3" />
              {post.followupCount}
            </span>
          )}
          {(post.instructorAnswer || post.studentAnswer) && (
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          )}
        </div>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 font-normal"
            >
              {tag}
            </Badge>
          ))}
          {post.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  )
}
