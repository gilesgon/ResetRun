'use client'

import { usePathname } from 'next/navigation'
import HomeChip from '@/components/home-chip'
import SettingsChip from '@/components/settings-chip'
import ProfileChip from '@/components/profile-chip'

/**
 * Nav chips - shown on all app routes except landing and session
 * Landing uses its own sticky header
 * Session requires full immersion
 * Always visible on /app routes for immediate settings access
 */
export default function NavChips() {
  const pathname = usePathname()

  // Hide nav only on landing (has its own sticky header) and session (full immersion)
  if (pathname === '/' || pathname === '/session') {
    return null
  }

  // Show nav chips on all other routes (/app, /login, /signup, /profile, etc.)
  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 hidden md:flex">
      <HomeChip />
      <SettingsChip />
      <ProfileChip />
    </div>
  )
}
