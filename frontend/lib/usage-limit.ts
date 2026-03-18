const DAILY_LIMIT = 10

// In-memory store: IP -> { count, dateKey }
// In production, this would use Redis or a database
const usageMap = new Map<string, { count: number; dateKey: string }>()

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function getRecord(ip: string) {
  const today = getTodayKey()
  const record = usageMap.get(ip)

  // Reset if it's a new day
  if (!record || record.dateKey !== today) {
    usageMap.set(ip, { count: 0, dateKey: today })
    return usageMap.get(ip)!
  }

  return record
}

export function getRemainingUses(ip: string): number {
  const record = getRecord(ip)
  return Math.max(0, DAILY_LIMIT - record.count)
}

export function consumeUse(ip: string): { allowed: boolean; remaining: number } {
  const record = getRecord(ip)

  if (record.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  record.count += 1
  return { allowed: true, remaining: DAILY_LIMIT - record.count }
}

export { DAILY_LIMIT }
