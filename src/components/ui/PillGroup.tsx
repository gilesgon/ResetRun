import { ReactNode } from 'react'

type PillGroupProps = {
  children: ReactNode
  className?: string
}

/**
 * PillGroup component - container for pill buttons
 *
 * Source styling: nav chip container (layout.tsx:41)
 * Reuses flex layout with gap from existing nav implementation
 */
export default function PillGroup({ children, className = '' }: PillGroupProps) {
  // Exact container pattern from nav chips (layout.tsx:41)
  // flex items-center gap-2 from the nav container
  const baseClasses = 'flex items-center justify-center flex-wrap gap-2 md:gap-3'

  return <div className={`${baseClasses} ${className}`.trim()}>{children}</div>
}
