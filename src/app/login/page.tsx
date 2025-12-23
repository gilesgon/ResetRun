'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { Eye, EyeOff } from 'lucide-react'
import { auth, firebaseConfigError } from '@/lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const search = useSearchParams()

  const next = useMemo(() => {
    const n = search.get('next')
    return n && n.startsWith('/') ? n : '/signup'
  }, [search])

  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailMode, setEmailMode] = useState<'signup' | 'signin'>('signup')

  useEffect(() => {
    if (!auth) return
    const unsub = onAuthStateChanged(auth, (u: User | null) => {
      if (u) {
        router.replace(next)
        return
      }
      setReady(true)
    })
    return () => unsub()
  }, [router, next])

  async function loginWithGoogle() {
    setError(null)
    if (!auth) return
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    router.replace(next)
  }

  async function submitEmailAuth() {
    setError(null)
    if (!auth) return

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Enter an email address.')
      return
    }

    if (emailMode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }

      try {
        await createUserWithEmailAndPassword(auth, trimmedEmail, password)
        router.replace(next)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create account.'
        setError(message)
      }
      return
    }

    if (!password.trim()) {
      setError('Enter your password.')
      return
    }

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password)
      router.replace(next)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in.'
      setError(message)
    }
  }

  if (firebaseConfigError || !auth) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-black tracking-tight">Create account</h1>
          <p className="text-white/50 mt-2">Firebase isn’t configured yet.</p>
          <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
            {firebaseConfigError || 'Missing Firebase config'}
          </pre>
          <p className="text-sm text-white/50 mt-6">
            Copy <code>.env.local.example</code> to <code>.env.local</code> and fill in your Firebase web app values.
          </p>
        </div>
      </main>
    )
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white/60 flex items-center justify-center px-6">
        Loading…
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-black tracking-tight">Create account</h1>
        <p className="text-white/50 mt-2">
          Sign in to save your setup across devices (cloud sync coming soon).
        </p>

        <div className="mt-10 space-y-4">
          <button
            onClick={loginWithGoogle}
            className="w-full rounded-2xl py-4 font-bold bg-white text-black"
          >
            Continue with Google
          </button>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="font-bold">Continue with email</div>
            <p className="text-sm text-white/50 mt-1">
              {emailMode === 'signup'
                ? 'Create a new account with email and password.'
                : 'Sign in with your email and password.'}
            </p>

            <div className="mt-4 space-y-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none"
              />
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={emailMode === 'signup' ? 'new-password' : 'current-password'}
                  className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 pr-12 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {emailMode === 'signup' ? (
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none"
                />
              ) : null}
              <button
                onClick={submitEmailAuth}
                className="w-full rounded-xl py-3 font-semibold border border-white/20 hover:bg-white/5"
              >
                {emailMode === 'signup' ? 'Create account' : 'Sign in'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmailMode(emailMode === 'signup' ? 'signin' : 'signup')
                  setConfirmPassword('')
                  setError(null)
                }}
                className="w-full text-xs text-white/50 hover:text-white"
              >
                {emailMode === 'signup'
                  ? 'Already have an account? Sign in'
                  : 'Need an account? Create one'}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </div>
      </div>
    </main>
  )
}
