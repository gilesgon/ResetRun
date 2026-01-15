import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'
import { isDuration, isMode, type Duration, type Mode } from '@/lib/protocols'
import {
  clearGoals,
  loadGoals,
  loadStore,
  saveGoals,
  saveStore,
  type Store,
  type UserGoals,
} from '@/lib/storage'

export type UserProfile = {
  onboardingComplete: boolean
  preferences: UserGoals | null
  runState: Store | null
  locks: {
    dailyLockDate: string | null
    runLockUntil: string | null
  }
}

const PROFILE_CACHE_KEY = 'reset_run_profile_cache'

type CachedProfile = {
  uid: string
  profile: UserProfile
  cachedAt: string
}

export function buildProfileFromLocal(): UserProfile {
  const runState = loadStore()
  const preferences = loadGoals(true)

  return {
    onboardingComplete: !!preferences,
    preferences,
    runState,
    locks: {
      dailyLockDate: runState?.settingsLockedForDate ?? null,
      runLockUntil: null,
    },
  }
}

function normalizePreferences(input: any, fallback: UserGoals | null): UserGoals | null {
  if (!input || typeof input !== 'object') return fallback
  const preferredModes = Array.isArray(input.preferredModes)
    ? input.preferredModes.filter((m: any) => isMode(m))
    : []
  const preferredDuration: Duration | null = isDuration(input.preferredDuration)
    ? input.preferredDuration
    : null

  if (!preferredDuration) return fallback

  return {
    dailyResets: typeof input.dailyResets === 'number' ? input.dailyResets : fallback?.dailyResets ?? 1,
    preferredModes: preferredModes.length ? preferredModes : fallback?.preferredModes ?? ([] as Mode[]),
    preferredDuration,
    reminderTime: typeof input.reminderTime === 'string' ? input.reminderTime : null,
  }
}

function normalizeRunState(input: any, fallback: Store | null): Store | null {
  if (!input || typeof input !== 'object') return fallback
  if (typeof input.runStartDate !== 'string') return fallback
  if (!input.completionsByDate || typeof input.completionsByDate !== 'object') return fallback
  return input as Store
}

function normalizeLocks(input: any, fallback: UserProfile['locks']): UserProfile['locks'] {
  if (!input || typeof input !== 'object') return fallback
  return {
    dailyLockDate: typeof input.dailyLockDate === 'string' ? input.dailyLockDate : fallback.dailyLockDate,
    runLockUntil: typeof input.runLockUntil === 'string' ? input.runLockUntil : fallback.runLockUntil,
  }
}

export function normalizeProfile(input: any, fallback: UserProfile): UserProfile {
  const onboardingComplete =
    typeof input?.onboardingComplete === 'boolean' ? input.onboardingComplete : fallback.onboardingComplete
  const preferences = normalizePreferences(input?.preferences, fallback.preferences)
  const runState = normalizeRunState(input?.runState, fallback.runState)
  const locks = normalizeLocks(input?.locks, fallback.locks)

  return {
    onboardingComplete,
    preferences,
    runState,
    locks,
  }
}

export function hydrateLocalFromProfile(profile: UserProfile) {
  if (profile.preferences) {
    saveGoals(profile.preferences)
  } else {
    clearGoals()
  }

  if (profile.runState) {
    saveStore(profile.runState)
  }
}

export function loadCachedProfile(uid: string): UserProfile | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(PROFILE_CACHE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as CachedProfile
    if (parsed.uid !== uid) return null
    if (!parsed.profile) return null
    return parsed.profile
  } catch {
    return null
  }
}

export function saveCachedProfile(uid: string, profile: UserProfile) {
  if (typeof window === 'undefined') return
  const payload: CachedProfile = {
    uid,
    profile,
    cachedAt: new Date().toISOString(),
  }
  window.localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(payload))
}

export function clearCachedProfile() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(PROFILE_CACHE_KEY)
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirebaseDb()
  if (!db) return null
  const ref = doc(db, 'profiles', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const fallback = buildProfileFromLocal()
  return normalizeProfile(snap.data(), fallback)
}

export async function saveUserProfile(uid: string, profile: UserProfile) {
  const db = getFirebaseDb()
  if (!db) return
  const ref = doc(db, 'profiles', uid)
  await setDoc(
    ref,
    {
      ...profile,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}
