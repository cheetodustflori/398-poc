"use client"

import type { TrendingTopic } from "@/lib/types"
import { TrendingUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrendingTopicsProps {
  topics: TrendingTopic[]
  onSelectTopic: (question: string) => void
  disabled?: boolean
}

export function TrendingTopics({
  topics,
  onSelectTopic,
  disabled = false,
}: TrendingTopicsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <TrendingUp className="h-3 w-3" />
        <span>Trending Questions</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {topics.slice(0, 4).map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic.sampleQuestion)}
            disabled={disabled}
            className={cn(
              "flex flex-col items-start gap-1 rounded-lg border border-border bg-background p-2.5 text-left transition-all",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "hover:border-primary/30 hover:bg-accent/50"
            )}
          >
            <div className="flex items-center gap-1 text-[10px] text-primary font-medium">
              <Users className="h-2.5 w-2.5" />
              <span>{topic.askCount} students asked</span>
            </div>
            <span className="text-xs font-medium text-foreground leading-tight line-clamp-2">
              {topic.topic}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
