import Link from 'next/link'
import { ComponentPropsWithoutRef } from 'react'

type PillButtonVariant = 'solid' | 'subtle'

type PillButtonProps = {
  variant?: PillButtonVariant
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
} & Omit<ComponentPropsWithoutRef<'button'>, 'onClick'>

/**
 * PillButton component - reuses existing nav chip and header CTA styles
 *
 * Source classes:
 * - solid variant: from header CTA (page.tsx:164)
 * - subtle variant: from nav chips (home-chip.tsx:8)
 */
export default function PillButton({
  variant = 'solid',
  children,
  href,
  onClick,
  className = '',
  ...props
}: PillButtonProps) {
  // Exact classes from existing components - no new colors/fonts
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-bold transition-all active:scale-95 tap-target'

  const variantClasses = {
    // From header CTA button (page.tsx:164)
    solid: 'px-4 py-2 text-sm bg-white text-black hover:bg-gray-200',
    // From nav chips (home-chip.tsx:8) - adapted for button sizing
    subtle: 'px-4 py-2 text-sm border border-white/15 bg-white/5 text-white/80 hover:text-white hover:border-white/30',
  }

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.trim()

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={combinedClasses} {...props}>
      {children}
    </button>
  )
}
