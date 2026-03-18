import { headers } from "next/headers"
import { getRemainingUses, DAILY_LIMIT } from "@/lib/usage-limit"

export async function GET() {
  const headersList = await headers()
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "anonymous"

  const remaining = getRemainingUses(ip)

  return Response.json({ remaining, limit: DAILY_LIMIT })
}
