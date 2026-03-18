"use client"

import { useState } from "react"
import type { PiazzaPost } from "@/lib/types"
import { AppSidebar } from "@/components/app-sidebar"
import { PostFeed } from "@/components/post-feed"
import { PostDetail } from "@/components/post-detail"
import { AIChatPanel } from "@/components/ai-chat-panel"
import { Button } from "@/components/ui/button"
import { BotMessageSquare, BookOpen } from "lucide-react"

export default function Home() {
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<PiazzaPost | null>(null)
  const [chatOpen, setChatOpen] = useState(false)

  const handleSelectPost = (post: PiazzaPost) => {
    setSelectedPost(post)
  }

  const handleAskAI = () => {
    setChatOpen(true)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left sidebar */}
      <AppSidebar
        activeFolder={activeFolder}
        onFolderChange={setActiveFolder}
      />

      {/* Post feed */}
      <PostFeed
        activeFolder={activeFolder}
        selectedPostId={selectedPost?.id ?? null}
        onSelectPost={handleSelectPost}
      />

      {/* Main content area */}
      <main className="flex flex-1 flex-col">
        {selectedPost ? (
          <PostDetail post={selectedPost} onAskAI={handleAskAI} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <BookOpen className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg font-semibold text-foreground">
                Select a post to view
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Browse the Q&A feed on the left and click a post to read the
                full discussion. You can also ask the AI Tutor for help
                understanding any topic.
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
              onClick={() => setChatOpen(true)}
            >
              <BotMessageSquare className="h-4 w-4" />
              Open AI Tutor
            </Button>
          </div>
        )}
      </main>

      {/* AI Chat Panel */}
      <AIChatPanel
        currentPost={selectedPost}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      {/* Floating AI button when chat is closed */}
      {!chatOpen && (
        <Button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-5 right-5 h-12 w-12 rounded-full shadow-lg"
          size="icon"
          aria-label="Open AI Tutor"
        >
          <BotMessageSquare className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
