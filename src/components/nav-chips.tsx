'use client'

import { usePathname } from 'next/navigation'
import HomeChip from '@/components/home-chip'
import ResetRunChip from '@/components/reset-run-chip'
import SettingsChip from '@/components/settings-chip'
import ProfileChip from '@/components/profile-chip'

/**
 * Nav chips - hidden on session page to avoid UI overlap
 */
export default function NavChips() {
  const pathname = usePathname()

  // Hide nav on session page for full immersion
  if (pathname === '/session') {
    return null
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 hidden md:flex">
      <HomeChip />
      <ResetRunChip />
      <SettingsChip />
      <ProfileChip />
    </div>
  )
}
