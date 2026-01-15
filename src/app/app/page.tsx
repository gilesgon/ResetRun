'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthenticatedHome from '@/components/authenticated-home'
import { useProfile } from '@/components/profile-context'

/**
 * /app route - Dashboard for authenticated users
 * Redirects unauthenticated users to landing page
 */
export default function AppPage() {
  const router = useRouter()
  const { user, profile, loading, authChecked } = useProfile()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!authChecked) return
    if (!user) {
      router.replace('/')
      return
    }
    if (loading) return
    if (!profile?.onboardingComplete) {
      router.replace('/setup')
      return
    }
    setReady(true)
  }, [authChecked, loading, profile, router, user])

  if (!authChecked || loading || !user || !ready) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    )
  }

  return <AuthenticatedHome />
}
