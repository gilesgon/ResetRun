import type { Metadata, Viewport } from 'next';
import './globals.css';
import HomeChip from '@/components/home-chip';
import ResetRunChip from '@/components/reset-run-chip';
import ProfileChip from '@/components/profile-chip';

export const metadata: Metadata = {
  title: 'RESET RUN — Get back in control',
  description: 'A 2–10 minute escape hatch to reset your nervous system, focus, space, or body. No accounts. No streaks.',
  manifest: '/manifest.json',
  icons: {
    icon: ['/icons/icon-192.png', '/icons/icon-512.png'],
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RESET RUN',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0A0A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
          <HomeChip />
          <ResetRunChip />
          <ProfileChip />
        </div>
        {children}
      </body>
    </html>
  );
}

