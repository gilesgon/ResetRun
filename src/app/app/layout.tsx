import { ReactNode } from 'react'

/**
 * /app layout - Wraps dashboard and app routes
 * Nav chips are provided by root layout (NavChips component)
 * Settings provider is in root layout (AppProviders)
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return children
}
