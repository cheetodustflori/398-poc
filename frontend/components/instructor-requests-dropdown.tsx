"use client"

import type { InstructorRequest } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, CheckCircle2, Clock, Loader2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface InstructorRequestsDropdownProps {
  requests: InstructorRequest[]
  onViewRequest?: (request: InstructorRequest) => void
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

function getStatusIcon(status: InstructorRequest["status"]) {
  switch (status) {
    case "resolved":
      return <CheckCircle2 className="h-3 w-3 text-green-600" />
    case "in_progress":
      return <Loader2 className="h-3 w-3 text-amber-600 animate-spin" />
    default:
      return <Clock className="h-3 w-3 text-muted-foreground" />
  }
}

function getStatusLabel(status: InstructorRequest["status"]) {
  switch (status) {
    case "resolved":
      return "Resolved"
    case "in_progress":
      return "In Progress"
    default:
      return "Pending"
  }
}

export function InstructorRequestsDropdown({
  requests,
  onViewRequest,
}: InstructorRequestsDropdownProps) {
  const pendingCount = requests.filter((r) => r.status === "pending").length
  const resolvedCount = requests.filter((r) => r.status === "resolved").length

  if (requests.length === 0) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
        disabled
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <span>No requests</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs relative"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{requests.length} request{requests.length !== 1 ? "s" : ""}</span>
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
              {pendingCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between text-xs">
          <span>Your Requests</span>
          <div className="flex items-center gap-2 text-[10px] font-normal text-muted-foreground">
            {pendingCount > 0 && <span>{pendingCount} pending</span>}
            {resolvedCount > 0 && <span>{resolvedCount} resolved</span>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-80">
          <div className="flex flex-col gap-1 p-1">
            {requests.map((request) => (
              <button
                key={request.id}
                onClick={() => onViewRequest?.(request)}
                className="flex flex-col gap-2 rounded-md p-2.5 text-left transition-colors hover:bg-accent w-full"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(request.status)}
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {getStatusLabel(request.status)}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {formatTimeAgo(request.createdAt)}
                  </span>
                </div>

                <p className="text-xs font-medium text-foreground line-clamp-2 leading-relaxed">
                  &quot;{request.originalQuestion}&quot;
                </p>

                {request.status === "resolved" && request.instructorReply && (
                  <div className="rounded-md bg-muted/50 p-2 border-l-2 border-primary">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "h-4 px-1.5 text-[9px] font-medium",
                          request.responderRole === "instructor"
                            ? "bg-primary/10 text-primary"
                            : "bg-amber-500/10 text-amber-700"
                        )}
                      >
                        {request.responderRole === "instructor" ? "Instructor" : "TA"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {request.responderName}
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground leading-relaxed line-clamp-3">
                      {request.instructorReply}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-1 text-[10px] text-primary">
                  <span>View full thread</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
