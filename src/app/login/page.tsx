import { Suspense } from 'react'
import LoginClient from './login-client'

export const dynamic = 'force-dynamic'

// Server Component wrapper.
// Next.js requires Client Components that call useSearchParams/useRouter to be
// rendered under a Suspense boundary provided by a Server Component.
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white/60 flex items-center justify-center px-6">
          Loading…
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  )
}
