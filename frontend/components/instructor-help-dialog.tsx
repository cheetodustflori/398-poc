"use client"

import { useState } from "react"
import type { FeedbackReason, InstructorStatus } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Clock, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface InstructorHelpDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reasons: FeedbackReason[], notes: string) => void
  instructorStatus: InstructorStatus
}

const FEEDBACK_OPTIONS: { value: FeedbackReason; label: string }[] = [
  { value: "incorrect_info", label: "Information seems incorrect" },
  { value: "too_vague", label: "Answer was too vague" },
  { value: "didnt_understand", label: "I still don't understand" },
  { value: "need_human_help", label: "I need to talk to a human" },
  { value: "other", label: "Other reason" },
]

export function InstructorHelpDialog({
  isOpen,
  onClose,
  onSubmit,
  instructorStatus,
}: InstructorHelpDialogProps) {
  const [selectedReasons, setSelectedReasons] = useState<FeedbackReason[]>([])
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleReasonToggle = (reason: FeedbackReason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    )
  }

  const handleSubmit = () => {
    onSubmit(selectedReasons, notes)
    setSubmitted(true)
  }

  const handleClose = () => {
    setSubmitted(false)
    setSelectedReasons([])
    setNotes("")
    onClose()
  }

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-base font-semibold text-foreground">
                Request Sent
              </h3>
              <p className="text-sm text-muted-foreground">
                Your question has been forwarded to the teaching team.
              </p>
            </div>

            <div className="w-full rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      instructorStatus.isOnline ? "bg-green-500" : "bg-muted-foreground"
                    )}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {instructorStatus.isOnline
                      ? "Prof. Chen is online"
                      : "Prof. Chen is offline"}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Clock className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>{instructorStatus.averageResponseTime}</span>
                </div>
                {!instructorStatus.isOnline && instructorStatus.nextAvailable && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Circle className="mt-0.5 h-3 w-3 shrink-0" />
                    <span>Next available: {instructorStatus.nextAvailable}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Office hours:</span>{" "}
                    {instructorStatus.activeHours}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              You can continue chatting with the AI Tutor while waiting, or check
              the Requests dropdown to track your request status.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Instructor Help</DialogTitle>
          <DialogDescription>
            Let us know why the AI response wasn&apos;t helpful. Your feedback helps
            us improve.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-3">
            <Label className="text-sm font-medium">
              What was the issue? (select all that apply)
            </Label>
            {FEEDBACK_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={option.value}
                  checked={selectedReasons.includes(option.value)}
                  onCheckedChange={() => handleReasonToggle(option.value)}
                />
                <Label
                  htmlFor={option.value}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional notes (optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any context that might help the instructor understand your question..."
              rows={3}
              className="resize-none text-sm"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedReasons.length === 0}
          >
            Send to Instructor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
