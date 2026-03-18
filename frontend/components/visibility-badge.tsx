"use client"

import { getVisiblePosts, getVisibleMaterials } from "@/lib/mock-data"
import { Eye } from "lucide-react"

export function VisibilityBadge() {
  const postCount = getVisiblePosts().length
  const matCount = getVisibleMaterials().length

  return (
    <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
      <Eye className="h-3 w-3" />
      <span>
        AI can see: {postCount} posts, {matCount} materials
      </span>
    </div>
  )
}
