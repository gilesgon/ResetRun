/**
 * Environment configuration utilities
 * Handles graceful degradation when Firebase is not configured
 */

export function isFirebaseConfigured(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: assume configured (prevents SSR issues)
    return true
  }

  const requiredVars = [
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ]

  const isConfigured = requiredVars.every((v) => Boolean(v))

  // Only log in development
  if (!isConfigured && process.env.NODE_ENV !== 'production') {
    const missing = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
    ].filter((key, idx) => !requiredVars[idx])

    console.warn(
      '[Reset Run] Firebase not configured. Missing:',
      missing.join(', '),
      '\nAccount features will be disabled. The app will work without authentication.'
    )
  }

  return isConfigured
}

/**
 * Gets user-facing error message when Firebase is unavailable
 * Never exposes internal configuration details
 */
export function getFirebaseUnavailableMessage(): {
  title: string
  body: string
  cta: string
  ctaLink: string
} {
  return {
    title: 'Account features unavailable',
    body: 'Reset Run works without an account. Please try again later.',
    cta: 'Start a reset',
    ctaLink: '/app',
  }
}
