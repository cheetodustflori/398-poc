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


// Trending topic that aggregates similar student questions
export interface TrendingTopic {
  id: string
  topic: string
  askCount: number
  sampleQuestion: string
  relatedPostIds: string[]
}

// Feedback reason options for instructor escalation
export type FeedbackReason =
  | "incorrect_info"
  | "too_vague"
  | "didnt_understand"
  | "need_human_help"
  | "other"

// A request sent to instructor
export interface InstructorRequest {
  id: string
  messageId: string
  originalQuestion: string
  aiResponse: string
  reasons: FeedbackReason[]
  notes: string
  status: "pending" | "in_progress" | "resolved"
  createdAt: string
  resolvedAt?: string
  responderName?: string
  responderRole?: "instructor" | "ta"
  instructorReply?: string
}

// A message in the instructor conversation thread
export interface InstructorMessage {
  id: string
  requestId: string
  role: "student" | "instructor" | "ta"
  senderName: string
  content: string
  timestamp: string
}

// Instructor availability info
export interface InstructorStatus {
  isOnline: boolean
  activeHours: string
  averageResponseTime: string
  nextAvailable?: string
}

// Schedule slot for instructor/TA availability calendar
export interface AvailabilitySlot {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday"
  startTime: string
  endTime: string
  type: "office_hours" | "online" | "piazza_active"
  person: "instructor" | "ta"
  name: string
}