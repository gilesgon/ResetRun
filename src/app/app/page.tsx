'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'
import AuthenticatedHome from '@/components/authenticated-home'

/**
 * /app route - Dashboard for authenticated users
 * Redirects unauthenticated users to landing page
 */
export default function AppPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      // No auth available, redirect to landing
      router.replace('/')
      return
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
      } else {
        // Not authenticated, redirect to landing
        router.replace('/')
      }
    })
    return () => unsub()
  }, [router])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    )
  }

  return <AuthenticatedHome />
}
