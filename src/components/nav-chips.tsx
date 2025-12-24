'use client'

import { usePathname } from 'next/navigation'
import HomeChip from '@/components/home-chip'
import SettingsChip from '@/components/settings-chip'
import ProfileChip from '@/components/profile-chip'

/**
 * Nav chips - hidden on landing and session pages
 * Landing uses its own sticky header
 * Session requires full immersion
 */
export default function NavChips() {
  const pathname = usePathname()

  // Hide nav on landing (has its own sticky header) and session (full immersion)
  if (pathname === '/' || pathname === '/session') {
    return null
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 hidden md:flex">
      <HomeChip />
      <SettingsChip />
      <ProfileChip />
    </div>
  )
}
