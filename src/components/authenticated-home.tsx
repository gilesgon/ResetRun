'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Wind, Target, Sparkles, Dumbbell, TrendingUp, Zap, Lock } from 'lucide-react'
import { loadStore, type Store } from '@/lib/storage'
import { type Mode, modeNames, modeColors } from '@/lib/protocols'
import { useProfile } from '@/components/profile-context'

const MODE_META: Record<Mode, { icon: any; tagline: string }> = {
  calm: { icon: Wind, tagline: 'Regain composure' },
  focus: { icon: Target, tagline: 'Lock in' },
  clean: { icon: Sparkles, tagline: 'Clear space' },
  body: { icon: Dumbbell, tagline: 'Move energy' },
}

const DURATIONS = [2, 5, 10] as const

export default function AuthenticatedHome() {
  const [store, setStore] = useState<Store | null>(null)
  const { profile } = useProfile()

  useEffect(() => {
    if (profile?.runState) {
      setStore(profile.runState)
      return
    }
    const s = loadStore()
    setStore(s)
  }, [profile])

  if (!store) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    )
  }

  const totalResets = store.totalResets || 0
  const currentStreak = store.completedDateKeys.length

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-5 py-8 pt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2">Welcome back</h1>
          <p className="text-white/50">Ready for your next reset?</p>
        </div>

        {/* Stats Grid - Mock data with "Coming Soon" indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-white/50 text-xs mb-1">Total Resets</div>
            <div className="text-2xl font-bold">{totalResets}</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-white/50 text-xs mb-1">Current Streak</div>
            <div className="text-2xl font-bold">{currentStreak} days</div>
          </div>

          {/* Mock Stats - Coming Soon */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Lock className="w-3 h-3 text-white/30" />
            </div>
            <div className="text-white/30 text-xs mb-1">Pauses Taken</div>
            <div className="text-2xl font-bold text-white/30">--</div>
            <div className="text-[10px] text-white/20 mt-1">Pro Feature</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Lock className="w-3 h-3 text-white/30" />
            </div>
            <div className="text-white/30 text-xs mb-1">Best Streak</div>
            <div className="text-2xl font-bold text-white/30">--</div>
            <div className="text-[10px] text-white/20 mt-1">Pro Feature</div>
          </div>
        </div>

        {/* Pro Features Teaser */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Pro Features Coming Soon</h3>
              <p className="text-white/60 text-sm mb-3">
                Advanced stats, pause tracking, streak history, and cross-device sync.
              </p>
              <Link
                href="/#pro-updates"
                className="inline-block text-sm text-purple-400 hover:text-purple-300 font-semibold"
              >
                Get notified →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Start a Reset</h2>
        </div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(MODE_META) as Mode[]).map((mode) => {
            const MIcon = MODE_META[mode].icon
            return (
              <div key={mode} className={`rounded-2xl border border-white/10 p-5 mode-${mode}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${modeColors[mode].solid} flex items-center justify-center`}>
                    <MIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{modeNames[mode]}</div>
                    <div className="text-white/40 text-sm">{MODE_META[mode].tagline}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {DURATIONS.map((duration) => (
                    <Link
                      key={duration}
                      href={`/session?mode=${mode}&duration=${duration}&returnTo=/app`}
                      className="flex-1 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 py-3 text-sm font-semibold text-center transition-colors"
                    >
                      {duration} min
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Activity Summary - Mock */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Recent Activity</h3>
            <TrendingUp className="w-5 h-5 text-white/40" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Wind className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Calm - 5 min</div>
                  <div className="text-xs text-white/40">Today at 2:30 PM</div>
                </div>
              </div>
              <div className="text-xs text-white/40 opacity-50 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Pro
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Focus - 10 min</div>
                  <div className="text-xs text-white/40">Yesterday at 9:15 AM</div>
                </div>
              </div>
              <div className="text-xs text-white/40 opacity-50 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Pro
              </div>
            </div>
            <div className="text-center py-3">
              <p className="text-xs text-white/30">Activity history coming with Pro features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
