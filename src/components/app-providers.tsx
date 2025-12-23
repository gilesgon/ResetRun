'use client'

import { ReactNode } from 'react'
import { SettingsProvider } from '@/components/settings-context'

export default function AppProviders({ children }: { children: ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>
}
