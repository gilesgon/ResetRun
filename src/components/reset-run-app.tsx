'use client'

import { useEffect, useMemo, useState } from 'react'
import { Wind, Target, Sparkles, Dumbbell, Check, Share2, Pause, Play, X } from 'lucide-react'
import confetti from 'canvas-confetti'
import { getProtocol, type Mode, type Duration, modeNames, modeColors } from '@/lib/protocols'
import {
  getDayIndex,
  loadGoals,
  loadStore,
  recordCompletion,
  updateDailyGoal,
  type Store,
  type UserGoals,
} from '@/lib/storage'

type Screen = 'home' | 'player' | 'done'

const MODE_META: Record<Mode, { icon: any; tagline: string }> = {
  calm: { icon: Wind, tagline: 'Regain composure' },
  focus: { icon: Target, tagline: 'Lock in' },
  clean: { icon: Sparkles, tagline: 'Clear space' },
  body: { icon: Dumbbell, tagline: 'Move energy' },
}

const DURATIONS: Duration[] = [2, 5, 10]

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

function localDateKey(d: Date) {
  const y = d.getFullYear()
  const m = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function ResetRunApp() {
  const [screen, setScreen] = useState<Screen>('home')
  const [store, setStore] = useState<Store | null>(null)
  const [showFallback, setShowFallback] = useState(false)

  const [goals, setGoals] = useState<UserGoals | null>(null)

  const [mode, setMode] = useState<Mode>('focus')
  const [duration, setDuration] = useState<Duration>(5)

  const protocol = useMemo(() => getProtocol(mode, duration), [mode, duration])
  const steps = protocol?.steps ?? []

  const [stepIndex, setStepIndex] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [paused, setPaused] = useState(false)

  // Load store once
  useEffect(() => {
    const s = loadStore()
    setStore(s)
  }, [])

  // If store hasn't arrived after a short delay, show a fallback CTA
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!store) setShowFallback(true)
    }, 2500)
    return () => window.clearTimeout(id)
  }, [store])

  // Apply saved onboarding defaults (if present)
  useEffect(() => {
    const g = loadGoals()
    setGoals(g)
    if (!g) return
    if (g.preferredModes?.[0]) setMode(g.preferredModes[0])
    if (g.preferredDuration) setDuration(g.preferredDuration)
  }, [])

  useEffect(() => {
    if (!store || !goals) return
    const updated = updateDailyGoal(store, goals.dailyResets)
    if (updated !== store) setStore(updated)
  }, [store, goals])

  // Deep-link: /app?mode=calm&duration=5
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    const m = url.searchParams.get('mode')
    const d = url.searchParams.get('duration') || url.searchParams.get('dur')

    const parsedMode = isMode(m) ? m : null
    const parsedDur = d ? Number(d) : null
    const parsedDuration = isDuration(parsedDur) ? (parsedDur as Duration) : null

    if (parsedMode && parsedDuration) {
      startRun(parsedMode, parsedDuration)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startRun(m: Mode, d: Duration) {
    setMode(m)
    setDuration(d)
    setPaused(false)
    setStepIndex(0)

    const p = getProtocol(m, d)
    const first = p?.steps?.[0]
    setSeconds(first?.duration ?? 0)

    setScreen('player')
  }

  // Ensure player always has a valid step
  useEffect(() => {
    if (screen !== 'player') return
    if (!protocol || steps.length === 0) {
      setScreen('home')
      return
    }
    if (stepIndex < 0 || stepIndex >= steps.length) {
      setStepIndex(0)
      setSeconds(steps[0].duration)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, protocol])

  // SINGLE interval (prevents accelerated timers)
  useEffect(() => {
    if (screen !== 'player') return
    if (paused) return

    const id = window.setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)

    return () => window.clearInterval(id)
  }, [screen, paused])

  // Advance exactly once when seconds hits 0
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
    setScreen('done')
    if (result.hitDaySeven) {
      confetti({ particleCount: 160, spread: 70, origin: { y: 0.6 } })
    }
  }

  async function copyShareLink() {
    if (typeof window === 'undefined') return
    const url = `${window.location.origin}/r/${mode}-${duration}`
    try {
      await navigator.clipboard.writeText(url)
      // quick + dirty for now; we’ll convert to a toast later
      alert('Link copied.')
    } catch {
      alert('Copy failed. Copy URL manually.')
    }
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-black text-white/60 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-lg font-semibold mb-4">Loading…</div>
          {showFallback ? (
            <div className="space-y-3">
              <p className="text-white/70">The app is taking longer than expected to load.</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    const s = loadStore()
                    setStore(s)
                  }}
                  className="w-full py-3 bg-white text-black font-bold rounded-xl"
                >
                  Start a reset anyway
                </button>
                <a href="/" className="inline-block text-sm text-white/60 hover:text-white">
                  Back to home
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  const todayKey = localDateKey(new Date())
  const dayIndex = getDayIndex(store.runStartDate, todayKey)
  const day = Math.min(Math.max(dayIndex, 1), 7)
  const completedIndices = new Set(
    store.completedDates
      .map((key) => getDayIndex(store.runStartDate, key))
      .filter((n) => n >= 1 && n <= 7)
  )
  const Icon = MODE_META[mode].icon

  const preferredDur = goals?.preferredDuration ?? null
  const homeModes: Mode[] = goals?.preferredModes?.length
    ? goals.preferredModes
    : (Object.keys(MODE_META) as Mode[])

  const shellClassName =
    screen === 'player' || screen === 'done'
      ? `min-h-screen text-white player ${mode}`
      : 'min-h-screen bg-black text-white'

  return (
    <div className={shellClassName}>
      <div className="mx-auto max-w-md px-5 py-8">
        {screen === 'home' && (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tight">RESET RUN</h1>
              <p className="text-white/50 mt-1">Day {day} of 7</p>
              {goals?.dailyResets ? (
                <p className="text-white/35 mt-1 text-sm">Daily goal: {goals.dailyResets} reset{goals.dailyResets > 1 ? 's' : ''}</p>
              ) : null}
            </div>

            <div className="flex gap-2 mb-8">
              {Array.from({ length: 7 }).map((_, i) => {
                const n = i + 1
                const ok = completedIndices.has(n)
                return (
                  <div
                    key={n}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      ok ? 'bg-white text-black' : 'border border-white/20 text-white/30'
                    }`}
                  >
                    {ok ? <Check className="w-4 h-4" /> : '○'}
                  </div>
                )
              })}
            </div>

            <div className="space-y-4">
              {homeModes.map((m) => {
                const MIcon = MODE_META[m].icon
                return (
                  <div key={m} className={`rounded-2xl border border-white/10 p-5 mode-${m}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${modeColors[m].solid} flex items-center justify-center`}>
                        <MIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{modeNames[m]}</div>
                        <div className="text-white/40 text-sm">{MODE_META[m].tagline}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {DURATIONS.map((d) => (
                        <button
                          key={d}
                          onClick={() => startRun(m, d)}
                          className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-colors ${
                            preferredDur === d
                              ? 'border-white bg-white text-black'
                              : 'border-white/15 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {d} min
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-white/35 text-center mt-8">No account. Local only. Execute and leave.</p>
          </>
        )}

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
                onClick={() => setScreen('home')}
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
              <div className="w-full max-w-md space-y-3">
                <button
                  onClick={copyShareLink}
                  className="w-full py-4 font-bold bg-white text-black flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Copy Link
                </button>
                <button
                  onClick={() => setScreen('home')}
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









