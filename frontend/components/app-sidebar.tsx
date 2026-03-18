"use client"

import { cn } from "@/lib/utils"
import { courseInfo, getVisibleMaterials, getFolders } from "@/lib/mock-data"
import type { CourseMaterial } from "@/lib/types"
import {
  BookOpen,
  FileText,
  FolderOpen,
  GraduationCap,
  ClipboardList,
  Link2,
  LayoutList,
} from "lucide-react"
import { ScrollArea } from "@/frontend/components/ui/scroll-area"
import { Separator } from "@/frontend/components/ui/separator"
import { Badge } from "@/frontend/components/ui/badge"

const materialIcon: Record<CourseMaterial["type"], React.ReactNode> = {
  syllabus: <ClipboardList className="h-3.5 w-3.5" />,
  lecture_notes: <BookOpen className="h-3.5 w-3.5" />,
  assignment: <FileText className="h-3.5 w-3.5" />,
  resource: <Link2 className="h-3.5 w-3.5" />,
}

interface AppSidebarProps {
  activeFolder: string | null
  onFolderChange: (folder: string | null) => void
}

export function AppSidebar({ activeFolder, onFolderChange }: AppSidebarProps) {
  const folders = getFolders()
  const materials = getVisibleMaterials()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      {/* Course Header */}
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight text-sidebar-foreground">
              CS 101
            </span>
            <span className="text-xs text-muted-foreground">
              {courseInfo.term}
            </span>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          {courseInfo.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {courseInfo.instructor}
        </p>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        {/* Folders */}
        <div className="p-3">
          <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Folders
          </p>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => onFolderChange(null)}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                activeFolder === null
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <LayoutList className="h-3.5 w-3.5" />
              All Posts
            </button>
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => onFolderChange(folder)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm capitalize transition-colors",
                  activeFolder === folder
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <FolderOpen className="h-3.5 w-3.5" />
                {folder}
              </button>
            ))}
          </div>
        </div>

        <Separator className="mx-3" />

        {/* Materials */}
        <div className="p-3">
          <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Course Materials
          </p>
          <div className="flex flex-col gap-0.5">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="flex items-start gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground"
              >
                <span className="mt-0.5 shrink-0 text-muted-foreground">
                  {materialIcon[mat.type]}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="leading-tight">{mat.title}</span>
                  {mat.week > 0 && (
                    <Badge
                      variant="secondary"
                      className="w-fit text-[10px] px-1.5 py-0"
                    >
                      Week {mat.week}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <Separator />
      <div className="p-3">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Showing only content visible to students. Instructor-only materials
          are hidden.
        </p>
      </div>
    </aside>
  )
}
