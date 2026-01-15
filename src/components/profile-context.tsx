'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'
import {
  buildProfileFromLocal,
  clearCachedProfile,
  fetchUserProfile,
  hydrateLocalFromProfile,
  loadCachedProfile,
  normalizeProfile,
  saveCachedProfile,
  saveUserProfile,
  type UserProfile,
} from '@/lib/user-profile'

type ProfileContextType = {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  authChecked: boolean
  refreshProfile: () => Promise<void>
  updateProfile: (update: Partial<UserProfile>) => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const activeUidRef = useRef<string | null>(null)

  const loadProfileForUser = useCallback(async (u: User) => {
    activeUidRef.current = u.uid
    setLoading(true)

    const cached = loadCachedProfile(u.uid)
    if (cached) {
      setProfile(cached)
      hydrateLocalFromProfile(cached)
    }

    let nextProfile: UserProfile
    try {
      nextProfile = (await fetchUserProfile(u.uid)) ?? buildProfileFromLocal()
    } catch {
      nextProfile = buildProfileFromLocal()
    }

    nextProfile = normalizeProfile(nextProfile, nextProfile)
    try {
      await saveUserProfile(u.uid, nextProfile)
    } catch {
      // Ignore profile sync errors and fall back to cached state.
    }

    if (activeUidRef.current !== u.uid) return

    setProfile(nextProfile)
    saveCachedProfile(u.uid, nextProfile)
    hydrateLocalFromProfile(nextProfile)
    setLoading(false)
  }, [])

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setUser(null)
      setProfile(null)
      setLoading(false)
      setAuthChecked(true)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthChecked(true)

      if (!u) {
        activeUidRef.current = null
        clearCachedProfile()
        setProfile(null)
        setLoading(false)
        return
      }

      loadProfileForUser(u)
    })
    return () => unsub()
  }, [loadProfileForUser])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    await loadProfileForUser(user)
  }, [loadProfileForUser, user])

  const updateProfile = useCallback(
    async (update: Partial<UserProfile>) => {
      if (!user) return
      const base = profile ?? buildProfileFromLocal()
      const merged = normalizeProfile({ ...base, ...update }, base)
      setProfile(merged)
      saveCachedProfile(user.uid, merged)
      hydrateLocalFromProfile(merged)
      try {
        await saveUserProfile(user.uid, merged)
      } catch {
        // Ignore profile sync errors and keep local state.
      }
    },
    [profile, user]
  )

  const value = useMemo(
    () => ({ user, profile, loading, authChecked, refreshProfile, updateProfile }),
    [user, profile, loading, authChecked, refreshProfile, updateProfile]
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
