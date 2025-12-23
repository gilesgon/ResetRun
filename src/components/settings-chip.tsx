'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Settings } from 'lucide-react'
import { onAuthStateChanged } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'

type SettingsChipProps = {
  onOpenSettings?: () => void
}

export default function SettingsChip({ onOpenSettings }: SettingsChipProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true)
    const auth = getFirebaseAuth()
    if (!auth) return
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
    })
    return () => unsub()
  }, [])

  const isAppRoute = pathname ? pathname.startsWith('/app') : false

  // Only show on /app for authenticated users
  if (!isClient || !isAuthenticated || !isAppRoute) return null

  return (
    <button
      onClick={onOpenSettings}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:text-white hover:border-white/30 transition-colors"
      aria-label="Settings"
    >
      <Settings className="h-3.5 w-3.5" />
      <span>Settings</span>
    </button>
  )
}
