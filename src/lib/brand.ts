/**
 * Brand token module
 * Reuses existing design tokens from globals.css and the dashboard
 * NO new colors, fonts, or design patterns introduced
 */

// Layout & spacing
export const layout = {
  container: 'container mx-auto px-6',
  section: 'py-12 md:py-16',
  sectionSpacing: 'space-y-6 md:space-y-8',
} as const

// Typography
export const type = {
  h1: 'text-5xl md:text-7xl font-bold',
  h2: 'text-2xl md:text-3xl font-bold',
  h3: 'text-xl md:text-2xl font-bold',
  body: 'text-base md:text-lg text-white/80',
  bodySm: 'text-sm md:text-base text-white/70',
  muted: 'text-sm md:text-base text-white/60',
  mutedSm: 'text-xs text-white/50',
} as const

// Surface styling (reused from existing pages)
export const surface = {
  pageBg: 'min-h-screen bg-black text-white',
  card: 'rounded-2xl border border-white/10 p-5 bg-white/5',
  modeCard: 'rounded-2xl border border-white/10 p-5',
  divider: 'border-t border-white/10',
} as const

// UI components (reused existing patterns)
export const ui = {
  primaryButton:
    'px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-gray-200 active:scale-95 transition-all tap-target',
  secondaryButton:
    'px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white/10 active:scale-95 transition-all tap-target',
  smallButton: 'px-5 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 active:scale-95 transition-all tap-target',
  ghostLink: 'text-white/60 hover:text-white transition-colors',
  mutedLink: 'text-white/50 hover:text-white/80 transition-colors',

  // Duration chip pattern (from dashboard)
  durationChip: 'flex-1 rounded-xl border py-3 text-sm font-semibold transition-colors',
  durationChipActive: 'border-white bg-white text-black',
  durationChipInactive: 'border-white/15 bg-white/5 hover:bg-white/10',

  // Mode icon container
  modeIconContainer: 'w-12 h-12 rounded-xl flex items-center justify-center',
} as const

// Mode colors (reused from globals.css and dashboard)
export const modeColors = {
  calm: {
    gradient: 'from-[#1a2148] to-[#2a2f64]',
    class: 'mode-calm',
    iconBg: 'bg-[#5a6bff]',
  },
  focus: {
    gradient: 'from-[#3a2912] to-[#5a3a12]',
    class: 'mode-focus',
    iconBg: 'bg-[#f59e0b]',
  },
  clean: {
    gradient: 'from-[#0f2f2a] to-[#0f3a34]',
    class: 'mode-clean',
    iconBg: 'bg-[#28d7a2]',
  },
  body: {
    gradient: 'from-[#3a1822] to-[#4a1f2d]',
    class: 'mode-body',
    iconBg: 'bg-[#ff4d7a]',
  },
} as const

// Framer motion shared animation variants
export const motionVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
  },
} as const
