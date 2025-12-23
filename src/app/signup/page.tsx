'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Wind, Target, Sparkles, Dumbbell, Check } from 'lucide-react';
import Link from 'next/link';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseAuth, firebaseConfigError } from '@/lib/firebase';
import { Mode, Duration, modeNames } from '@/lib/protocols';
import { saveGoals, UserGoals } from '@/lib/storage';

const modeIcons: Record<Mode, typeof Wind> = {
  calm: Wind,
  focus: Target,
  clean: Sparkles,
  body: Dumbbell,
};

const modeDescriptions: Record<Mode, string> = {
  calm: 'Reset your nervous system',
  focus: 'Clear mental clutter',
  clean: 'Organize your space',
  body: 'Move your energy',
};

const steps = ['modes', 'frequency', 'duration', 'confirm'] as const;
type Step = typeof steps[number];

export default function SignupPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('modes');
  const [selectedModes, setSelectedModes] = useState<Mode[]>([]);
  const [dailyResets, setDailyResets] = useState(1);
  const [preferredDuration, setPreferredDuration] = useState<Duration>(5);

  // Require login before onboarding
  useEffect(() => {
    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) return;
    const unsub = onAuthStateChanged(firebaseAuth, (u: User | null) => {
      if (!u) {
        router.replace('/login?next=/signup');
        return;
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, [router]);

  if (firebaseConfigError || !getFirebaseAuth()) {
    return (
      <div className="min-h-screen bg-black text-white px-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold">Accounts are in early access</h1>
          <p className="text-white/50 mt-2">Accounts and cloud sync are currently invite-only.</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            Join the waitlist to request access and be notified when accounts open.
          </div>
          <div className="mt-6">
            <a href="/#waitlist" className="inline-block px-5 py-3 bg-white text-black rounded-full font-bold">
              Join Waitlist
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!authReady) {
    return (
      <div className="min-h-screen bg-black text-white/60 flex items-center justify-center">
        Loading…
      </div>
    );
  }

  const stepIndex = steps.indexOf(currentStep);
  const canContinue = currentStep === 'modes' ? selectedModes.length > 0 : true;

  const toggleMode = (mode: Mode) => {
    setSelectedModes((prev) =>
      prev.includes(mode)
        ? prev.filter((m) => m !== mode)
        : [...prev, mode]
    );
  };

  const nextStep = () => {
    const next = steps[stepIndex + 1];
    if (next) setCurrentStep(next);
  };

  const prevStep = () => {
    const prev = steps[stepIndex - 1];
    if (prev) setCurrentStep(prev);
  };

  const handleComplete = () => {
    const goals: UserGoals = {
      dailyResets,
      preferredModes: selectedModes,
      preferredDuration,
      reminderTime: null,
    };
    saveGoals(goals);
    router.push('/app');
  };

  return (
    <div className="min-h-screen flex flex-col p-6 safe-bottom">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {stepIndex > 0 ? (
          <button onClick={prevStep} className="tap-target p-2 -ml-2 text-gray-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <Link href="/" className="tap-target p-2 -ml-2 text-gray-400">
            <ChevronLeft className="w-6 h-6" />
          </Link>
        )}
        <span className="text-sm text-gray-500">
          {stepIndex + 1} of {steps.length}
        </span>
        <div className="w-10" />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {/* STEP 1: Mode Selection */}
          {currentStep === 'modes' && (
            <motion.div
              key="modes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-2">What do you want to reset?</h1>
              <p className="text-gray-400 mb-8">Pick the modes you'll use most. You can always change this.</p>

              <div className="grid grid-cols-1 gap-3">
                {(['calm', 'focus', 'clean', 'body'] as Mode[]).map((mode) => {
                  const Icon = modeIcons[mode];
                  const isSelected = selectedModes.includes(mode);

                  return (
                    <button
                      key={mode}
                      onClick={() => toggleMode(mode)}
                      className={`tap-target mode-${mode} p-5 rounded-xl border text-left flex items-center gap-4 transition-all ${
                        isSelected
                          ? 'border-white'
                          : 'border-gray-800 opacity-60'
                      }`}
                    >
                      <Icon className="w-6 h-6 shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold">{modeNames[mode]}</div>
                        <div className="text-sm text-gray-400">{modeDescriptions[mode]}</div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Frequency */}
          {currentStep === 'frequency' && (
            <motion.div
              key="frequency"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-2">How often?</h1>
              <p className="text-gray-400 mb-8">Set your daily reset goal. Start small.</p>

              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setDailyResets(num)}
                    className={`tap-target p-5 rounded-xl border text-left transition-all ${
                      dailyResets === num
                        ? 'border-white bg-white/5'
                        : 'border-gray-800'
                    }`}
                  >
                    <div className="font-semibold text-lg">
                      {num} reset{num > 1 ? 's' : ''} per day
                    </div>
                    <div className="text-sm text-gray-400">
                      {num === 1 && 'Perfect for building the habit'}
                      {num === 2 && 'Morning and evening rhythm'}
                      {num === 3 && 'Consistent daily practice'}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Duration */}
          {currentStep === 'duration' && (
            <motion.div
              key="duration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-2">How long?</h1>
              <p className="text-gray-400 mb-8">Pick your default reset length. You can switch anytime.</p>

              <div className="flex flex-col gap-3">
                {([2, 5, 10] as Duration[]).map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setPreferredDuration(dur)}
                    className={`tap-target p-5 rounded-xl border text-left transition-all ${
                      preferredDuration === dur
                        ? 'border-white bg-white/5'
                        : 'border-gray-800'
                    }`}
                  >
                    <div className="font-semibold text-lg">{dur} minutes</div>
                    <div className="text-sm text-gray-400">
                      {dur === 2 && 'Quick reset — perfect for busy days'}
                      {dur === 5 && 'Standard reset — balanced & effective'}
                      {dur === 10 && 'Deep reset — when you have time'}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Confirm */}
          {currentStep === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-2">You're all set</h1>
              <p className="text-gray-400 mb-8">Here's your reset plan.</p>

              <div className="bg-gray-900 rounded-2xl p-6 mb-6">
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">YOUR MODES</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedModes.map((mode) => {
                      const Icon = modeIcons[mode];
                      return (
                        <div
                          key={mode}
                          className={`mode-${mode} px-4 py-2 rounded-full flex items-center gap-2 border border-gray-700`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{modeNames[mode]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">DAILY GOAL</div>
                    <div className="text-2xl font-bold">
                      {dailyResets} reset{dailyResets > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">DEFAULT LENGTH</div>
                    <div className="text-2xl font-bold">{preferredDuration} min</div>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 text-sm text-center">
                Your progress will be saved locally. Cloud sync coming soon.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="pt-6">
        {currentStep === 'confirm' ? (
          <button
            onClick={handleComplete}
            className="tap-target w-full py-4 bg-white text-black font-bold rounded-full text-lg active:scale-95 transition-transform"
          >
            Start Your First Reset
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={!canContinue}
            className={`tap-target w-full py-4 font-bold rounded-full text-lg flex items-center justify-center gap-2 transition-all ${
              canContinue
                ? 'bg-white text-black active:scale-95'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
