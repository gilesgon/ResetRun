import { isDuration, isMode, upgradePreferredModes, type Duration, type Mode } from '@/lib/protocols'

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
  completedDateKeys: string[]
  lastCompletionDate: string | null
  settingsLockedForDate: string | null
  lastSettingsChangeDate: string | null
  totalResets: number
}

type CompletionResult = {
  store: Store
  todayKey: string
  dayIndex: number
  completedDatesLength: number
  completedDayNow: boolean
  alreadyCompletedToday: boolean
  hitDaySeven: boolean
}

const KEY = 'reset_run_v3'
const GOALS_KEY = 'reset_run_v2_goals'
const MS_PER_DAY = 24 * 60 * 60 * 1000

function pad2(n: number) {
  return n.toString().padStart(2, '0')
}

export function getLocalDateKey(d: Date = new Date()) {
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

export function getNextLocalDateKey(d: Date = new Date()) {
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
  return getLocalDateKey(next)
}

function freshStore(todayKey = getLocalDateKey()): Store {
  return {
    runStartDate: todayKey,
    dailyGoal: 1,
    completionsByDate: {},
    completedDateKeys: [],
    lastCompletionDate: null,
    settingsLockedForDate: null,
    lastSettingsChangeDate: null,
    totalResets: 0,
  }
}

function migrate(raw: any): Store {
  if (raw && typeof raw.runStartDate === 'string' && raw.completionsByDate) {
    return {
      runStartDate: raw.runStartDate,
      dailyGoal: raw.dailyGoal || 1,
      completionsByDate: raw.completionsByDate || {},
      completedDateKeys: Array.isArray(raw.completedDateKeys)
        ? raw.completedDateKeys
        : Array.isArray(raw.completedDates)
          ? raw.completedDates
          : [],
      lastCompletionDate: typeof raw.lastCompletionDate === 'string' ? raw.lastCompletionDate : null,
      settingsLockedForDate: typeof raw.settingsLockedForDate === 'string' ? raw.settingsLockedForDate : null,
      lastSettingsChangeDate: typeof raw.lastSettingsChangeDate === 'string' ? raw.lastSettingsChangeDate : null,
      totalResets: typeof raw.totalResets === 'number' ? raw.totalResets : 0,
    }
  }

  if (raw?.currentRun?.startDate) {
    const startKey = getLocalDateKey(new Date(raw.currentRun.startDate))
    const dailyGoal = 1
    const completedDates = Array.isArray(raw.currentRun.completedDays)
      ? raw.currentRun.completedDays
          .filter((n: number) => Number.isFinite(n) && n >= 1 && n <= 7)
          .map((n: number) => {
            const d = new Date(new Date(raw.currentRun.startDate).getTime() + (n - 1) * MS_PER_DAY)
            return getLocalDateKey(d)
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
      completedDateKeys: completedDates,
      lastCompletionDate: completedDates[completedDates.length - 1] ?? null,
      settingsLockedForDate: null,
      lastSettingsChangeDate: null,
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
    const todayKey = getLocalDateKey()
    if (s.settingsLockedForDate && s.settingsLockedForDate !== todayKey) {
      s.settingsLockedForDate = null
    }
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
  const todayKey = getLocalDateKey()
  let runStartDate = store.runStartDate || todayKey
  let dayIndex = diffDays(runStartDate, todayKey)

  if (dayIndex >= 7 || dayIndex < 0 || Number.isNaN(dayIndex)) {
    runStartDate = todayKey
    dayIndex = 0
    store = {
      ...store,
      runStartDate,
      completionsByDate: {},
      completedDateKeys: [],
      lastCompletionDate: null,
    }
  }

  let completedDayNow = false
  let alreadyCompletedToday = false
  const completionsByDate = { ...store.completionsByDate }
  const completedDates = new Set(store.completedDateKeys)

  if (completed) {
    if (store.lastCompletionDate === todayKey || completedDates.has(todayKey)) {
      alreadyCompletedToday = true
    }
    const nextCount = (completionsByDate[todayKey] || 0) + 1
    completionsByDate[todayKey] = nextCount

    if (!alreadyCompletedToday && nextCount >= store.dailyGoal && !completedDates.has(todayKey)) {
      completedDates.add(todayKey)
      completedDayNow = true
    }
  }

  const completedDatesArr = Array.from(completedDates)
  const updated: Store = {
    ...store,
    runStartDate,
    completionsByDate,
    completedDateKeys: completedDatesArr,
    lastCompletionDate: completed ? (alreadyCompletedToday ? store.lastCompletionDate : todayKey) : store.lastCompletionDate,
    totalResets: store.totalResets + (completed ? 1 : 0),
  }

  saveStore(updated)

  return {
    store: updated,
    todayKey,
    dayIndex,
    completedDatesLength: completedDatesArr.length,
    completedDayNow,
    alreadyCompletedToday,
    hitDaySeven: completedDayNow && completedDatesArr.length === 7,
  }
}

export function getDayIndex(runStartDate: string, dateKey: string) {
  return diffDays(runStartDate, dateKey) + 1
}

export function lockSettingsForToday(store: Store): Store {
  const todayKey = getLocalDateKey()
  const updated: Store = {
    ...store,
    settingsLockedForDate: todayKey,
    lastSettingsChangeDate: todayKey,
  }
  saveStore(updated)
  return updated
}

export function resetRun(store: Store): Store {
  const todayKey = getLocalDateKey()
  const updated: Store = {
    ...store,
    runStartDate: todayKey,
    completionsByDate: {},
    completedDateKeys: [],
    lastCompletionDate: null,
    settingsLockedForDate: null,
    lastSettingsChangeDate: null,
    totalResets: 0,
  }
  saveStore(updated)
  return updated
}

export function saveGoals(goals: UserGoals) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
}

/**
 * Load user goals (only use for authenticated users)
 * For guests, always return null to ensure all modes are shown
 */
export function loadGoals(isAuthenticated: boolean = false): UserGoals | null {
  if (typeof window === 'undefined') return null
  if (!isAuthenticated) return null // Guests always see all modes

  const raw = window.localStorage.getItem(GOALS_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<UserGoals>
    const preferredModes = Array.isArray(parsed.preferredModes)
      ? upgradePreferredModes(parsed.preferredModes.filter(isMode))
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

/**
 * Clear goals (useful when logging out)
 */
export function clearGoals() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(GOALS_KEY)
}
