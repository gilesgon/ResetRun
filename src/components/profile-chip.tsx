'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { User as UserIcon } from 'lucide-react'
import { getFirebaseAuth } from '@/lib/firebase'

function getInitials(email: string) {
  const base = email.split('@')[0] || email
  const cleaned = base.replace(/[^a-zA-Z0-9]/g, '')
  return cleaned.slice(0, 2).toUpperCase() || 'U'
}

export default function ProfileChip() {
  const [user, setUser] = useState<User | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) return
    const unsub = onAuthStateChanged(firebaseAuth, (u) => setUser(u))
    return () => unsub()
  }, [])

  if (!isClient) return null

  return (
    <Link
      href="/profile"
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:text-white hover:border-white/30"
      aria-label="Profile"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-[10px] font-bold">
        {user?.email ? getInitials(user.email) : <UserIcon className="h-3.5 w-3.5" />}
      </span>
      <span className="truncate max-w-[140px]">
        {user?.email ? user.email : 'Sign in'}
      </span>
    </Link>
  )
}
