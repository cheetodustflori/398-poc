"use client"

import { useState } from "react"
import type { InstructorStatus, AvailabilitySlot } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, Clock, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface InstructorAvailabilityProps {
  status: InstructorStatus
  schedule: AvailabilitySlot[]
}

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const
const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":")
  const h = parseInt(hours, 10)
  const suffix = h >= 12 ? "pm" : "am"
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h
  return minutes === "00" ? `${hour12}${suffix}` : `${hour12}:${minutes}${suffix}`
}

function getCurrentDay(): typeof DAY_ORDER[number] | null {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const day = days[new Date().getDay()]
  return DAY_ORDER.includes(day as typeof DAY_ORDER[number]) ? day as typeof DAY_ORDER[number] : null
}

export function InstructorAvailability({
  status,
  schedule,
}: InstructorAvailabilityProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentDay = getCurrentDay()

  // Group slots by day
  const slotsByDay = schedule.reduce((acc, slot) => {
    if (!acc[slot.day]) acc[slot.day] = []
    acc[slot.day].push(slot)
    return acc
  }, {} as Record<string, AvailabilitySlot[]>)

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full shrink-0",
              status.isOnline ? "bg-green-500" : "bg-muted-foreground"
            )}
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-foreground">
              {status.isOnline ? "Prof. Chen is online" : "Prof. Chen is offline"}
            </span>
            {!status.isOnline && status.nextAvailable && (
              <span className="text-[10px] text-muted-foreground">
                {status.nextAvailable}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>~2hr avg</span>
        </div>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-full justify-between px-0 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              View schedule
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-col gap-1.5 border-t border-border pt-2">
            {DAY_ORDER.map((day) => {
              const slots = slotsByDay[day] || []
              const isToday = day === currentDay

              if (slots.length === 0) return null

              return (
                <div
                  key={day}
                  className={cn(
                    "flex items-center gap-2 rounded px-1.5 py-1 text-[10px]",
                    isToday && "bg-primary/5"
                  )}
                >
                  <span
                    className={cn(
                      "w-8 shrink-0 font-medium",
                      isToday ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {DAY_LABELS[day]}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {slots.map((slot, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-foreground">
                          {formatTime(slot.startTime)}-{formatTime(slot.endTime)}
                        </span>
                        <span className="text-muted-foreground">
                          {slot.name}
                          {slot.type === "office_hours" && " (Office)"}
                          {slot.type === "online" && " (Online)"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
