'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type SettingsContextType = {
  showSettings: boolean
  openSettings: () => void
  closeSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [showSettings, setShowSettings] = useState(false)

  const openSettings = () => setShowSettings(true)
  const closeSettings = () => setShowSettings(false)

  return (
    <SettingsContext.Provider value={{ showSettings, openSettings, closeSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
