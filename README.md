# RESET RUN v2

A minimal micro-reset PWA for everyday people. Mobile-first, no accounts required.

## Features

- **4 Modes**: Calm, Focus, Clean, Body
- **3 Durations**: 2, 5, or 10 minutes
- **7-Day Runs**: Evergreen progress tracking (no guilt, no streak breaks)
- **Shareable**: Generate story cards and "Run With Me" links
- **PWA Ready**: Install on home screen for app-like experience

## Routes

- `/` — Landing page (marketing + waitlist)
- `/app` — Free demo (localStorage, no account)
- `/signup` — Goal-setting onboarding flow
- `/r/[mode]-[duration]` — Shareable reset links (e.g., `/r/calm-5`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npx vercel
```

Set `NEXT_PUBLIC_SITE_URL` in project settings for share links.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- localStorage for persistence
