'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { getFirebaseAuth, firebaseConfigError } from '@/lib/firebase'

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
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-black tracking-tight">Accounts are in early access</h1>
          <p className="text-white/50 mt-2">Cloud accounts are invite-only for now.</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            If you'd like access, join the waitlist and we'll notify you when accounts open.
          </div>
          <div className="mt-6">
            <a href="/#waitlist" className="inline-block px-5 py-3 bg-white text-black rounded-full font-bold">
              Join Waitlist
            </a>
          </div>
        </div>
      </main>
    )
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white/60 flex items-center justify-center px-6">
        Loading...
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
