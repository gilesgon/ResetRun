import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k)

export const firebaseConfigError = missing.length
  ? `Missing Firebase env vars: ${missing.join(', ')}. Create a .env.local file (see .env.local.example).`
  : null

// Lazy initialization - only runs in browser/runtime, prevents SSR/prerender issues
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null
  if (firebaseConfigError) return null
  if (app) return app

  if (getApps().length) {
    app = getApps()[0]!
  } else {
    app = initializeApp(firebaseConfig as Required<typeof firebaseConfig>)
  }
  return app
}

export function getFirebaseAuth(): Auth | null {
  if (!auth) {
    const firebaseApp = getFirebaseApp()
    if (firebaseApp) auth = getAuth(firebaseApp)
  }
  return auth
}

export function getFirebaseDb(): Firestore | null {
  if (!db) {
    const firebaseApp = getFirebaseApp()
    if (firebaseApp) db = getFirestore(firebaseApp)
  }
  return db
}
