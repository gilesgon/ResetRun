'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wind, Target, Sparkles, Dumbbell } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseDb, getFirebaseAuth, firebaseConfigError } from '@/lib/firebase';
import AuthenticatedHome from '@/components/authenticated-home';

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
    <div className="min-h-screen">
      {/* Hero */}
      <div className="container mx-auto px-6 py-16 md:py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          RESET RUN
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10"
        >
          A 2–10 minute escape hatch to reset your nervous system, focus, space, or body.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
        >
          <Link
            href="/app"
            className="tap-target px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-gray-200 active:scale-95 transition-all text-center"
          >
            Try Free Demo
          </Link>
          <Link
            href="/login?next=/signup"
            className="tap-target px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white/10 active:scale-95 transition-all"
          >
            Create Account
          </Link>
        </motion.div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-12">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-center mb-12"
        >
          4 Modes. Zero Friction.
        </motion.h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {modes.map((mode, i) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${mode.gradient} p-5 rounded-xl border border-gray-800`}
            >
              <mode.icon className="w-6 h-6 mb-3 stroke-[1.5]" />
              <h3 className="font-bold text-lg mb-1">{mode.name}</h3>
              <p className="text-gray-400 text-sm leading-snug">{mode.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 text-left">
            <div className="flex-1">
              <div className="text-4xl font-bold text-gray-700 mb-2">1</div>
              <p className="text-gray-300">Pick a mode and time (2, 5, or 10 min)</p>
            </div>
            <div className="flex-1">
              <div className="text-4xl font-bold text-gray-700 mb-2">2</div>
              <p className="text-gray-300">Follow the guided steps with timers</p>
            </div>
            <div className="flex-1">
              <div className="text-4xl font-bold text-gray-700 mb-2">3</div>
              <p className="text-gray-300">Complete 7 days. Share your progress.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pro Updates CTA */}
      <div id="pro-updates" className="container mx-auto px-6 py-16 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Pro Accounts</h2>
          <p className="text-gray-400">
            Sync across devices and set goals.
            Get notified when Pro features launch.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
              className="tap-target px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 active:scale-95 transition-all"
            >
              Get Pro Updates
            </button>
          </div>

          {email.includes('@') ? (
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="text-xs text-white/60 hover:text-white text-left"
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

        <div className="mt-4 text-center text-sm min-h-6">
          {formStatus === 'success' && (
            <span className="text-green-400">Thanks! You're on the list.</span>
          )}
          {formStatus === 'error' && (
            <span className="text-red-400">{errorMessage}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm border-t border-gray-900 safe-bottom">
        <div>Made with intention. <a href="mailto:support@resetrun.app" className="hover:text-gray-300">support@resetrun.app</a></div>
        <div className="mt-2 flex items-center justify-center gap-4 text-gray-500">
          <a href="/privacy" className="hover:text-gray-300">Privacy</a>
          <a href="/terms" className="hover:text-gray-300">Terms</a>
        </div>
      </footer>
    </div>
  );
}





