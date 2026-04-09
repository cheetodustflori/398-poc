"use client"

import { useState, useMemo } from "react"
import { getVisiblePosts } from "@/lib/mock-data"
import type { PiazzaPost, PostType } from "@/lib/types"
import { PostCard } from "@/components/post-card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface PostFeedProps {
  activeFolder: string | null
  selectedPostId: string | null
  onSelectPost: (post: PiazzaPost) => void
}

type FilterTab = "all" | "question" | "unanswered" | "note"

export function PostFeed({
  activeFolder,
  selectedPostId,
  onSelectPost,
}: PostFeedProps) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<FilterTab>("all")

  const allPosts = getVisiblePosts()

  const filteredPosts = useMemo(() => {
    let posts = allPosts

    // Folder filter
    if (activeFolder) {
      posts = posts.filter((p) => p.folders.includes(activeFolder))
    }

    // Tab filter
    if (activeTab === "question") {
      posts = posts.filter((p) => p.type === "question")
    } else if (activeTab === "unanswered") {
      posts = posts.filter((p) => p.status === "unanswered")
    } else if (activeTab === "note") {
      posts = posts.filter((p) => p.type === "note")
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    return posts.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    )
  }, [allPosts, activeFolder, activeTab, search])

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "question", label: "Questions" },
    { key: "unanswered", label: "Unanswered" },
    { key: "note", label: "Notes" },
  ]

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-card">
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-3 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Post list */}
      <ScrollArea className="min-h-0 px-3 pb-3">
        <div className="flex flex-col gap-2">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isActive={selectedPostId === post.id}
                onClick={() => onSelectPost(post)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Search className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No posts found</p>
              <p className="text-xs text-muted-foreground/70">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Count */}
      <div className="border-t border-border px-3 py-2">
        <p className="text-xs text-muted-foreground">
          {filteredPosts.length} of {allPosts.length} posts
        </p>
      </div>
    </div>
  )
}
