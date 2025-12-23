'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { getFirebaseAuth, firebaseConfigError } from '@/lib/firebase'
import { getFirebaseUnavailableMessage } from '@/lib/env'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) return
    const unsub = onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u)
      setReady(true)
    })
    return () => unsub()
  }, [])

  async function handleSignOut() {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) return
    await signOut(firebaseAuth)
  }

  if (firebaseConfigError || !getFirebaseAuth()) {
    const fallback = getFirebaseUnavailableMessage()
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-black tracking-tight">{fallback.title}</h1>
          <p className="text-white/50 mt-2">{fallback.body}</p>
          <div className="mt-6 flex gap-3">
            <Link href={fallback.ctaLink} className="inline-block px-5 py-3 bg-white text-black rounded-full font-bold">
              {fallback.cta}
            </Link>
            <Link href="/" className="inline-block px-4 py-3 text-sm text-white/60 hover:text-white">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-white/60">Loading profile…</div>
        <Link href="/app" className="px-5 py-3 text-sm text-white/60 hover:text-white border border-white/20 rounded-full">
          Start a reset
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-black tracking-tight">Profile</h1>

        {user ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/40">Signed in as</div>
            <div className="text-lg font-semibold mt-1">{user.email || 'Account'}</div>
            <button
              onClick={handleSignOut}
              className="mt-5 w-full rounded-xl border border-white/20 py-3 text-sm font-semibold text-white/80 hover:bg-white/5 hover:text-white"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/70">You are not signed in.</div>
            <Link
              href="/login?next=/app"
              className="mt-4 block w-full rounded-xl border border-white/20 py-3 text-center text-sm font-semibold text-white/80 hover:bg-white/5 hover:text-white"
            >
              Sign in
            </Link>
          </div>
        )}

        <Link
          href="/app"
          className="mt-6 inline-block text-sm text-white/50 hover:text-white"
        >
          Back to app
        </Link>
      </div>
    </main>
  )
}
