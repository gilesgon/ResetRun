'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wind, Target, Sparkles, Dumbbell, Play, Hourglass } from 'lucide-react';
import Link from 'next/link';
import { Mode, Duration, modeNames, getProtocol } from '@/lib/protocols';

const modeIcons: Record<Mode, typeof Wind> = {
  calm: Wind,
  focus: Target,
  clean: Sparkles,
  body: Dumbbell,
  timeout: Hourglass,
};

export default function SharedResetPage() {
  const params = useParams();
  const [isValid, setIsValid] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);

  useEffect(() => {
    const slugRaw = params.slug
    const slug = Array.isArray(slugRaw) ? slugRaw[0] : slugRaw
    if (!slug) return

    if (!slug) return;

    // Parse slug: "calm-5" -> mode: calm, duration: 5
    const [modeStr, durationStr] = slug.split('-');
    const validModes: Mode[] = ['calm', 'focus', 'clean', 'body', 'timeout'];
    const validDurations: Duration[] = [2, 5, 10];

    if (
      validModes.includes(modeStr as Mode) &&
      validDurations.includes(parseInt(durationStr) as Duration)
    ) {
      setMode(modeStr as Mode);
      setDuration(parseInt(durationStr) as Duration);
      setIsValid(true);
    }
  }, [params.slug]);

  if (!isValid || !mode || !duration) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Reset not found</h1>
        <p className="text-gray-400 mb-8">This reset link isn't valid.</p>
        <Link
          href="/"
          className="tap-target px-6 py-3 bg-white text-black font-bold rounded-full"
        >
          Go to RESET RUN
        </Link>
      </div>
    );
  }

  const Icon = modeIcons[mode];
  const protocol = getProtocol(mode, duration);

  return (
    <div className={`min-h-screen flex flex-col mode-${mode}`}>
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6"
        >
          <Icon className="w-10 h-10" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-2"
        >
          {modeNames[mode]} Reset
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 mb-2"
        >
          {duration} minutes · {protocol?.steps.length} steps
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 mb-12"
        >
          Someone shared this reset with you
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 w-full max-w-xs"
        >
          <Link
            href={`/session?mode=${mode}&duration=${duration}&returnTo=/`}
            className="tap-target w-full py-4 bg-white text-black font-bold rounded-full flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start This Reset
          </Link>
          <Link
            href="/"
            className="tap-target w-full py-4 border-2 border-gray-700 text-white font-semibold rounded-full"
          >
            Learn More
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center text-gray-600 text-sm safe-bottom">
        <p>RESET RUN — Get back in control</p>
      </div>
    </div>
  );
}
