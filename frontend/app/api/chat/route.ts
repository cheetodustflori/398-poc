import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"
import { headers } from "next/headers"
import { getVisiblePosts, getVisibleMaterials, courseInfo } from "@/lib/mock-data"
import { consumeUse } from "@/lib/usage-limit"
import type { PiazzaPost } from "@/lib/types"

export const maxDuration = 30

function buildCourseContext() {
  const posts = getVisiblePosts()
  const materials = getVisibleMaterials()

  let context = `COURSE: ${courseInfo.name} (${courseInfo.term})\nInstructor: ${courseInfo.instructor}\n\n`

  context += "=== COURSE MATERIALS ===\n\n"
  for (const mat of materials) {
    context += `[${mat.type.toUpperCase()}] ${mat.title} (Week ${mat.week})\n${mat.content}\n\n---\n\n`
  }

  context += "=== PIAZZA POSTS (Student-Visible) ===\n\n"
  for (const post of posts) {
    context += `Post @${post.number}: "${post.title}" (${post.type}, ${post.status})\n`
    context += `By: ${post.author.name} (${post.author.role}) | Tags: ${post.tags.join(", ")}\n`
    context += `Content: ${post.content}\n`
    if (post.instructorAnswer) {
      context += `Instructor Answer (by ${post.instructorAnswer.author.name}): ${post.instructorAnswer.content}\n`
    }
    if (post.studentAnswer) {
      context += `Student Answer (by ${post.studentAnswer.author.name}): ${post.studentAnswer.content}\n`
    }
    if (post.followups.length > 0) {
      context += `Followups:\n`
      for (const f of post.followups) {
        context += `  - ${f.author.name} (${f.author.role}): ${f.content}\n`
        for (const r of f.replies) {
          context += `    - ${r.author.name} (${r.author.role}): ${r.content}\n`
        }
      }
    }
    context += "\n---\n\n"
  }

  return context
}

function buildSystemPrompt(currentPost: PiazzaPost | null) {
  const courseContext = buildCourseContext()

  let postContext = ""
  if (currentPost) {
    postContext = `\n\nCURRENT CONTEXT: The student is currently viewing Post @${currentPost.number}: "${currentPost.title}". This is a ${currentPost.type} about ${currentPost.tags.join(", ")}. When responding, be aware of this context and relate your guidance to this specific topic when relevant.`
  }

  return `You are a Socratic AI tutor for ${courseInfo.name} (${courseInfo.term}), taught by ${courseInfo.instructor}.

ROLE:
- You help students LEARN by guiding them to discover answers themselves
- You NEVER give direct answers to homework or assignment questions
- You ask probing questions that help students think critically
- You reference relevant course materials and existing Piazza discussions when helpful

SOCRATIC METHOD RULES:
1. When a student asks a question, first assess what they already understand
2. Ask one targeted guiding question at a time -- don't overwhelm with multiple questions
3. Acknowledge correct reasoning enthusiastically, and gently redirect misconceptions
4. Reference specific lecture notes or Piazza posts when relevant (e.g., "Have you reviewed the recursion notes from Week 4?" or "Post @7 has a great discussion about this")
5. If a student is frustrated after 2-3 exchanges, provide a small concrete hint but still frame it as a question
6. Encourage students to post on Piazza or visit office hours for deeper help
7. When a student arrives at the correct understanding, congratulate them and reinforce the concept

RESPONSE STYLE:
- Keep responses concise (2-4 paragraphs max)
- Use markdown formatting for code blocks and emphasis
- Be warm, encouraging, and patient -- like a supportive peer tutor
- Start with what the student knows before building to what they don't

BOUNDARIES:
- Only reference content from the course context provided below
- If asked about content outside the course, politely say you can only help with ${courseInfo.name} material
- Never fabricate Piazza posts or materials that don't exist in the context
- Remind students to verify important information with the instructor
- If asked to write code for an assignment, refuse and guide them through the thought process instead

AVAILABLE COURSE CONTEXT:
${courseContext}${postContext}`
}

export async function POST(req: Request) {
  // Enforce daily usage limit
  const headersList = await headers()
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "anonymous"

  const { allowed, remaining } = consumeUse(ip)
  if (!allowed) {
    return Response.json(
      {
        error:
          "You've used all 10 AI Tutor sessions for today. Come back tomorrow, or post your question on Piazza for help from classmates and instructors!",
        remaining: 0,
      },
      { status: 429 }
    )
  }

  const { messages, currentPost }: { messages: UIMessage[]; currentPost: PiazzaPost | null } =
    await req.json()

  const systemPrompt = buildSystemPrompt(currentPost)

  const result = streamText({
    model: "openai/gpt-4o",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  const response = result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })

  // Attach remaining uses header so the client can update UI
  response.headers.set("x-remaining-uses", String(remaining))
  return response
}
