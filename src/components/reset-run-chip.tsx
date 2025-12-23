import Link from 'next/link'
import { Wind } from 'lucide-react'

export default function ResetRunChip() {
  return (
    <Link
      href="/app"
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:text-white hover:border-white/30"
      aria-label="Reset Run"
    >
      <Wind className="h-3.5 w-3.5" />
      <span>Reset Run</span>
    </Link>
  )
}
