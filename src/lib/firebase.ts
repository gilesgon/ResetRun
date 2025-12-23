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

const app: FirebaseApp | null = firebaseConfigError
  ? null
  : getApps().length
      ? getApps()[0]!
      : initializeApp(firebaseConfig as Required<typeof firebaseConfig>)

export const auth: Auth | null = app ? getAuth(app) : null
export const db: Firestore | null = app ? getFirestore(app) : null
