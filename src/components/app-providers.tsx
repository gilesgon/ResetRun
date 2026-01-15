'use client'

import { ReactNode } from 'react'
import { ProfileProvider } from '@/components/profile-context'
import { SettingsProvider } from '@/components/settings-context'

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <SettingsProvider>{children}</SettingsProvider>
    </ProfileProvider>
  )
}
