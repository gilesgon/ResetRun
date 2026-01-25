'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Wind, Target, Sparkles, Dumbbell, Share2, Pause, Play, X, Hourglass } from 'lucide-react'
import confetti from 'canvas-confetti'
import { onAuthStateChanged } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'
import { getProtocol, type Mode, type Duration, modeNames } from '@/lib/protocols'
import {
  getLocalDateKey,
  lockSettingsForToday,
  recordCompletion,
  loadStore,
  type Store,
} from '@/lib/storage'

type Screen = 'player' | 'done'

const MODE_META: Record<Mode, { icon: any }> = {
  calm: { icon: Wind },
  focus: { icon: Target },
  clean: { icon: Sparkles },
  body: { icon: Dumbbell },
  timeout: { icon: Hourglass },
}

function formatTime(s: number) {
  const n = Math.max(0, Math.floor(s))
  const m = Math.floor(n / 60)
  const r = n % 60
  return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`
}

function isMode(x: any): x is Mode {
  return x === 'calm' || x === 'focus' || x === 'clean' || x === 'body'
}
function isDuration(x: any): x is Duration {
  return x === 2 || x === 5 || x === 10
}

function SessionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [screen, setScreen] = useState<Screen>('player')
  const [store, setStore] = useState<Store | null>(null)
  const [completionNotice, setCompletionNotice] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Parse URL params
  const mParam = searchParams.get('mode')
  const dParam = searchParams.get('duration') || searchParams.get('dur')
  const returnTo = searchParams.get('returnTo') || null

  const mode: Mode = isMode(mParam) ? mParam : 'focus'
  const duration: Duration = isDuration(Number(dParam)) ? (Number(dParam) as Duration) : 5

  const protocol = useMemo(() => getProtocol(mode, duration), [mode, duration])
  const steps = protocol?.steps ?? []

  const [stepIndex, setStepIndex] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [paused, setPaused] = useState(false)

  // Check authentication
  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setIsAuthenticated(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
    })
    return () => unsub()
  }, [])

  // Load store once
  useEffect(() => {
    const s = loadStore()
    setStore(s)
  }, [])

  // Initialize session on mount
  useEffect(() => {
    if (!protocol || steps.length === 0) {
      // Invalid mode/duration, redirect back
      handleEnd()
      return
    }

    // Lock settings for today if store is available
    if (store) {
      const todayKey = getLocalDateKey()
      const lockedToday =
        store.settingsLockedForDate === todayKey || store.lastSettingsChangeDate === todayKey
      if (!lockedToday) {
        setStore(lockSettingsForToday(store))
      }
    }

    // Initialize first step
    setStepIndex(0)
    setSeconds(steps[0].duration)
    setPaused(false)
    setCompletionNotice(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Timer interval
  useEffect(() => {
    if (screen !== 'player') return
    if (paused) return

    const id = window.setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)

    return () => window.clearInterval(id)
  }, [screen, paused])

  // Advance steps when timer hits 0
  useEffect(() => {
    if (screen !== 'player') return
    if (paused) return
    if (seconds !== 0) return
    if (!protocol || steps.length === 0) return

    if (stepIndex < steps.length - 1) {
      const next = stepIndex + 1
      setStepIndex(next)
      setSeconds(steps[next].duration)
    } else {
      finishRun()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, paused, screen, stepIndex, protocol])

  function finishRun() {
    if (!store) {
      setScreen('done')
      return
    }
    const result = recordCompletion(store, true)
    setStore(result.store)
    setCompletionNotice(result.alreadyCompletedToday ? 'Completed for today.' : null)
    setScreen('done')
    if (result.hitDaySeven) {
      confetti({ particleCount: 160, spread: 70, origin: { y: 0.6 } })
    }
  }

  function handleEnd() {
    // Use returnTo param, or fallback based on auth
    if (returnTo) {
      router.push(returnTo)
    } else if (isAuthenticated) {
      router.push('/app')
    } else {
      router.push('/')
    }
  }

  async function copyShareLink() {
    if (typeof window === 'undefined') return
    const url = `${window.location.origin}/r/${mode}-${duration}`
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied.')
    } catch {
      alert('Copy failed. Copy URL manually.')
    }
  }

  const shellClassName = `min-h-screen text-white player ${mode}`

  return (
    <div className={shellClassName}>
      <div className="mx-auto max-w-md px-5 py-8">
        {screen === 'player' && protocol && steps[stepIndex] && (
          <div className="min-h-screen flex flex-col px-6 pt-24 pb-10">
            <div className="fixed top-6 left-6 z-10 text-sm text-white/80">
              <span className="font-semibold">{modeNames[mode]}</span>
              <span className="text-white/50"> - </span>
              <span className="text-white/70">{duration} min</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <h2 className="font-black tracking-tight text-[clamp(2rem,6vw,4rem)] leading-[1.1] mb-3">
                {steps[stepIndex].title}
              </h2>
              <p className="text-white/80 max-w-xl text-[clamp(1rem,3vw,1.5rem)]">
                {steps[stepIndex].instruction}
              </p>
              <div className="mt-10 text-[clamp(3rem,10vw,8rem)] font-black tracking-[-0.05em] tabular-nums">
                {formatTime(seconds)}
              </div>
              <div className="mt-2 text-xs text-white/60">
                Step {stepIndex + 1} of {steps.length}
              </div>
            </div>
            <div className="mt-auto w-full flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setPaused((p) => !p)}
                className="w-full sm:w-1/2 py-4 font-semibold flex items-center justify-center gap-2 bg-white text-black"
              >
                {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                {paused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={handleEnd}
                className="w-full sm:w-1/2 py-4 font-semibold text-white border border-white/40 flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                End
              </button>
            </div>
          </div>
        )}
        {screen === 'done' && (
          <div className="min-h-screen flex flex-col px-6 pt-24 pb-10 text-center">
            <div className="flex-1 flex flex-col items-center justify-center">
              <h2 className="text-[clamp(2rem,6vw,4rem)] font-black mb-2">Reset complete</h2>
              <p className="text-white/80 text-[clamp(1rem,3vw,1.5rem)] mb-10">
                Quiet wins compound.
              </p>
              {completionNotice ? (
                <p className="text-sm text-white/70 mb-6">{completionNotice}</p>
              ) : null}
              <div className="w-full max-w-md space-y-3">
                <button
                  onClick={copyShareLink}
                  className="w-full py-4 font-bold bg-white text-black flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Copy Link
                </button>
                <button
                  onClick={handleEnd}
                  className="w-full py-4 font-semibold border border-white/40 text-white"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * /session route - Full-page session player
 * Params:
 *  - mode: calm|focus|clean|body
 *  - duration: 2|5|10
 *  - returnTo: where to go when session ends (/ or /app)
 */
export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-white/60">Loading...</div>
        </div>
      }
    >
      <SessionContent />
    </Suspense>
  )
}
