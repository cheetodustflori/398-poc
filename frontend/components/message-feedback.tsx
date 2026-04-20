"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, HelpCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageFeedbackProps {
  messageId: string
  onMarkHelpful: (messageId: string) => void
  onRequestHelp: (messageId: string) => void
}

export function MessageFeedback({
  messageId,
  onMarkHelpful,
  onRequestHelp,
}: MessageFeedbackProps) {
  const [markedHelpful, setMarkedHelpful] = useState(false)

  const handleHelpful = () => {
    if (!markedHelpful) {
      setMarkedHelpful(true)
      onMarkHelpful(messageId)
    }
  }

  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleHelpful}
        disabled={markedHelpful}
        className={cn(
          "h-6 gap-1 px-2 text-[10px] font-medium",
          markedHelpful
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {markedHelpful ? (
          <>
            <Check className="h-3 w-3" />
            Marked Helpful
          </>
        ) : (
          <>
            <ThumbsUp className="h-3 w-3" />
            Helpful
          </>
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRequestHelp(messageId)}
        className="h-6 gap-1 px-2 text-[10px] font-medium text-muted-foreground hover:text-foreground"
      >
        <HelpCircle className="h-3 w-3" />
        Get Help
      </Button>
    </div>
  )
}
