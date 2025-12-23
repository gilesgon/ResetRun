'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { User as UserIcon, KeyRound, LogOut, ChevronDown } from 'lucide-react'
import { getFirebaseAuth } from '@/lib/firebase'

function getInitials(email: string) {
  const base = email.split('@')[0] || email
  const cleaned = base.replace(/[^a-zA-Z0-9]/g, '')
  return cleaned.slice(0, 2).toUpperCase() || 'U'
}

export default function ProfileChip() {
  const [user, setUser] = useState<User | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) return
    const unsub = onAuthStateChanged(firebaseAuth, (u) => setUser(u))
    return () => unsub()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) return
    await signOut(firebaseAuth)
    setShowDropdown(false)
    router.push('/')
  }

  if (!isClient) return null

  // Guest user - simple link to login
  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:text-white hover:border-white/30"
        aria-label="Sign in"
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20">
          <UserIcon className="h-3.5 w-3.5" />
        </span>
        <span>Sign in</span>
      </Link>
    )
  }

  // Authenticated user - dropdown menu
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:text-white hover:border-white/30 transition-colors"
        aria-label="Profile menu"
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-[10px] font-bold">
          {getInitials(user.email || '')}
        </span>
        <span className="truncate max-w-[140px]">{user.email}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-gray-900 shadow-lg overflow-hidden z-50">
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setShowDropdown(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile</span>
            </Link>

            <button
              onClick={() => {
                setShowDropdown(false)
                // TODO: Implement password change modal or redirect
                alert('Password change coming soon! For now, use the "Forgot Password" link on the login page.')
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors w-full text-left"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </button>

            <div className="border-t border-white/10 my-1"></div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
