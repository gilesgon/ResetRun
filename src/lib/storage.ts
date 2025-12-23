import { isDuration, isMode, type Duration, type Mode } from '@/lib/protocols'

export type UserGoals = {
  dailyResets: number
  preferredModes: Mode[]
  preferredDuration: Duration
  reminderTime: string | null
}

export type Store = {
  runStartDate: string
  dailyGoal: 1 | 2 | 3
  completionsByDate: Record<string, number>
  completedDates: string[]
  totalResets: number
}

type CompletionResult = {
  store: Store
  todayKey: string
  dayIndex: number
  completedDatesLength: number
  completedDayNow: boolean
  hitDaySeven: boolean
}

const KEY = 'reset_run_v3'
const GOALS_KEY = 'reset_run_v2_goals'
const MS_PER_DAY = 24 * 60 * 60 * 1000

function pad2(n: number) {
  return n.toString().padStart(2, '0')
}

function localDateKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function parseDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

function diffDays(startKey: string, endKey: string) {
  const start = parseDateKey(startKey)
  const end = parseDateKey(endKey)
  return Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY)
}

function freshStore(todayKey = localDateKey(new Date())): Store {
  return {
    runStartDate: todayKey,
    dailyGoal: 1,
    completionsByDate: {},
    completedDates: [],
    totalResets: 0,
  }
}

function migrate(raw: any): Store {
  if (raw && typeof raw.runStartDate === 'string' && raw.completionsByDate) {
    return {
      runStartDate: raw.runStartDate,
      dailyGoal: raw.dailyGoal || 1,
      completionsByDate: raw.completionsByDate || {},
      completedDates: Array.isArray(raw.completedDates) ? raw.completedDates : [],
      totalResets: typeof raw.totalResets === 'number' ? raw.totalResets : 0,
    }
  }

  if (raw?.currentRun?.startDate) {
    const startKey = localDateKey(new Date(raw.currentRun.startDate))
    const dailyGoal = 1
    const completedDates = Array.isArray(raw.currentRun.completedDays)
      ? raw.currentRun.completedDays
          .filter((n: number) => Number.isFinite(n) && n >= 1 && n <= 7)
          .map((n: number) => {
            const d = new Date(new Date(raw.currentRun.startDate).getTime() + (n - 1) * MS_PER_DAY)
            return localDateKey(d)
          })
      : []

    const completionsByDate: Record<string, number> = {}
    completedDates.forEach((k: string) => {
      completionsByDate[k] = dailyGoal
    })

    return {
      runStartDate: startKey,
      dailyGoal,
      completionsByDate,
      completedDates,
      totalResets: raw?.stats?.totalResets || 0,
    }
  }

  return freshStore()
}

export function loadStore(): Store {
  if (typeof window === 'undefined') return freshStore()
  const raw = window.localStorage.getItem(KEY)
  if (!raw) {
    const s = freshStore()
    window.localStorage.setItem(KEY, JSON.stringify(s))
    return s
  }
  try {
    const parsed = JSON.parse(raw)
    const s = migrate(parsed)
    window.localStorage.setItem(KEY, JSON.stringify(s))
    return s
  } catch {
    const s = freshStore()
    window.localStorage.setItem(KEY, JSON.stringify(s))
    return s
  }
}

export function saveStore(store: Store) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(store))
}

export function updateDailyGoal(store: Store, goal: number): Store {
  if (![1, 2, 3].includes(goal)) return store
  if (store.dailyGoal === goal) return store
  const updated = { ...store, dailyGoal: goal as 1 | 2 | 3 }
  saveStore(updated)
  return updated
}

export function recordCompletion(store: Store, completed: boolean): CompletionResult {
  const todayKey = localDateKey(new Date())
  let runStartDate = store.runStartDate || todayKey
  let dayIndex = diffDays(runStartDate, todayKey)

  if (dayIndex >= 7 || dayIndex < 0 || Number.isNaN(dayIndex)) {
    runStartDate = todayKey
    dayIndex = 0
    store = {
      ...store,
      runStartDate,
      completionsByDate: {},
      completedDates: [],
    }
  }

  let completedDayNow = false
  const completionsByDate = { ...store.completionsByDate }
  const completedDates = new Set(store.completedDates)

  if (completed) {
    const nextCount = (completionsByDate[todayKey] || 0) + 1
    completionsByDate[todayKey] = nextCount

    if (nextCount >= store.dailyGoal && !completedDates.has(todayKey)) {
      completedDates.add(todayKey)
      completedDayNow = true
    }
  }

  const completedDatesArr = Array.from(completedDates)
  const updated: Store = {
    ...store,
    runStartDate,
    completionsByDate,
    completedDates: completedDatesArr,
    totalResets: store.totalResets + (completed ? 1 : 0),
  }

  saveStore(updated)

  return {
    store: updated,
    todayKey,
    dayIndex,
    completedDatesLength: completedDatesArr.length,
    completedDayNow,
    hitDaySeven: completedDayNow && completedDatesArr.length === 7,
  }
}

export function getDayIndex(runStartDate: string, dateKey: string) {
  return diffDays(runStartDate, dateKey) + 1
}

export function saveGoals(goals: UserGoals) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
}

export function loadGoals(): UserGoals | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(GOALS_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<UserGoals>
    const preferredModes = Array.isArray(parsed.preferredModes)
      ? parsed.preferredModes.filter(isMode)
      : []
    const preferredDuration = isDuration(parsed.preferredDuration) ? parsed.preferredDuration : null

    if (!preferredDuration) return null

    return {
      dailyResets: typeof parsed.dailyResets === 'number' ? parsed.dailyResets : 1,
      preferredModes,
      preferredDuration,
      reminderTime: typeof parsed.reminderTime === 'string' ? parsed.reminderTime : null,
    }
  } catch {
    return null
  }
}
