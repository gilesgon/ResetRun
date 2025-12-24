'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wind, Target, Sparkles, Dumbbell, Check } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseDb, getFirebaseAuth, firebaseConfigError } from '@/lib/firebase';
import AuthenticatedHome from '@/components/authenticated-home';
import { layout, type as typo, surface, ui, modeColors, motionVariants } from '@/lib/brand';
import PillButton from '@/components/ui/PillButton';
import PillGroup from '@/components/ui/PillGroup';

const modes = [
  {
    id: 'calm',
    name: 'Calm',
    description: 'Reset your nervous system in 2–10 minutes',
    icon: Wind,
    gradient: 'from-[#1a2148] to-[#2a2f64]',
  },
  {
    id: 'focus',
    name: 'Focus',
    description: 'Clear mental clutter, lock in',
    icon: Target,
    gradient: 'from-[#3a2912] to-[#5a3a12]',
  },
  {
    id: 'clean',
    name: 'Clean',
    description: '5-minute physical space reset',
    icon: Sparkles,
    gradient: 'from-[#0f2f2a] to-[#0f3a34]',
  },
  {
    id: 'body',
    name: 'Body',
    description: 'Reboot energy with micro-movement',
    icon: Dumbbell,
    gradient: 'from-[#3a1822] to-[#4a1f2d]',
  },
];

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setAuthChecked(true);
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email.');
      setFormStatus('error');
      return;
    }
    const firebaseDb = getFirebaseDb();
    if (!firebaseDb || firebaseConfigError) {
      setErrorMessage('Pro updates are temporarily unavailable. Please try again later.');
      setFormStatus('error');
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedPhone = phone.trim();
    const entry = {
      email: trimmedEmail,
      firstName: trimmedFirst,
      lastName: trimmedLast,
      phone: trimmedPhone,
      createdAt: new Date().toISOString(),
    };
    try {
      const existingRaw = localStorage.getItem('waitlistEntries');
      const existing = existingRaw ? (JSON.parse(existingRaw) as typeof entry[]) : [];
      existing.push(entry);
      localStorage.setItem('waitlistEntries', JSON.stringify(existing));
    } catch {
      // Ignore storage errors in demo
    }
    try {
      const payload: Record<string, string | ReturnType<typeof serverTimestamp>> = {
        email: trimmedEmail,
        createdAt: serverTimestamp(),
      };
      if (trimmedFirst) payload.firstName = trimmedFirst;
      if (trimmedLast) payload.lastName = trimmedLast;
      if (trimmedPhone) payload.phone = trimmedPhone;

      await addDoc(collection(firebaseDb, 'waitlist'), payload);
      setFormStatus('success');
      setErrorMessage(null);
      setEmail('');
      setFirstName('');
      setLastName('');
      setPhone('');
      setShowDetails(false);
    } catch {
      setErrorMessage('Unable to save right now. Please try again.');
      setFormStatus('error');
    }
  };

  // Show loading state while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  // Show authenticated home for logged-in users
  if (isAuthenticated) {
    return <AuthenticatedHome />;
  }

  // Show landing page for guests
  return (
    <div className={surface.pageBg}>
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur border-b border-white/10">
        <div className={`${layout.container} flex items-center justify-between py-4`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-lg font-bold"
          >
            <Link href="#top" className="hover:text-white/80 transition-colors">
              RESET RUN
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <Link href="#pro" className={`text-sm ${ui.mutedLink}`}>
              Pro
            </Link>
            <Link href="/app" className={`text-sm font-bold px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-all`}>
              Try Reset Run
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero */}
      <div id="top" className={`${layout.container} ${layout.section} pt-32 md:pt-40 text-center`}>
        <motion.h1
          initial={motionVariants.fadeInUp.initial}
          animate={motionVariants.fadeInUp.animate}
          transition={motionVariants.fadeInUp.transition}
          className={typo.h1}
        >
          RESET RUN
        </motion.h1>
        
        <motion.p
          initial={motionVariants.fadeInUp.initial}
          animate={motionVariants.fadeInUp.animate}
          transition={{ ...motionVariants.fadeInUp.transition, delay: 0.1 }}
          className={`${typo.body} max-w-2xl mx-auto mb-4 text-white/70`}
        >
          A 2–10 minute escape hatch to reset your nervous system, focus, space, or body.
        </motion.p>

        <motion.p
          initial={motionVariants.fadeInUp.initial}
          animate={motionVariants.fadeInUp.animate}
          transition={{ ...motionVariants.fadeInUp.transition, delay: 0.15 }}
          className={`${typo.bodySm} max-w-2xl mx-auto mb-10 text-white/60`}
        >
          Short resets beat long intentions.
        </motion.p>

        <motion.div
          initial={motionVariants.fadeInUp.initial}
          animate={motionVariants.fadeInUp.animate}
          transition={{ ...motionVariants.fadeInUp.transition, delay: 0.2 }}
          className="mb-6"
        >
          <PillGroup>
            <PillButton variant="solid" href="/app">
              Try Free Demo
            </PillButton>
            <PillButton variant="subtle" href="/login?next=/signup">
              Create Account
            </PillButton>
            <PillButton variant="subtle" href="/#pro">
              Join Pro Waitlist
            </PillButton>
          </PillGroup>
        </motion.div>

        <motion.p
          initial={motionVariants.fadeInUp.initial}
          animate={motionVariants.fadeInUp.animate}
          transition={{ ...motionVariants.fadeInUp.transition, delay: 0.25 }}
          className={typo.mutedSm}
        >
          No sign-up required to try.
        </motion.p>
      </div>

      {/* The Moment */}
      <section id="moment" className={`${layout.container} ${layout.section}`}>
        <motion.div
          initial={motionVariants.fadeIn.initial}
          whileInView={motionVariants.fadeIn.whileInView}
          viewport={motionVariants.fadeIn.viewport}
          className="max-w-2xl mx-auto"
        >
          <h2 className={`${typo.h2} mb-8 text-center`}>The Moment</h2>
          
          <ul className={`${layout.sectionSpacing} mb-8`}>
            <li className={`${typo.body} text-white/70`}>47 tabs, 12 notifications, endless scroll.</li>
            <li className={`${typo.body} text-white/70`}>You know what to do, but can't begin.</li>
            <li className={`${typo.body} text-white/70`}>Shoulders up, breath shallow, stuck.</li>
          </ul>

          <div className="text-center">
            <PillButton variant="solid" href="/session?mode=calm&duration=2&returnTo=/">
              Start a 2-minute reset
            </PillButton>
          </div>
        </motion.div>
      </section>

      {/* The Insight */}
      <section id="insight" className={`${layout.container} ${layout.section}`}>
        <motion.div
          initial={motionVariants.fadeIn.initial}
          whileInView={motionVariants.fadeIn.whileInView}
          viewport={motionVariants.fadeIn.viewport}
          className="max-w-3xl mx-auto"
        >
          <h2 className={`${typo.h2} mb-12 text-center`}>The Insight</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {['Too long.', 'Too complicated.', 'Too performative.'].map((text, i) => (
              <div
                key={i}
                className={`${surface.card} text-center`}
              >
                <p className={`${typo.bodySm} text-white/70`}>{text}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className={`${typo.h3} text-white/90`}>
              2 minutes that you actually do &gt; 30 minutes you never start
            </p>
          </div>
        </motion.div>
      </section>

      {/* Modes Picker */}
      <section id="modes" className={`${layout.container} ${layout.section}`}>
        <motion.div
          initial={motionVariants.fadeIn.initial}
          whileInView={motionVariants.fadeIn.whileInView}
          viewport={motionVariants.fadeIn.viewport}
        >
          <h2 className={`${typo.h2} mb-2 text-center`}>Pick a Reset</h2>
          <p className={`${typo.bodySm} text-center mb-12 text-white/60`}>
            4 modes × 3 durations → guided steps with timers
          </p>

          <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const colorConfig = modeColors[mode.id as keyof typeof modeColors];
              return (
                <div
                  key={mode.id}
                  className={`${surface.modeCard} bg-gradient-to-br ${colorConfig.gradient}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`${ui.modeIconContainer} ${colorConfig.iconBg}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className={`${typo.h3} text-white`}>{mode.name}</div>
                      <p className={`${typo.mutedSm} text-white/60`}>{mode.description}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {[2, 5, 10].map((duration) => (
                      <Link
                        key={duration}
                        href={`/session?mode=${mode.id}&duration=${duration}&returnTo=/`}
                        className={`${ui.durationChip} ${ui.durationChipInactive}`}
                      >
                        {duration} min
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how" className={`${layout.container} ${layout.section}`}>
        <motion.div
          initial={motionVariants.fadeIn.initial}
          whileInView={motionVariants.fadeIn.whileInView}
          viewport={motionVariants.fadeIn.viewport}
          className="max-w-2xl mx-auto"
        >
          <h2 className={`${typo.h2} mb-12 text-center`}>Three steps. Zero friction.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: 1, text: 'Pick mode + time' },
              { num: 2, text: 'Follow the steps (full-viewport timer)' },
              { num: 3, text: 'Complete + streak (Day 7 confetti)' },
            ].map((step) => (
              <div key={step.num} className="text-left">
                <div className={`${typo.h2} text-white/30 mb-2`}>{step.num}</div>
                <p className={typo.body}>{step.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <PillButton variant="solid" href="/app">
              Try it now
            </PillButton>
          </div>
        </motion.div>
      </section>

      {/* Streak Integrity */}
      <section id="streak" className={`${layout.container} ${layout.section}`}>
        <motion.div
          initial={motionVariants.fadeIn.initial}
          whileInView={motionVariants.fadeIn.whileInView}
          viewport={motionVariants.fadeIn.viewport}
          className="max-w-2xl mx-auto"
        >
          <h2 className={`${typo.h2} mb-4 text-center`}>Streak Integrity</h2>
          <p className={`${typo.bodySm} text-center mb-8 text-white/60`}>
            We reward showing up, not gaming.
          </p>

          <div className={surface.card}>
            <ul className={layout.sectionSpacing}>
              <li className="flex gap-3 items-start">
                <Check className="w-5 h-5 text-white/50 mt-1 flex-shrink-0" />
                <p className={typo.bodySm}>Only 1 completion counts per calendar day</p>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-5 h-5 text-white/50 mt-1 flex-shrink-0" />
                <p className={typo.bodySm}>No bingeing to fake a streak</p>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-5 h-5 text-white/50 mt-1 flex-shrink-0" />
                <p className={typo.bodySm}>Confetti only on true Day 7 completion</p>
              </li>
            </ul>
          </div>

          {/* Streak visualization */}
          <div className="mt-8 flex gap-2 justify-center">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i + 1}
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${
                  i < 3
                    ? 'border-white bg-white text-black'
                    : 'border-white/20 text-white/30'
                }`}
              >
                {i < 3 ? <Check className="w-4 h-4" /> : '○'}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Share a Reset */}
      <section id="share" className={`${layout.container} ${layout.section}`}>
        <motion.div
          initial={motionVariants.fadeIn.initial}
          whileInView={motionVariants.fadeIn.whileInView}
          viewport={motionVariants.fadeIn.viewport}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className={`${typo.h2} mb-4`}>Share a Reset</h2>
          <p className={`${typo.body} text-white/70 mb-8`}>
            Deep links that drop friends directly into a session. No sign-up required to try.
          </p>

          <div className="space-y-3 mb-8">
            {[
              'resetrun.app/r/calm-5',
              'resetrun.app/r/focus-2',
              'resetrun.app/r/clean-10',
              'resetrun.app/r/body-5',
            ].map((link) => (
              <code
                key={link}
                className={`block ${surface.card} font-mono ${typo.bodySm} text-white/70 break-all`}
              >
                {link}
              </code>
            ))}
          </div>

          <p className={`${typo.mutedSm} text-white/50`}>
            Share links available once feature is deployed
          </p>
        </motion.div>
      </section>

      {/* Pro Accounts */}
      <section id="pro" className={`${layout.container} ${layout.section}`}>
        <motion.div
          initial={motionVariants.fadeIn.initial}
          whileInView={motionVariants.fadeIn.whileInView}
          viewport={motionVariants.fadeIn.viewport}
          className="max-w-2xl mx-auto"
        >
          <h2 className={`${typo.h2} mb-2 text-center`}>Pro Accounts</h2>
          <p className={`${typo.bodySm} text-center mb-8 text-white/60`}>
            Sync + insights across devices (coming soon).
          </p>

          <ul className={`${layout.sectionSpacing} mb-8`}>
            <li className={`${typo.body} text-white/70`}>Cloud sync: your progress everywhere</li>
            <li className={`${typo.body} text-white/70`}>Insights: patterns, streak trends, reset types</li>
            <li className={`${typo.body} text-white/70`}>No ads. No noise.</li>
          </ul>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                  setFormStatus('idle');
                }}
                placeholder="your@email.com"
                className="flex-grow px-5 py-3 bg-gray-900 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                required
              />
              <button
                type="submit"
                className={ui.smallButton}
              >
                Join Waitlist
              </button>
            </div>

            {email.includes('@') ? (
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                className={`text-xs ${ui.mutedLink}`}
              >
                {showDetails ? 'Hide optional details' : 'Add optional details'}
              </button>
            ) : null}

            {showDetails ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name (optional)"
                  className="px-5 py-3 bg-gray-900 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name (optional)"
                  className="px-5 py-3 bg-gray-900 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                />
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone (optional)"
                  className="sm:col-span-2 px-5 py-3 bg-gray-900 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                />
              </div>
            ) : null}
          </form>

          <div className="text-center text-sm min-h-6">
            {formStatus === 'success' && (
              <span className="text-green-400">Thanks! You're on the list.</span>
            )}
            {formStatus === 'error' && (
              <span className="text-red-400">{errorMessage}</span>
            )}
          </div>
        </motion.div>
      </section>

      {/* Final Close */}
      <section id="close" className={`${layout.container} ${layout.section} pb-20`}>
        <motion.div
          initial={motionVariants.fadeIn.initial}
          whileInView={motionVariants.fadeIn.whileInView}
          viewport={motionVariants.fadeIn.viewport}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className={`${typo.h2} mb-8`}>Your 2–10 minute escape hatch.</h2>

          <PillGroup>
            <PillButton variant="solid" href="/app">
              Try Free Demo
            </PillButton>
            <PillButton variant="subtle" href="/login?next=/signup">
              Create Account
            </PillButton>
            <PillButton variant="subtle" href="/#pro">
              Join Pro Waitlist
            </PillButton>
          </PillGroup>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`${surface.divider} py-8 text-center ${typo.mutedSm}`}>
        <div>Made with intention. <a href="mailto:support@resetrun.app" className={ui.mutedLink}>support@resetrun.app</a></div>
        <div className="mt-2 flex items-center justify-center gap-4">
          <Link href="/privacy" className={ui.mutedLink}>Privacy</Link>
          <Link href="/terms" className={ui.mutedLink}>Terms</Link>
        </div>
      </footer>
    </div>
  );
}





