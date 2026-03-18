export type PostType = "question" | "note" | "poll"
export type PostStatus = "answered" | "unanswered" | "open"
export type Visibility = "entire_class" | "instructors" | "private"
export type UserRole = "student" | "instructor" | "ta"

export interface Author {
  name: string
  role: UserRole
}

export interface Answer {
  content: string
  author: Author
  created: string
  isEndorsed: boolean
}

export interface Followup {
  id: string
  content: string
  author: Author
  created: string
  replies: Followup[]
}

export interface PiazzaPost {
  id: string
  number: number
  type: PostType
  title: string
  content: string
  created: string
  author: Author
  tags: string[]
  folders: string[]
  status: PostStatus
  visibility: Visibility
  viewCount: number
  followupCount: number
  studentAnswer?: Answer
  instructorAnswer?: Answer
  followups: Followup[]
  isInstructorEndorsed: boolean
}

export interface CourseMaterial {
  id: string
  title: string
  type: "syllabus" | "lecture_notes" | "assignment" | "resource"
  content: string
  week: number
  visible: boolean
}

export interface CourseInfo {
  id: string
  name: string
  term: string
  instructor: string
  description: string
}
