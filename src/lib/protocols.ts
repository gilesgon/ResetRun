export type Mode = 'calm' | 'focus' | 'clean' | 'body' | 'timeout';
export type Duration = 2 | 5 | 10;

export interface Step {
  title: string;
  instruction: string;
  duration: number; // seconds
}

export interface Protocol {
  mode: Mode;
  duration: Duration;
  steps: Step[];
}

export const protocols: Protocol[] = [
  // CALM - 2 min
  {
    mode: 'calm',
    duration: 2,
    steps: [
      { title: 'Box Breathe', instruction: 'Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat.', duration: 60 },
      { title: 'Body Scan', instruction: 'Notice tension. Relax your jaw, shoulders, hands.', duration: 60 },
    ],
  },
  // CALM - 5 min
  {
    mode: 'calm',
    duration: 5,
    steps: [
      { title: 'Box Breathe', instruction: 'Inhale 4s, hold 4s, exhale 4s, hold 4s.', duration: 90 },
      { title: '5-4-3-2-1', instruction: '5 things you see. 4 you hear. 3 you feel. 2 you smell. 1 you taste.', duration: 90 },
      { title: 'Body Scan', instruction: 'Scan from head to toes. Release each tension point.', duration: 120 },
    ],
  },
  // CALM - 10 min
  {
    mode: 'calm',
    duration: 10,
    steps: [
      { title: 'Settle In', instruction: 'Find a comfortable position. Close your eyes.', duration: 60 },
      { title: 'Deep Breathing', instruction: 'Slow, deep breaths. Feel your belly rise and fall.', duration: 120 },
      { title: 'Progressive Relaxation', instruction: 'Tense and release each muscle group, starting with your feet.', duration: 180 },
      { title: '5-4-3-2-1', instruction: 'Ground yourself with your senses.', duration: 120 },
      { title: 'Return', instruction: 'Slowly open your eyes. Move gently.', duration: 120 },
    ],
  },
  // FOCUS - 2 min
  {
    mode: 'focus',
    duration: 2,
    steps: [
      { title: 'Clear Tabs', instruction: 'Close everything except what you need right now.', duration: 45 },
      { title: 'Define Done', instruction: 'Write exactly what "done" looks like for this task.', duration: 75 },
    ],
  },
  // FOCUS - 5 min
  {
    mode: 'focus',
    duration: 5,
    steps: [
      { title: 'Brain Dump', instruction: 'Write down everything on your mind. Get it out.', duration: 90 },
      { title: 'Pick One', instruction: 'Choose the single most important task.', duration: 60 },
      { title: 'Clear Space', instruction: 'Close tabs, silence phone, remove distractions.', duration: 60 },
      { title: 'Define Done', instruction: 'What does "complete" look like? Be specific.', duration: 90 },
    ],
  },
  // FOCUS - 10 min
  {
    mode: 'focus',
    duration: 10,
    steps: [
      { title: 'Breathe First', instruction: 'Take 5 deep breaths. Slow down.', duration: 60 },
      { title: 'Brain Dump', instruction: 'Write everything floating in your head.', duration: 120 },
      { title: 'Prioritize', instruction: 'Circle the ONE thing that moves the needle.', duration: 90 },
      { title: 'Environment', instruction: 'Clear desk. Close tabs. Silence notifications.', duration: 90 },
      { title: 'Define Output', instruction: 'Write exactly what you\'ll produce in the next hour.', duration: 90 },
      { title: 'Commit', instruction: 'Say out loud: "For the next hour, I\'m doing [X]."', duration: 60 },
      { title: 'Begin', instruction: 'Start. Right now. First action only.', duration: 90 },
    ],
  },
  // CLEAN - 2 min
  {
    mode: 'clean',
    duration: 2,
    steps: [
      { title: 'Surface Sweep', instruction: 'Clear your immediate workspace. Everything off the desk.', duration: 60 },
      { title: 'Quick Stack', instruction: 'Stack papers, close drawers, straighten what\'s visible.', duration: 60 },
    ],
  },
  // CLEAN - 5 min
  {
    mode: 'clean',
    duration: 5,
    steps: [
      { title: 'Clear Surfaces', instruction: 'Every horizontal surface in reach. Clear it.', duration: 90 },
      { title: 'Trash Pass', instruction: 'Grab anything that\'s actual garbage. Toss it.', duration: 60 },
      { title: 'Put Away', instruction: 'Everything has a home. Return 5 items.', duration: 90 },
      { title: 'Wipe Down', instruction: 'Quick wipe of desk/table with whatever\'s available.', duration: 60 },
    ],
  },
  // CLEAN - 10 min
  {
    mode: 'clean',
    duration: 10,
    steps: [
      { title: 'Pick a Zone', instruction: 'Choose one area: desk, floor, shelves, or bed.', duration: 30 },
      { title: 'Remove Everything', instruction: 'Take everything off/out of your zone.', duration: 120 },
      { title: 'Wipe Clean', instruction: 'Clean the empty surface thoroughly.', duration: 90 },
      { title: 'Sort', instruction: 'Keep, toss, or relocate. Every item gets a decision.', duration: 180 },
      { title: 'Replace Mindfully', instruction: 'Only put back what belongs. Find homes for the rest.', duration: 120 },
      { title: 'Final Pass', instruction: 'Step back. Admire. Adjust anything that bugs you.', duration: 60 },
    ],
  },
  // BODY - 2 min
  {
    mode: 'body',
    duration: 2,
    steps: [
      { title: 'Stand & Shake', instruction: 'Stand up. Shake out your arms and legs.', duration: 30 },
      { title: 'Neck Rolls', instruction: 'Slow circles. 4 each direction.', duration: 30 },
      { title: 'Shoulder Shrugs', instruction: 'Up to your ears, then drop. 5 times.', duration: 30 },
      { title: 'Forward Fold', instruction: 'Bend forward, let your head hang heavy.', duration: 30 },
    ],
  },
  // BODY - 5 min
  {
    mode: 'body',
    duration: 5,
    steps: [
      { title: 'Wake Up', instruction: 'March in place. Get blood moving.', duration: 45 },
      { title: 'Neck Release', instruction: 'Ear to shoulder, hold each side 15s.', duration: 45 },
      { title: 'Arm Circles', instruction: 'Big circles, 10 forward, 10 back.', duration: 45 },
      { title: 'Hip Circles', instruction: 'Hands on hips. Big slow circles.', duration: 45 },
      { title: 'Forward Fold', instruction: 'Hang heavy. Let gravity do the work.', duration: 60 },
      { title: 'Gentle Twist', instruction: 'Feet planted, twist upper body each direction.', duration: 60 },
    ],
  },
  // BODY - 10 min
  {
    mode: 'body',
    duration: 10,
    steps: [
      { title: 'March', instruction: 'High knees, swing your arms. Wake everything up.', duration: 60 },
      { title: 'Neck Work', instruction: 'Slow tilts and rotations. Don\'t force it.', duration: 60 },
      { title: 'Shoulder Openers', instruction: 'Arm across body, pull gently. Both sides.', duration: 60 },
      { title: 'Side Bends', instruction: 'Reach overhead, lean to each side. Feel the stretch.', duration: 60 },
      { title: 'Hip Flexor', instruction: 'Lunge position, push hips forward gently.', duration: 90 },
      { title: 'Spinal Twist', instruction: 'Seated or standing, twist and hold each side.', duration: 90 },
      { title: 'Forward Fold', instruction: 'Let everything release. Breathe into your back.', duration: 60 },
      { title: 'Child\'s Pose', instruction: 'Knees wide, reach forward, rest.', duration: 120 },
    ],
  },
  // TIMEOUT - 2 min (Cool Down)
  {
    mode: 'timeout',
    duration: 2,
    steps: [
      { title: 'Stop', instruction: 'Stop what you are doing. Step away.', duration: 30 },
      { title: 'Breathe', instruction: 'Big deep breath. Blow out the candles.', duration: 45 },
      { title: 'Count', instruction: 'Count to 10 slowly. 1... 2... 3...', duration: 45 },
    ],
  },
  // TIMEOUT - 5 min (Reflect)
  {
    mode: 'timeout',
    duration: 5,
    steps: [
      { title: 'Space', instruction: 'Find a quiet spot. Sit down.', duration: 60 },
      { title: 'Download', instruction: 'What are you feeling? Mad? Sad? Say it.', duration: 90 },
      { title: 'Breathe', instruction: 'In through nose, out through mouth. Slow.', duration: 90 },
      { title: 'Reset', instruction: 'Shake it off. Ready to try again?', duration: 60 },
    ],
  },
  // TIMEOUT - 10 min (Restore)
  {
    mode: 'timeout',
    duration: 10,
    steps: [
      { title: 'Disconnect', instruction: 'Go to a different room. lay down if you can.', duration: 60 },
      { title: 'Big Breaths', instruction: 'Fill your belly like a balloon. Let it out slowly.', duration: 120 },
      { title: 'Feelings Check', instruction: 'Where is the anger in your body? Let it melt.', duration: 120 },
      { title: 'Quiet Time', instruction: 'Just rest. Nothing to do right now.', duration: 180 },
      { title: 'Return', instruction: 'Stand up slowly. You are in control.', duration: 120 },
    ],
  },
];

export function getProtocol(mode: Mode, duration: Duration): Protocol | undefined {
  return protocols.find((p) => p.mode === mode && p.duration === duration);
}

export const modeColors: Record<Mode, { from: string; to: string; solid: string }> = {
  calm: { from: 'from-[#1a2148]', to: 'to-[#2a2f64]', solid: 'bg-[#5a6bff]' },
  focus: { from: 'from-[#3a2912]', to: 'to-[#5a3a12]', solid: 'bg-[#f59e0b]' },
  clean: { from: 'from-[#0f2f2a]', to: 'to-[#0f3a34]', solid: 'bg-[#28d7a2]' },
  body: { from: 'from-[#3a1822]', to: 'to-[#4a1f2d]', solid: 'bg-[#ff4d7a]' },
  timeout: { from: 'from-[#1e1b4b]', to: 'to-[#312e81]', solid: 'bg-[#6366f1]' }, // Indigo/Violet
};

export const modeNames: Record<Mode, string> = {
  calm: 'Calm',
  focus: 'Focus',
  clean: 'Clean',
  body: 'Body',
  timeout: 'Timeout',
};

export const completionMessages = [
  'You showed up. That matters.',
  'Small reset, big shift.',
  'Go far, so you can see further.',
  'Quiet wins compound.',
  'Reset complete. Move forward.',
  'You did the thing.',
  'Day handled.',
  'Back in control.',
  'Momentum restored.',
  'The reset worked.',
];

export function getRandomCompletionMessage(): string {
  return completionMessages[Math.floor(Math.random() * completionMessages.length)];
}

export const DURATIONS: Duration[] = [2, 5, 10]
export const MODES: Mode[] = ['calm', 'focus', 'clean', 'body', 'timeout']

export function isMode(x: any): x is Mode {
  return MODES.includes(x)
}

export function isDuration(x: any): x is Duration {
  return DURATIONS.includes(x)
}

export function getProtocolSafe(mode: Mode, duration: Duration): Protocol {
  const p = getProtocol(mode, duration)
  if (!p) {
    // Fallback: never return undefined (prevents UI crashes)
    return getProtocol('focus', 2)!
  }
  return p
}
